import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Cleaning Services Sydney | Recurring Home & Commercial Cleaning | Taspro",
  description:
    "Recurring home and commercial cleaning across Sydney NSW. Weekly and fortnightly schedules available. Police-checked, insured cleaners. Book online or call (08) 7081 6811.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/sydney" },
  openGraph: {
    title: "Cleaning Services Sydney | Recurring Home & Commercial Cleaning | Taspro",
    description:
      "Recurring home and commercial cleaning across Sydney NSW. Weekly and fortnightly schedules available. Police-checked, insured cleaners.",
    type: "website",
    url: "https://tasprocleaning.com.au/locations/sydney",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/sydney#service",
  name: "Cleaning Services Sydney",
  description:
    "Recurring home and commercial cleaning across Sydney NSW. Police-checked and fully insured cleaners. Weekly and fortnightly schedules.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: {
    "@type": "City",
    name: "Sydney",
    containedIn: "New South Wales, Australia",
    sameAs: "https://en.wikipedia.org/wiki/Sydney",
  },
  serviceType: ["Home Cleaning", "End of Lease Cleaning", "Commercial Cleaning", "Deep Cleaning"],
  url: "https://tasprocleaning.com.au/locations/sydney",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "Transparent pricing from $120. Recurring clean discounts up to 15%.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Locations", item: "https://tasprocleaning.com.au/locations/sydney" },
    { "@type": "ListItem", position: 3, name: "Sydney", item: "https://tasprocleaning.com.au/locations/sydney" },
  ],
};

const SYDNEY_SUBURBS = [
  "CBD & Circular Quay", "Surry Hills & Darlinghurst", "Newtown & Glebe",
  "Bondi & Coogee", "Manly & Northern Beaches", "Chatswood & North Shore",
  "Parramatta & Western Sydney", "Strathfield & Burwood", "Liverpool & Campbelltown",
  "Cronulla & Sutherland Shire", "Ryde & Meadowbank", "Hornsby & Hills District",
];

const SERVICES = [
  {
    href: "/services/home-cleaning",
    icon: "🏠",
    title: "Home Cleaning",
    desc: "Recurring weekly or fortnightly cleans for houses and apartments across Sydney. 100% satisfaction guarantee.",
  },
  {
    href: "/services/commercial",
    icon: "🏢",
    title: "Commercial Cleaning",
    desc: "Offices, retail, medical centres, gyms and co-working spaces across Sydney.",
  },
  {
    href: "/services/ndis",
    icon: "💙",
    title: "NDIS Cleaning Support",
    desc: "General NDIS cleaning support for participants in Sydney.",
  },
];

const WHY_POINTS = [
  {
    title: "Apartment & strata specialists",
    desc: "Most Sydney properties are apartments or townhouses. Our cleaners are experienced with strata building access, key fob requirements, and high-density living spaces.",
  },
  {
    title: "Same cleaner for recurring visits",
    desc: "We assign the same cleaner to your home for each recurring booking where possible — familiar, trusted, and consistent.",
  },
  {
    title: "Fully insured & police-checked",
    desc: "Every cleaner holds a National Police Check and Public Liability Insurance. Required for many Sydney strata buildings — we've got it covered.",
  },
  {
    title: "Transparent online pricing",
    desc: "No phone calls, no callbacks. See your full price in seconds using our online quote tool — including any add-ons.",
  },
  {
    title: "Flexible to Sydney schedules",
    desc: "Early morning, evening, and weekend availability. We work around CBD commutes, school pick-ups, and Airbnb turnovers.",
  },
];

