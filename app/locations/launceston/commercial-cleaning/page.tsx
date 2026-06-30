import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Commercial Cleaning Launceston | Office & Business Cleaning TAS | Taspro",
  description:
    "Professional commercial cleaning across Launceston TAS. Offices, retail, medical and more. After-hours available. Police-checked, fully insured. Get a custom quote today.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston/commercial-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston/commercial-cleaning#service",
  name: "Commercial Cleaning Launceston",
  description: "Professional commercial and office cleaning across Launceston TAS. After-hours available. Offices, retail, medical and more.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston/commercial-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Launceston TAS" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "Commercial Cleaning", item: "https://tasprocleaning.com.au/locations/launceston/commercial-cleaning" },
  ],
};

const FAQS = [
  { q: "How much does commercial cleaning cost in Launceston?", a: "Commercial cleaning in Launceston is priced based on your premises size, frequency and requirements. Pricing is confirmed after a site visit or detailed discussion — contact us for a custom quote." },
  { q: "Do you offer after-hours commercial cleaning in Launceston?", a: "Yes. We offer after-hours and weekend commercial cleaning across Launceston so your business isn't disrupted during trading hours." },
  { q: "What commercial premises do you clean in Launceston?", a: "We clean offices, retail stores, medical and allied health centres, gyms, childcare centres, and more across Launceston TAS." },
  { q: "Are your Launceston commercial cleaners police-checked?", a: "Yes. Every Taspro commercial cleaner in Launceston is police-checked and we carry full public liability insurance. Certificates available on request." },
  { q: "Can you set up a regular cleaning schedule for our Launceston business?", a: "Yes — recurring commercial cleans are our most popular service. We can set up daily, weekly or fortnightly schedules tailored to your business needs." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const INCLUDED = [
  { room: "Offices & Workstations", items: ["Desks and surfaces wiped", "Monitors and keyboards dusted", "Bins emptied and relined", "Floors vacuumed"] },
  { room: "Kitchens & Break Rooms", items: ["Benchtops and sink cleaned", "Appliance exteriors wiped", "Microwave interior and exterior", "Floor mopped"] },
  { room: "Bathrooms & Toilets", items: ["Toilets scrubbed and sanitised", "Sinks, taps and mirrors cleaned", "Bins emptied", "Floors mopped and disinfected"] },
  { room: "Common Areas", items: ["Reception surfaces wiped", "Meeting rooms cleaned", "Glass and partitions cleaned", "All floors vacuumed and mopped"] },
];

const LAUNCESTON_AREAS = [
  "Launceston CBD", "Newstead", "Invermay", "Newnham",
  "South Launceston", "Riverside", "Kings Meadows", "Youngtown",
  "Mowbray", "Mayfield", "St Leonards", "Prospect",
  "Rocherlea", "Norwood", "Legana", "Hadspen",
];

export default function LauncestonCommercialCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="commercial-launceston-heading">
        <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80" alt="Commercial cleaning in a Launceston office" fill priority className="object-cover opacity-10" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS · Commercial Cleaning</p>
            <h1 id="commercial-launceston-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">Commercial Cleaning<br className="hidden md:block" /> in Launceston</h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">Professional office and commercial cleaning across Launceston TAS. After-hours available. Police-checked, fully insured, custom pricing.</p>
            <p className="text-teal-300 font-semibold text-sm mb-8">Police-checked · Fully insured · After-hours available · All Launceston areas</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=commercial" className="btn-primary text-base px-8 py-4">Get a Custom Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Police-checked cleaners", "Fully insured", "After-hours available", "Custom pricing", "All Launceston areas"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-navy-950/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="commercial-launceston-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What We Cover</p>
            <h2 id="commercial-launceston-included-heading" className="section-heading">Standard commercial clean inclusions</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {INCLUDED.map((section, i) => (
              <AnimateInView key={section.room} variant="slide-up" delay={i * 0.07}>
                <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-display text-base font-bold text-navy-950 mb-4">{section.room}</h3>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-navy-950/70">
                        <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
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

      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="commercial-launceston-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="commercial-launceston-areas-heading" className="section-heading">Launceston areas we service</h2>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {LAUNCESTON_AREAS.map((area, i) => (
              <AnimateInView key={area} variant="slide-up" delay={i * 0.03}>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-navy-950/8 text-sm text-navy-950/70 font-medium">
                  <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {area}
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="commercial-launceston-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="commercial-launceston-faq-heading" className="section-heading">Commercial cleaning Launceston — common questions</h2>
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

      <section className="section-padding bg-teal-500" aria-labelledby="commercial-launceston-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="commercial-launceston-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Get a commercial cleaning quote for your Launceston business</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Tell us about your premises and we&apos;ll get back to you with a tailored quote.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=commercial" className="btn-secondary text-base px-8 py-4">Get a Custom Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
