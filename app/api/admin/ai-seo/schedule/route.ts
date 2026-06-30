import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { calculateScheduledTimes } from "@/lib/ai-seo-generate";

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

  const postIds = Array.isArray(body.postIds) ? (body.postIds as string[]) : [];
  if (postIds.length === 0) {
    return NextResponse.json({ error: "postIds must be a non-empty array" }, { status: 400 });
  }

  const requestedStart = String(body.startTime ?? new Date().toISOString());
  const intervalHours = Math.min(48, Math.max(1, Number(body.intervalHours ?? 2)));
  const windowStartHour = Math.min(23, Math.max(0, Number(body.windowStartHour ?? 7)));
  const windowEndHour = Math.min(24, Math.max(1, Number(body.windowEndHour ?? 19)));
  const skipWeekends = body.skipWeekends !== false;

  // Always start AFTER the last already-scheduled post to prevent time collisions
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: lastPost } = await supabaseAdmin
    .from("blog_posts")
    .select("scheduled_at")
    .not("scheduled_at", "is", null)
    .order("scheduled_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let effectiveStart = new Date(requestedStart);
  if (lastPost?.scheduled_at) {
    const lastTime = new Date(lastPost.scheduled_at);
    // If requested start is at or before the last scheduled post, move it forward
    if (effectiveStart <= lastTime) {
      effectiveStart = new Date(lastTime.getTime() + intervalHours * 3600 * 1000);
    }
  }

  const startTime = effectiveStart.toISOString();

  const scheduledTimes = calculateScheduledTimes({
    postIds,
    startTime,
    intervalHours,
    windowStartHour,
    windowEndHour,
    skipWeekends,
  });

  const updates = postIds.map((id, i) =>
    supabaseAdmin!
      .from("blog_posts")
      .update({ status: "scheduled", scheduled_at: scheduledTimes[i] })
      .eq("id", id)
      .eq("status", "draft") // safety: only schedule drafts
  );

  const results = await Promise.all(updates);
  const errors = results.filter((r) => r.error).map((r) => r.error!.message);

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
  }

  return NextResponse.json({
    scheduled: postIds.length,
    times: scheduledTimes,
  });
}
