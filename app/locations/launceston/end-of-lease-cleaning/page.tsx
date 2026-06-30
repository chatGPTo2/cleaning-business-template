import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "End of Lease Cleaning Launceston | Bond Back Guaranteed | Taspro",
  description:
    "Professional end of lease cleaning in Launceston TAS. Bond-back guaranteed, real estate agent checklists, police-checked cleaners. Serving Launceston, Kings Meadows, Newstead & surrounds. Get an instant quote.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston/end-of-lease-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston/end-of-lease-cleaning#service",
  name: "End of Lease Cleaning Launceston",
  description: "Bond-back guaranteed end of lease and bond cleaning in Launceston TAS. We follow real estate agent checklists line by line.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston/end-of-lease-cleaning",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    areaServed: "Launceston TAS",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "End of Lease Cleaning", item: "https://tasprocleaning.com.au/locations/launceston/end-of-lease-cleaning" },
  ],
};

const FAQS = [
  {
    q: "Do you guarantee the bond will be returned?",
    a: "Yes. We offer a bond-back guarantee — if your property manager or real estate agent identifies a cleaning issue within 72 hours of our clean, we return to re-clean those areas at no charge.",
  },
  {
    q: "How much does end of lease cleaning cost in Launceston?",
    a: "Pricing is based on the number of bedrooms and bathrooms. A standard 2-bedroom, 1-bathroom property in Launceston typically starts from $280. Get an exact price instantly online — no phone calls needed.",
  },
  {
    q: "Do you use the real estate agent's checklist?",
    a: "Yes. We follow the standard Tasmanian end of lease cleaning checklist used by Launceston real estate agents and property managers. If your agent has a specific checklist, send it through and we'll work from that.",
  },
  {
    q: "What areas in Launceston do you cover for bond cleaning?",
    a: "We cover Launceston CBD, Kings Meadows, Newstead, Invermay, Newnham, Mowbray, Riverside, Trevallyn, South Launceston, Youngtown, Ravenswood, and surrounding northern Tasmania areas including George Town and Longford.",
  },
  {
    q: "How much notice do I need to give?",
    a: "We recommend booking at least 48–72 hours before your vacate date. For end-of-month moves (common in Launceston) we book up fast, so the earlier the better.",
  },
  {
    q: "Do you clean carpets and windows?",
    a: "Carpet steam cleaning and window cleaning are available as add-ons to your end of lease package. Many Launceston leases require professional carpet cleaning — check your lease agreement and we can arrange it.",
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

const INCLUDED = [
  {
    room: "Kitchen",
    items: ["Oven interior & exterior (including racks)", "Range hood & filters", "Stovetop & splashback", "Benchtops & cupboard exteriors", "Sink & taps", "Dishwasher exterior", "Microwave interior & exterior", "Mopped floor"],
  },
  {
    room: "Bathrooms & Ensuites",
    items: ["Shower screens & tiles", "Bath (if applicable)", "Toilet bowl, seat & exterior", "Vanity & mirror", "Exhaust fan", "Taps & fixtures", "Scrubbed & mopped floor"],
  },
  {
    room: "Bedrooms & Living Areas",
    items: ["All surfaces dusted", "Wardrobes interior & exterior", "Skirting boards & window sills", "Light switches & door handles", "Vacuumed carpets or mopped hard floors"],
  },
  {
    room: "Throughout",
    items: ["All windows interior cleaned", "Blinds wiped", "Cobwebs removed", "Light fittings wiped", "Wall marks spot cleaned", "Fly screens wiped"],
  },
];

const AREAS = [
  "Launceston CBD", "Kings Meadows", "Newstead", "Invermay",
  "Newnham", "Mowbray", "Riverside", "Trevallyn",
  "South Launceston", "Youngtown", "Ravenswood", "West Launceston",
  "George Town", "Longford", "Summerhill", "Rocherlea",
];

export default function LauncestonEndOfLeasePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="eol-launc-heading">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="Professional end of lease cleaner in a Launceston property"
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS · Bond Cleaning</p>
            <h1 id="eol-launc-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              End of Lease Cleaning<br className="hidden md:block" /> in Launceston
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">
              Bond-back guaranteed. We follow Launceston real estate agent checklists line by line — so you get your full deposit back.
            </p>
            <p className="text-teal-300 font-semibold text-sm mb-8">
              Police-checked · Fully insured · 72-hour re-clean guarantee
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=end-of-lease" className="btn-primary text-base px-8 py-4">
                Get an Instant Quote
              </Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">
                Call (08) 7081 6811
              </a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Bond-back guarantee", "Real estate checklist included", "Police-checked cleaners", "72-hr re-clean if needed", "Instant online pricing"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-navy-950/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-white" aria-labelledby="eol-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Checklist</p>
            <h2 id="eol-included-heading" className="section-heading">What&apos;s included in every Launceston bond clean</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Every room cleaned to the standard Tasmanian property managers expect. Send us your agent&apos;s checklist and we&apos;ll work from that.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {INCLUDED.map((section, i) => (
              <AnimateInView key={section.room} variant="slide-up" delay={i * 0.07}>
                <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-display text-base font-bold text-navy-950 mb-4">{section.room}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-navy-950/70">
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
          <AnimateInView variant="slide-up" className="mt-8 text-center">
            <p className="text-sm text-navy-950/50">
              Carpet steam cleaning and window cleaning available as add-ons.{" "}
              <Link href="/quote?city=launceston&service=end-of-lease" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">
                See full pricing →
              </Link>
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* Guarantee callout */}
      <section className="bg-navy-950 py-16" aria-labelledby="eol-guarantee-heading">
        <div className="container-custom max-w-3xl text-center">
          <AnimateInView variant="slide-up">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-navy-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2 id="eol-guarantee-heading" className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Our bond-back guarantee
            </h2>
            <p className="text-white/65 text-lg leading-relaxed mb-6">
              If your Launceston property manager or real estate agent flags a cleaning issue within <strong className="text-white">72 hours</strong> of our clean, we return and re-clean those areas <strong className="text-white">free of charge</strong>. No arguments, no extra costs.
            </p>
            <p className="text-white/45 text-sm">
              Under the Residential Tenancy Act 1997 (Tasmania), your bond is held by Consumer, Building and Occupational Services (CBOS). A thorough clean is the most common reason bonds are disputed — we make sure it isn&apos;t.
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-white" aria-labelledby="eol-process-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Process</p>
            <h2 id="eol-process-heading" className="section-heading">How it works</h2>
          </AnimateInView>
          <div className="space-y-6">
            {[
              { step: "1", title: "Get an instant quote online", desc: "Enter your property details and get a fixed price in seconds. No phone calls, no surprises. Carpet steam cleaning and window cleaning can be added." },
              { step: "2", title: "Book your clean", desc: "Choose a date that works with your vacate and handover schedule. We work around your move-out timeline." },
              { step: "3", title: "We clean to the agent's standard", desc: "Our Launceston cleaners follow the standard end of lease checklist and can work from your specific agent's list if provided." },
              { step: "4", title: "Pass the inspection — or we come back", desc: "If anything is flagged within 72 hours, we return free of charge. Most Taspro end of lease cleans in Launceston pass first time." },
            ].map((s, i) => (
              <AnimateInView key={s.step} variant="slide-up" delay={i * 0.07}>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0 font-bold text-navy-950 text-sm">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-semibold text-navy-950">{s.title}</p>
                    <p className="text-navy-950/60 text-sm mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Areas covered */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="eol-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="eol-areas-heading" className="section-heading">Areas we cover for bond cleaning in Launceston</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We cover Launceston and surrounding northern Tasmania. Not sure if we cover your suburb?{" "}
              <Link href="/contact" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Ask us</Link>.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {AREAS.map((area, i) => (
              <AnimateInView key={area} variant="slide-up" delay={i * 0.03}>
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

      {/* FAQ */}
      <section className="section-padding bg-white" aria-labelledby="eol-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="eol-faq-heading" className="section-heading">End of lease cleaning Launceston — common questions</h2>
          </AnimateInView>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.05}>
                <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-semibold text-navy-950 mb-2">{faq.q}</h3>
                  <p className="text-navy-950/65 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="eol-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also useful</p>
            <h2 id="eol-related-heading" className="section-heading">Other Launceston cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/launceston", title: "All Launceston Services", desc: "Home cleaning, commercial and NDIS support in Launceston." },
              { href: "/services/end-of-lease", title: "End of Lease Australia-wide", desc: "Also available in Perth WA. View full service details." },
              { href: "/pricing", title: "Pricing", desc: "See instant pricing for your property size." },
            ].map((link, i) => (
              <AnimateInView key={link.href} variant="slide-up" delay={i * 0.07}>
                <Link href={link.href} className="group block p-5 bg-white rounded-2xl border border-navy-950/8 card-hover">
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{link.title}</p>
                  <p className="text-navy-950/55 text-xs leading-relaxed">{link.desc}</p>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500" aria-labelledby="eol-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="eol-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">
              Book your Launceston bond clean today
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">
              Get a fixed price in seconds. Bond-back guaranteed or we come back free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=end-of-lease" className="btn-secondary text-base px-8 py-4">
                Get an Instant Quote
              </Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">
                Call (08) 7081 6811
              </a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
