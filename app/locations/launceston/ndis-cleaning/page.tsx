import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "NDIS Cleaning Launceston | Support for NDIS Participants TAS | Taspro",
  description:
    "NDIS cleaning services for participants across Launceston TAS. Plan-managed and self-managed. Police-checked, caring cleaners. Get a quote today.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston/ndis-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston/ndis-cleaning#service",
  name: "NDIS Cleaning Launceston",
  description: "NDIS cleaning services for plan-managed and self-managed participants across Launceston TAS.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston/ndis-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Launceston TAS" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "NDIS Cleaning", item: "https://tasprocleaning.com.au/locations/launceston/ndis-cleaning" },
  ],
};

const FAQS = [
  { q: "Is Taspro a registered NDIS provider in Launceston?", a: "Taspro is not a registered NDIS provider. Our NDIS cleaning services in Launceston are available to self-managed and plan-managed participants. If you are agency-managed, please check with your plan manager." },
  { q: "What NDIS funding can be used for cleaning in Launceston?", a: "Cleaning services in Launceston are typically funded under Core Supports — Assistance with Daily Life. Speak with your plan manager or support coordinator to confirm what your plan covers." },
  { q: "Are your Launceston cleaners experienced with NDIS participants?", a: "Yes. Our Launceston cleaners who work with NDIS participants are experienced, patient, and understand the importance of consistency and clear communication." },
  { q: "Can I get regular NDIS cleaning in Launceston?", a: "Yes. Weekly or fortnightly cleans are the most common arrangement for NDIS participants in Launceston. Consistent scheduling means your home is always safe, clean, and comfortable." },
  { q: "What areas do you cover for NDIS cleaning in Launceston?", a: "We provide NDIS cleaning across Launceston CBD and all surrounding suburbs. Submit a quote request to confirm availability for your specific area." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const INCLUDED = [
  { room: "Kitchen", items: ["Benchtops wiped and sanitised", "Sink and taps scrubbed", "Stovetop cleaned", "Floor mopped and disinfected"] },
  { room: "Bathrooms", items: ["Toilet sanitised", "Shower and sink cleaned", "Floor scrubbed and disinfected", "Towel rails wiped"] },
  { room: "Bedrooms", items: ["Surfaces dusted", "Floors vacuumed or mopped", "Mirrors cleaned", "Skirting boards dusted"] },
  { room: "Living Areas", items: ["Surfaces dusted", "Floors vacuumed and mopped", "Bins emptied and relined", "Light switches cleaned"] },
];

const LAUNCESTON_AREAS = [
  "Launceston CBD", "Newstead", "Invermay", "Newnham",
  "South Launceston", "Riverside", "Kings Meadows", "Youngtown",
  "Mowbray", "Mayfield", "St Leonards", "Prospect",
  "Rocherlea", "Norwood", "Legana", "Hadspen",
];

export default function LauncestonNdisCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="ndis-launceston-heading">
        <Image src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80" alt="NDIS cleaning support in Launceston" fill priority className="object-cover opacity-10" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS · NDIS Cleaning</p>
            <h1 id="ndis-launceston-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">NDIS Cleaning<br className="hidden md:block" /> in Launceston</h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">Cleaning support for NDIS participants across Launceston TAS. Self-managed and plan-managed. Police-checked, caring, consistent cleaners.</p>
            <p className="text-teal-300 font-semibold text-sm mb-8">Police-checked · Fully insured · Self & plan-managed · All Launceston suburbs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=ndis" className="btn-primary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["NDIS services available", "Self & plan-managed", "Police-checked cleaners", "Consistent scheduling", "All Launceston suburbs"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-navy-950/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blue-50 border-b border-blue-100 py-5">
        <div className="container-custom text-center">
          <p className="text-sm text-blue-800"><strong>Please note:</strong> Taspro is not a registered NDIS provider. Our NDIS cleaning services are available to <strong>self-managed</strong> and <strong>plan-managed</strong> participants in Launceston. If you are agency-managed, please check with your plan manager.</p>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="ndis-launceston-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What We Cover</p>
            <h2 id="ndis-launceston-included-heading" className="section-heading">What&apos;s included in NDIS cleaning in Launceston</h2>
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

      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="ndis-launceston-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="ndis-launceston-areas-heading" className="section-heading">Launceston suburbs we cover for NDIS cleaning</h2>
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

      <section className="section-padding bg-white" aria-labelledby="ndis-launceston-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="ndis-launceston-faq-heading" className="section-heading">NDIS cleaning Launceston — common questions</h2>
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

      <section className="section-padding bg-teal-500" aria-labelledby="ndis-launceston-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="ndis-launceston-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Get in touch about NDIS cleaning in Launceston</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">We&apos;ll explain how it works and get your cleaning support set up quickly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=ndis" className="btn-secondary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
