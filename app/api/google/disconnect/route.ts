import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { clearGoogleTokenCookie } from "@/lib/ai-seo";

export async function POST() {
  await requireAdmin();
  await clearGoogleTokenCookie();
  return NextResponse.redirect(new URL("/admin/ai-seo?disconnected=1", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
