import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "End of Lease & Bond Cleaning in Sydney, Melbourne, Perth & Launceston | Taspro",
  description:
    "Bond-back guaranteed end of lease cleaning in Sydney NSW, Melbourne VIC, Perth WA and Launceston TAS. Thorough checklist-driven cleans by insured, police-checked professionals.",
  alternates: { canonical: "https://tasprocleaning.com.au/services/end-of-lease" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/services/end-of-lease#service",
  name: "End of Lease & Bond Cleaning",
  description: "Bond-back guaranteed end of lease cleaning in Sydney, Melbourne, Perth and Launceston. Thorough checklist-driven cleans by insured, police-checked professionals.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: ["Perth WA", "Launceston TAS"],
  serviceType: "End of Lease Cleaning",
  url: "https://tasprocleaning.com.au/services/end-of-lease",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "Fixed-price bond cleaning packages. Bond-back guarantee included.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://tasprocleaning.com.au/services/end-of-lease" },
    { "@type": "ListItem", position: 3, name: "End of Lease Cleaning", item: "https://tasprocleaning.com.au/services/end-of-lease" },
  ],
};

const STANDARD_ITEMS = [
  "Full property deep clean — top to bottom",
  "Stove, oven exteriors & splashback",
  "All benchtops & surfaces wiped",
  "Sink & taps cleaned and polished",
  "Cabinet & drawer exteriors wiped",
  "Microwave interior & exterior",
  "Dishwasher stack cleaned",
  "All floors swept, vacuumed & mopped",
  "Bathrooms scrubbed & disinfected",
  "Toilets, showers, baths and mirrors",
  "Bedroom floors, wardrobes and surfaces",
  "Wall spot cleaning throughout",
  "All windows & sills (interior)",
  "Bins emptied & liners replaced",
  "Bond clean standard met — agent checklist followed",
];

const EXTRA_ITEMS = [
  "Inside oven — trays, racks and walls",
  "Interior windows — glass, tracks, sills, sliding doors",
  "Inside all kitchen and bathroom cupboards & drawers",
  "Carpet steam clean (where selected)",
  "Garage swept and mopped",
  "Laundry thoroughly cleaned",
  "Detailed bathroom grout scrubbing",
];

