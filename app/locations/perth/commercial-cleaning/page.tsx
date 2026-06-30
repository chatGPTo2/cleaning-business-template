import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Commercial Cleaning Perth | Office & Business Cleaning | Taspro",
  description:
    "Professional commercial cleaning across all Perth suburbs. Offices, retail, medical, gyms and more. After-hours available. Police-checked, fully insured. Get a custom quote today.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/perth/commercial-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/perth/commercial-cleaning#service",
  name: "Commercial Cleaning Perth",
  description: "Professional commercial and office cleaning across Perth WA. After-hours available. Offices, retail, medical, gyms and industrial premises.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Perth", containedIn: "Western Australia, Australia" },
  url: "https://tasprocleaning.com.au/locations/perth/commercial-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Perth WA" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Perth", item: "https://tasprocleaning.com.au/locations/perth" },
    { "@type": "ListItem", position: 3, name: "Commercial Cleaning", item: "https://tasprocleaning.com.au/locations/perth/commercial-cleaning" },
  ],
};

const FAQS = [
  {
    q: "How much does commercial cleaning cost in Perth?",
    a: "Commercial cleaning is priced based on your premises size, frequency and specific requirements. Pricing is confirmed after a site visit or detailed discussion — send us your details and we'll get back to you with a custom quote.",
  },
  {
    q: "Do you offer after-hours commercial cleaning in Perth?",
    a: "Yes. We offer after-hours and weekend commercial cleaning across Perth so your business isn't disrupted. Early morning starts are also available.",
  },
  {
    q: "What types of commercial premises do you clean in Perth?",
    a: "We clean offices, retail stores, medical and allied health centres, gyms, warehouses, childcare centres, strata buildings, and more across Perth WA.",
  },
  {
    q: "Are your commercial cleaners police-checked?",
    a: "Yes. Every Taspro commercial cleaner in Perth is police-checked and we carry full public liability insurance. We can provide certificates on request.",
  },
  {
    q: "Can you clean our Perth office on a regular schedule?",
    a: "Yes — recurring commercial cleans are our most popular service. We can set up daily, weekly or fortnightly cleaning schedules tailored to your business.",
  },
  {
    q: "Do you supply all cleaning products and equipment?",
    a: "Yes. We bring all commercial-grade cleaning products and equipment. You don't need to supply anything.",
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
  { room: "Offices & Workstations", items: ["Desks and surfaces wiped down", "Monitors and keyboards dusted", "Chairs and partitions wiped", "Bins emptied and relined", "Floors vacuumed"] },
  { room: "Kitchens & Break Rooms", items: ["Benchtops and sink cleaned", "Appliance exteriors wiped", "Fridge exterior cleaned", "Microwave interior and exterior", "Floor mopped"] },
  { room: "Bathrooms & Toilets", items: ["Toilets scrubbed and sanitised", "Sinks, taps and mirrors cleaned", "Soap dispensers refilled", "Bins emptied", "Floors mopped and disinfected"] },
  { room: "Common Areas & Reception", items: ["Reception desk and surfaces wiped", "Meeting room tables cleaned", "Glass doors and partitions cleaned", "Hard floors mopped", "Vacuuming throughout"] },
];

const PERTH_AREAS = [
  "Perth CBD", "East Perth", "West Perth", "Northbridge",
  "Subiaco", "Fremantle", "Osborne Park", "Malaga",
  "Leederville", "Mt Lawley", "Joondalup", "Belmont",
  "Midland", "Cannington", "Canning Vale", "Armadale",
  "Welshpool", "Bibra Lake", "Wangara", "Kenwick",
  "Rockingham", "Mandurah", "Karrinyup", "Victoria Park",
];

export default function PerthCommercialCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="commercial-perth-heading">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Professional commercial cleaner in a Perth office"
          fill priority className="object-cover opacity-10" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Perth WA · Commercial Cleaning</p>
            <h1 id="commercial-perth-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Commercial Cleaning<br className="hidden md:block" /> in Perth
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">
              Professional office and commercial cleaning across all Perth suburbs. After-hours available. Police-checked, fully insured, custom pricing.
            </p>
            <p className="text-teal-300 font-semibold text-sm mb-8">
              Police-checked · Fully insured · After-hours available · All Perth suburbs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=commercial" className="btn-primary text-base px-8 py-4">Get a Custom Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Police-checked cleaners", "Fully insured", "After-hours available", "Custom pricing", "All Perth suburbs covered"].map((t) => (
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
      <section className="section-padding bg-white" aria-labelledby="commercial-perth-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What We Cover</p>
            <h2 id="commercial-perth-included-heading" className="section-heading">Standard commercial clean inclusions</h2>
            <p className="section-subheading max-w-2xl mx-auto">Every commercial clean is tailored to your premises. The below covers what&apos;s included in a standard office clean — we adjust based on your specific requirements.</p>
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
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="commercial-perth-process-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Process</p>
            <h2 id="commercial-perth-process-heading" className="section-heading">How it works</h2>
          </AnimateInView>
          <div className="space-y-6">
            {[
              { step: "1", title: "Tell us about your Perth premises", desc: "Submit a quote request with your address, premises type and rough size. We'll get back to you quickly with questions or a quote." },
              { step: "2", title: "We confirm the details and pricing", desc: "For most commercial premises, pricing is confirmed after a brief site visit or phone discussion so we can quote accurately." },
              { step: "3", title: "We clean — during or after hours", desc: "Our Perth commercial cleaners work around your schedule. After-hours, early mornings and weekends are all available." },
              { step: "4", title: "Ongoing relationship", desc: "Most Perth businesses set up a regular cleaning schedule. We assign consistent cleaners so they know your premises inside out." },
            ].map((s, i) => (
              <AnimateInView key={s.step} variant="slide-up" delay={i * 0.07}>
                <div className="flex gap-5 items-start">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center shrink-0 font-bold text-navy-950 text-sm">{s.step}</div>
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

      {/* Areas */}
      <section className="section-padding bg-white" aria-labelledby="commercial-perth-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="commercial-perth-areas-heading" className="section-heading">Perth areas we service for commercial cleaning</h2>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {PERTH_AREAS.map((area, i) => (
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="commercial-perth-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="commercial-perth-faq-heading" className="section-heading">Commercial cleaning Perth — common questions</h2>
          </AnimateInView>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.05}>
                <div className="bg-white rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-semibold text-navy-950 mb-2">{faq.q}</h3>
                  <p className="text-navy-950/65 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="section-padding bg-white" aria-labelledby="commercial-perth-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also useful</p>
            <h2 id="commercial-perth-related-heading" className="section-heading">More Perth cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/perth/home-cleaning", title: "Home Cleaning Perth", desc: "Residential cleans for Perth homes — one-off or recurring." },
              { href: "/services/commercial", title: "Commercial Cleaning Australia-wide", desc: "Also available in Launceston, Melbourne and Sydney." },
              { href: "/locations/perth", title: "All Perth Services", desc: "View all cleaning services available across Perth WA." },
            ].map((link, i) => (
              <AnimateInView key={link.href} variant="slide-up" delay={i * 0.07}>
                <Link href={link.href} className="group block p-5 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover">
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{link.title}</p>
                  <p className="text-navy-950/55 text-xs leading-relaxed">{link.desc}</p>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-teal-500" aria-labelledby="commercial-perth-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="commercial-perth-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Get a commercial cleaning quote for your Perth business</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Tell us about your premises and we&apos;ll get back to you with a tailored quote.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=commercial" className="btn-secondary text-base px-8 py-4">Get a Custom Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
