import { NextRequest, NextResponse } from "next/server";
import {
  createAiSeoBlogDrafts,
  getAiSeoSettings,
  getStoredSeoSnapshot,
  markAiSeoRunComplete,
} from "@/lib/ai-seo";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`
    || request.nextUrl.searchParams.get("secret") === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getAiSeoSettings();
  if (!settings.enabled) {
    return NextResponse.json({ skipped: true, reason: "AI SEO schedule is paused." });
  }

  if (settings.next_run_at && new Date(settings.next_run_at).getTime() > Date.now()) {
    return NextResponse.json({ skipped: true, reason: "Next run is not due yet.", next_run_at: settings.next_run_at });
  }

  const snapshot = await getStoredSeoSnapshot();
  if (!snapshot.connected || snapshot.error) {
    return NextResponse.json({ error: snapshot.error || "Google is not connected." }, { status: 400 });
  }

  const posts = await createAiSeoBlogDrafts(snapshot, {
    limit: settings.drafts_per_run,
    autoPublish: settings.auto_publish,
    settings,
  });
  await markAiSeoRunComplete(settings);

  return NextResponse.json({
    created: posts.length,
    status: settings.auto_publish ? "published" : "draft",
  });
}
