"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Turnstile } from "@marsidev/react-turnstile";
import { calculatePrice, ADDONS, LAUNDRY_OPTIONS, STOREY_OPTIONS, HOURLY_RATE, NDIS_HOURLY_RATE, HOURLY_MIN_HOURS, OFFICE_RATE_DURING, OFFICE_RATE_AFTER, OFFICE_MIN_HOURS } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { CITY_OPTIONS, getAvailableServices, getAvailableFrequencies, getStateForCity, isServiceAvailable, isFrequencyAvailable } from "@/lib/quote-config";
import { trackEvent, trackLead } from "@/lib/analytics";

/* ── Types ── */
interface BookingData {
  city: string;
  serviceType: string;
  bedrooms: string;
  bathrooms: string;
  laundry: string;
  storeys: string;
  hourly: boolean;
  hours: number;
  commercialSize: string;
  officeRooms: number;
  officeMeetingRooms: number;
  officeKitchens: number;
  officeBathrooms: number;
  officeSchedule: string;
  sanitaryWaste: string;
  commercialType: string;
  addons: Record<string, number>;
  frequency: string;
  date: string;
  timeSlot: string;
  exactTime: string;
  instructions: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  street: string;
  suburb: string;
  postcode: string;
  state: string;
  referral: string;
}

/* ── Constants ── */
const TOTAL_STEPS = 8;

const SERVICE_TYPES = [
  { id: "home", label: "Home Clean", icon: "🏠" },
  { id: "end-of-lease", label: "End of Lease", icon: "🔑" },
  { id: "commercial", label: "Commercial", icon: "🏢" },
  { id: "deep-clean", label: "Deep Clean", icon: "🧹" },
  { id: "ndis", label: "NDIS", icon: "♿" },
];

const COMMERCIAL_TYPES = [
  { id: "office",     label: "Office Cleaning",                  icon: "🖥️" },
  { id: "medical",    label: "Medical & Allied Health Cleaning",  icon: "🏥" },
  { id: "retail",     label: "Retail Cleaning",                   icon: "🛍️" },
  { id: "industrial", label: "Industrial & Warehouse Cleaning",   icon: "🏭" },
  { id: "airbnb",     label: "Airbnb & Short Stay Cleaning",      icon: "🏠" },
  { id: "childcare",  label: "Childcare Cleaning",                icon: "🧒" },
  { id: "strata",     label: "Strata Cleaning",                   icon: "🏢" },
];

const BEDROOM_OPTIONS = [
  { id: "studio", label: "Studio" },
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
  { id: "6", label: "6" },
];

const BATHROOM_OPTIONS = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
  { id: "6", label: "6" },
];


const FREQUENCY_OPTIONS = [
  { id: "once",        label: "One-off",      detail: "No commitment",           discount: 0    },
  { id: "weekly",      label: "Weekly",       detail: "Recurring every week",    discount: 0.15 },
  { id: "fortnightly", label: "Fortnightly",  detail: "Recurring every 2 weeks", discount: 0.10 },
];

const TIME_SLOTS = [
  { id: "morning", label: "Morning", detail: "8am – 12pm", icon: "🌅" },
  { id: "afternoon", label: "Afternoon", detail: "12pm – 5pm", icon: "☀️" },
  { id: "flexible", label: "Flexible", detail: "Any time", icon: "🕐" },
];