const FAQS: { q: string; a: string; jsx?: React.ReactNode }[] = [
  {
    q: "What suburbs in Sydney do you service?",
    a: "We take bookings across Sydney suburbs including the CBD, inner suburbs, Northern Beaches, Parramatta, the Hills District, and the Sutherland Shire. Use our online quote tool to confirm availability at your specific address before booking.",
  },
  {
    q: "Do you clean Sydney apartments and strata properties?",
    a: "Yes. The majority of Sydney cleans we do are apartments and units. Our cleaners are experienced with strata building access, key fob and swipe card entry, and working within shared building environments.",
  },
  {
    q: "Are your Sydney cleaners background checked?",
    a: "Yes. Every cleaner on our Sydney team holds a current National Police Check and is fully vetted before joining Taspro. Many Sydney strata buildings require this — we comply.",
  },
  {
    q: "Do you offer end of lease cleaning in Sydney?",
    a: "End-of-lease cleaning is not currently available in Sydney. We provide this service in Perth and Launceston. For recurring home cleaning, commercial cleaning or NDIS support in Sydney, use our online quote tool.",
    jsx: (
      <>
        <Link href="/services/end-of-lease" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          End-of-lease cleaning
        </Link>{" "}
        is not currently available in Sydney. We provide this service in{" "}
        <Link href="/locations/perth" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          Perth
        </Link>{" "}
        and{" "}
        <Link href="/locations/launceston" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          Launceston
        </Link>
        . For{" "}
        <Link href="/services/home-cleaning" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          recurring home cleaning
        </Link>
        ,{" "}
        <Link href="/services/commercial" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          commercial cleaning
        </Link>
        , or{" "}
        <Link href="/services/ndis" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          NDIS support
        </Link>{" "}
        in Sydney, use our online quote tool.
      </>
    ),
  },
  {
    q: "How quickly can you arrange a Sydney cleaner?",
    a: "We can often accommodate same-day or next-day bookings in Sydney. Select your date in our online booking tool and we'll confirm availability within 2 hours.",
  },
  {
    q: "Do you offer commercial office cleaning in Sydney?",
    a: "Yes. We service offices, co-working spaces, retail, medical centres, gyms and more across Greater Sydney. Commercial cleaning is priced per your space and frequency — contact us for a custom quote.",
    jsx: (
      <>
        Yes. We service offices, co-working spaces, retail, medical centres, gyms and more across Greater Sydney.{" "}
        <Link href="/services/commercial" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          Commercial cleaning
        </Link>{" "}
        is priced per your space and frequency —{" "}
        <Link href="/contact" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          contact us
        </Link>{" "}
        for a custom quote.
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

export default function SydneyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section
        className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden"
        aria-labelledby="syd-heading"
      >
        <Image
          src="https://images.unsplash.com/photo-1527515637462-cff94ebb52f7?w=1920&q=80"
          alt="Professional cleaner wiping down a clean modern surface"
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Sydney NSW
            </p>
            <h1
              id="syd-heading"
              className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5"
            >
              Professional Cleaning Services
              <br className="hidden md:block" /> in Sydney
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Background-checked, fully insured cleaners serving all Sydney suburbs. Recurring home cleaning, commercial cleaning and NDIS support — bookable online.
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

      {/* Trust bar */}
      <section className="bg-white border-b border-navy-950/8 py-5">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-navy-950/60 font-medium">
            {[
              "Police-checked cleaners",
              "Public liability insured",
              "Same cleaner each visit",
              "100% satisfaction guarantee",
              "Strata-experienced",
            ].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Recurring Only Notice */}
      <section className="bg-navy-950/[0.04] border-b border-navy-950/10" aria-label="Service availability in Sydney">
        <div className="container-custom py-5">
          <div className="flex items-start gap-3 max-w-3xl mx-auto">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-navy-950 text-sm mb-0.5">Recurring cleaning services only in Sydney</p>
              <p className="text-navy-950/65 text-sm leading-relaxed">
                We currently provide <strong className="font-semibold text-navy-950">weekly or fortnightly recurring cleaning services only</strong> in Sydney. We do not offer one-off deep cleans or end-of-lease cleaning in this location.{" "}
                <Link href="/locations/perth" className="text-teal-600 font-medium hover:text-teal-700 transition-colors underline underline-offset-2">View Perth for our full-service offering.</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white" aria-labelledby="syd-services-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Our Services</p>
            <h2 id="syd-services-heading" className="section-heading">
              Cleaning services available in Sydney
            </h2>
            <p className="section-subheading max-w-2xl mx-auto">
              We currently offer recurring home cleaning, commercial cleaning and NDIS support in Sydney. For end-of-lease, deep cleans and one-off bookings, see our <Link href="/locations/perth" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Perth page</Link>.
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
                    <h3 className="font-display text-lg font-bold text-navy-950 mb-1 group-hover:text-teal-700 transition-colors">
                      {s.title}
                    </h3>
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
      <section className="bg-teal-500 py-10" aria-label="Office cleaning Sydney">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="font-semibold text-navy-950/70 text-sm mb-1">🏢 Office &amp; Commercial Cleaning — Sydney</p>
              <h2 className="font-display text-2xl font-bold text-navy-950">We clean Sydney offices too.</h2>
              <p className="text-navy-950/70 text-sm mt-1 max-w-lg">
                Desks, meeting rooms, kitchens and bathrooms — during business hours or after hours. Police-checked, fully insured.{" "}
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

      {/* Suburbs */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="syd-suburbs-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="syd-suburbs-heading" className="section-heading">Sydney suburbs we service</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We take bookings across Sydney suburbs. Use the quote tool to confirm
              availability at your address, or{" "}
              <Link
                href="/contact"
                className="text-teal-600 font-semibold hover:text-teal-700 transition-colors"
              >
                contact us
              </Link>{" "}
              directly.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {SYDNEY_SUBURBS.map((suburb, i) => (
              <AnimateInView key={suburb} variant="slide-up" delay={i * 0.04}>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-navy-950/8 text-sm text-navy-950/70 font-medium">
                  <svg
                    className="w-3.5 h-3.5 text-teal-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {suburb}
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Why Taspro in Sydney */}
      <section className="section-padding bg-white" aria-labelledby="syd-why-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimateInView variant="slide-right">
              <p className="section-label">Why Taspro in Sydney</p>
              <h2 id="syd-why-heading" className="section-heading mb-6">
                Sydney&apos;s trusted cleaning team
              </h2>
              <div className="space-y-5">
                {WHY_POINTS.map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-teal-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
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
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/pricing" className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  View Sydney pricing
                </Link>
                <span className="text-navy-950/20">·</span>
                <Link href="/about" className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  About Taspro
                </Link>
              </div>
            </AnimateInView>

            <AnimateInView variant="slide-left">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                  alt="Professional cleaner tidying a bright Sydney apartment"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Trust proof */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="syd-trust-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Trust &amp; Standards</p>
            <h2 id="syd-trust-heading" className="section-heading">What you can expect from every clean</h2>
          </AnimateInView>

          {/* Google rating + guarantee row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            <AnimateInView variant="slide-up" delay={0}>
              <div className="bg-white rounded-2xl border border-navy-950/8 p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <p className="font-display text-3xl font-bold text-navy-950 mb-1">5.0<span className="text-teal-500">★</span></p>
                <p className="font-semibold text-navy-950 text-sm mb-1">Google Rating</p>
                <p className="text-navy-950/50 text-xs mb-3">50+ verified reviews</p>
                <a
                  href="https://share.google/F3GElGqkpP0ooMiSU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 text-xs font-semibold hover:text-teal-700 transition-colors"
                >
                  Read our reviews →
                </a>
              </div>
            </AnimateInView>

            <AnimateInView variant="slide-up" delay={0.07}>
              <div className="bg-white rounded-2xl border border-navy-950/8 p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <p className="font-display text-2xl font-bold text-navy-950 mb-1">100%</p>
                <p className="font-semibold text-navy-950 text-sm mb-1">Satisfaction Guarantee</p>
                <p className="text-navy-950/55 text-xs leading-relaxed">
                  Not happy? We return within 24 hours to fix any missed areas — at no extra cost.
                </p>
              </div>
            </AnimateInView>

            <AnimateInView variant="slide-up" delay={0.14}>
              <div className="bg-white rounded-2xl border border-navy-950/8 p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <p className="font-display text-2xl font-bold text-navy-950 mb-1">Police-checked</p>
                <p className="font-semibold text-navy-950 text-sm mb-1">Vetted Cleaners</p>
                <p className="text-navy-950/55 text-xs leading-relaxed">
                  National Police Check + Public Liability Insurance. Required for strata — we comply.
                </p>
              </div>
            </AnimateInView>
          </div>

          {/* How it works — 4 steps */}
          <AnimateInView variant="slide-up">
            <div className="bg-white rounded-3xl border border-navy-950/8 p-8">
              <p className="section-label text-center mb-8">How It Works</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: "1", title: "Get your price", desc: "Select your property size, service type, and any add-ons. Your exact price appears instantly — no callbacks." },
                  { step: "2", title: "Choose your date", desc: "Pick a date and time that suits you. Early mornings, evenings, and weekends available." },
                  { step: "3", title: "We clean", desc: "A vetted, insured cleaner arrives on time with all equipment and products. You don't need to be home." },
                  { step: "4", title: "Pay after", desc: "Payment is processed automatically after your clean completes. No cash, no invoices, no chasing." },
                ].map((item, i) => (
                  <div key={item.step} className="flex flex-col items-start">
                    <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center text-navy-950 font-bold text-base mb-3 shrink-0">
                      {item.step}
                    </div>
                    <p className="font-semibold text-navy-950 text-sm mb-1">{item.title}</p>
                    <p className="text-navy-950/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-navy-950/8 text-center">
                <Link href="/quote" className="btn-primary px-8 py-3">
                  Get a Free Instant Quote
                </Link>
              </div>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="syd-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="syd-faq-heading" className="section-heading">
              Sydney cleaning questions answered
            </h2>
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

      {/* Other locations */}
      <section className="section-padding bg-white" aria-labelledby="syd-other-locations-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Other Locations</p>
            <h2 id="syd-other-locations-heading" className="section-heading">
              We also service
            </h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/melbourne", city: "Melbourne", state: "VIC", desc: "Recurring home and commercial cleaning across Greater Melbourne." },
              { href: "/locations/perth", city: "Perth", state: "WA", desc: "Full-service hub — home cleaning, end of lease, NDIS, deep cleans and commercial across Greater Perth." },
              { href: "/locations/launceston", city: "Launceston", state: "TAS", desc: "Recurring home, NDIS and commercial cleaning in Launceston — where Taspro was founded." },
            ].map((loc, i) => (
              <AnimateInView key={loc.href} variant="slide-up" delay={i * 0.07}>
                <Link
                  href={loc.href}
                  className="group flex flex-col p-5 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full"
                >
                  <p className="font-display font-bold text-navy-950 text-lg mb-0.5 group-hover:text-teal-700 transition-colors">
                    {loc.city}
                    <span className="ml-1.5 text-sm font-semibold text-navy-950/40">{loc.state}</span>
                  </p>
                  <p className="text-navy-950/55 text-sm leading-relaxed flex-1 mt-1">{loc.desc}</p>
                  <span className="mt-3 text-teal-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View page
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500" aria-labelledby="syd-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2
              id="syd-cta-heading"
              className="font-display text-4xl font-bold text-navy-950 mb-4"
            >
              Ready to book your Sydney clean?
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">
              Get an instant quote online in under 60 seconds — no phone call needed.
              Pricing is transparent, there&apos;s no lock-in, and your satisfaction is guaranteed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-secondary text-base px-8 py-4">
                Get a Free Instant Quote
              </Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">
                Call (08) 7081 6811
              </a>
            </div>
            <p className="mt-5 text-navy-950/55 text-sm">
              Or{" "}
              <Link href="/contact" className="font-semibold underline underline-offset-2 hover:text-navy-950 transition-colors">
                send us a message
              </Link>{" "}
              — we respond within 1 business day.
            </p>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
