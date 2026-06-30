import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { buildQuoteAdminHtml, buildQuoteClientHtml, type QuotePayload } from "@/lib/emails/quote-emails";
import { createQuoteCrmRecord } from "@/lib/crm";

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
  const isPlaceholder = !apiKey || apiKey.includes("xxxx");
  if (!apiKey || isPlaceholder) {
    return NextResponse.json(
      { error: "Email service is not configured. Please contact us directly." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const s = (key: string) => (body[key] as string | undefined) ?? "";

  const email = s("email");
  if (!email || !s("firstName") || !s("city") || !s("serviceType")) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const turnstileToken = s("turnstileToken");
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

  const addons = (body.addons && typeof body.addons === "object" && !Array.isArray(body.addons))
    ? body.addons as Record<string, number>
    : {};

  const p: QuotePayload = {
    city:         s("city"),
    serviceType:  s("serviceType"),
    bedrooms:     s("bedrooms"),
    bathrooms:    s("bathrooms"),
    laundry:      s("laundry"),
    storeys:      s("storeys"),
    hourly:       body.hourly === true,
    hours:        typeof body.hours === "number" ? body.hours : 3,
    commercialSize: s("commercialSize"),
    officeRooms: typeof body.officeRooms === "number" ? body.officeRooms : 0,
    officeMeetingRooms: typeof body.officeMeetingRooms === "number" ? body.officeMeetingRooms : 0,
    officeKitchens: typeof body.officeKitchens === "number" ? body.officeKitchens : 0,
    officeBathrooms: typeof body.officeBathrooms === "number" ? body.officeBathrooms : 0,
    officeSchedule: s("officeSchedule"),
    commercialType: s("commercialType"),
    sanitaryWaste: s("sanitaryWaste"),
    addons,
    frequency:    s("frequency"),
    date:         s("date"),
    timeSlot:     s("timeSlot"),
    exactTime:    s("exactTime"),
    instructions: s("instructions"),
    firstName:    s("firstName"),
    lastName:     s("lastName"),
    email,
    mobile:       s("mobile"),
    street:       s("street"),
    suburb:       s("suburb"),
    state:        s("state"),
    postcode:     s("postcode"),
    referral:     s("referral"),
  };

  // Create CRM record
  const crmResult = await createQuoteCrmRecord(p);
  if (!crmResult.ok) {
    console.error("[submit-quote] CRM insert failed:", crmResult.error);
  }

  const serviceLabel = (p.serviceType ?? "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c: string) => c.toUpperCase());
  const cityLabel = (p.city ?? "").charAt(0).toUpperCase() + (p.city ?? "").slice(1);

  const [adminResult, clientResult] = await Promise.all([
    resend.emails.send({
      from:    FROM,
      to:      TO,
      replyTo: email,
      subject: `New quote request: ${serviceLabel} — ${p.firstName} ${p.lastName}`,
      html:    buildQuoteAdminHtml(p),
    }),
    resend.emails.send({
      from:    FROM,
      to:      email,
      subject: `We've received your quote request — ${serviceLabel} in ${cityLabel}`,
      html:    buildQuoteClientHtml(p),
    }),
  ]);

  if (adminResult.error) {
    console.error("[submit-quote] admin send error:", JSON.stringify(adminResult.error));
    return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 });
  }
  if (clientResult.error) {
    console.error("[submit-quote] client send error:", JSON.stringify(clientResult.error));
  }

  return NextResponse.json({
    ok: true,
    crm: crmResult.ok ? { customerId: crmResult.customerId, quoteId: crmResult.quoteId } : null,
  });
}