// 8:00 am → 6:00 pm in 30-min increments (21 slots)
const EXACT_TIME_OPTIONS: { value: string; label: string }[] = Array.from({ length: 21 }, (_, i) => {
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

const REFERRAL_OPTIONS = [
  "Google",
  "Facebook",
  "TikTok",
  "Friend / Family",
  "Other",
];

const STATES = ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"];

const TRUST_BADGES = [
  { icon: "🛡️", label: "Fully Insured" },
  { icon: "✅", label: "Police Checked" },
  { icon: "⭐", label: "Satisfaction Guaranteed" },
  { icon: "🔒", label: "Secure Booking" },
];

/* ── Session persistence ── */
const STORAGE_KEY = "taspro_quote_draft";
const NAME_KEY    = "taspro_user";

const DEFAULT_DATA: Partial<BookingData> = {
  addons: {},
  frequency: "once",
  timeSlot: "flexible",
  laundry: "none",
  storeys: "single",
  hourly: false,
  hours: HOURLY_MIN_HOURS,
  officeRooms: 0,
  officeMeetingRooms: 0,
  officeKitchens: 0,
  officeBathrooms: 0,
  commercialType: "",
};

/* ── Calendar helpers ── */
function buildGoogleCalendarUrl(
  date: string,
  timeSlot: string,
  exactTime: string | undefined,
  serviceLabel: string,
): string {
  const d = date.replace(/-/g, "");
  const h = exactTime ? parseInt(exactTime.split(":")[0]) : timeSlot === "afternoon" ? 13 : 9;
  const end = Math.min(h + 3, 20);
  const fmt = (n: number) => String(n).padStart(2, "0");
  return (
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`${serviceLabel} – Taspro Cleaning`)}` +
    `&dates=${d}T${fmt(h)}0000/${d}T${fmt(end)}0000` +
    `&details=${encodeURIComponent("Your Taspro cleaning appointment. We’ll confirm the exact time shortly.")}`
  );
}

function buildICSDataUrl(
  date: string,
  timeSlot: string,
  exactTime: string | undefined,
  serviceLabel: string,
): string {
  const d = date.replace(/-/g, "");
  const h = exactTime ? parseInt(exactTime.split(":")[0]) : timeSlot === "afternoon" ? 13 : 9;
  const end = Math.min(h + 3, 20);
  const fmt = (n: number) => String(n).padStart(2, "0");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Taspro Cleaning//EN",
    "BEGIN:VEVENT",
    `DTSTART:${d}T${fmt(h)}0000`,
    `DTEND:${d}T${fmt(end)}0000`,
    `SUMMARY:${serviceLabel} – Taspro Cleaning`,
    "DESCRIPTION:Your Taspro cleaning appointment. We'll confirm the exact time shortly.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}

/* ── Slide animation variants ── */
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

/* ── Step indicator ── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round(((step - 1) / (total - 1)) * 100);
  return (
    <div className="mb-8" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total} aria-label={`Step ${step} of ${total}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-navy-950/60">
          Step {step} of {total}
        </span>
        <span className="text-sm font-semibold text-teal-600">{pct}%</span>
      </div>
      <div className="h-2 bg-navy-950/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-teal-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ── Price footer ── */
function PriceFooter({ data }: { data: Partial<BookingData> }) {
  const isCommercial = data.serviceType === "commercial";
  const { base, addonsTotal, discount, total } = calculatePrice({
    serviceType: data.serviceType || "home",
    bedrooms: data.bedrooms || "1",
    bathrooms: data.bathrooms || "1",
    laundry: data.laundry,
    storeys: data.storeys,
    hourly: data.hourly,
    hours: data.hours,
    addons: data.addons || {},
    frequency: data.frequency || "once",
  });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-navy-950/10 shadow-lg px-4 py-3"
      role="status"
      aria-label="Estimated price"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        {isCommercial ? (
          <div className="flex items-center gap-4 flex-wrap text-sm text-navy-950/60">
            <span>☀️ During hours: <strong className="text-navy-950">$82.50/hr</strong> + GST</span>
            <span>🌙 After hours: <strong className="text-navy-950">$94/hr</strong> + GST</span>
            <span className="text-navy-950/40">· 2hr min · price confirmed after site visit</span>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-navy-950/50 text-sm">Estimated total</span>
              <span className="font-display font-bold text-2xl text-navy-950">
                ${total}
              </span>
              {discount > 0 && (
                <span className="text-green-600 text-sm font-semibold">
                  (saving ${discount})
                </span>
              )}
            </div>
            <div className="text-right text-xs text-navy-950/40">
              <div>Base ${base}</div>
              {addonsTotal > 0 && <div>Extras +${addonsTotal}</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main wizard ── */
export default function QuoteWizard() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [addonError, setAddonError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [noExtras, setNoExtras] = useState(false);
  const [data, setData] = useState<Partial<BookingData>>(DEFAULT_DATA);
  const [returningName, setReturningName] = useState<string | null>(null);
  const quoteStartedRef = useRef(false);
  const trackedStepsRef = useRef<Set<number>>(new Set());
  const [commercialPhase, setCommercialPhase] = useState(0); // 0 = type picker, 1 = office details
  const turnstileToken = useRef<string | null>(null);
  const [confirmDetails, setConfirmDetails] = useState<{
    date: string;
    timeSlot: string;
    exactTime?: string;
    serviceType: string;
  } | null>(null);

  const stepPanelRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<BookingData>({
    defaultValues: data as BookingData,
    mode: "onChange",
  });

  /* ── Restore draft from localStorage on mount ── */
  useEffect(() => {
    let requestedCity: string | undefined;
    let requestedService: string | undefined;

    try {
      const params = new URLSearchParams(window.location.search);
      const cityParam = params.get("city") || undefined;
      const serviceParam = params.get("service") || undefined;
      requestedCity = CITY_OPTIONS.some((city) => city.id === cityParam) ? cityParam : undefined;
      requestedService = SERVICE_TYPES.some((service) => service.id === serviceParam)
        ? serviceParam
        : undefined;

      const raw = localStorage.getItem(STORAGE_KEY);
      let savedStep = 1;
      let savedNoExtras = false;
      let savedData: Partial<BookingData> = {};

      if (raw) {
        const { currentStep, noExtras: parsedNoExtras, ...parsedData } = JSON.parse(raw) as Record<string, unknown>;
        savedData = parsedData as Partial<BookingData>;
        savedStep = typeof currentStep === "number" && currentStep > 1
          ? Math.min(currentStep, TOTAL_STEPS - 1)
          : 1;
        savedNoExtras = Boolean(parsedNoExtras);
      }

      const city = requestedCity ?? savedData.city;
      const availableFrequencies = city ? getAvailableFrequencies(city) : [];
      const initialData: Partial<BookingData> = {
        ...savedData,
        ...(requestedCity ? {
          city: requestedCity,
          addons: {},
          frequency: availableFrequencies.some((freq) => freq.id === savedData.frequency)
            ? savedData.frequency
            : availableFrequencies[0]?.id,
        } : {}),
      };

      if (requestedService && (!city || isServiceAvailable(city, requestedService))) {
        initialData.serviceType = requestedService;
      }

      setData((d) => ({ ...d, ...initialData }));
      if (savedNoExtras && !requestedCity && !requestedService) setNoExtras(true);

      const stepFromParams = requestedCity && initialData.serviceType ? 3 : requestedCity ? 2 : undefined;
      setStep(stepFromParams ?? savedStep);

      if (city) {
        const stateCode = getStateForCity(city);
        if (stateCode) setValue("state", stateCode);
      }
    } catch { /* ignore corrupt storage */ }

    const savedName = localStorage.getItem(NAME_KEY);
    if (savedName) setReturningName(savedName);

    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Persist draft to localStorage whenever relevant state changes ── */
  useEffect(() => {
    if (!ready) return;
    if (step === TOTAL_STEPS) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    if (!data.city && step === 1) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      city: data.city,
      serviceType: data.serviceType,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      laundry: data.laundry,
      storeys: data.storeys,
      hourly: data.hourly,
      hours: data.hours,
      addons: data.addons,
      frequency: data.frequency,
      date: data.date,
      timeSlot: data.timeSlot,
      exactTime: data.exactTime,
      instructions: data.instructions,
      officeRooms: data.officeRooms,
      officeMeetingRooms: data.officeMeetingRooms,
      officeKitchens: data.officeKitchens,
      officeSchedule: data.officeSchedule,
      sanitaryWaste: data.sanitaryWaste,
      commercialType: data.commercialType,
      currentStep: step,
      noExtras,
    }));
  }, [data, step, noExtras, ready]);

  /* ── Warn before leaving a partially-complete quote ── */
  useEffect(() => {
    if (step <= 1 || step >= TOTAL_STEPS) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [step]);

  /* ── Move focus to the new step panel after each transition ── */
  useEffect(() => {
    const t = setTimeout(() => stepPanelRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    if (!ready || trackedStepsRef.current.has(step)) return;
    trackedStepsRef.current.add(step);
    trackEvent("quote_step_view", {
      step,
      city: data.city,
      service_type: data.serviceType,
      event_category: "quote",
    });
  }, [data.city, data.serviceType, ready, step]);

  /* ── Clear saved quote and restart ── */
  const clearQuote = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_DATA);
    setStep(1);
    setDirection(1);
    setNoExtras(false);
    setAddonError(false);
    setDateError(false);
  };

  /* ── Navigation helpers ── */
  const goNext = () => {
    trackEvent("quote_step_completed", {
      step,
      service_type: data.serviceType,
      city: data.city,
      event_category: "quote",
    });
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => {
    setDirection(-1);
    setAddonError(false);
    setDateError(false);

    // Commercial step 3, phase 1 (office details) → back to phase 0 (type picker)
    if (step === 3 && data.serviceType === "commercial" && commercialPhase === 1) {
      setCommercialPhase(0);
      return;
    }

    // Going back from frequency (step 5) for commercial → back to step 3
    if (step === 5 && data.serviceType === "commercial") {
      setCommercialPhase(data.commercialType === "office" ? 1 : 0);
      setStep(3);
      return;
    }

    setStep((s) => Math.max(s - 1, 1));
  };

  /* ── Update partial data ── */
  const update = (patch: Partial<BookingData>) => {
    setData((d) => ({ ...d, ...patch }));
  };

  /* ── Select city — resets incompatible service/frequency, pre-fills state ── */
  const selectCity = (cityId: string) => {
    if (!quoteStartedRef.current) {
      quoteStartedRef.current = true;
      trackEvent("quote_started", {
        city: cityId,
        event_category: "quote",
      });
    }
    const stateCode = getStateForCity(cityId);
    const services  = getAvailableServices(cityId);
    const freqs     = getAvailableFrequencies(cityId);
    setNoExtras(false);
    setData((d) => ({
      ...d,
      city: cityId,
      addons: {},
      serviceType: services.some((s) => s.id === d.serviceType) ? d.serviceType : undefined,
      frequency:   freqs.some((f) => f.id === d.frequency)      ? d.frequency   : freqs[0].id,
    }));
    if (stateCode) setValue("state", stateCode);
    setTimeout(goNext, 220);
  };

  /* ── Toggle add-on ── */
  const toggleAddon = (id: string) => {
    setAddonError(false);
    setNoExtras(false);
    setData((d) => {
      const addons = { ...(d.addons || {}) };
      if (addons[id] !== undefined) {
        delete addons[id];
      } else {
        addons[id] = 1;
      }
      return { ...d, addons };
    });
  };

  /* ── Set quantity for a quantity-based addon ── */
  const setAddonQty = (id: string, qty: number) => {
    setData((d) => {
      const addons = { ...(d.addons || {}) };
      if (qty <= 0) {
        delete addons[id];
      } else {
        addons[id] = qty;
      }
      return { ...d, addons };
    });
  };

  const selectNoExtras = () => {
    setAddonError(false);
    setNoExtras(true);
    setData((d) => ({ ...d, addons: {} }));
    setTimeout(goNext, 220);
  };

  const handleStep4Continue = () => {
    if (Object.keys(data.addons || {}).length === 0 && !noExtras) {
      setAddonError(true);
      return;
    }
    setAddonError(false);
    goNext();
  };

  const handleStep6Continue = () => {
    if (!data.date) {
      setDateError(true);
      return;
    }
    setDateError(false);
    goNext();
  };

  const handleStep3CommercialContinue = () => {
    setDirection(1);
    setStep(5); // skip add-ons for commercial
  };

  /* ── Form submission (step 7) ── */
  const onSubmit: SubmitHandler<BookingData> = async (formData) => {
    if (!data.city || !data.serviceType) {
      setSubmitError("City and service type are required. Please go back and complete all steps.");
      return;
    }
    if (!isServiceAvailable(data.city, data.serviceType)) {
      setSubmitError("This service is not available in your selected city. Please go back and change your selection.");
      return;
    }
    if (data.frequency && !isFrequencyAvailable(data.city, data.frequency)) {
      setSubmitError("This frequency is not available in your selected city. Please go back and change your selection.");
      return;
    }

    if (!turnstileToken.current) {
      setSubmitError("Please wait for the security check to complete, then try again.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    const payload = { ...formData, ...data, turnstileToken: turnstileToken.current };
    trackEvent("quote_submitted", {
      city: data.city,
      service_type: data.serviceType,
      frequency: data.frequency,
      value: total,
      currency: "AUD",
      event_category: "quote",
    });

    let json: { ok?: boolean; pending?: boolean; verifyUrl?: string; error?: string } = {};
    try {
      const res = await fetch("/api/submit-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      json = await res.json().catch(() => ({}));
      if (!res.ok) {
        trackEvent("quote_submit_error", {
          city: data.city,
          service_type: data.serviceType,
          error_type: "api",
          event_category: "quote",
        });
        setSubmitError(json.error ?? "Something went wrong. Please call us directly.");
        setSubmitting(false);
        return;
      }
    } catch {
      trackEvent("quote_submit_error", {
        city: data.city,
        service_type: data.serviceType,
        error_type: "network",
        event_category: "quote",
      });
      setSubmitError("Network error. Please try again or call us on (08) 7081 6811.");
      setSubmitting(false);
      return;
    }

    // Persist first name for personalised greeting on next visit
    if (formData.firstName) localStorage.setItem(NAME_KEY, formData.firstName);

    trackEvent("quote_submitted_success", {
      city: data.city,
      service_type: data.serviceType,
      frequency: data.frequency,
      value: total,
      currency: "AUD",
      event_category: "quote",
    });
    trackLead("quote_submitted_success", {
      city: data.city,
      service_type: data.serviceType,
      value: total,
      currency: "AUD",
    });
    setConfirmDetails({
      date:        data.date || "",
      timeSlot:    data.timeSlot || "flexible",
      exactTime:   data.exactTime,
      serviceType: data.serviceType || "",
    });

    setSubmitting(false);
    goNext();
  };

  /* ── Commercial office pricing estimates ── */
  const officeRate      = data.officeSchedule === "after" ? OFFICE_RATE_AFTER : OFFICE_RATE_DURING;
  const officeRoomCount = (data.officeRooms || 0) + (data.officeMeetingRooms || 0) + (data.officeKitchens || 0);
  const officeRawHours  = (data.officeRooms || 0) * 0.5 + (data.officeMeetingRooms || 0) * 0.5 + (data.officeKitchens || 0) * 0.75 + (officeRoomCount > 0 ? 0.5 : 0);
  const officeEstHours  = Math.max(OFFICE_MIN_HOURS, Math.ceil(officeRawHours * 2) / 2); // round up to nearest 0.5 hr
  const officeEstTotal  = Math.round(officeEstHours * officeRate);

  /* ── Price data for sticky footer ── */
  const billedAddons = data.addons || {};
  const { total, discount } = calculatePrice({
    serviceType: data.serviceType || "home",
    bedrooms: data.bedrooms || "1",
    bathrooms: data.bathrooms || "1",
    laundry: data.laundry,
    storeys: data.storeys,
    hourly: data.hourly,
    hours: data.hours,
    addons: billedAddons,
    frequency: data.frequency || "once",
  });

  /* ── Auto-advance helper for single-choice steps ── */
  const selectAndAdvance = (patch: Partial<BookingData>) => {
    update(patch);
    setTimeout(goNext, 220);
  };

  /* ── Continue button disabled state ── */
  const continueDisabled =
    (step === 3 && data.serviceType !== "commercial" && !data.hourly && (!data.bedrooms || !data.bathrooms)) ||
    (step === 4 && Object.keys(data.addons || {}).length === 0 && !noExtras) ||
    (step === 6 && !data.date);

  return (
    <div className="pb-28" role="main" aria-label="Quote wizard">

      {/* Screen-reader live region — announces step changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {step < TOTAL_STEPS ? `Step ${step} of ${TOTAL_STEPS - 1}` : "Booking confirmed"}
      </div>

      {/* Sticky progress bar — stays visible as the user scrolls on mobile */}
      {step < TOTAL_STEPS && (
        <div className="sticky top-16 z-10 bg-white -mx-4 px-4 sm:mx-0 sm:px-0">
          <ProgressBar step={step} total={TOTAL_STEPS - 1} />
        </div>
      )}

      {/* Personalised welcome-back banner (step 1 only) */}
      {returningName && step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-2xl px-4 py-3 mb-4"
          role="status"
        >
          <span className="text-xl shrink-0" aria-hidden="true">👋</span>
          <p className="text-sm text-teal-800 font-medium">
            Welcome back, <strong>{returningName}</strong>! Your previous progress has been restored.
          </p>
        </motion.div>
      )}

      {/* ── Step panels ── */}
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          >
            {/* Focus target — receives focus after each step transition for keyboard/SR users */}
            <div ref={stepPanelRef} tabIndex={-1} className="outline-none">

              {/* ── STEP 1: City / Location ── */}
              {step === 1 && (
                <StepCard heading="Where are you located?" subheading="Service options depend on your city">
                  <div className="grid grid-cols-2 gap-3" role="group" aria-label="Select your city">
                    {CITY_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => selectCity(c.id)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5",
                          data.city === c.id
                            ? "border-teal-500 bg-teal-50 shadow-teal"
                            : "border-navy-950/10 bg-white hover:border-teal-300 hover:bg-teal-50/50"
                        )}
                        aria-pressed={data.city === c.id}
                        aria-label={`${c.label}${c.fullService ? " — full service" : " — recurring only"}`}
                      >
                        <span className="text-4xl" aria-hidden="true">{c.icon}</span>
                        <span className="font-semibold text-navy-950 text-sm text-center">{c.label}</span>
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full",
                          c.fullService ? "bg-teal-100 text-teal-700" : "bg-navy-950/5 text-navy-950/50"
                        )}>
                          {c.fullService ? "Full service" : "Recurring only"}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-navy-950/40 text-center mt-5 leading-relaxed">
                    Perth and Launceston offer all service types. Melbourne and Sydney offer recurring weekly or fortnightly cleaning only.
                  </p>
                </StepCard>
              )}

              {/* ── STEP 2: Service Type ── */}
              {step === 2 && (
                <StepCard
                  heading="What type of clean do you need?"
                  subheading={CITY_OPTIONS.find((c) => c.id === data.city)?.fullService ? "Select one to continue" : "Recurring services available in your city"}
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="group" aria-label="Select service type">
                    {getAvailableServices(data.city || "").map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          if (s.id !== data.serviceType) {
                            setNoExtras(false);
                            update({ serviceType: s.id, addons: {}, hourly: false });
                            trackEvent("quote_service_selected", {
                              city: data.city,
                              service_type: s.id,
                              event_category: "quote",
                            });
                            setTimeout(goNext, 220);
                          } else {
                            trackEvent("quote_service_selected", {
                              city: data.city,
                              service_type: s.id,
                              event_category: "quote",
                            });
                            selectAndAdvance({ serviceType: s.id });
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5",
                          data.serviceType === s.id
                            ? "border-teal-500 bg-teal-50 shadow-teal"
                            : "border-navy-950/10 bg-white hover:border-teal-300 hover:bg-teal-50/50"
                        )}
                        aria-pressed={data.serviceType === s.id}
                        aria-label={s.label}
                      >
                        <span className="text-4xl" aria-hidden="true">{s.icon}</span>
                        <span className="font-semibold text-navy-950 text-sm text-center">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </StepCard>
              )}

              {/* ── STEP 3a: Commercial sub-type picker ── */}
              {step === 3 && data.serviceType === "commercial" && commercialPhase === 0 && (
                <StepCard heading="What type of commercial clean?" subheading="Select the service that best matches your needs">
                  <div className="space-y-2">
                    {COMMERCIAL_TYPES.map((ct) => (
                      <button
                        key={ct.id}
                        onClick={() => {
                          update({ commercialType: ct.id });
                          trackEvent("commercial_type_selected", { commercial_type: ct.id, event_category: "quote" });
                          if (ct.id === "office") {
                            setDirection(1);
                            setCommercialPhase(1);
                          } else {
                            setDirection(1);
                            setStep(5);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5",
                          data.commercialType === ct.id
                            ? "border-teal-500 bg-teal-50 shadow-teal"
                            : "border-navy-950/10 bg-white hover:border-teal-300"
                        )}
                        aria-pressed={data.commercialType === ct.id}
                      >
                        <span className="text-2xl shrink-0" aria-hidden="true">{ct.icon}</span>
                        <span className="font-semibold text-navy-950">{ct.label}</span>
                      </button>
                    ))}
                  </div>
                </StepCard>
              )}

              {/* ── STEP 3b: Commercial office details ── */}
              {step === 3 && data.serviceType === "commercial" && commercialPhase === 1 && (
                <StepCard heading="Tell us about your office" subheading="All fields are optional — we’ll confirm the details when we follow up">
                  <div className="space-y-7">

                    {/* Room counts */}
                    <div>
                      <p className="font-semibold text-navy-950 text-sm uppercase tracking-wide mb-4">Rooms to clean</p>
                      <div className="space-y-3">
                        {(([
                          { key: "officeRooms",        label: "Offices / Workstations",    icon: "🖥️", max: 30 },
                          { key: "officeMeetingRooms", label: "Meeting rooms / Boardrooms", icon: "🤝", max: 20 },
                          { key: "officeKitchens",     label: "Kitchens / Breakrooms",      icon: "☕", max: 10 },
                          { key: "officeBathrooms",    label: "Bathrooms / Toilets",        icon: "🚿", max: 20 },
                        ]) as { key: keyof BookingData; label: string; icon: string; max: number }[]).map(({ key, label, icon, max }) => {
                          const val = (data[key] as number) || 0;
                          return (
                            <div key={String(key)} className="flex items-center justify-between p-4 bg-navy-950/[0.03] rounded-xl border border-navy-950/8">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl" aria-hidden="true">{icon}</span>
                                <span className="font-medium text-navy-950 text-sm">{label}</span>
                              </div>
                              <div className="flex items-center gap-3" role="group" aria-label={`${label} count`}>
                                <button
                                  onClick={() => update({ [key]: Math.max(0, val - 1) } as Partial<BookingData>)}
                                  disabled={val <= 0}
                                  className="w-8 h-8 rounded-full bg-white border border-navy-950/15 font-bold text-lg flex items-center justify-center hover:bg-navy-950/5 disabled:opacity-30 transition-colors"
                                  aria-label={`Decrease ${label}`}
                                >−</button>
                                <span className="w-6 text-center font-bold text-navy-950 tabular-nums" aria-live="polite">{val}</span>
                                <button
                                  onClick={() => update({ [key]: Math.min(max, val + 1) } as Partial<BookingData>)}
                                  disabled={val >= max}
                                  className="w-8 h-8 rounded-full bg-teal-500 text-white font-bold text-lg flex items-center justify-center hover:bg-teal-600 disabled:opacity-30 transition-colors"
                                  aria-label={`Increase ${label}`}
                                >+</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cleaning schedule */}
                    <div>
                      <p className="font-semibold text-navy-950 text-sm uppercase tracking-wide mb-3">Preferred cleaning time</p>
                      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Preferred cleaning schedule">
                        {[
                          { id: "during", label: "During office hours", detail: "8am – 6pm",   icon: "☀️" },
                          { id: "after",  label: "After hours",          detail: "6pm onwards", icon: "🌙" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => update({ officeSchedule: opt.id })}
                            className={cn(
                              "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200",
                              data.officeSchedule === opt.id
                                ? "border-teal-500 bg-teal-50 shadow-teal"
                                : "border-navy-950/10 bg-white hover:border-teal-300"
                            )}
                            aria-pressed={data.officeSchedule === opt.id}
                            aria-label={`${opt.label}: ${opt.detail}`}
                          >
                            <span className="text-2xl" aria-hidden="true">{opt.icon}</span>
                            <span className="font-semibold text-navy-950 text-sm">{opt.label}</span>
                            <span className="text-navy-950/50 text-xs">{opt.detail}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Cost structure info */}
                    <div className="bg-navy-950/[0.03] border border-navy-950/10 rounded-xl p-4 space-y-2">
                      <p className="font-semibold text-navy-950 text-sm">Cost structure</p>
                      <div className="flex flex-wrap gap-4 text-xs text-navy-950/60">
                        <span>☀️ During hours: <strong className="text-navy-950">$82.50/hr</strong> + GST</span>
                        <span>🌙 After hours: <strong className="text-navy-950">$94/hr</strong> + GST</span>
                      </div>
                      <p className="text-xs text-navy-950/50 leading-relaxed">
                        2-hour minimum applies. CBD locations incur no transport fee — additional charges may apply for locations outside the CBD. <strong className="text-navy-950/70">Final price will be confirmed after the site visit.</strong>
                      </p>
                    </div>

                    {/* SANITARY WASTE — hidden until service is available; uncomment to re-enable
                    <div>
                      <p className="font-semibold text-navy-950 text-sm uppercase tracking-wide mb-1">Sanitary waste services</p>
                      <p className="text-navy-950/50 text-xs mb-3">Do you already have a service arranged for sanitary waste collection?</p>
                      <div className="space-y-2" role="group" aria-label="Sanitary waste arrangement">
                        {[
                          { id: "arranged",      label: "Yes — we’ve arranged it",  icon: "✅" },
                          { id: "not-needed",    label: "No — we don’t require it", icon: "🚫" },
                          { id: "need-arranged", label: "No — we need this arranged",    icon: "❓" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => update({ sanitaryWaste: opt.id })}
                            className={cn(
                              "w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all duration-200",
                              data.sanitaryWaste === opt.id
                                ? "border-teal-500 bg-teal-50"
                                : "border-navy-950/10 bg-white hover:border-teal-300"
                            )}
                            aria-pressed={data.sanitaryWaste === opt.id}
                          >
                            <span className="text-lg shrink-0" aria-hidden="true">{opt.icon}</span>
                            <span className="font-medium text-navy-950 text-sm">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                      {data.sanitaryWaste === "need-arranged" && (
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3" role="alert">
                          <span className="text-lg shrink-0" aria-hidden="true">ℹ️</span>
                          <p className="text-sm text-amber-800 leading-relaxed">
                            We don&apos;t currently offer sanitary waste collection. You&apos;ll need to arrange this with a specialist provider before your clean commences. We&apos;re happy to discuss your requirements when we follow up.
                          </p>
                        </div>
                      )}
                    </div>
                    END SANITARY WASTE */}

                    <p className="text-xs text-navy-950/40 text-center">
                      All fields are optional — we&apos;ll confirm the details when we follow up.
                    </p>
                  </div>
                </StepCard>
              )}

              {/* ── STEP 3c: Residential property details ── */}
              {step === 3 && data.serviceType !== "commercial" && (
                <StepCard heading="How big is the property?" subheading="This determines your base price">
                  <div className="space-y-6">

                    {/* Hourly toggle */}
                    <button
                      onClick={() => update({ hourly: !data.hourly, hours: data.hours || HOURLY_MIN_HOURS })}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200",
                        data.hourly ? "border-teal-500 bg-teal-50" : "border-navy-950/10 bg-white hover:border-teal-300"
                      )}
                      aria-pressed={!!data.hourly}
                      aria-describedby="hourly-desc"
                    >
                      <span className="text-2xl shrink-0" aria-hidden="true">⏱️</span>
                      <div className="flex-1">
                        <p className="font-semibold text-navy-950 text-sm">Hourly Cleaning</p>
                        <p id="hourly-desc" className="text-navy-950/50 text-xs">${data.serviceType === "ndis" ? "58.03" : "85"}/hr — minimum 3 hours</p>
                      </div>
                      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0", data.hourly ? "border-teal-500 bg-teal-500" : "border-navy-950/20")} aria-hidden="true">
                        {data.hourly && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                    </button>

                    {data.hourly ? (
                      /* Hours selector */
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-8 py-2">
                          <button
                            onClick={() => update({ hours: Math.max(HOURLY_MIN_HOURS, (data.hours || HOURLY_MIN_HOURS) - 1) })}
                            disabled={(data.hours || HOURLY_MIN_HOURS) <= HOURLY_MIN_HOURS}
                            className="w-12 h-12 rounded-full bg-navy-950/5 hover:bg-navy-950/10 text-navy-950 font-bold text-2xl flex items-center justify-center transition-colors disabled:opacity-30"
                            aria-label="Decrease hours"
                          >−</button>
                          <div className="text-center w-24" aria-live="polite" aria-atomic="true">
                            <span className="font-display text-5xl font-bold text-navy-950 tabular-nums">{data.hours || HOURLY_MIN_HOURS}</span>
                            <p className="text-navy-950/50 text-sm mt-1">hours</p>
                          </div>
                          <button
                            onClick={() => update({ hours: Math.min(22, (data.hours || HOURLY_MIN_HOURS) + 1) })}
                            disabled={(data.hours || HOURLY_MIN_HOURS) >= 22}
                            className="w-12 h-12 rounded-full bg-teal-500 hover:bg-teal-600 text-white font-bold text-2xl flex items-center justify-center transition-colors disabled:opacity-30"
                            aria-label="Increase hours"
                          >+</button>
                        </div>
                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
                          <p className="font-display font-bold text-2xl text-teal-700">${Math.round((data.hours || HOURLY_MIN_HOURS) * (data.serviceType === "ndis" ? NDIS_HOURLY_RATE : HOURLY_RATE) * 100) / 100}</p>
                          <p className="text-teal-800 text-xs mt-1">Billed at ${data.serviceType === "ndis" ? "58.03" : "85"} per hour — minimum 3 hour booking</p>
                        </div>
                      </div>
                    ) : (
                      /* Property size fields */
                      <>
                        <fieldset>
                          <legend className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Bedrooms</legend>
                          <div className="flex flex-wrap gap-2">
                            {BEDROOM_OPTIONS.map((b) => (
                              <button
                                key={b.id}
                                onClick={() => update({ bedrooms: b.id })}
                                className={cn(
                                  "w-16 h-14 rounded-xl border-2 font-semibold text-sm transition-all duration-150",
                                  data.bedrooms === b.id ? "border-teal-500 bg-teal-500 text-navy-950 shadow-teal" : "border-navy-950/10 bg-white text-navy-950 hover:border-teal-300"
                                )}
                                aria-pressed={data.bedrooms === b.id}
                                aria-label={`${b.label} bedroom${b.id === "studio" ? "" : b.id === "1" ? "" : "s"}`}
                              >{b.label}</button>
                            ))}
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Bathrooms</legend>
                          <div className="flex flex-wrap gap-2">
                            {BATHROOM_OPTIONS.map((b) => (
                              <button
                                key={b.id}
                                onClick={() => update({ bathrooms: b.id })}
                                className={cn(
                                  "w-16 h-14 rounded-xl border-2 font-semibold text-sm transition-all duration-150",
                                  data.bathrooms === b.id ? "border-teal-500 bg-teal-500 text-navy-950 shadow-teal" : "border-navy-950/10 bg-white text-navy-950 hover:border-teal-300"
                                )}
                                aria-pressed={data.bathrooms === b.id}
                                aria-label={`${b.label} bathroom${b.id === "1" ? "" : "s"}`}
                              >{b.label}</button>
                            ))}
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Laundry Room / Cupboard</legend>
                          <div className="flex flex-wrap gap-2">
                            {LAUNDRY_OPTIONS.map((l) => (
                              <button
                                key={l.id}
                                onClick={() => update({ laundry: l.id })}
                                className={cn(
                                  "px-4 h-12 rounded-xl border-2 font-semibold text-sm transition-all duration-150 flex items-center gap-1.5",
                                  (data.laundry || "none") === l.id ? "border-teal-500 bg-teal-500 text-navy-950 shadow-teal" : "border-navy-950/10 bg-white text-navy-950 hover:border-teal-300"
                                )}
                                aria-pressed={(data.laundry || "none") === l.id}
                              >
                                {l.label}
                                {l.add > 0 && <span className="opacity-60 text-xs font-normal">+${l.add}</span>}
                              </button>
                            ))}
                          </div>
                        </fieldset>

                        <fieldset>
                          <legend className="font-semibold text-navy-950 mb-3 text-sm uppercase tracking-wide">Storeys</legend>
                          <div className="flex flex-wrap gap-2">
                            {STOREY_OPTIONS.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => update({ storeys: s.id })}
                                className={cn(
                                  "px-4 h-12 rounded-xl border-2 font-semibold text-sm transition-all duration-150 flex items-center gap-1.5",
                                  (data.storeys || "single") === s.id ? "border-teal-500 bg-teal-500 text-navy-950 shadow-teal" : "border-navy-950/10 bg-white text-navy-950 hover:border-teal-300"
                                )}
                                aria-pressed={(data.storeys || "single") === s.id}
                              >
                                {s.label}
                                {s.add > 0 && <span className="opacity-60 text-xs font-normal">+${s.add}</span>}
                              </button>
                            ))}
                          </div>
                        </fieldset>

                        {/* Live price hint */}
                        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-center justify-between" aria-live="polite" aria-atomic="true">
                          <span className="text-sm text-teal-800 font-medium">Estimated base price</span>
                          <span className="font-display font-bold text-2xl text-teal-700">
                            ${calculatePrice({ serviceType: data.serviceType || "home", bedrooms: data.bedrooms || "1", bathrooms: data.bathrooms || "1", laundry: data.laundry, storeys: data.storeys, addons: {}, frequency: "once" }).base}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </StepCard>
              )}

              {/* ── STEP 4: Add-ons ── */}
              {step === 4 && (
                <StepCard heading="Any add-on extras?" subheading="Select extras or choose 'No extras required' to continue">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Select add-on extras">
                    {ADDONS.filter((addon) => !addon.excludeForServices?.includes(data.serviceType || "")).map((addon) => {
                      const qty = (data.addons || {})[addon.id] ?? 0;
                      const selected = qty > 0;
                      return (
                        <div
                          key={addon.id}
                          className={cn(
                            "rounded-2xl border-2 transition-all duration-200 overflow-hidden",
                            selected ? "border-teal-500 bg-teal-50 shadow-sm" : "border-navy-950/10 bg-white hover:border-teal-300"
                          )}
                        >
                          <button
                            onClick={() => toggleAddon(addon.id)}
                            className="flex items-center gap-4 p-4 w-full text-left"
                            aria-pressed={selected}
                            aria-label={`${addon.label} — $${addon.unitPrice}${addon.unitLabel ? ` ${addon.unitLabel}` : ""}${selected ? ", selected" : ""}`}
                          >
                            <span className="text-2xl shrink-0" aria-hidden="true">{addon.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-navy-950 text-sm leading-snug">{addon.label}</p>
                              <p className="text-teal-600 font-bold text-sm">
                                {selected && addon.hasQuantity && qty > 1
                                  ? `x${qty} = $${addon.unitPrice * qty}`
                                  : `+$${addon.unitPrice}${addon.unitLabel ? ` ${addon.unitLabel}` : ""}`}
                              </p>
                            </div>
                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all", selected ? "border-teal-500 bg-teal-500" : "border-navy-950/20")} aria-hidden="true">
                              {selected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                          </button>
                          {selected && addon.hasQuantity && (
                            <div className="flex items-center justify-between px-4 pb-3 border-t border-teal-200/60 pt-2">
                              <span className="text-xs text-teal-700 font-medium capitalize">{addon.unitLabel || "quantity"}</span>
                              <div className="flex items-center gap-3" role="group" aria-label={`${addon.label} quantity`}>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setAddonQty(addon.id, qty - 1); }}
                                  className="w-7 h-7 rounded-full bg-white border border-teal-300 text-teal-700 font-bold flex items-center justify-center hover:bg-teal-100 transition-colors leading-none"
                                  aria-label={`Decrease ${addon.label} quantity`}
                                >−</button>
                                <span className="font-bold text-navy-950 w-5 text-center text-sm tabular-nums" aria-live="polite">{qty}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setAddonQty(addon.id, Math.min(qty + 1, addon.maxQty)); }}
                                  disabled={qty >= addon.maxQty}
                                  className="w-7 h-7 rounded-full bg-teal-500 text-white font-bold flex items-center justify-center hover:bg-teal-600 disabled:opacity-30 transition-colors leading-none"
                                  aria-label={`Increase ${addon.label} quantity`}
                                >+</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={selectNoExtras}
                    className={cn(
                      "w-full mt-3 flex items-center justify-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200",
                      noExtras ? "border-teal-500 bg-teal-50 shadow-sm" : "border-navy-950/10 bg-white hover:border-teal-300"
                    )}
                    aria-pressed={noExtras}
                  >
                    <span className="text-2xl" aria-hidden="true">✓</span>
                    <span className="font-semibold text-navy-950 text-sm">No extras required</span>
                  </button>

                  {addonError && (
                    <p className="text-red-500 text-sm font-medium text-center mt-3" role="alert">
                      Please select at least one option to continue.
                    </p>
                  )}
                </StepCard>
              )}

              {/* ── STEP 5: Frequency ── */}
              {step === 5 && (
                <StepCard
                  heading="How often?"
                  subheading={CITY_OPTIONS.find((c) => c.id === data.city)?.fullService ? "Select how often you'd like your service" : "Weekly or fortnightly recurring cleans available in your city"}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Select cleaning frequency">
                    {getAvailableFrequencies(data.city || "").map((f) => {
                      const selected = data.frequency === f.id;
                      const { total: savedTotal } = calculatePrice({
                        serviceType: data.serviceType || "home",
                        bedrooms: data.bedrooms || "1",
                        bathrooms: data.bathrooms || "1",
                        laundry: data.laundry,
                        storeys: data.storeys,
                        hourly: data.hourly,
                        hours: data.hours,
                        addons: billedAddons,
                        frequency: f.id,
                      });
                      const saving = total - savedTotal;
                      return (
                        <button
                          key={f.id}
                          onClick={() => {
                            trackEvent("quote_frequency_selected", {
                              city: data.city,
                              service_type: data.serviceType,
                              frequency: f.id,
                              event_category: "quote",
                            });
                            selectAndAdvance({ frequency: f.id });
                          }}
                          className={cn(
                            "p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5",
                            selected
                              ? "border-teal-500 bg-teal-50 shadow-teal"
                              : "border-navy-950/10 bg-white hover:border-teal-300"
                          )}
                          aria-pressed={selected}
                          aria-label={f.label}
                        >
                          <p className="font-display font-bold text-lg text-navy-950">{f.label}</p>
                          <p className="text-navy-950/50 text-sm mt-1">{f.detail}</p>
                        </button>
                      );
                    })}
                  </div>
                </StepCard>
              )}

              {/* ── STEP 6: Date & Time ── */}
              {step === 6 && (
                <StepCard heading="When would you like your service to start?" subheading="Select a preferred date and time">
                  <div className="space-y-6">
                    {/* Date picker */}
                    <div>
                      <label
                        htmlFor="quote-date"
                        className="block font-semibold text-navy-950 mb-2 text-sm uppercase tracking-wide"
                      >
                        Preferred Date *
                      </label>
                      <input
                        id="quote-date"
                        type="date"
                        min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                        value={data.date || ""}
                        onChange={(e) => { setDateError(false); update({ date: e.target.value }); }}
                        className={cn(
                          "w-full border-2 rounded-xl px-4 py-3 text-navy-950 font-medium focus:outline-none transition-colors bg-white",
                          dateError ? "border-red-400 focus:border-red-500" : "border-navy-950/10 focus:border-teal-500"
                        )}
                        aria-label="Preferred clean date"
                        aria-invalid={dateError}
                        aria-describedby={dateError ? "date-error" : undefined}
                      />
                      {dateError && (
                        <p id="date-error" className="text-red-500 text-sm font-medium mt-1" role="alert">
                          Please select a preferred date to continue.
                        </p>
                      )}
                    </div>

                    {/* Preferred start time */}
                    <div>
                      <label
                        htmlFor="exact-time"
                        className="block font-semibold text-navy-950 mb-2 text-sm uppercase tracking-wide"
                      >
                        Preferred start time <span className="text-navy-950/40 font-normal normal-case">(optional)</span>
                      </label>
                      <select
                        id="exact-time"
                        value={data.exactTime || ""}
                        onChange={(e) => update({ exactTime: e.target.value })}
                        className="w-full border-2 border-navy-950/10 rounded-xl px-4 py-3 text-navy-950 font-medium focus:outline-none focus:border-teal-500 transition-colors bg-white"
                        aria-describedby="exact-time-hint"
                      >
                        <option value="">Select a time…</option>
                        {EXACT_TIME_OPTIONS.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <p id="exact-time-hint" className="text-xs text-navy-950/40 mt-1.5">
                        We&apos;ll do our best to accommodate — your start time will be confirmed after booking.
                      </p>
                    </div>

                    {/* Special instructions */}
                    <div>
                      <label
                        htmlFor="instructions"
                        className="block font-semibold text-navy-950 mb-2 text-sm uppercase tracking-wide"
                      >
                        Special Instructions <span className="text-navy-950/40 font-normal normal-case">(optional)</span>
                      </label>
                      <textarea
                        id="instructions"
                        rows={3}
                        placeholder="e.g. Please focus on the kitchen. Dog in backyard — please keep gate closed."
                        value={data.instructions || ""}
                        onChange={(e) => update({ instructions: e.target.value })}
                        className="w-full border-2 border-navy-950/10 rounded-xl px-4 py-3 text-navy-950 placeholder:text-navy-950/30 focus:outline-none focus:border-teal-500 transition-colors resize-none bg-white"
                        aria-label="Special cleaning instructions"
                      />
                    </div>
                  </div>
                </StepCard>
              )}

              {/* ── STEP 7: Your Details ── */}
              {step === 7 && (
                <StepCard heading="Almost there!" subheading="We'll use these details to confirm your booking">
                  <form
                    id="quote-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                    noValidate
                    aria-label="Your contact and address details"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="firstName" className="form-label">First name *</label>
                        <input
                          id="firstName"
                          {...register("firstName", { required: "First name is required" })}
                          className={cn("form-input", errors.firstName && "border-red-400 focus:border-red-500")}
                          aria-invalid={!!errors.firstName}
                          aria-describedby={errors.firstName ? "firstName-error" : undefined}
                          autoComplete="given-name"
                        />
                        {errors.firstName && (
                          <p id="firstName-error" className="form-error" role="alert">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="form-label">Last name *</label>
                        <input
                          id="lastName"
                          {...register("lastName", { required: "Last name is required" })}
                          className={cn("form-input", errors.lastName && "border-red-400")}
                          aria-invalid={!!errors.lastName}
                          aria-describedby={errors.lastName ? "lastName-error" : undefined}
                          autoComplete="family-name"
                        />
                        {errors.lastName && (
                          <p id="lastName-error" className="form-error" role="alert">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="form-label">Email address *</label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
                        })}
                        className={cn("form-input", errors.email && "border-red-400")}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                        autoComplete="email"
                      />
                      {errors.email && <p id="email-error" className="form-error" role="alert">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="mobile" className="form-label">Mobile number *</label>
                      <input
                        id="mobile"
                        type="tel"
                        {...register("mobile", {
                          required: "Mobile is required",
                          pattern: { value: /^[\d\s\+\-()]{8,}$/, message: "Enter a valid mobile number" },
                        })}
                        className={cn("form-input", errors.mobile && "border-red-400")}
                        aria-invalid={!!errors.mobile}
                        aria-describedby={errors.mobile ? "mobile-error" : undefined}
                        autoComplete="tel"
                        placeholder="0400 000 000"
                      />
                      {errors.mobile && <p id="mobile-error" className="form-error" role="alert">{errors.mobile.message}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label htmlFor="street" className="form-label">Street address *</label>
                      <input
                        id="street"
                        {...register("street", { required: "Street address is required" })}
                        className={cn("form-input", errors.street && "border-red-400")}
                        aria-invalid={!!errors.street}
                        aria-describedby={errors.street ? "street-error" : undefined}
                        autoComplete="street-address"
                        placeholder="12 Example Street"
                      />
                      {errors.street && <p id="street-error" className="form-error" role="alert">{errors.street.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="suburb" className="form-label">Suburb *</label>
                        <input
                          id="suburb"
                          {...register("suburb", { required: "Suburb is required" })}
                          className={cn("form-input", errors.suburb && "border-red-400")}
                          aria-invalid={!!errors.suburb}
                          aria-describedby={errors.suburb ? "suburb-error" : undefined}
                          autoComplete="address-level2"
                          placeholder="Launceston"
                        />
                        {errors.suburb && <p id="suburb-error" className="form-error" role="alert">{errors.suburb.message}</p>}
                      </div>
                      <div>
                        <label htmlFor="postcode" className="form-label">Postcode *</label>
                        <input
                          id="postcode"
                          {...register("postcode", { required: "Postcode is required" })}
                          className={cn("form-input", errors.postcode && "border-red-400")}
                          aria-invalid={!!errors.postcode}
                          aria-describedby={errors.postcode ? "postcode-error" : undefined}
                          autoComplete="postal-code"
                          placeholder="7250"
                        />
                        {errors.postcode && <p id="postcode-error" className="form-error" role="alert">{errors.postcode.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="state" className="form-label">State *</label>
                      <select
                        id="state"
                        {...register("state", { required: "State is required" })}
                        className={cn("form-input", errors.state && "border-red-400")}
                        aria-invalid={!!errors.state}
                        aria-describedby={errors.state ? "state-error" : undefined}
                        autoComplete="address-level1"
                      >
                        <option value="">Select state…</option>
                        {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p id="state-error" className="form-error" role="alert">{errors.state.message}</p>}
                    </div>

                    <div>
                      <label htmlFor="referral" className="form-label">How did you hear about us? <span className="text-navy-950/40 font-normal">(optional)</span></label>
                      <select id="referral" {...register("referral")} className="form-input">
                        <option value="">Select…</option>
                        {REFERRAL_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>

                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={(token) => { turnstileToken.current = token; }}
                      onError={() => { turnstileToken.current = null; }}
                      onExpire={() => { turnstileToken.current = null; }}
                      options={{ theme: "light" }}
                    />
                  </form>

                  {/* Trust badges */}
                  <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-6 mt-2 border-t border-navy-950/8" aria-label="Trust and security">
                    {TRUST_BADGES.map((b) => (
                      <div key={b.label} className="flex items-center gap-1.5 text-xs text-navy-950/55 font-medium">
                        <span aria-hidden="true">{b.icon}</span>
                        {b.label}
                      </div>
                    ))}
                  </div>
                </StepCard>
              )}

              {/* ── STEP 8: Booking confirmed ── */}
              {step === 8 && (
                <StepCard heading="" subheading="">
                  <div className="text-center py-4">
                    {/* Animated checkmark */}
                    <motion.div
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-6 shadow-teal"
                      aria-hidden="true"
                    >
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-display text-3xl font-bold text-navy-950 mb-3"
                    >
                      Booking Request Received!
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="text-navy-950/60 text-base mb-8"
                    >
                      {data.serviceType === "commercial"
                        ? "We’ve received your request. Our team will contact you via email or phone to confirm a site visit."
                        : "We’ll confirm your booking within 2 hours via SMS and email."}
                    </motion.p>

                    {/* Booking summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-navy-950/[0.04] rounded-2xl p-6 text-left mb-8"
                      aria-label="Booking summary"
                    >
                      <h3 className="font-display font-semibold text-navy-950 mb-4">Booking Summary</h3>
                      <div className="space-y-3 text-sm">
                        <SummaryRow label="Service" value={SERVICE_TYPES.find(s => s.id === data.serviceType)?.label || "—"} />
                        {data.serviceType === "commercial" ? (
                          <>
                            {data.commercialType && <SummaryRow label="Type" value={COMMERCIAL_TYPES.find(ct => ct.id === data.commercialType)?.label || data.commercialType} />}
                            <SummaryRow label="Rooms" value={[
                              (data.officeRooms        || 0) > 0 ? `${data.officeRooms} office${data.officeRooms        !== 1 ? "s" : ""}` : null,
                              (data.officeMeetingRooms || 0) > 0 ? `${data.officeMeetingRooms} meeting room${data.officeMeetingRooms !== 1 ? "s" : ""}` : null,
                              (data.officeKitchens     || 0) > 0 ? `${data.officeKitchens} kitchen${data.officeKitchens  !== 1 ? "s" : ""}` : null,
                              (data.officeBathrooms    || 0) > 0 ? `${data.officeBathrooms} bathroom${data.officeBathrooms !== 1 ? "s" : ""}` : null,
                            ].filter(Boolean).join(", ") || "To be discussed"} />
                            {data.officeSchedule && <SummaryRow label="Cleaning time" value={data.officeSchedule === "during" ? "During office hours" : "After hours"} />}
                            {data.sanitaryWaste  && <SummaryRow label="Sanitary waste" value={data.sanitaryWaste === "arranged" ? "Arranged" : data.sanitaryWaste === "not-needed" ? "Not required" : "To discuss"} />}
                          </>
                        ) : data.hourly ? (
                          <SummaryRow label="Hours" value={`${data.hours || HOURLY_MIN_HOURS} hrs @ $${data.serviceType === "ndis" ? NDIS_HOURLY_RATE : HOURLY_RATE}/hr = $${Math.round((data.hours || HOURLY_MIN_HOURS) * (data.serviceType === "ndis" ? NDIS_HOURLY_RATE : HOURLY_RATE) * 100) / 100}`} />
                        ) : (
                          <>
                            <SummaryRow label="Property" value={`${data.bedrooms || "—"} bed / ${data.bathrooms || "—"} bath`} />
                            {data.laundry && data.laundry !== "none" && (
                              <SummaryRow label="Laundry" value={LAUNDRY_OPTIONS.find(l => l.id === data.laundry)?.label || ""} />
                            )}
                            {data.storeys && data.storeys !== "single" && (
                              <SummaryRow label="Storeys" value={STOREY_OPTIONS.find(s => s.id === data.storeys)?.label || ""} />
                            )}
                          </>
                        )}
                        <SummaryRow
                          label="Extras"
                          value={Object.keys(data.addons || {}).length > 0
                            ? Object.entries(data.addons || {}).map(([id, qty]) => {
                                const addon = ADDONS.find(a => a.id === id);
                                if (!addon) return null;
                                return qty > 1 ? `${addon.label} x${qty} = $${addon.unitPrice * qty}` : `${addon.label} = $${addon.unitPrice}`;
                              }).filter(Boolean).join(", ")
                            : "None"
                          }
                        />
                        <SummaryRow label="Frequency" value={FREQUENCY_OPTIONS.find(f => f.id === data.frequency)?.label || "—"} />
                        <SummaryRow label="Date" value={data.date ? new Date(data.date + "T12:00:00").toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "—"} />
                        <SummaryRow
                          label="Preferred Time"
                          value={(() => {
                            const slot = TIME_SLOTS.find(t => t.id === data.timeSlot)?.label || "—";
                            const exact = data.exactTime ? EXACT_TIME_OPTIONS.find(t => t.value === data.exactTime)?.label : undefined;
                            return exact ? `${slot} (${exact})` : slot;
                          })()}
                        />
                        {data.serviceType === "commercial" ? (
                          <div className="pt-3 border-t border-navy-950/10">
                            <p className="text-sm text-navy-950/60 italic">Price will be confirmed after the site visit.</p>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-navy-950/10 flex items-center justify-between">
                            <span className="font-bold text-navy-950">Total</span>
                            <span className="font-display font-bold text-2xl text-navy-950">${total}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* What happens next */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.65 }}
                      className="text-left space-y-3"
                    >
                      <h3 className="font-semibold text-navy-950 mb-3">What happens next?</h3>
                      {(data.serviceType === "commercial" ? [
                        "We review your request and contact you to arrange a site visit",
                        "We assess your space and prepare a tailored quote",
                        "Once confirmed, we schedule your commercial clean",
                      ] : [
                        "We review your booking request",
                        "We match you with a vetted local cleaner",
                        "Your cleaner arrives on time, ready to work",
                      ]).map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-teal-500 text-navy-950 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5" aria-hidden="true">
                            {i + 1}
                          </div>
                          <p className="text-navy-950/70 text-sm">{step}</p>
                        </div>
                      ))}
                    </motion.div>

                    {/* Calendar links */}
                    {confirmDetails?.date && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="mt-8 pt-6 border-t border-navy-950/8"
                      >
                        <p className="text-sm text-navy-950/50 font-medium mb-3">Add to your calendar</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <a
                            href={buildGoogleCalendarUrl(
                              confirmDetails.date,
                              confirmDetails.timeSlot,
                              confirmDetails.exactTime,
                              SERVICE_TYPES.find(s => s.id === confirmDetails.serviceType)?.label || "Cleaning",
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-sm"
                            aria-label="Add to Google Calendar"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            Google Calendar
                          </a>
                          <a
                            href={buildICSDataUrl(
                              confirmDetails.date,
                              confirmDetails.timeSlot,
                              confirmDetails.exactTime,
                              SERVICE_TYPES.find(s => s.id === confirmDetails.serviceType)?.label || "Cleaning",
                            )}
                            download="taspro-cleaning.ics"
                            className="btn-primary text-sm"
                            aria-label="Add to Apple Calendar"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                              <path d="M19 3h-1V1h-2v2H8V1H6v2H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                            </svg>
                            Apple Calendar
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </StepCard>
              )}{/* end step 8 !pendingEmail */}

            </div>{/* end focus target */}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation buttons ── */}
      {step < TOTAL_STEPS && (
        <div className="flex items-center justify-between mt-6 gap-3">
          {step > 1 ? (
            <button
              onClick={goBack}
              className="btn-primary text-sm flex-1"
              aria-label="Go back to previous step"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Back
            </button>
          ) : (
            <div aria-hidden="true" className="flex-1" /> // spacer
          )}

          {/* Show Next button for multi-choice steps; submit for step 7 */}
          {([3, 4, 6].includes(step) && !(step === 3 && data.serviceType === "commercial" && commercialPhase === 0)) && (
            <button
              onClick={step === 4 ? handleStep4Continue : step === 6 ? handleStep6Continue : (step === 3 && data.serviceType === "commercial") ? handleStep3CommercialContinue : goNext}
              disabled={continueDisabled}
              className="btn-primary text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
              aria-label="Continue to next step"
              aria-disabled={continueDisabled}
            >
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          )}

          {step === 7 && (
            <button
              type="submit"
              form="quote-form"
              disabled={submitting}
              className="btn-primary text-sm flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
              aria-label="Submit booking request"
              aria-busy={submitting}
            >
              {submitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Submitting…
                </>
              ) : (
                <>
                  Confirm Booking
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* ── Clear quote ── */}
      {data.city && step < TOTAL_STEPS && (
        <div className="mt-3">
          <button
            onClick={clearQuote}
            className="w-full text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors py-2"
          >
            Clear quote &amp; start over
          </button>
        </div>
      )}

      {/* ── Submission error ── */}
      {submitError && (
        <p className="mt-4 text-center text-sm text-red-600 font-medium" role="alert">
          {submitError}
        </p>
      )}

      {/* ── Sticky price footer (not on city or confirmation steps) ── */}
      {step < TOTAL_STEPS && step > 2 && <PriceFooter data={data} />}
    </div>
  );
}

/* ── Helper components ── */

function StepCard({ heading, subheading, children }: { heading: string; subheading: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
      {heading && (
        <h2 className="font-display text-2xl font-bold text-navy-950 mb-1">{heading}</h2>
      )}
      {subheading && (
        <p className="text-navy-950/50 text-sm mb-6">{subheading}</p>
      )}
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-navy-950/50 shrink-0">{label}</span>
      <span className="font-medium text-navy-950 text-right">{value}</span>
    </div>
  );
}
