import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Airbnb Cleaning Services | Perth, Melbourne, Sydney & Launceston | Taspro",
  description:
    "Professional Airbnb & short-stay cleaning across Perth, Melbourne, Sydney and Launceston. Fast guest-ready turnovers, linen changes, restocking and hotel-standard presentation. Police-checked cleaners.",
  alternates: { canonical: "https://tasprocleaning.com.au/services/airbnb-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/services/airbnb-cleaning#service",
  name: "Airbnb & Short-Stay Cleaning",
  description: "Professional Airbnb and short-stay property cleaning across Perth, Melbourne, Sydney and Launceston. Guest-ready turnovers between bookings.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: ["Perth WA", "Melbourne VIC", "Sydney NSW", "Launceston TAS"],
  serviceType: "Airbnb Cleaning",
  url: "https://tasprocleaning.com.au/services/airbnb-cleaning",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "Fixed-price Airbnb turnovers. Get an instant quote online.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://tasprocleaning.com.au/services/airbnb-cleaning" },
    { "@type": "ListItem", position: 3, name: "Airbnb Cleaning", item: "https://tasprocleaning.com.au/services/airbnb-cleaning" },
  ],
};

const INCLUSIONS = [
  "Full property cleaned between every guest checkout",
  "Beds made to hotel standard — sheets, pillowcases, duvet covers",
  "Linen & towel change and fresh presentation",
  "Kitchen reset — dishes, benchtops, stovetop, appliances wiped",
  "Bathrooms scrubbed, disinfected & towels staged",
  "All floors vacuumed and mopped",
  "Rubbish removed and bins emptied & relined",
  "Mirrors and glass surfaces cleaned streak-free",
  "Balconies and outdoor areas tidied",
  "Restocking of guest supplies on request",
];

