"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FAQ {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

/**
 * Accessible accordion for FAQ sections.
 * Uses aria-expanded and aria-controls for screen readers.
 */
export default function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-navy-950/10" role="list">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        const controlId = `faq-answer-${i}`;
        const buttonId = `faq-button-${i}`;

        return (
          <div key={i} role="listitem">
            <button
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={controlId}
              onClick={() => setOpen(isOpen ? null : i)}
              className={cn(
                "w-full text-left flex items-start justify-between gap-4 py-5 px-1 transition-colors group",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 rounded-sm"
              )}
            >
              <span
                className={cn(
                  "font-semibold text-base transition-colors",
                  isOpen ? "text-teal-600" : "text-navy-950 group-hover:text-teal-600"
                )}
              >
                {faq.q}
              </span>
              <span
                className={cn(
                  "shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                  isOpen
                    ? "border-teal-500 bg-teal-500 text-white rotate-45"
                    : "border-navy-950/20 text-navy-950/40 group-hover:border-teal-500 group-hover:text-teal-500"
                )}
                aria-hidden="true"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={controlId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 px-1 text-navy-950/65 leading-relaxed text-sm">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
