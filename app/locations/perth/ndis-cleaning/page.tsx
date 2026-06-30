import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "NDIS Cleaning Perth | Support for NDIS Participants | Taspro",
  description:
    "NDIS cleaning services for participants across Perth WA. Plan-managed, agency-managed and self-managed. Police-checked, experienced cleaners. Get a quote today.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/perth/ndis-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/perth/ndis-cleaning#service",
  name: "NDIS Cleaning Perth",
  description: "NDIS cleaning services for plan-managed, agency-managed and self-managed participants across Perth WA.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Perth", containedIn: "Western Australia, Australia" },
  url: "https://tasprocleaning.com.au/locations/perth/ndis-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Perth WA" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Perth", item: "https://tasprocleaning.com.au/locations/perth" },
    { "@type": "ListItem", position: 3, name: "NDIS Cleaning", item: "https://tasprocleaning.com.au/locations/perth/ndis-cleaning" },
  ],
};

const FAQS = [
  {
    q: "Is Taspro a registered NDIS provider?",
    a: "Taspro is not a registered NDIS provider. Our NDIS cleaning services are available to self-managed and plan-managed participants. If you are agency-managed, please check with your plan manager whether we can be used.",
  },
  {
    q: "What NDIS funding can be used for cleaning in Perth?",
    a: "Cleaning services in Perth are typically funded under the Core Supports — Assistance with Daily Life category of your NDIS plan. Speak with your plan manager or support coordinator to confirm what your plan covers.",
  },
  {
    q: "How much does NDIS cleaning cost in Perth?",
    a: "Our NDIS cleaning rate in Perth aligns with NDIS price guide rates. We invoice directly and provide all necessary documentation for your records. Contact us for current rates.",
  },
  {
    q: "Are your Perth cleaners experienced with NDIS participants?",
    a: "Yes. Our Perth cleaners who work with NDIS participants are experienced, patient, and understand the importance of consistency and communication for participants and their families.",
  },
  {
    q: "Can I use my NDIS plan for regular cleaning in Perth?",
    a: "Yes. Regular cleaning — weekly or fortnightly — is the most common arrangement for NDIS participants in Perth. Consistent scheduling means your home is always safe, clean, and comfortable.",
  },
  {
    q: "What Perth suburbs do you cover for NDIS cleaning?",
    a: "We provide NDIS cleaning across all of Greater Perth. Submit a quote request and we'll confirm availability for your specific suburb.",
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
  { room: "Kitchen", items: ["Benchtops wiped and sanitised", "Sink and taps scrubbed", "Stovetop cleaned", "Appliance exteriors wiped", "Floor mopped and disinfected"] },
  { room: "Bathrooms", items: ["Toilet bowl, seat and exterior sanitised", "Shower and bath cleaned", "Sink and vanity wiped", "Floor scrubbed and disinfected", "Towel rails and fixtures wiped"] },
  { room: "Bedrooms", items: ["All surfaces dusted", "Floors vacuumed or mopped", "Wardrobe exteriors wiped", "Mirrors cleaned", "Skirting boards dusted"] },
  { room: "Living Areas", items: ["Surfaces dusted throughout", "Floors vacuumed and mopped", "Window sills wiped", "Light switches cleaned", "Bins emptied and relined"] },
];

const PERTH_AREAS = [
  "Perth CBD", "East Perth", "West Perth", "Northbridge",
  "Subiaco", "Fremantle", "Cottesloe", "Claremont",
  "Leederville", "Mt Lawley", "Scarborough", "Joondalup",
  "Midland", "Cannington", "Canning Vale", "Armadale",
  "Osborne Park", "Balga", "Victoria Park", "Bentley",
  "Rockingham", "Mandurah", "Karrinyup", "Belmont",
];

export default function PerthNdisCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="ndis-perth-heading">
        <Image
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80"
          alt="Professional NDIS cleaner in a Perth home"
          fill priority className="object-cover opacity-10" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Perth WA · NDIS Cleaning</p>
            <h1 id="ndis-perth-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              NDIS Cleaning<br className="hidden md:block" /> in Perth
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">
              Cleaning support for NDIS participants across all Perth suburbs. Plan-managed and self-managed. Police-checked, caring, consistent cleaners.
            </p>
            <p className="text-teal-300 font-semibold text-sm mb-8">
              Police-checked · Fully insured · Self & plan-managed · All Perth suburbs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=ndis" className="btn-primary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["NDIS services available", "Self & plan-managed", "Police-checked cleaners", "Consistent scheduling", "All Perth suburbs"].map((t) => (
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

      {/* Notice */}
      <section className="bg-blue-50 border-b border-blue-100 py-5">
        <div className="container-custom text-center">
          <p className="text-sm text-blue-800">
            <strong>Please note:</strong> Taspro is not a registered NDIS provider. Our NDIS cleaning services are available to <strong>self-managed</strong> and <strong>plan-managed</strong> participants. If you are agency-managed, please check with your plan manager.
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="section-padding bg-white" aria-labelledby="ndis-perth-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What We Cover</p>
            <h2 id="ndis-perth-included-heading" className="section-heading">What&apos;s included in NDIS cleaning in Perth</h2>
            <p className="section-subheading max-w-2xl mx-auto">Every clean is tailored to the participant&apos;s needs and preferences. The below covers a standard NDIS home clean.</p>
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="ndis-perth-process-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Process</p>
            <h2 id="ndis-perth-process-heading" className="section-heading">How it works</h2>
          </AnimateInView>
          <div className="space-y-6">
            {[
              { step: "1", title: "Contact us about your NDIS plan", desc: "Let us know you're an NDIS participant and whether you're self-managed or plan-managed. We'll explain how the process works from there." },
              { step: "2", title: "We discuss your cleaning needs", desc: "We'll talk through what cleaning support you need, how often, and any specific requirements or preferences of the participant." },
              { step: "3", title: "We schedule a consistent cleaner", desc: "We assign a consistent Perth cleaner who gets to know your home and needs. Consistency matters for NDIS participants." },
              { step: "4", title: "We provide all documentation", desc: "We provide invoices and service records for your plan manager or your own records. Everything is clear and easy to manage." },
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
      <section className="section-padding bg-white" aria-labelledby="ndis-perth-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="ndis-perth-areas-heading" className="section-heading">Perth suburbs we cover for NDIS cleaning</h2>
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="ndis-perth-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="ndis-perth-faq-heading" className="section-heading">NDIS cleaning Perth — common questions</h2>
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
      <section className="section-padding bg-white" aria-labelledby="ndis-perth-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also useful</p>
            <h2 id="ndis-perth-related-heading" className="section-heading">More Perth cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/perth/home-cleaning", title: "Home Cleaning Perth", desc: "Standard residential cleans for Perth homes." },
              { href: "/services/ndis", title: "NDIS Cleaning Australia-wide", desc: "NDIS cleaning also available in Launceston TAS." },
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
      <section className="section-padding bg-teal-500" aria-labelledby="ndis-perth-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="ndis-perth-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Get in touch about NDIS cleaning in Perth</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">We&apos;ll explain how it works and get your cleaning support set up quickly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=ndis" className="btn-secondary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
