"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/** Minimal GDPR-style cookie consent banner */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't dismissed
    const dismissed = localStorage.getItem("cookies-accepted");
    if (!dismissed) {
      // Slight delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookies-accepted", "true");
    window.dispatchEvent(new Event("taspro-cookie-consent"));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50"
          role="region"
          aria-label="Cookie consent"
          aria-live="polite"
        >
          <div className="bg-navy-950 text-white rounded-2xl p-4 shadow-xl border border-white/10 flex flex-col gap-3">
            <p className="text-sm text-white/80 leading-relaxed">
              We use cookies to improve your experience. By continuing to use
              this site, you accept our{" "}
              <span className="text-teal-400">privacy policy</span>.
            </p>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 bg-teal-500 text-navy-950 font-semibold text-sm py-2 rounded-lg hover:bg-teal-400 transition-colors"
                aria-label="Accept cookies"
              >
                Accept
              </button>
              <button
                onClick={accept}
                className="flex-1 bg-white/10 text-white text-sm py-2 rounded-lg hover:bg-white/20 transition-colors"
                aria-label="Dismiss cookie notice"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
