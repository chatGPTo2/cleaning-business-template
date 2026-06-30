import type { Metadata } from "next";
import QuoteWizard from "./QuoteWizard";

export const metadata: Metadata = {
  title: "Get an Instant Quote | Taspro Cleaning Solutions",
  description:
    "Get a free instant cleaning quote in under 2 minutes. Choose your service, property size, add-ons and preferred date. No phone calls required.",
  alternates: { canonical: "https://tasprocleaning.com.au/quote" },
};

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-navy-950/[0.03] pt-24 pb-16">
      <div className="container-custom max-w-2xl">
        <div className="text-center mb-10">
          <p className="section-label">Free & Instant</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-navy-950 leading-tight">
            Get Your Quote
          </h1>
          <p className="text-navy-950/60 mt-3 text-lg">
            Takes less than 2 minutes. No phone calls, no fuss.
          </p>
        </div>
        {/* Availability notice */}
        <p className="text-center text-sm text-navy-950/50 leading-relaxed mb-8">
          Service availability depends on your location.{" "}
          <span className="text-navy-950/70">Perth and Launceston</span> offer full-service cleaning including end-of-lease, deep cleaning, and one-off cleans.{" "}
          Melbourne and Sydney currently offer recurring weekly or fortnightly cleaning only.
        </p>
        <QuoteWizard />
      </div>
    </div>
  );
}
