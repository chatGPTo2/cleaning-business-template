import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Cleaners in Launceston TAS | Home, End of Lease & Commercial | Taspro",
  description:
    "Local cleaners in Launceston TAS — home cleaning, bond-back guaranteed end of lease cleaning, commercial and NDIS support. Police-checked, insured. Instant online quote.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston#service",
  name: "Cleaning Services Launceston",
  description: "Professional home, end-of-lease, deep cleaning, commercial and NDIS cleaning in Launceston and across Tasmania.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Locations", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
  ],
};

const LAUNCESTON_AREAS = [
  "Launceston CBD", "Newstead & Invermay", "Newnham & Mowbray",
  "Kings Meadows & Youngtown", "Ravenswood & Rocherlea", "South Launceston",
  "West Launceston & Summerhill", "Riverside & Trevallyn", "George Town",
  "Scottsdale & Lilydale", "Longford & Perth TAS", "Deloraine & Westbury",
];

const SERVICES = [
  { href: "/services/home-cleaning", icon: "🏠", title: "Home Cleaning", desc: "Recurring weekly or fortnightly home cleans across Launceston and northern Tasmania. 100% satisfaction guarantee." },
  { href: "/locations/launceston/end-of-lease-cleaning", icon: "🔑", title: "End of Lease Cleaning", desc: "Bond-back guaranteed end of lease cleaning in Launceston TAS. We follow real estate agent checklists line by line." },
  { href: "/services/deep-clean", icon: "✨", title: "Deep Cleaning", desc: "Top-to-bottom deep cleaning for move-ins, pre-sale, spring cleans and homes that need a full reset." },
  { href: "/services/commercial", icon: "🏢", title: "Commercial Cleaning", desc: "Offices, retail and commercial spaces across Launceston and northern Tasmania." },
  { href: "/services/ndis", icon: "💙", title: "NDIS Cleaning Support", desc: "General NDIS cleaning support for participants in Launceston and Tasmania." },
];

