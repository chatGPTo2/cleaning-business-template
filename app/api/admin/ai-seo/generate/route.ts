import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { GenerationMode } from "@/lib/ai-seo-generate";

// Returns immediately with a runId — processing happens via /worker calls from the client
export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const keyword = String(body.keyword ?? "").trim();
  if (!keyword) {
    return NextResponse.json({ error: "keyword is required" }, { status: 400 });
  }

  const qty = Math.min(50, Math.max(1, Number(body.qty ?? 1)));
  const mode: GenerationMode = body.mode === "cluster" ? "cluster" : "standard";
  const location = String(body.location ?? "").trim() || undefined;
  const audience = String(body.audience ?? "").trim() || undefined;
  const offerAngle = String(body.offerAngle ?? "").trim() || undefined;
  const requireApproval = body.requireApproval !== false;

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  // Store all params in DB so the worker can pick them up without needing them in the request
  const { data: run, error: runError } = await supabaseAdmin
    .from("generation_runs")
    .insert({
      keyword,
      qty,
      mode,
      location: location ?? null,
      audience: audience ?? null,
      offer_angle: offerAngle ?? null,
      require_approval: requireApproval,
      status: "queued",
      target: qty,
      processed: 0,
      params: { keyword, qty, mode, location, audience, offerAngle, requireApproval },
    })
    .select("id")
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: runError?.message ?? "Could not create run" }, { status: 500 });
  }

  // Return immediately — client will call /worker to drive processing
  return NextResponse.json({ runId: run.id, target: qty });
}