const FAQS = [
  {
    q: "How quickly can you turn around an Airbnb clean?",
    a: "We work within your checkout and check-in window. Let us know your booking calendar and we'll schedule cleaners to arrive as soon as guests check out, ensuring the property is ready before the next guests arrive.",
  },
  {
    q: "Do you supply linen and towels?",
    a: "We can work with your own linen or arrange a linen hire service. Let us know your preference when booking.",
  },
  {
    q: "Can I set up a recurring schedule for multiple turnovers per week?",
    a: "Yes. Many of our Airbnb clients run multiple turnovers per week. We can set up a regular schedule or you can request cleans on demand as bookings come in.",
  },
  {
    q: "Do you report any damage or maintenance issues?",
    a: "Yes. Our cleaners will flag any damage, missing items or maintenance issues noticed during the turnover so you can address them before the next guest arrives.",
  },
  {
    q: "Which cities do you cover for Airbnb cleaning?",
    a: "We service Airbnb and short-stay properties across Perth WA, Melbourne VIC, Sydney NSW and Launceston TAS.",
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

const LOCATIONS = [
  { city: "Perth", state: "WA", href: "/locations/perth", note: "Full service" },
  { city: "Melbourne", state: "VIC", href: "/locations/melbourne", note: "Available" },
  { city: "Sydney", state: "NSW", href: "/locations/sydney", note: "Available" },
  { city: "Launceston", state: "TAS", href: "/locations/launceston", note: "Available" },
];

export default function AirbnbCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="airbnb-heading">
        <Image
          src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1920&q=80"
          alt="Professionally cleaned Airbnb property"
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Airbnb & Short-Stay Cleaning</p>
            <h1 id="airbnb-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Guest-ready every time.<br className="hidden md:block" /> Every turnover.
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Professional Airbnb cleaning across Perth, Melbourne, Sydney and Launceston. We work within your checkout–check-in window so your property is spotless before the next guest arrives.
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

      {/* Trust strip */}
      <section className="bg-teal-500 border-b border-teal-600/20" aria-label="Key features">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            {["Police-checked cleaners", "Works within your booking window", "Linen change included", "Damage reporting", "On-demand or recurring schedule"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-navy-950/80 text-xs font-medium">
                <svg className="w-3.5 h-3.5 text-navy-950/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions + why */}
      <section className="section-padding bg-white" aria-labelledby="inclusions-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <AnimateInView variant="slide-right">
              <p className="section-label">What&apos;s Included</p>
              <h2 id="inclusions-heading" className="section-heading mb-6">Every Airbnb turnover includes</h2>
              <ul className="space-y-3">
                {INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-navy-950/75 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-navy-950/40 italic">
                Additional services (inside oven, fridge, extra linen sets) available as add-ons.
              </p>
            </AnimateInView>

            <AnimateInView variant="slide-left">
              <div className="space-y-5">
                <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-7">
                  <h3 className="font-display text-xl font-bold text-navy-950 mb-5">Why hosts choose Taspro</h3>
                  {[
                    { icon: "⚡", title: "Fast turnarounds", desc: "We know your checkout–check-in window is tight. Our team arrives promptly and works efficiently to hit your deadline every time." },
                    { icon: "🛡️", title: "Police-checked cleaners", desc: "Every cleaner is background-checked and insured. You can trust them in your property without needing to be there." },
                    { icon: "👁️", title: "Damage & issue reporting", desc: "We flag any damage, missing items or maintenance issues so you're never caught off guard before a guest arrives." },
                    { icon: "📅", title: "Flexible scheduling", desc: "Set a recurring schedule or request on-demand cleans as bookings come in. We adapt to your calendar." },
                  ].map((point) => (
                    <div key={point.title} className="flex items-start gap-4 py-4 border-b border-navy-950/8 last:border-0 last:pb-0">
                      <span className="text-2xl shrink-0" aria-hidden="true">{point.icon}</span>
                      <div>
                        <p className="font-semibold text-navy-950 text-sm">{point.title}</p>
                        <p className="text-navy-950/60 text-sm mt-0.5 leading-relaxed">{point.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href="/quote" className="btn-primary w-full text-center block">
                  Get Your Instant Quote
                </Link>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="airbnb-locations-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Where We Operate</p>
            <h2 id="airbnb-locations-heading" className="section-heading">Airbnb cleaning across Australia</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We service Airbnb and short-stay properties in four cities. Click your city for suburb-level coverage.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {LOCATIONS.map((loc, i) => (
              <AnimateInView key={loc.city} variant="slide-up" delay={i * 0.07}>
                <Link href={loc.href} className="group flex flex-col items-center p-5 bg-white rounded-2xl border border-navy-950/8 card-hover text-center">
                  <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">{loc.city}</p>
                  <p className="text-navy-950/50 text-xs">{loc.state}</p>
                  <span className="mt-2 text-xs font-medium text-teal-600">{loc.note}</span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white" aria-labelledby="airbnb-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="airbnb-faq-heading" className="section-heading">Airbnb cleaning questions answered</h2>
          </AnimateInView>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.06}>
                <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-semibold text-navy-950 mb-2">{faq.q}</h3>
                  <p className="text-navy-950/65 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="other-services-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Available</p>
            <h2 id="other-services-heading" className="section-heading">Other cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: "/services/home-cleaning", icon: "🏠", label: "Home Cleaning" },
              { href: "/services/end-of-lease", icon: "🔑", label: "End of Lease" },
              { href: "/services/deep-clean", icon: "✨", label: "Deep Clean" },
              { href: "/services/ndis", icon: "💙", label: "NDIS Cleaning" },
            ].map((svc, i) => (
              <AnimateInView key={svc.href} variant="slide-up" delay={i * 0.07}>
                <Link href={svc.href} className="group flex flex-col items-center gap-2 p-5 bg-white rounded-2xl border border-navy-950/8 card-hover text-center">
                  <span className="text-3xl" aria-hidden="true">{svc.icon}</span>
                  <span className="text-sm font-semibold text-navy-950 group-hover:text-teal-700 transition-colors">{svc.label}</span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500" aria-labelledby="airbnb-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="airbnb-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">
              Ready to automate your Airbnb cleaning?
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">
              Get an instant quote online — no phone calls, no back-and-forth, just a price in seconds.
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
