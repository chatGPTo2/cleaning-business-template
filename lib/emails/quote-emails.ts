import { BUSINESS } from "@/config/business";
import {
  calculatePrice,
  ADDONS, BASE_PRICE,
  BEDROOM_ADDS, BATHROOM_ADDS,
  LAUNDRY_OPTIONS, STOREY_OPTIONS,
  FREQUENCY_DISCOUNTS,
  EOL_SURCHARGE, DEEP_CLEAN_SURCHARGE,
  HOURLY_RATE,
} from "@/lib/pricing";

/* ── Shared row/section helpers ── */
function row(label: string, value: string | undefined) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:8px 12px;color:#6b7280;font-size:14px;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;color:#111827;font-size:14px;font-weight:600">${value}</td>
    </tr>`;
}

function section(heading: string, rows: string) {
  return `
    <h3 style="margin:24px 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;
               letter-spacing:.08em;color:#0d9488">${heading}</h3>
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;
                  border-radius:8px;overflow:hidden">
      ${rows}
    </table>`;
}

const ADDON_LABELS: Record<string, { label: string; unitPrice: number }> = {
  "oven":            { label: "Inside the Oven",             unitPrice: 64 },
  "fridge":          { label: "Inside Fridge",               unitPrice: 64 },
  "dishwasher":      { label: "Inside Dishwasher",           unitPrice: 62 },
  "dryer":           { label: "Dryer",                       unitPrice: 56 },
  "washing-machine": { label: "Washing Machine",             unitPrice: 56 },
  "cupboards":       { label: "Inside Cupboards",            unitPrice: 64 },
  "windows":         { label: "Inside Windows",              unitPrice: 64 },
  "sliding-doors":   { label: "Sliding Glass Doors",         unitPrice: 44 },
  "blinds":          { label: "Blinds",                      unitPrice: 56 },
  "balcony-small":   { label: "Small Balcony/Deck/Patio",    unitPrice: 64 },
  "balcony-large":   { label: "Large Balcony/Deck/Patio",    unitPrice: 84 },
  "garage":          { label: "Garage Sweep & Tidy",         unitPrice: 55 },
  "wall-washing":    { label: "Wall Washing",                unitPrice: 89 },
  "carpet":          { label: "Carpet Deep Cleaning",        unitPrice: 97 },
  "bedsheets":       { label: "Change Bedsheets",            unitPrice: 27 },
};

const LAUNDRY_MAP: Record<string, string> = { one: "1 Laundry", two: "2 Laundries" };
const STOREYS_MAP: Record<string, string> = { double: "Double Storey", triple: "Triple Storey" };

export interface QuotePayload {
  city: string;
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  laundry: string;
  storeys: string;
  hourly: boolean;
  hours: number;
  addons: Record<string, number>;
  frequency: string;
  date: string;
  timeSlot: string;
  exactTime?: string;
  instructions: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  referral: string;
  commercialSize?: string;
  officeRooms?: number;
  officeMeetingRooms?: number;
  officeKitchens?: number;
  officeBathrooms?: number;
  officeSchedule?: string;
  sanitaryWaste?: string;
  commercialType?: string;
}

function buildLabels(p: QuotePayload) {
  const s = (k: keyof QuotePayload) => String(p[k] ?? "");

  const cityLabel      = s("city").charAt(0).toUpperCase() + s("city").slice(1);
  const serviceLabel   = s("serviceType").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const frequencyLabel = s("frequency").charAt(0).toUpperCase() + s("frequency").slice(1);

  const addonsRecord = (p.addons && typeof p.addons === "object" && !Array.isArray(p.addons))
    ? p.addons as Record<string, number>
    : {};

  const addonsLabel = Object.keys(addonsRecord).length
    ? Object.entries(addonsRecord).map(([id, qty]) => {
        const a = ADDON_LABELS[id];
        if (!a) return id;
        return qty > 1 ? `${a.label} x${qty} = $${a.unitPrice * qty}` : `${a.label} = $${a.unitPrice}`;
      }).join(", ")
    : "None";

  const isHourly = p.hourly === true;
  const propertyLabel = isHourly
    ? `${p.hours || 3} hrs @ $85/hr`
    : [p.bedrooms && `${p.bedrooms} bed`, p.bathrooms && `${p.bathrooms} bath`].filter(Boolean).join(" / ") || "—";

  const laundryLabel = LAUNDRY_MAP[s("laundry")] ?? "";
  const storeysLabel = STOREYS_MAP[s("storeys")] ?? "";
  const addressLabel = [s("street"), s("suburb"), s("state"), s("postcode")].filter(Boolean).join(", ");
  const dateLabel    = p.date
    ? new Date(p.date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
    : "Not specified";
  const timeLabel    = p.timeSlot ? p.timeSlot.charAt(0).toUpperCase() + p.timeSlot.slice(1) : "Flexible";

  const { total, discount } = calculatePrice({
    serviceType: p.serviceType || "home",
    bedrooms:    p.bedrooms    || "1",
    bathrooms:   p.bathrooms   || "1",
    laundry:     p.laundry     || "none",
    storeys:     p.storeys     || "single",
    hourly:      isHourly,
    hours:       isHourly ? Number(p.hours) || 3 : undefined,
    addons:      addonsRecord,
    frequency:   p.frequency   || "once",
  });

  const priceLabel = discount > 0
    ? `$${total} (incl. $${discount} frequency discount)`
    : `$${total}`;

  return {
    cityLabel, serviceLabel, frequencyLabel, addonsLabel,
    propertyLabel, laundryLabel, storeysLabel, addressLabel,
    dateLabel, timeLabel, priceLabel,
    isHourly, addonsRecord,
  };
}

/* ── Invoice table helpers (admin email only) ── */
const CELL = "padding:10px 14px;font-size:14px;vertical-align:middle;border-top:1px solid #f1f5f9";

function iHeader(): string {
  const th = `padding:9px 14px;font-size:11px;font-weight:700;text-transform:uppercase;
              letter-spacing:.07em;color:#64748b;background:#f8fafc;text-align`;
  return `<tr>
    <th style="${th}:left;width:46%">Item</th>
    <th style="${th}:center;width:10%">Qty</th>
    <th style="${th}:right;width:21%">Unit Price</th>
    <th style="${th}:right;width:23%">Total</th>
  </tr>`;
}

