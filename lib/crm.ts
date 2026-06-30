import { calculatePrice } from "@/lib/pricing";
import { supabaseAdmin } from "@/lib/supabase";
import type { QuotePayload } from "@/lib/emails/quote-emails";

export type CrmQuoteResult = {
  ok: boolean;
  customerId?: string;
  quoteId?: string;
  error?: string;
};

export const QUOTE_STATUSES = [
  "new",
  "reviewing",
  "quote_sent",
  "follow_up",
  "accepted",
  "declined",
  "converted_to_job",
] as const;

export const JOB_STATUSES = [
  "draft",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "invoiced",
  "paid",
] as const;

export const NOTE_TYPES = [
  "customer_called",
  "quote_followed_up",
  "cleaner_notes",
  "issue_reported",
  "payment_reminder",
  "admin_comment",
] as const;

export const TIME_SLOT_OPTIONS = [
  { id: "morning", label: "Morning", detail: "8am - 12pm" },
  { id: "afternoon", label: "Afternoon", detail: "12pm - 5pm" },
  { id: "flexible", label: "Flexible", detail: "Any time" },
] as const;

export const EXACT_TIME_OPTIONS = Array.from({ length: 21 }, (_, i) => {
  const totalMins = 8 * 60 + i * 30;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const period = h < 12 ? "am" : "pm";
  const h12 = h > 12 ? h - 12 : h;

  return {
    value: `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`,
    label: `${h12}:${m === 0 ? "00" : "30"} ${period}`,
  };
});

export function labelise(value?: string | null) {
  if (!value) return "Not set";
  const acronyms: Record<string, string> = {
    ndis: "NDIS",
  };
  if (acronyms[value]) return acronyms[value];

  return value.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function shortReference(prefix: string, id?: string | null) {
  if (!id) return `${prefix}-000000`;
  const numeric = Number.parseInt(id.replace(/-/g, "").slice(0, 10), 16) % 1000000;
  return `${prefix}-${String(numeric).padStart(6, "0")}`;
}

export function normalisePhone(value?: string | null) {
  return (value ?? "").replace(/[^\d+]/g, "");
}

function toInteger(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function estimatedPrice(payload: QuotePayload) {
  const { total } = calculatePrice({
    serviceType: payload.serviceType || "home",
    bedrooms: payload.bedrooms || "1",
    bathrooms: payload.bathrooms || "1",
    laundry: payload.laundry || "none",
    storeys: payload.storeys || "single",
    hourly: payload.hourly === true,
    hours: payload.hourly ? Number(payload.hours) || 3 : undefined,
    addons: payload.addons || {},
    frequency: payload.frequency || "once",
  });

  return total;
}

export async function createQuoteCrmRecord(payload: QuotePayload): Promise<CrmQuoteResult> {
  if (!supabaseAdmin) {
    return { ok: false, error: "Supabase admin client is not configured." };
  }

  const email = (payload.email ?? "").trim().toLowerCase();
  const phone = normalisePhone(payload.mobile);
  if (!email && !phone) {
    return { ok: false, error: "Quote has no email or phone to match a customer." };
  }

  const customerPatch = {
    first_name: payload.firstName || "Unknown",
    last_name: payload.lastName || "",
    email,
    phone,
    street: payload.street || null,
    suburb: payload.suburb || null,
    postcode: payload.postcode || null,
    state: payload.state || null,
    city: payload.city || null,
    customer_type: payload.serviceType === "ndis" ? "ndis" : payload.serviceType || null,
    source: payload.referral || "website",
    recurring_customer: ["weekly", "fortnightly", "monthly"].includes(payload.frequency || ""),
    updated_at: new Date().toISOString(),
  };

  let customerId: string | undefined;

  if (email) {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    customerId = data?.id;
  }

  if (!customerId && phone) {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (error) return { ok: false, error: error.message };
    customerId = data?.id;
  }

  if (customerId) {
    const { error } = await supabaseAdmin
      .from("customers")
      .update(customerPatch)
      .eq("id", customerId);

    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .insert(customerPatch)
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };
    customerId = data.id;
  }

  const { data: quote, error: quoteError } = await supabaseAdmin
    .from("quotes")
    .insert({
      customer_id: customerId,
      service_type: payload.serviceType || "home",
      location: payload.city || "unknown",
      frequency: payload.frequency || "once",
      bedrooms: toInteger(payload.bedrooms),
      bathrooms: toInteger(payload.bathrooms),
      laundry: payload.laundry || null,
      storeys: payload.storeys || null,
      hourly: payload.hourly === true,
      hours: payload.hourly ? toInteger(payload.hours) : null,
      addons: payload.addons || {},
      property_details: {
        commercialSize: (payload as QuotePayload & { commercialSize?: string }).commercialSize ?? null,
        officeRooms: (payload as QuotePayload & { officeRooms?: number }).officeRooms ?? null,
        officeMeetingRooms: (payload as QuotePayload & { officeMeetingRooms?: number }).officeMeetingRooms ?? null,
        officeKitchens: (payload as QuotePayload & { officeKitchens?: number }).officeKitchens ?? null,
        officeSchedule: (payload as QuotePayload & { officeSchedule?: string }).officeSchedule ?? null,
      },
      preferred_date: payload.date || null,
      preferred_time: payload.timeSlot || null,
      exact_time: Boolean(payload.exactTime),
      preferred_exact_time: payload.exactTime || null,
      special_instructions: payload.instructions || null,
      estimated_price: estimatedPrice(payload),
      status: "new",
    })
    .select("id")
    .single();

  if (quoteError) return { ok: false, error: quoteError.message };

  return { ok: true, customerId, quoteId: quote.id };
}
