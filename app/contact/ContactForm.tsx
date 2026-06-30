"use client";

import { useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { cn } from "@/lib/utils";
import { trackEvent, trackLead } from "@/lib/analytics";

const AU_STATES = [
  { value: "ACT", label: "ACT — Australian Capital Territory" },
  { value: "NSW", label: "NSW — New South Wales" },
  { value: "NT",  label: "NT — Northern Territory" },
  { value: "QLD", label: "QLD — Queensland" },
  { value: "SA",  label: "SA — South Australia" },
  { value: "TAS", label: "TAS — Tasmania" },
  { value: "VIC", label: "VIC — Victoria" },
  { value: "WA",  label: "WA — Western Australia" },
];

interface FormValues {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  state: string;
  message: string;
}

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnstileToken = useRef<string | null>(null);
  const formStartedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const trackFormStart = () => {
    if (formStartedRef.current) return;
    formStartedRef.current = true;
    trackEvent("contact_form_start", { event_category: "contact" });
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!turnstileToken.current) {
      setError("Please wait for the security check to complete.");
      return;
    }

    setSubmitting(true);
    setError(null);
    trackEvent("contact_form_submit", { event_category: "contact" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken: turnstileToken.current }),
      });
      const json = await res.json().catch(() => ({})) as { ok?: boolean; error?: string };

      if (json.ok) {
        trackEvent("contact_form_success", { event_category: "contact" });
        trackLead("contact_form_success");
        setSubmitted(true);
      } else {
        trackEvent("contact_form_error", { event_category: "contact" });
        setError(json.error ?? "Something went wrong. Please try again or call us directly.");
      }
    } catch {
      trackEvent("contact_form_error", { event_category: "contact", error_type: "network" });
      setError("Network error. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-teal-50 border border-teal-200 rounded-3xl p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <div
          className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-5 shadow-teal"
          aria-hidden="true"
        >
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-navy-950 mb-2">Message sent!</h3>
        <p className="text-navy-950/60">
          Thanks for getting in touch. We&apos;ll get back to you shortly — usually within a few hours.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onFocusCapture={trackFormStart}
      className="bg-white rounded-3xl border border-navy-950/8 shadow-card p-8 space-y-5"
      noValidate
      aria-label="Contact form"
    >
      <h2 className="font-display text-2xl font-bold text-navy-950">Send us a message</h2>

      {/* Name */}
      <div>
        <label htmlFor="name" className="form-label">Full name *</label>
        <input
          id="name"
          {...register("name", { required: "Your name is required" })}
          className={cn("form-input", errors.name && "border-red-400")}
          autoComplete="name"
          placeholder="Jane Smith"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p id="name-error" className="form-error">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="form-label">Email address *</label>
        <input
          id="contact-email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email" },
          })}
          className={cn("form-input", errors.email && "border-red-400")}
          autoComplete="email"
          placeholder="jane@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email && (
          <p id="contact-email-error" className="form-error">{errors.email.message}</p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="contact-phone" className="form-label">Phone number</label>
        <input
          id="contact-phone"
          type="tel"
          {...register("phone")}
          className="form-input"
          autoComplete="tel"
          placeholder="0400 000 000"
        />
      </div>

      {/* Suburb + State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="suburb" className="form-label">Suburb *</label>
          <input
            id="suburb"
            {...register("suburb", { required: "Suburb is required" })}
            className={cn("form-input", errors.suburb && "border-red-400")}
            autoComplete="address-level2"
            placeholder="e.g. Northbridge"
            aria-invalid={!!errors.suburb}
            aria-describedby={errors.suburb ? "suburb-error" : undefined}
          />
          {errors.suburb && (
            <p id="suburb-error" className="form-error">{errors.suburb.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="state" className="form-label">State *</label>
          <select
            id="state"
            {...register("state", { required: "State is required" })}
            className={cn("form-input", errors.state && "border-red-400")}
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? "state-error" : undefined}
            defaultValue=""
          >
            <option value="" disabled>Select state…</option>
            {AU_STATES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          {errors.state && (
            <p id="state-error" className="form-error">{errors.state.message}</p>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="form-label">Message *</label>
        <textarea
          id="message"
          rows={5}
          {...register("message", { required: "A message is required" })}
          className={cn("form-input resize-none", errors.message && "border-red-400")}
          placeholder="Tell us about your cleaning needs…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="form-error">{errors.message.message}</p>
        )}
      </div>

      {/* Turnstile CAPTCHA */}
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={(token) => { turnstileToken.current = token; }}
        onError={() => { turnstileToken.current = null; }}
        onExpire={() => { turnstileToken.current = null; }}
        options={{ theme: "light" }}
      />

      {/* Server error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm font-medium"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center py-4 disabled:opacity-70 disabled:cursor-not-allowed"
        aria-label="Send message"
      >
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending…
          </>
        ) : (
          <>
            Send Message
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>

      <p className="text-center text-navy-950/40 text-xs">
        Or call us directly on{" "}
        <a href="tel:+61870816811" className="text-teal-600 font-medium hover:underline">
          (08) 7081 6811
        </a>
      </p>
    </form>
  );
}