function iRow(item: string, qty: number | string, unitPrice: string, totalAmt: number): string {
  return `<tr>
    <td style="${CELL};color:#1e293b">${item}</td>
    <td style="${CELL};color:#64748b;text-align:center">${qty}</td>
    <td style="${CELL};color:#64748b;text-align:right">${unitPrice}</td>
    <td style="${CELL};color:#1e293b;font-weight:600;text-align:right">$${totalAmt}</td>
  </tr>`;
}

function iSurchargeRow(label: string, pct: string, totalAmt: number): string {
  return `<tr style="background:#fff7ed">
    <td style="${CELL};color:#92400e;border-top:1px solid #fed7aa">${label}</td>
    <td style="${CELL};color:#92400e;text-align:center;border-top:1px solid #fed7aa">—</td>
    <td style="${CELL};color:#92400e;text-align:right;border-top:1px solid #fed7aa">${pct}</td>
    <td style="${CELL};color:#92400e;font-weight:600;text-align:right;border-top:1px solid #fed7aa">$${totalAmt}</td>
  </tr>`;
}

function iDivider(): string {
  return `<tr><td colspan="4" style="border-top:2px solid #e2e8f0;padding:0;height:1px;line-height:1px;font-size:1px">&nbsp;</td></tr>`;
}

function iSubtotalRow(amount: number): string {
  return `<tr style="background:#f8fafc">
    <td colspan="3" style="${CELL};font-weight:600;color:#374151;border-top:2px solid #e2e8f0">Subtotal</td>
    <td style="${CELL};font-weight:600;color:#374151;text-align:right;border-top:2px solid #e2e8f0">$${amount}</td>
  </tr>`;
}

