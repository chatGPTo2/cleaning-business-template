import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "NDIS Cleaning Services | Perth, Melbourne, Sydney & Launceston | Taspro",
  description:
    "NDIS cleaning services across Perth WA, Melbourne VIC, Sydney NSW and Launceston TAS. Plan-managed, agency-managed and self-managed participants welcome. Police-checked, insured cleaners.",
  alternates: { canonical: "https://tasprocleaning.com.au/services/ndis" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/services/ndis#service",
  name: "NDIS Cleaning Services",
  description: "NDIS cleaning services across Perth WA, Melbourne VIC, Sydney NSW and Launceston TAS. Plan-managed, agency-managed and self-managed participants welcome.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: ["Perth WA", "Melbourne VIC", "Sydney NSW", "Launceston TAS"],
  serviceType: "NDIS Cleaning",
  url: "https://tasprocleaning.com.au/services/ndis",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "NDIS-funded cleaning services. Plan-managed, agency-managed and self-managed participants welcome.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://tasprocleaning.com.au/services/ndis" },
    { "@type": "ListItem", position: 3, name: "NDIS Cleaning", item: "https://tasprocleaning.com.au/services/ndis" },
  ],
};

const INCLUSIONS = [
  "Kitchen — benchtops, sink, stove, microwave, floor",
  "Bedrooms — dusting, furniture, surfaces, floors",
  "Bathrooms — toilet, shower, bath, mirrors, floor",
  "All rooms — vacuuming, mopping, bins emptied",
  "Interior windows wiped and sills cleaned",
  "Skirting boards and surfaces dusted throughout",
  "Respectful and discreet service at all times",
  "Consistent cleaner where possible",
  "Flexible scheduling around participant needs",
  "Detailed notes and preferences followed",
  "Clear communication with support coordinators",
];

const FUNDING_TYPES = [
  { label: "Plan Managed", description: "We invoice your plan manager directly. Simple, paperwork-free process." },
  { label: "Self Managed", description: "Participants manage their own claims. We provide all required invoices and receipts." },
  { label: "Registered Providers", description: "We work alongside registered providers delivering support packages." },
  { label: "LAC Partners", description: "We coordinate with Local Area Coordinators to deliver cleaning as part of your support plan." },
];

export default function NDISPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section
        className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden"
        aria-labelledby="ndis-heading"
      >
        <Image
          src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1920&q=80"
          alt="Caring professional cleaner working in a comfortable home setting"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">NDIS Cleaning</p>
            <h1 id="ndis-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              NDIS Cleaning Services<br className="hidden md:block" /> in Tasmania
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Compassionate, reliable cleaning support for NDIS participants across Launceston and Tasmania. We work with your plan to make it simple.
            </p>
            <Link href="/contact" className="btn-primary text-base px-8 py-4">
              Enquire About NDIS Cleaning
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Coverage breakdown */}
      <section className="bg-navy-950/[0.04] border-b border-navy-950/10" aria-label="NDIS coverage by city">
        <div className="container-custom py-5">
          <div className="flex flex-wrap items-start sm:items-center justify-center gap-x-10 gap-y-3">
            <div className="flex items-center gap-2.5 text-sm">
              <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-navy-950/70"><strong className="font-semibold text-navy-950">Perth WA &amp; Tasmania</strong> — Full NDIS cleaning support</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-navy-950/70"><strong className="font-semibold text-navy-950">Melbourne VIC &amp; Sydney NSW</strong> — General NDIS cleaning support</span>
            </div>
          </div>
        </div>
      </section>

      {/* About NDIS */}
      <section className="section-padding bg-white" aria-labelledby="ndis-about-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up">
            <p className="section-label">About NDIS</p>
            <h2 id="ndis-about-heading" className="section-heading mb-5">What is the NDIS?</h2>
            <div className="prose prose-navy max-w-none text-navy-950/70 leading-relaxed space-y-4 text-base">
              <p>
                The National Disability Insurance Scheme (NDIS) is an Australian Government scheme that provides funding to Australians with permanent and significant disability. The scheme gives participants choice and control over the supports and services they receive.
              </p>
              <p>
                Household cleaning can be funded under the NDIS as an <strong>Assistance with Daily Life</strong> support, where cleaning tasks are required due to the participant&apos;s disability. Participants must be registered with the NDIA to access NDIS-funded cleaning services.
              </p>
              <p>
                Taspro Cleaning Solutions works with plan managers, Local Area Coordinators (LACs), registered providers and self-managed participants across Tasmania.
              </p>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Funding types */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="ndis-funding-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">How We Work</p>
            <h2 id="ndis-funding-heading" className="section-heading">We support all funding types</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FUNDING_TYPES.map((ft, i) => (
              <AnimateInView key={ft.label} variant="slide-up" delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-navy-950/8 shadow-card h-full">
                  <h3 className="font-display text-lg font-semibold text-navy-950 mb-2">{ft.label}</h3>
                  <p className="text-navy-950/60 text-sm leading-relaxed">{ft.description}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-white" aria-labelledby="ndis-inclusions-heading">
        <div className="container-custom max-w-2xl">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">What&apos;s Included</p>
            <h2 id="ndis-inclusions-heading" className="section-heading">Standard home cleaning tasks</h2>
            <p className="section-subheading">
              NDIS cleaning includes all standard home cleaning items, tailored around participant needs and schedule.
            </p>
          </AnimateInView>
          <AnimateInView variant="slide-up" delay={0.1}>
            <ul className="space-y-3" aria-label="NDIS cleaning inclusions">
              {INCLUSIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-navy-950/70">
                  <svg className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </AnimateInView>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal-500 py-14">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 className="font-display text-3xl font-bold text-navy-950 mb-3">Ready to get started?</h2>
            <p className="text-navy-950/70 max-w-lg mx-auto mb-6">
              Contact us today to discuss how we can support you or your participant under the NDIS. We&apos;ll respond within 1 business day.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy-900 hover:-translate-y-0.5 transition-all duration-200">
              Contact Us About NDIS
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="section-padding bg-white" aria-labelledby="ndis-cities-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Where We Clean</p>
            <h2 id="ndis-cities-heading" className="section-heading">NDIS cleaning across Australia</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We provide NDIS cleaning services in all four of our cities.
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="ndis-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Available</p>
            <h2 id="ndis-related-heading" className="section-heading">Other cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/services/home-cleaning", icon: "🏠", title: "Home Cleaning", desc: "Regular weekly, fortnightly or monthly residential cleans." },
              { href: "/services/end-of-lease", icon: "🔑", title: "End of Lease", desc: "Bond-back guaranteed. We follow the agent checklist." },
              { href: "/services/commercial", icon: "🏢", title: "Commercial Cleaning", desc: "Offices, retail, gyms and medical centres." },
              { href: "/services/deep-clean", icon: "✨", title: "Deep Clean", desc: "Top-to-bottom refresh — perfect for move-ins and pre-sale." },
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
