import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Deep Cleaning Launceston | Top-to-Bottom Intensive Clean TAS | Taspro",
  description:
    "Professional deep cleaning across Launceston TAS. Move-in, pre-sale, spring clean and post-renovation cleans. Police-checked, fully insured. Get an instant quote online.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston/deep-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston/deep-cleaning#service",
  name: "Deep Cleaning Launceston",
  description: "Top-to-bottom intensive deep cleaning across Launceston TAS. Move-in, pre-sale, spring clean and post-renovation cleans.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston/deep-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Launceston TAS" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "Deep Cleaning", item: "https://tasprocleaning.com.au/locations/launceston/deep-cleaning" },
  ],
};

const FAQS = [
  { q: "How much does a deep clean cost in Launceston?", a: "Deep cleaning in Launceston is priced based on the number of bedrooms and bathrooms with a premium for the extra time and detail required. Get an exact fixed price instantly using our online quote tool." },
  { q: "What does a deep clean include in Launceston?", a: "A deep clean goes significantly further than a standard clean — inside the oven, inside the fridge, inside cupboards, grout scrubbing, window tracks, behind appliances, and all the areas a regular clean skips." },
  { q: "How long does a deep clean take in Launceston?", a: "A deep clean typically takes 2–3 times longer than a standard clean. A 3-bedroom, 2-bathroom home in Launceston usually takes 4–6 hours depending on the condition of the property." },
  { q: "Is a deep clean good before selling my Launceston property?", a: "Yes — a pre-sale deep clean is popular with Launceston homeowners. A thoroughly cleaned home photographs better and makes a stronger impression at inspections." },
  { q: "What Launceston areas do you cover for deep cleaning?", a: "We cover Launceston CBD and all surrounding suburbs for deep cleaning. Use our quote tool or contact us to confirm availability for your area." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const INCLUDED = [
  { room: "Kitchen (deep)", items: ["Oven interior, racks and grills degreased", "Range hood and filters", "Inside fridge and freezer", "Inside all cupboards", "Behind and under appliances"] },
  { room: "Bathrooms (deep)", items: ["Grout scrubbed", "Shower screens de-scaled", "Inside all cabinets", "Exhaust fan cleaned", "All tiles scrubbed thoroughly"] },
  { room: "Bedrooms & Living (deep)", items: ["Inside all wardrobes", "Behind furniture", "Skirting boards scrubbed", "Window sills and tracks", "Light fittings wiped"] },
  { room: "Throughout", items: ["All windows interior washed", "Blinds wiped", "Wall marks removed", "Cobwebs removed", "All floors vacuumed and mopped"] },
];

const LAUNCESTON_AREAS = [
  "Launceston CBD", "Newstead", "Invermay", "Newnham",
  "South Launceston", "Riverside", "Kings Meadows", "Youngtown",
  "Mowbray", "Mayfield", "St Leonards", "Prospect",
  "Rocherlea", "Norwood", "Legana", "Hadspen",
];

export default function LauncestonDeepCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="deep-launceston-heading">
        <Image src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80" alt="Deep cleaning a Launceston home" fill priority className="object-cover opacity-10" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS · Deep Cleaning</p>
            <h1 id="deep-launceston-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">Deep Cleaning<br className="hidden md:block" /> in Launceston</h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">Top-to-bottom intensive cleaning across Launceston TAS. Move-in, pre-sale, spring clean or post-renovation — we go where regular cleans don&apos;t.</p>
            <p className="text-teal-300 font-semibold text-sm mb-8">Police-checked · Fully insured · Fixed pricing · All Launceston suburbs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=deep-clean" className="btn-primary text-base px-8 py-4">Get an Instant Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Inside oven & fridge included", "Police-checked cleaners", "Fully insured", "Fixed pricing", "All Launceston suburbs"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-navy-950/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="deep-launceston-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Checklist</p>
            <h2 id="deep-launceston-included-heading" className="section-heading">What&apos;s included in a Launceston deep clean</h2>
            <p className="section-subheading max-w-2xl mx-auto">We go where regular cleans don&apos;t. Inside ovens, fridges, cupboards, grout, window tracks — all of it.</p>
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

      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="deep-launceston-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="deep-launceston-areas-heading" className="section-heading">Launceston suburbs we cover for deep cleaning</h2>
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

      <section className="section-padding bg-white" aria-labelledby="deep-launceston-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="deep-launceston-faq-heading" className="section-heading">Deep cleaning Launceston — common questions</h2>
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

      <section className="section-padding bg-teal-500" aria-labelledby="deep-launceston-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="deep-launceston-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Book your Launceston deep clean today</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Fixed price, instant quote. No phone calls needed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=deep-clean" className="btn-secondary text-base px-8 py-4">Get an Instant Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