function iDiscountRow(label: string, totalAmt: number): string {
  return `<tr style="background:#f0fdf4">
    <td colspan="3" style="${CELL};color:#15803d;border-top:1px solid #bbf7d0">${label}</td>
    <td style="${CELL};color:#15803d;font-weight:600;text-align:right;border-top:1px solid #bbf7d0">−$${totalAmt}</td>
  </tr>`;
}

function iTotalRow(amount: number): string {
  return `<tr style="background:#0f172a">
    <td colspan="3" style="padding:14px;font-size:15px;font-weight:700;color:#ffffff;vertical-align:middle">ESTIMATED TOTAL</td>
    <td style="padding:14px;font-size:16px;font-weight:700;color:#2dd4bf;text-align:right;vertical-align:middle">$${amount}</td>
  </tr>`;
}

const COMMERCIAL_TYPE_LABELS: Record<string, string> = {
  office:     "Office Cleaning",
  medical:    "Medical & Allied Health Cleaning",
  retail:     "Retail Cleaning",
  industrial: "Industrial & Warehouse Cleaning",
  airbnb:     "Airbnb & Short Stay Cleaning",
  childcare:  "Childcare Cleaning",
  strata:     "Strata Cleaning",
};

function buildCommercialBreakdown(p: QuotePayload): string {
  const typeLabel     = p.commercialType ? (COMMERCIAL_TYPE_LABELS[p.commercialType] ?? p.commercialType) : "Commercial";
  const scheduleLabel = p.officeSchedule === "after" ? "After hours (6pm onwards)" : p.officeSchedule === "during" ? "During office hours (8am–6pm)" : "Not specified";
  const rateLabel     = p.officeSchedule === "after" ? "$94/hr + GST" : "$82.50/hr + GST";
  const freqLabel     = FREQUENCY_DISCOUNTS[p.frequency]?.label ?? (p.frequency || "One-off");

  const rooms = [
    (p.officeRooms        || 0) > 0 ? `${p.officeRooms} Office${(p.officeRooms ?? 0) !== 1 ? "s" : ""} / Workstation${(p.officeRooms ?? 0) !== 1 ? "s" : ""}` : null,
    (p.officeMeetingRooms || 0) > 0 ? `${p.officeMeetingRooms} Meeting Room${(p.officeMeetingRooms ?? 0) !== 1 ? "s" : ""} / Boardroom${(p.officeMeetingRooms ?? 0) !== 1 ? "s" : ""}` : null,
    (p.officeKitchens     || 0) > 0 ? `${p.officeKitchens} Kitchen${(p.officeKitchens ?? 0) !== 1 ? "s" : ""} / Breakroom${(p.officeKitchens ?? 0) !== 1 ? "s" : ""}` : null,
    (p.officeBathrooms    || 0) > 0 ? `${p.officeBathrooms} Bathroom${(p.officeBathrooms ?? 0) !== 1 ? "s" : ""} / Toilet${(p.officeBathrooms ?? 0) !== 1 ? "s" : ""}` : null,
  ].filter(Boolean);

  return `
    <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden;margin-bottom:12px">
      ${row("Service type", typeLabel)}
      ${p.commercialType === "office" ? row("Rooms to clean", rooms.length ? rooms.join("<br>") : "Not specified") : ""}
      ${p.commercialType === "office" ? row("Preferred cleaning time", scheduleLabel) : ""}
      ${p.commercialType === "office" ? row("Hourly rate", rateLabel) : ""}
      ${p.commercialType === "office" ? row("Minimum", "2-hour minimum applies") : ""}
      ${row("Hourly rate", rateLabel)}
      ${row("Frequency", freqLabel)}
    </table>
    <div style="padding:12px 14px;background:#fff7ed;border-radius:8px;border-left:4px solid #f97316;margin-bottom:4px">
      <p style="margin:0;color:#92400e;font-size:13px;font-weight:600">
        Price to be confirmed after site visit — do not quote a total to the customer yet.
      </p>
    </div>`;
}

