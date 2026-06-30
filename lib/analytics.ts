"use client";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, {
    page_path: window.location.pathname,
    page_location: window.location.href,
    ...params,
  });
}

export function trackLead(method: string, params: AnalyticsParams = {}) {
  trackEvent("generate_lead", {
    method,
    event_category: "lead",
    ...params,
  });
}
