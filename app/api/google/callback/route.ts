import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { consumeGoogleStateCookie, exchangeGoogleCode, saveGoogleTokens, setGoogleTokenCookie } from "@/lib/ai-seo";

function adminAiSeoUrl(path = "/admin/ai-seo") {
  return new URL(path, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
}

export async function GET(request: NextRequest) {
  await requireAdmin();

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = await consumeGoogleStateCookie();

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(adminAiSeoUrl("/admin/ai-seo?error=google-state"));
  }

  try {
    const tokens = await exchangeGoogleCode(code);
    await setGoogleTokenCookie(tokens);
    await saveGoogleTokens(tokens);
    return NextResponse.redirect(adminAiSeoUrl("/admin/ai-seo?connected=1"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "google-connect";
    return NextResponse.redirect(adminAiSeoUrl(`/admin/ai-seo?error=${encodeURIComponent(message)}`));
  }
}