function buildInvoiceTable(p: QuotePayload): string {
  if (p.serviceType === "commercial") {
    return buildCommercialBreakdown(p);
  }

  const addonsRecord: Record<string, number> =
    p.addons && typeof p.addons === "object" && !Array.isArray(p.addons)
      ? (p.addons as Record<string, number>)
      : {};
  const isHourly = p.hourly === true;

  const rows: string[] = [iHeader()];
  let subtotal = 0;

  if (isHourly) {
    const hrs = Number(p.hours) || 3;
    const lineTotal = hrs * HOURLY_RATE;
    subtotal += lineTotal;
    rows.push(iRow(`Hourly Clean`, hrs, `$${HOURLY_RATE} / hr`, lineTotal));
  } else {
    const bedroomKey  = p.bedrooms  || "1";
    const bathroomKey = p.bathrooms || "1";
    const bedroomAdd  = BEDROOM_ADDS[bedroomKey]  ?? 0;
    const bathroomAdd = BATHROOM_ADDS[bathroomKey] ?? 0;

    subtotal += BASE_PRICE;
    rows.push(iRow("Base Clean (1 bed / 1 bath)", 1, `$${BASE_PRICE}`, BASE_PRICE));

    if (bedroomAdd > 0) {
      const label = bedroomKey === "studio" ? "Studio" : `${bedroomKey} bed`;
      rows.push(iRow(`Bedroom Upgrade (${label})`, 1, `+$${bedroomAdd}`, bedroomAdd));
      subtotal += bedroomAdd;
    }
    if (bathroomAdd > 0) {
      rows.push(iRow(`Bathroom Upgrade (${bathroomKey} bath)`, 1, `+$${bathroomAdd}`, bathroomAdd));
      subtotal += bathroomAdd;
    }

    const laundryOpt = LAUNDRY_OPTIONS.find((l) => l.id === (p.laundry || "none"));
    if (laundryOpt && laundryOpt.add > 0) {
      rows.push(iRow(laundryOpt.label, 1, `+$${laundryOpt.add}`, laundryOpt.add));
      subtotal += laundryOpt.add;
    }

    const storeyOpt = STOREY_OPTIONS.find((s) => s.id === (p.storeys || "single"));
    if (storeyOpt && storeyOpt.add > 0) {
      rows.push(iRow(storeyOpt.label, 1, `+$${storeyOpt.add}`, storeyOpt.add));
      subtotal += storeyOpt.add;
    }

    if (p.serviceType === "end-of-lease") {
      const after = Math.round(subtotal * (1 + EOL_SURCHARGE));
      rows.push(iSurchargeRow("End-of-Lease Surcharge", "+25%", after - subtotal));
      subtotal = after;
    } else if (p.serviceType === "deep-clean") {
      const after = Math.round(subtotal * (1 + DEEP_CLEAN_SURCHARGE));
      rows.push(iSurchargeRow("Deep Clean Surcharge", "+15%", after - subtotal));
      subtotal = after;
    }
  }

  for (const [id, qty] of Object.entries(addonsRecord)) {
    if (!qty || qty <= 0) continue;
    const addon = ADDONS.find((a) => a.id === id);
    if (!addon) continue;
    const lineTotal = addon.unitPrice * qty;
    const unitLabel = addon.unitLabel ? `$${addon.unitPrice} ${addon.unitLabel}` : `$${addon.unitPrice}`;
    rows.push(iRow(addon.label, qty, unitLabel, lineTotal));
    subtotal += lineTotal;
  }

  const discountRate  = FREQUENCY_DISCOUNTS[p.frequency]?.discount ?? 0;
  const discountLabel = FREQUENCY_DISCOUNTS[p.frequency]?.label ?? "";
  const discountAmt   = Math.round(subtotal * discountRate);
  const total         = subtotal - discountAmt;

  if (discountAmt > 0) {
    rows.push(iDivider());
    rows.push(iSubtotalRow(subtotal));
    rows.push(iDiscountRow(`${discountLabel} Frequency Discount (−${Math.round(discountRate * 100)}%)`, discountAmt));
  }
  rows.push(iTotalRow(total));

  return `<table style="width:100%;border-collapse:collapse;border-radius:8px;overflow:hidden;
                        border:1px solid #e2e8f0">
    ${rows.join("\n")}
  </table>`;
}

