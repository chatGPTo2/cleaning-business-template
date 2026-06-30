import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Airbnb Cleaning Launceston | Short Stay & Vacation Rental Cleaning TAS | Taspro",
  description:
    "Professional Airbnb and short stay cleaning across Launceston TAS. Fast turnovers, linen change, restock and inspection-ready presentation. Get a quote today.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston/airbnb-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston/airbnb-cleaning#service",
  name: "Airbnb Cleaning Launceston",
  description: "Professional Airbnb and short stay vacation rental cleaning across Launceston TAS. Fast turnovers and inspection-ready presentation.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston/airbnb-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Launceston TAS" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "Airbnb Cleaning", item: "https://tasprocleaning.com.au/locations/launceston/airbnb-cleaning" },
  ],
};

const FAQS = [
  { q: "How does Airbnb cleaning work in Launceston?", a: "We coordinate with your guest checkout and next check-in times to turn your Launceston property around quickly. Provide us your schedule and we handle the clean, linen change, restock and presentation." },
  { q: "Can you do same-day turnovers in Launceston?", a: "Yes. Same-day turnovers between guests are available for Launceston short stay hosts. We need at least a few hours notice and work to your specific check-in deadline." },
  { q: "Do you change linen during Airbnb cleans in Launceston?", a: "Yes. Linen change and bed making is included in our Launceston Airbnb cleaning service. You provide your own linen sets or we can discuss a linen arrangement." },
  { q: "What Launceston areas do you cover for Airbnb cleaning?", a: "We cover Launceston CBD and surrounding suburbs popular with short stay guests including Newstead, South Launceston, Riverside, and beyond. Contact us to confirm availability for your property." },
  { q: "Can I set up an ongoing Airbnb cleaning schedule in Launceston?", a: "Yes. We can set up an ongoing arrangement tied to your booking calendar so every turnover is handled automatically. Contact us to discuss how this works for your Launceston property." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const INCLUDED = [
  { room: "Bedrooms", items: ["Linen stripped and replaced", "Beds made to hotel standard", "All surfaces dusted", "Floors vacuumed"] },
  { room: "Bathrooms", items: ["Toilet, shower and sink sanitised", "Mirrors polished", "Fresh towels set out", "Floor mopped and disinfected"] },
  { room: "Kitchen", items: ["Dishes checked and washed", "Benchtops sanitised", "Stovetop cleaned", "Bin emptied and relined"] },
  { room: "Presentation", items: ["Property inspected for damage", "Report sent to host", "Supplies restocked as requested", "Entry area tidied"] },
];

const LAUNCESTON_AREAS = [
  "Launceston CBD", "Newstead", "South Launceston", "Riverside",
  "Trevallyn", "Invermay", "Newnham", "Kings Meadows",
  "Mayfield", "Mowbray", "St Leonards", "Prospect",
  "Norwood", "Summerhill", "Legana", "Hadspen",
];

export default function LauncestonAirbnbCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="airbnb-launceston-heading">
        <Image src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80" alt="Airbnb property in Launceston ready for guests" fill priority className="object-cover opacity-10" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS · Airbnb & Short Stay Cleaning</p>
            <h1 id="airbnb-launceston-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">Airbnb Cleaning<br className="hidden md:block" /> in Launceston</h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">Fast, reliable turnovers for Launceston short stay hosts. Clean, linen change, restock and inspection-ready — every time.</p>
            <p className="text-teal-300 font-semibold text-sm mb-8">Same-day turnovers · Linen change included · Damage reporting · All Launceston suburbs</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=airbnb" className="btn-primary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Same-day turnovers", "Linen change included", "Damage reporting", "Police-checked cleaners", "All Launceston suburbs"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-navy-950/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white" aria-labelledby="airbnb-launceston-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What We Cover</p>
            <h2 id="airbnb-launceston-included-heading" className="section-heading">What&apos;s included in every Launceston Airbnb turnover</h2>
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

      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="airbnb-launceston-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="airbnb-launceston-areas-heading" className="section-heading">Launceston areas we cover for Airbnb cleaning</h2>
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

      <section className="section-padding bg-white" aria-labelledby="airbnb-launceston-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="airbnb-launceston-faq-heading" className="section-heading">Airbnb cleaning Launceston — common questions</h2>
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

      <section className="section-padding bg-teal-500" aria-labelledby="airbnb-launceston-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="airbnb-launceston-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Set up reliable Airbnb cleaning for your Launceston property</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Tell us about your property and guest schedule — we&apos;ll handle the rest.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=airbnb" className="btn-secondary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
