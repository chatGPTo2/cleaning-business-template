import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function verifySquareSignature(rawBody: string, signature: string | null) {
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const notificationUrl = process.env.SQUARE_WEBHOOK_NOTIFICATION_URL;
  if (!signatureKey || !notificationUrl || !signature) return false;

  const expected = createHmac("sha256", signatureKey)
    .update(`${notificationUrl}${rawBody}`)
    .digest("base64");

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);
  return expectedBuffer.length === signatureBuffer.length && timingSafeEqual(expectedBuffer, signatureBuffer);
}

function paymentStatus(squareStatus?: string) {
  switch (squareStatus) {
    case "COMPLETED":
      return "paid";
    case "FAILED":
      return "failed";
    case "CANCELED":
      return "cancelled";
    case "PENDING":
    case "APPROVED":
      return "pending";
    default:
      return null;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-square-hmacsha256-signature");

  if (!verifySquareSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid Square signature." }, { status: 403 });
  }

  const event = JSON.parse(rawBody) as {
    type?: string;
    data?: {
      object?: {
        payment?: {
          id?: string;
          order_id?: string;
          status?: string;
          updated_at?: string;
          total_money?: { amount?: number };
        };
      };
    };
  };

  const payment = event.data?.object?.payment;
  const orderId = payment?.order_id;
  const status = paymentStatus(payment?.status);

  if (!supabaseAdmin || !orderId || !status) {
    return NextResponse.json({ ok: true });
  }

  await supabaseAdmin
    .from("jobs")
    .update({
      payment_status: status,
      payment_paid_at: status === "paid" ? (payment?.updated_at ?? new Date().toISOString()) : null,
      payment_reference: orderId,
      updated_at: new Date().toISOString(),
    })
    .eq("payment_provider", "square")
    .eq("payment_reference", orderId);

  return NextResponse.json({ ok: true });
}