const FAQS: { q: string; a: string; jsx?: React.ReactNode }[] = [
  {
    q: "What areas in Launceston and Tasmania do you service?",
    a: "We service Launceston CBD and surrounding areas including Newnham, Kings Meadows, Newstead, Riverside, and regional locations across northern Tasmania.",
  },
  {
    q: "Are your Launceston cleaners background checked?",
    a: "Yes. Every cleaner on our Launceston team is police checked, vetted, and fully insured before joining Taspro.",
  },
  {
    q: "Do you provide NDIS cleaning in Launceston?",
    a: "Yes. Taspro provides NDIS cleaning support in Launceston for plan-managed, agency-managed, and self-managed NDIS participants.",
    jsx: (
      <>
        Yes. Taspro provides{" "}
        <Link href="/services/ndis" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          NDIS cleaning services
        </Link>{" "}
        in Launceston for plan-managed, agency-managed, and self-managed NDIS participants.
      </>
    ),
  },
  {
    q: "Do you offer end of lease cleaning in Launceston?",
    a: "Yes! Taspro now offers bond-back guaranteed end of lease cleaning in Launceston TAS. We follow real estate agent checklists line by line. Get a free quote online.",
    jsx: (
      <>
        Yes! Taspro now offers bond-back guaranteed{" "}
        <Link href="/locations/launceston/end-of-lease-cleaning" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          end of lease cleaning in Launceston
        </Link>
        . We follow real estate agent checklists line by line and guarantee your bond back. Get a free quote online.
      </>
    ),
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function LauncestonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="launc-heading">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"
          alt="Beautiful Tasmanian landscape near Launceston"
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS</p>
            <h1 id="launc-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Professional Cleaning Services<br className="hidden md:block" /> in Launceston
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Taspro is Launceston-based and proud. Background-checked, insured cleaners serving Launceston and northern Tasmania — home cleaning, end of lease cleaning, deep cleaning, commercial cleaning and NDIS support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-primary text-base px-8 py-4">
                Get a Free Instant Quote
              </Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">
                Call (08) 7081 6811
              </a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Recurring Only Notice */}
      <section className="bg-navy-950/[0.04] border-b border-navy-950/10" aria-label="Service availability in Launceston">
        <div className="container-custom py-5">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-navy-950 text-sm mb-0.5">Full cleaning services now available in Launceston</p>
              <p className="text-navy-950/65 text-sm leading-relaxed">
                We provide <strong className="font-semibold text-navy-950">home cleaning, end of lease cleaning, deep cleaning, commercial cleaning and NDIS support</strong> in Launceston and northern Tasmania.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white" aria-labelledby="launc-services-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Our Services</p>
            <h2 id="launc-services-heading" className="section-heading">Cleaning services available in Launceston</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Taspro is based in Launceston. We offer home cleaning, end of lease cleaning, deep cleaning, commercial cleaning and NDIS support across Launceston and northern Tasmania.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <AnimateInView key={s.href} variant="slide-up" delay={i * 0.07}>
                <Link
                  href={s.href}
                  className="group flex items-start gap-5 p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full"
                >
                  <span className="text-4xl shrink-0" aria-hidden="true">{s.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950 mb-1 group-hover:text-teal-700 transition-colors">{s.title}</h3>
                    <p className="text-navy-950/60 text-sm leading-relaxed">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 mt-3 text-teal-600 text-sm font-semibold group-hover:gap-3 transition-all">
                      Learn more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Office Cleaning callout */}
      <section className="bg-teal-500 py-10" aria-label="Office cleaning Launceston">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="font-semibold text-navy-950/70 text-sm mb-1">🏢 Office &amp; Commercial Cleaning — Launceston</p>
              <h2 className="font-display text-2xl font-bold text-navy-950">We clean Launceston offices.</h2>
              <p className="text-navy-950/70 text-sm mt-1 max-w-lg">
                Offices, meeting rooms and kitchens across Launceston and northern Tasmania — during business hours or after hours.{" "}
                <Link href="/services/commercial" className="underline underline-offset-2 font-semibold hover:text-navy-800 transition-colors">
                  Learn about office cleaning
                </Link>.
              </p>
            </div>
            <Link href="/quote" className="btn-secondary shrink-0 whitespace-nowrap">
              Get an Office Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="launc-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="launc-areas-heading" className="section-heading">Areas in &amp; around Launceston we service</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We serve Launceston and surrounds. Not sure if we cover your area? <Link href="/contact" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Contact us</Link>.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {LAUNCESTON_AREAS.map((area, i) => (
              <AnimateInView key={area} variant="slide-up" delay={i * 0.04}>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-navy-950/8 text-sm text-navy-950/70 font-medium">
                  <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {area}
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Why Taspro in Launceston */}
      <section className="section-padding bg-white" aria-labelledby="launc-why-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimateInView variant="slide-right">
              <p className="section-label">Why Taspro in Launceston</p>
              <h2 id="launc-why-heading" className="section-heading mb-6">Launceston&apos;s own cleaning company</h2>
              <div className="space-y-5">
                {[
                  { title: "Launceston-based and owned", desc: "Taspro was founded in Launceston. When you book with us, you're supporting a local Tasmanian business, not a mainland franchise." },
                  { title: "Fully insured & police-checked", desc: "Every cleaner undergoes a National Police Check and holds Public Liability Insurance. Your home is fully protected." },
                  { title: "NDIS cleaning support", desc: "We are experienced working with NDIS participants, plan managers, and support coordinators across Tasmania." },
                  { title: "100% satisfaction guarantee", desc: "If you're not happy, we'll return within 24 hours to fix any missed areas at no extra charge." },
                  { title: "Transparent pricing", desc: "See your full price before booking. No hidden fees, no call required." },
                ].map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-950 text-sm">{point.title}</p>
                      <p className="text-navy-950/60 text-sm mt-1">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateInView>

            <AnimateInView variant="slide-left">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                  alt="Professional cleaner at work in a Launceston home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="launc-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="launc-faq-heading" className="section-heading">Launceston cleaning questions answered</h2>
          </AnimateInView>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.06}>
                <div className="bg-white rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-semibold text-navy-950 mb-2">{faq.q}</h3>
                  <p className="text-navy-950/65 text-sm leading-relaxed">{faq.jsx ?? faq.a}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* Other Locations */}
      <section className="section-padding bg-white" aria-labelledby="launc-locations-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">We Also Serve</p>
            <h2 id="launc-locations-heading" className="section-heading">Other locations</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { href: "/locations/sydney", icon: "🌉", city: "Sydney", state: "NSW" },
              { href: "/locations/melbourne", icon: "🏙️", city: "Melbourne", state: "VIC" },
              { href: "/locations/perth", icon: "🌅", city: "Perth", state: "WA" },
            ].map((loc, i) => (
              <AnimateInView key={loc.href} variant="slide-up" delay={i * 0.07}>
                <Link href={loc.href} className="group flex flex-col items-center p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover text-center">
                  <span className="text-3xl mb-3" aria-hidden="true">{loc.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{loc.city}</p>
                  <p className="text-navy-950/55 text-xs">{loc.state}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View services <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-teal-500" aria-labelledby="launc-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="launc-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">
              Ready to book your Launceston clean?
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">
              Get an instant quote online — no phone calls, no forms, just a price in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-secondary text-base px-8 py-4">
                Get a Free Instant Quote
              </Link>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4">
                Contact Us
              </Link>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
