"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-EK7F534NGX";
const COOKIE_CONSENT_KEY = "cookies-accepted";
const COOKIE_CONSENT_EVENT = "taspro-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function hasCookieConsent() {
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const [hasConsent, setHasConsent] = useState(false);
  const trackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    setHasConsent(hasCookieConsent());

    const syncConsent = () => setHasConsent(hasCookieConsent());

    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hasConsent) {
      return;
    }

    const pagePath = `${pathname}${window.location.search}`;

    if (trackedPathRef.current === null) {
      trackedPathRef.current = pagePath;
      return;
    }

    if (trackedPathRef.current === pagePath || !window.gtag) {
      return;
    }

    trackedPathRef.current = pagePath;
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [hasConsent, pathname]);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !hasConsent) {
      return;
    }

    const trackClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !window.gtag) {
        return;
      }

      const link = target.closest("a[href]");
      if (!(link instanceof HTMLAnchorElement)) {
        return;
      }

      if (link.href.startsWith("tel:")) {
        window.gtag("event", "phone_click", {
          link_url: link.href,
          link_text: link.textContent?.trim().slice(0, 80),
          page_path: window.location.pathname,
          page_location: window.location.href,
          event_category: "lead",
        });
        return;
      }

      if (link.href.startsWith("mailto:")) {
        window.gtag("event", "email_click", {
          link_url: link.href,
          link_text: link.textContent?.trim().slice(0, 80),
          page_path: window.location.pathname,
          page_location: window.location.href,
          event_category: "lead",
        });
        return;
      }

      const href = link.getAttribute("href") ?? "";
      if (href === "/quote" || href.startsWith("/quote?") || link.href.includes("/quote")) {
        window.gtag("event", "quote_cta_click", {
          link_url: link.href,
          link_text: link.textContent?.trim().slice(0, 80),
          page_path: window.location.pathname,
          page_location: window.location.href,
          event_category: "quote",
        });
      }
    };

    document.addEventListener("click", trackClick);
    return () => document.removeEventListener("click", trackClick);
  }, [hasConsent]);

  if (!GA_MEASUREMENT_ID || !hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname + window.location.search,
              page_title: document.title,
              page_location: window.location.href
            });
          `,
        }}
      />
    </>
  );
}