export function buildQuoteAdminHtml(p: QuotePayload): string {
  const { cityLabel, serviceLabel, addressLabel, dateLabel, timeLabel } = buildLabels(p);
  const frequencyLabel = FREQUENCY_DISCOUNTS[p.frequency]?.label ?? (p.frequency || "One-off");

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:12px;
              overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">

    <div style="background:#0f172a;padding:28px 32px">
      <p style="margin:0;color:#2dd4bf;font-size:12px;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em">New Quote Request (Verified)</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700">
        ${p.firstName} ${p.lastName}
      </h1>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px">${serviceLabel} &mdash; ${cityLabel}</p>
    </div>

    <div style="padding:28px 32px">

      ${section("Customer", `
        ${row("Name",      `${p.firstName} ${p.lastName}`)}
        ${row("Email",     p.email)}
        ${row("Mobile",    p.mobile)}
        ${row("Address",   addressLabel)}
      `)}

      <h3 style="margin:28px 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;
                 letter-spacing:.08em;color:#0d9488">Quote Breakdown</h3>
      ${buildInvoiceTable(p)}

      ${section("Preferred Schedule", `
        ${row("Date",         dateLabel)}
        ${row("Time slot",    timeLabel)}
        ${p.exactTime ? row("Preferred start time", p.exactTime) : ""}
        ${row("Frequency",    frequencyLabel)}
        ${row("Instructions", p.instructions || "None")}
      `)}

      ${p.referral ? section("Source", row("How they found us", p.referral)) : ""}

      <div style="margin-top:28px;padding:16px;background:#f0fdf4;border-radius:8px;
                  border-left:4px solid #22c55e">
        <p style="margin:0;color:#166534;font-size:13px;line-height:1.6">
          Reply to this email to reach <strong>${p.firstName}</strong> at
          <a href="mailto:${p.email}" style="color:#166534">${p.email}</a>
          or call <a href="tel:${p.mobile}" style="color:#166534">${p.mobile}</a>.
        </p>
      </div>
    </div>

    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
      <p style="margin:0;color:#94a3b8;font-size:12px">
        Sent by the ${BUSINESS.name} quote form &mdash; ${BUSINESS.domain}
      </p>
    </div>
  </div>
</body>
</html>`;
}

export function buildQuoteClientHtml(p: QuotePayload): string {
  const {
    cityLabel, serviceLabel, frequencyLabel, addonsLabel,
    propertyLabel, laundryLabel, storeysLabel, addressLabel,
    dateLabel, timeLabel, priceLabel,
  } = buildLabels(p);

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:600px;margin:32px auto;background:#ffffff;border-radius:12px;
              overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1)">

    <div style="background:#0f172a;padding:28px 32px">
      <p style="margin:0;color:#2dd4bf;font-size:12px;font-weight:700;text-transform:uppercase;
                letter-spacing:.1em">Booking Request Confirmed</p>
      <h1 style="margin:6px 0 0;color:#ffffff;font-size:22px;font-weight:700">
        Thanks, ${p.firstName}!
      </h1>
      <p style="margin:4px 0 0;color:#94a3b8;font-size:14px">We&apos;ll be in touch shortly with your quote.</p>
    </div>

    <div style="padding:28px 32px">
      <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6">
        ${p.serviceType === "commercial"
          ? `Hi ${p.firstName}, your commercial cleaning enquiry for your premises in <strong>${cityLabel}</strong> has been received. Our team will contact you via email or phone to arrange a site visit and confirm your tailored quote.`
          : `Hi ${p.firstName}, your <strong>${serviceLabel}</strong> booking request for <strong>${cityLabel}</strong> has been received. Our team will review your details and get back to you as soon as possible — usually within a few hours.`}
      </p>

      <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;
                 letter-spacing:.08em;color:#0d9488">Your Request Summary</h3>
      <table style="width:100%;border-collapse:collapse;background:#f9fafb;border-radius:8px;overflow:hidden;margin-bottom:16px">
        ${row("City",      cityLabel)}
        ${row("Service",   serviceLabel)}
        ${p.serviceType === "commercial" ? `
          ${p.commercialType ? row("Service type", COMMERCIAL_TYPE_LABELS[p.commercialType] ?? p.commercialType) : ""}
          ${p.commercialType === "office" && (p.officeRooms        || 0) > 0 ? row("Offices / Workstations",    String(p.officeRooms)) : ""}
          ${p.commercialType === "office" && (p.officeMeetingRooms || 0) > 0 ? row("Meeting Rooms / Boardrooms", String(p.officeMeetingRooms)) : ""}
          ${p.commercialType === "office" && (p.officeKitchens     || 0) > 0 ? row("Kitchens / Breakrooms",      String(p.officeKitchens)) : ""}
          ${p.commercialType === "office" && (p.officeBathrooms    || 0) > 0 ? row("Bathrooms / Toilets",        String(p.officeBathrooms)) : ""}
          ${p.commercialType === "office" && p.officeSchedule ? row("Preferred cleaning time", p.officeSchedule === "after" ? "After hours (6pm onwards)" : "During office hours (8am–6pm)") : ""}
        ` : `
          ${row("Property",  propertyLabel)}
          ${laundryLabel ? row("Laundry",   laundryLabel) : ""}
          ${storeysLabel ? row("Storeys",   storeysLabel) : ""}
          ${addonsLabel !== "None" ? row("Extras", addonsLabel) : ""}
        `}
        ${row("Frequency", frequencyLabel)}
        ${row("Address",   addressLabel)}
        ${row("Date",      dateLabel)}
        ${p.exactTime    ? row("Preferred Start Time", p.exactTime) : ""}
        ${p.instructions ? row("Instructions", p.instructions) : ""}
      </table>

      ${p.serviceType === "commercial" ? `
      <div style="margin-bottom:24px;padding:14px 16px;background:#fff7ed;border-radius:8px;
                  border-left:4px solid #f97316">
        <p style="margin:0 0 2px;font-size:12px;font-weight:700;text-transform:uppercase;
                  letter-spacing:.06em;color:#92400e">Next Step</p>
        <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6">
          We will contact you to arrange a site visit. Your final price will be confirmed after our team has assessed your office space.
        </p>
      </div>
      ` : `
      <div style="margin-bottom:24px;padding:14px 16px;background:#f0f9ff;border-radius:8px;
                  border-left:4px solid #0d9488">
        <p style="margin:0 0 2px;font-size:12px;font-weight:700;text-transform:uppercase;
                  letter-spacing:.06em;color:#0d9488">Estimated Price</p>
        <p style="margin:0;font-size:20px;font-weight:700;color:#0f172a">${priceLabel}</p>
        <p style="margin:4px 0 0;font-size:12px;color:#6b7280">
          This is an estimate — your final quote will be confirmed by our team.
        </p>
      </div>
      `}

      <div style="padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #22c55e">
        <p style="margin:0;color:#166534;font-size:13px;line-height:1.6">
          If you have any questions in the meantime, you can reach us at
          <a href="mailto:${BUSINESS.email}" style="color:#166534">${BUSINESS.email}</a>
          or call us on <a href="tel:${BUSINESS.phone}" style="color:#166534">${BUSINESS.phoneFormatted}</a>.
        </p>
      </div>
    </div>

    <div style="padding:16px 32px;background:#f8fafc;border-top:1px solid #e2e8f0">
      <p style="margin:0;color:#94a3b8;font-size:12px">
        ${BUSINESS.name} &mdash; ${BUSINESS.domain}
      </p>
    </div>
  </div>
</body>
</html>`;
}
