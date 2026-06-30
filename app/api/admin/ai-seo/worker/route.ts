import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { generateOneDraftForRun } from "@/lib/ai-seo-generate";

export const maxDuration = 300;

function isAuthorizedCron(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (
    request.headers.get("authorization") === `Bearer ${secret}` ||
    request.nextUrl.searchParams.get("secret") === secret
  );
}

// POST — called by client UI to process the next post for a given run
export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* no body */ }
  return processNextPost(String(body.runId ?? ""));
}

// GET — called by Vercel Cron as a fallback; processes up to 5 posts per tick
export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = [];
  for (let i = 0; i < 5; i++) {
    const res = await processNextPost(null);
    const body = await res.json();
    results.push(body);
    if (body.done || body.error || body.message) break; // no more runs or run finished
  }
  return NextResponse.json({ ticks: results });
}

async function processNextPost(runId: string | null) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  // Find the run — either specific or next queued/running one
  let query = supabaseAdmin
    .from("generation_runs")
    .select("*")
    .in("status", ["queued", "running"])
    .order("created_at", { ascending: true })
    .limit(1);

  if (runId) {
    query = supabaseAdmin
      .from("generation_runs")
      .select("*")
      .eq("id", runId)
      .in("status", ["queued", "running"])
      .limit(1);
  }

  const { data: runs } = await query;
  const run = runs?.[0];

  if (!run) {
    return NextResponse.json({ done: true, message: "No pending runs." });
  }

  // Mark as running if queued
  if (run.status === "queued") {
    await supabaseAdmin.from("generation_runs").update({ status: "running" }).eq("id", run.id);
  }

  try {
    const result = await generateOneDraftForRun({
      id: run.id,
      keyword: run.keyword,
      mode: run.mode,
      location: run.location,
      audience: run.audience,
      offer_angle: run.offer_angle,
      require_approval: run.require_approval,
      cluster_id: run.params?.cluster_id ?? null,
      processed: run.processed,
      target: run.target,
    });

    const newProcessed = run.processed + (result.saved ? 1 : 0);
    const isDone = newProcessed >= run.target;

    await supabaseAdmin
      .from("generation_runs")
      .update({
        processed: newProcessed,
        status: isDone ? "done" : "running",
      })
      .eq("id", run.id);

    return NextResponse.json({
      runId: run.id,
      done: isDone,
      processed: newProcessed,
      target: run.target,
      saved: result.saved,
      title: result.title,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Worker error";
    await supabaseAdmin
      .from("generation_runs")
      .update({ status: "failed", meta: { error: message } })
      .eq("id", run.id);
    return NextResponse.json({ error: message, runId: run.id }, { status: 500 });
  }
}
