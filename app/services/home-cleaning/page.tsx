import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Home Cleaning Services in Sydney, Melbourne, Perth & Launceston",
  description:
    "Professional home cleaning in Sydney NSW, Melbourne VIC, Perth WA and Launceston TAS. Background-checked cleaners, 100% satisfaction guarantee. Book online in minutes.",
  alternates: { canonical: "https://tasprocleaning.com.au/services/home-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/services/home-cleaning#service",
  name: "Home Cleaning",
  description: "Professional home cleaning in Sydney, Melbourne, Perth and Launceston. Background-checked cleaners, 100% satisfaction guarantee. Book online in minutes.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: ["Sydney NSW", "Melbourne VIC", "Perth WA", "Launceston TAS"],
  serviceType: "Home Cleaning",
  url: "https://tasprocleaning.com.au/services/home-cleaning",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "Transparent pricing from $99. Discounts for weekly, fortnightly and monthly recurring cleans.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://tasprocleaning.com.au/services/home-cleaning" },
    { "@type": "ListItem", position: 3, name: "Home Cleaning", item: "https://tasprocleaning.com.au/services/home-cleaning" },
  ],
};

const INCLUSIONS = [
  {
    room: "Kitchen",
    icon: "🍳",
    items: [
      "Stove / oven exteriors & splashback",
      "Benchtops wiped down",
      "Sink & taps cleaned",
      "Cabinet exteriors wiped",
      "Microwave exterior",
      "Dishwasher stack",
      "Floor mopped",
    ],
  },
  {
    room: "Bedrooms",
    icon: "🛏️",
    items: [
      "Beds made (on request)",
      "Furniture dusted",
      "Electronics wiped",
      "Shoes, toys & clothing tidied",
      "Floors vacuumed & mopped",
    ],
  },
  {
    room: "Bathrooms",
    icon: "🚿",
    items: [
      "Toilet scrubbed & disinfected",
      "Shower & shower screen",
      "Bathtub cleaned",
      "Sink & taps",
      "Mirrors polished",
      "Cabinet exteriors",
      "Floor mopped",
    ],
  },
  {
    room: "All Rooms",
    icon: "🏠",
    items: [
      "Surfaces and shelves dusted",
      "Skirting boards wiped",
      "Carpets vacuumed",
      "Hard floors swept & mopped",
      "Interior windows wiped",
      "Mirrors cleaned",
      "Bins emptied",
    ],
  },
];

export default function HomeCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section
        className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden"
        aria-labelledby="hc-heading"
      >
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&q=80"
          alt="Spotless bright kitchen after professional home cleaning"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Home Cleaning</p>
            <h1 id="hc-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Home Cleaning in Launceston,<br className="hidden md:block" /> Melbourne &amp; Perth
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Regular, reliable home cleans by background-checked, insured professionals. Fully customisable to your home and lifestyle.
            </p>
            <Link href="/quote" className="btn-primary text-base px-8 py-4">
              Book a Home Clean
            </Link>
            <p className="text-white/45 text-xs mt-5">
              Recurring weekly/fortnightly cleans — available in all cities.
              One-off home cleans — Perth and Launceston.
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-white" aria-labelledby="hc-inclusions-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What&apos;s Included</p>
            <h2 id="hc-inclusions-heading" className="section-heading">Every corner, every time</h2>
            <p className="section-subheading max-w-xl mx-auto">
              Our standard home clean covers your entire home — no room is left behind.
            </p>
          </AnimateInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INCLUSIONS.map((inc, i) => (
              <AnimateInView key={inc.room} variant="slide-up" delay={i * 0.08}>
                <div className="bg-navy-950/[0.03] rounded-2xl p-6 h-full">
                  <span className="text-3xl block mb-3" aria-hidden="true">{inc.icon}</span>
                  <h3 className="font-display text-lg font-semibold text-navy-950 mb-4">{inc.room}</h3>
                  <ul className="space-y-2" aria-label={`${inc.room} inclusions`}>
                    {inc.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-navy-950/65">
                        <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee strip */}
      <section className="bg-teal-500 py-14" aria-label="Satisfaction guarantee">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 className="font-display text-3xl font-bold text-navy-950 mb-3">100% Satisfaction Guarantee</h2>
            <p className="text-navy-950/70 max-w-lg mx-auto mb-6">
              If anything is missed on our checklist, contact us within 24 hours and we&apos;ll send the cleaner back — free of charge.
            </p>
            <Link href="/quote" className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy-900 hover:-translate-y-0.5 transition-all duration-200">
              Get a Free Instant Quote
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="section-padding bg-white" aria-labelledby="hc-cities-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Where We Clean</p>
            <h2 id="hc-cities-heading" className="section-heading">Home cleaning across Australia</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We offer recurring home cleaning in four cities. See your city for local pricing and availability.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/locations/perth", icon: "🌅", city: "Perth", state: "WA", note: "Full-service hub — all clean types" },
              { href: "/locations/melbourne", icon: "🏙️", city: "Melbourne", state: "VIC", note: "Recurring home & commercial cleans" },
              { href: "/locations/sydney", icon: "🌉", city: "Sydney", state: "NSW", note: "Recurring home & commercial cleans" },
              { href: "/locations/launceston", icon: "🏔️", city: "Launceston", state: "TAS", note: "Recurring home cleans + NDIS" },
            ].map((loc, i) => (
              <AnimateInView key={loc.href} variant="slide-up" delay={i * 0.07}>
                <Link href={loc.href} className="group flex flex-col p-5 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full">
                  <span className="text-3xl mb-3" aria-hidden="true">{loc.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">{loc.city}, {loc.state}</p>
                  <p className="text-navy-950/55 text-xs leading-relaxed flex-1">{loc.note}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View location <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
          <AnimateInView variant="slide-up" delay={0.35} className="text-center mt-8">
            <p className="text-navy-950/50 text-sm">
              Want to know the exact price?{" "}
              <Link href="/pricing" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
                See our pricing guide
              </Link>{" "}
              or{" "}
              <Link href="/quote" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
                get a free instant quote
              </Link>.
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="home-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Available</p>
            <h2 id="home-related-heading" className="section-heading">Other cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/services/end-of-lease", icon: "🔑", title: "End of Lease", desc: "Bond-back guaranteed. We follow the agent checklist." },
              { href: "/services/commercial", icon: "🏢", title: "Commercial Cleaning", desc: "Offices, retail, gyms and medical centres." },
              { href: "/services/deep-clean", icon: "✨", title: "Deep Clean", desc: "Top-to-bottom refresh — perfect for move-ins and pre-sale." },
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
