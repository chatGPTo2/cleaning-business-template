import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { verifyToken } from "@/lib/signed-token";
import { buildContactAdminHtml } from "@/lib/emails/contact-email";
import { buildQuoteAdminHtml, buildQuoteClientHtml, type QuotePayload } from "@/lib/emails/quote-emails";
import { createQuoteCrmRecord } from "@/lib/crm";

export const dynamic = "force-dynamic";

const TO = process.env.ADMIN_EMAIL ?? "info@tasprocleaning.com.au";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    const devHint = process.env.NODE_ENV === "development"
      ? " (dev: check the terminal — most likely TOKEN_SECRET changed. Resubmit the form to get a fresh link.)"
      : "";
    return NextResponse.json(
      { error: `This verification link is invalid or has expired. Please submit your request again.${devHint}` },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 503 });
  }
  const resend = new Resend(apiKey);
  const FROM   = process.env.RESEND_FROM_EMAIL ?? "Taspro Cleaning <info@tasprocleaning.com.au>";

  /* ── Contact enquiry ── */
  if (payload.type === "contact") {
    const { name = "", email = "", phone = "", suburb = "", state = "", message = "" } = payload as {
      name?: string; email?: string; phone?: string; suburb?: string; state?: string; message?: string;
    };

    const { error } = await resend.emails.send({
      from:    FROM,
      to:      TO,
      replyTo: email || undefined,
      subject: `Contact enquiry from ${name}`,
      html:    buildContactAdminHtml({ name, email, phone, suburb, state, message }),
    });

    if (error) {
      console.error("[verify-email] contact admin send error:", JSON.stringify(error));
      return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, type: "contact" });
  }

  /* ── Quote request ── */
  if (payload.type === "quote") {
    const p = payload as unknown as QuotePayload;
    const crmResult = await createQuoteCrmRecord(p);
    if (!crmResult.ok) {
      console.error("[verify-email] CRM insert failed:", crmResult.error);
    }

    const serviceLabel = (p.serviceType ?? "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    const cityLabel = (p.city ?? "").charAt(0).toUpperCase() + (p.city ?? "").slice(1);

    const [adminResult, clientResult] = await Promise.all([
      resend.emails.send({
        from:    FROM,
        to:      TO,
        replyTo: p.email || undefined,
        subject: `New quote request: ${serviceLabel} — ${p.firstName} ${p.lastName}`,
        html:    buildQuoteAdminHtml(p),
      }),
      p.email
        ? resend.emails.send({
            from:    FROM,
            to:      p.email,
            subject: `We've received your quote request — ${serviceLabel} in ${cityLabel}`,
            html:    buildQuoteClientHtml(p),
          })
        : Promise.resolve({ error: null }),
    ]);

    if (adminResult.error) {
      console.error("[verify-email] quote admin send error:", JSON.stringify(adminResult.error));
      return NextResponse.json({ error: "Failed to process your request. Please try again." }, { status: 500 });
    }
    if (clientResult.error) {
      console.error("[verify-email] quote client send error:", JSON.stringify(clientResult.error));
    }

    return NextResponse.json({
      ok: true,
      type: "quote",
      crm: crmResult.ok ? { customerId: crmResult.customerId, quoteId: crmResult.quoteId } : null,
    });
  }

  return NextResponse.json({ error: "Unknown submission type." }, { status: 400 });
}