export default function EndOfLeasePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section
        className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden"
        aria-labelledby="eol-heading"
      >
        <Image
          src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1920&q=80"
          alt="Empty clean room ready for end of lease inspection"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">End of Lease</p>
            <h1 id="eol-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              End of Lease &amp; Bond Cleaning —<br className="hidden md:block" /> Get Your Full Bond Back
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Our comprehensive bond clean follows real estate checklists line by line. We give you the best chance of a full bond return — guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/quote?service=end-of-lease" className="btn-primary text-base px-8 py-4">
                Get a Bond Clean Quote
              </Link>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Service availability notice */}
      <section className="bg-navy-950/[0.04] border-b border-navy-950/10" aria-label="Service availability">
        <div className="container-custom py-5">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-navy-950/75 text-sm leading-relaxed">
              <strong className="font-semibold text-navy-950">Available in Perth WA and Launceston TAS.</strong> End-of-lease cleaning is not currently available in Melbourne or Sydney. Customers in those cities can book <Link href="/services/home-cleaning" className="text-teal-600 underline underline-offset-2 font-medium hover:text-teal-700 transition-colors">recurring home cleaning</Link> instead.
            </p>
          </div>
        </div>
      </section>

      {/* Important note */}
      <section className="bg-amber-50 border-b border-amber-100 py-6">
        <div className="container-custom flex items-start gap-4">
          <span className="text-2xl shrink-0" aria-hidden="true">⚠️</span>
          <p className="text-amber-900 text-sm leading-relaxed">
            <strong>Important:</strong> End of lease cleans must be performed once all furniture has been fully removed from the property. This ensures every surface, corner and floor can be accessed and cleaned properly.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-white" aria-labelledby="eol-inclusions-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What&apos;s Included</p>
            <h2 id="eol-inclusions-heading" className="section-heading">A thorough clean, top to bottom</h2>
            <p className="section-subheading max-w-xl mx-auto">
              Our bond clean covers everything in the standard home clean, plus these critical end-of-lease extras.
            </p>
          </AnimateInView>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Standard items */}
            <AnimateInView variant="slide-right">
              <div className="bg-navy-950/[0.03] rounded-2xl p-8">
                <h3 className="font-display text-xl font-semibold text-navy-950 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-navy-950 text-sm font-bold" aria-hidden="true">✓</span>
                  Everything in a Standard Clean
                </h3>
                <ul className="space-y-3" aria-label="Standard cleaning inclusions">
                  {STANDARD_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-navy-950/70">
                      <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateInView>

            {/* Bond-specific extras */}
            <AnimateInView variant="slide-left">
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8">
                <h3 className="font-display text-xl font-semibold text-navy-950 mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-navy-950 text-sm font-bold" aria-hidden="true">+</span>
                  Bond Clean Extras Included
                </h3>
                <ul className="space-y-3" aria-label="Bond cleaning extras">
                  {EXTRA_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-navy-950/70">
                      <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-4 bg-teal-500/10 rounded-xl border border-teal-300">
                  <p className="text-teal-800 text-sm font-semibold">
                    🔒 Bond-Back Guarantee — if your property manager flags anything from our checklist, we come back and fix it free.
                  </p>
                </div>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-500 py-14" aria-label="Get a bond clean quote">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 className="font-display text-3xl font-bold text-navy-950 mb-3">Ready to get your bond back?</h2>
            <p className="text-navy-950/70 max-w-lg mx-auto mb-6">
              Get a free, instant quote in under 2 minutes. No phone calls required.
            </p>
            <Link href="/quote?service=end-of-lease" className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy-900 hover:-translate-y-0.5 transition-all duration-200">
              Get Your Bond Clean Quote
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Location */}
      <section className="section-padding bg-white" aria-labelledby="eol-location-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Where We Clean</p>
            <h2 id="eol-location-heading" className="section-heading">End of lease cleaning in Perth &amp; Launceston</h2>
            <p className="section-subheading max-w-xl mx-auto">
              Our bond-back end of lease service is available in Perth WA and Launceston TAS. Get a free quote online in under 2 minutes.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
            <AnimateInView variant="slide-up" delay={0.07}>
              <Link href="/locations/perth" className="group flex flex-col p-6 bg-teal-500/[0.08] rounded-2xl border-2 border-teal-500/30 card-hover h-full">
                <span className="text-3xl mb-3" aria-hidden="true">🌅</span>
                <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">Perth, WA</p>
                <p className="text-navy-950/55 text-xs leading-relaxed flex-1">End-of-lease, deep cleans, recurring & more</p>
                <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                  View Perth services <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </AnimateInView>
            <AnimateInView variant="slide-up" delay={0.14}>
              <Link href="/locations/launceston/end-of-lease-cleaning" className="group flex flex-col p-6 bg-teal-500/[0.08] rounded-2xl border-2 border-teal-500/30 card-hover h-full">
                <span className="text-3xl mb-3" aria-hidden="true">🏔️</span>
                <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">Launceston, TAS</p>
                <p className="text-navy-950/55 text-xs leading-relaxed flex-1">Bond-back guaranteed end-of-lease cleaning</p>
                <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                  View Launceston bond cleaning <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </AnimateInView>
            <AnimateInView variant="slide-up" delay={0.21}>
              <Link href="/pricing" className="group flex flex-col p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full">
                <span className="text-3xl mb-3" aria-hidden="true">💲</span>
                <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">Pricing guide</p>
                <p className="text-navy-950/55 text-xs leading-relaxed flex-1">End-of-lease cleans attract a 25% surcharge — see the full price breakdown</p>
                <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                  See pricing <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="eol-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Available</p>
            <h2 id="eol-related-heading" className="section-heading">Other cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/services/home-cleaning", icon: "🏠", title: "Home Cleaning", desc: "Regular weekly, fortnightly or monthly residential cleans." },
              { href: "/services/commercial", icon: "🏢", title: "Commercial Cleaning", desc: "Offices, retail, gyms and medical centres." },
              { href: "/services/deep-clean", icon: "✨", title: "Deep Clean", desc: "Top-to-bottom refresh for homes and rental properties." },
              { href: "/services/ndis", icon: "💙", title: "NDIS Cleaning", desc: "NDIS cleaning services across Tasmania." },
            ].map((s, i) => (
              <AnimateInView key={s.href} variant="slide-up" delay={i * 0.07}>
                <Link href={s.href} className="group flex flex-col p-5 bg-white rounded-2xl border border-navy-950/8 card-hover h-full">
                  <span className="text-3xl mb-3" aria-hidden="true">{s.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{s.title}</p>
                  <p className="text-navy-950/55 text-xs leading-relaxed flex-1">{s.desc}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    Learn more <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
