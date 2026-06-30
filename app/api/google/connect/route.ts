import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createGoogleOAuthUrl, isGoogleSeoConfigured, setGoogleStateCookie } from "@/lib/ai-seo";

export async function GET() {
  await requireAdmin();

  if (!isGoogleSeoConfigured()) {
    return NextResponse.redirect(new URL("/admin/ai-seo?error=missing-google-env", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  }

  const state = randomBytes(24).toString("hex");
  await setGoogleStateCookie(state);
  return NextResponse.redirect(createGoogleOAuthUrl(state));
}
