import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildContactAdminHtml } from "@/lib/emails/contact-email";

export const dynamic = "force-dynamic";

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });
  const data = await res.json() as { success: boolean };
  return data.success === true;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.includes("xxxx")) {
    return NextResponse.json(
      { error: "Email service is not configured. Please contact us directly." },
      { status: 503 },
    );
  }

  let body: { name?: string; email?: string; phone?: string; suburb?: string; state?: string; message?: string; turnstileToken?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name = "", email = "", phone = "", suburb = "", state = "", message = "", turnstileToken = "" } = body;

  if (!name || !email || !suburb || !state || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!turnstileToken) {
    return NextResponse.json({ error: "Please complete the security check." }, { status: 400 });
  }

  const ip = req.headers.get("CF-Connecting-IP") ?? req.headers.get("x-forwarded-for") ?? "";
  const captchaOk = await verifyTurnstile(turnstileToken, ip);
  if (!captchaOk) {
    return NextResponse.json({ error: "Security check failed. Please try again." }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const FROM = process.env.RESEND_FROM_EMAIL ?? "Taspro Cleaning <info@tasprocleaning.com.au>";
  const TO   = process.env.ADMIN_EMAIL ?? "info@tasprocleaning.com.au";

  const { error } = await resend.emails.send({
    from:    FROM,
    to:      TO,
    replyTo: email,
    subject: `Contact enquiry from ${name}`,
    html:    buildContactAdminHtml({ name, email, phone, suburb, state, message }),
  });

  if (error) {
    console.error("[contact] Resend error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Failed to send your message. Please try again or call us directly." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
