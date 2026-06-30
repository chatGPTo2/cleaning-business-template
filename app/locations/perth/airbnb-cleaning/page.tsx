import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Airbnb Cleaning Perth | Short Stay & Vacation Rental Cleaning | Taspro",
  description:
    "Professional Airbnb and short stay cleaning across all Perth suburbs. Fast turnovers, linen change, restock and inspection-ready presentation. Get a quote today.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/perth/airbnb-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/perth/airbnb-cleaning#service",
  name: "Airbnb Cleaning Perth",
  description: "Professional Airbnb and short stay vacation rental cleaning across Perth WA. Fast turnovers and inspection-ready presentation.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Perth", containedIn: "Western Australia, Australia" },
  url: "https://tasprocleaning.com.au/locations/perth/airbnb-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Perth WA" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Perth", item: "https://tasprocleaning.com.au/locations/perth" },
    { "@type": "ListItem", position: 3, name: "Airbnb Cleaning", item: "https://tasprocleaning.com.au/locations/perth/airbnb-cleaning" },
  ],
};

const FAQS = [
  {
    q: "How does Airbnb cleaning work in Perth?",
    a: "We coordinate with your guest checkout and next check-in times to turn your Perth property around quickly. You provide us with a schedule (or we can link to your calendar) and we handle the rest — clean, linen change, restock and presentation.",
  },
  {
    q: "Can you do same-day turnovers in Perth?",
    a: "Yes. Same-day turnovers between guests are our specialty for Perth short stay hosts. We need at least a few hours notice and work to your specific check-in deadline.",
  },
  {
    q: "Do you change linen during Airbnb cleans in Perth?",
    a: "Yes. Linen change and bed making is included in our Perth Airbnb cleaning service. You can provide your own linen sets or we can discuss a linen hire arrangement.",
  },
  {
    q: "Can you restock supplies during the clean in Perth?",
    a: "Yes. We can restock toiletries, toilet paper, dish soap, and other basics at cost during your Perth Airbnb turnover. Just let us know what you want kept stocked.",
  },
  {
    q: "What Perth suburbs do you cover for Airbnb cleaning?",
    a: "We cover popular Perth short stay areas including Fremantle, Cottesloe, Scarborough, Perth CBD, Northbridge, and all surrounding suburbs. Get a quote to confirm availability for your property.",
  },
  {
    q: "Can I get a regular cleaning schedule for my Perth Airbnb?",
    a: "Yes. We can set up an ongoing arrangement tied to your booking calendar so every turnover is handled automatically. Contact us to discuss how this works.",
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
  { room: "Bedrooms", items: ["Linen stripped and replaced", "Beds made to hotel standard", "All surfaces dusted", "Floors vacuumed", "Wardrobe interiors tidied"] },
  { room: "Bathrooms", items: ["Toilet, shower and sink sanitised", "Mirrors polished", "Fresh towels set out", "Toiletries restocked", "Floor mopped and disinfected"] },
  { room: "Kitchen", items: ["Dishes checked and washed", "Benchtops sanitised", "Stovetop cleaned", "Fridge checked for left items", "Bin emptied and relined"] },
  { room: "Presentation", items: ["Property inspected for damage", "Report sent to host", "Supplies restocked as requested", "Staging and presentation checked", "Entry area tidied"] },
];

const PERTH_AREAS = [
  "Perth CBD", "Northbridge", "Fremantle", "Cottesloe",
  "Scarborough", "Leederville", "Subiaco", "Claremont",
  "East Perth", "West Perth", "Mt Lawley", "Victoria Park",
  "Karrinyup", "Osborne Park", "Belmont", "Burswood",
  "Mandurah", "Rockingham", "Joondalup", "Hillarys",
  "Mosman Park", "Nedlands", "Crawley", "South Perth",
];

export default function PerthAirbnbCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="airbnb-perth-heading">
        <Image
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&q=80"
          alt="Airbnb short stay property in Perth ready for guests"
          fill priority className="object-cover opacity-10" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Perth WA · Airbnb & Short Stay Cleaning</p>
            <h1 id="airbnb-perth-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Airbnb Cleaning<br className="hidden md:block" /> in Perth
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">
              Fast, reliable turnovers for Perth short stay hosts. Clean, linen change, restock and inspection-ready — every time.
            </p>
            <p className="text-teal-300 font-semibold text-sm mb-8">
              Same-day turnovers · Linen change included · Damage reporting · All Perth suburbs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=airbnb" className="btn-primary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Same-day turnovers", "Linen change included", "Damage reporting", "Police-checked cleaners", "All Perth suburbs"].map((t) => (
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
      <section className="section-padding bg-white" aria-labelledby="airbnb-perth-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">What We Cover</p>
            <h2 id="airbnb-perth-included-heading" className="section-heading">What&apos;s included in every Perth Airbnb turnover</h2>
            <p className="section-subheading max-w-2xl mx-auto">We treat your property like a hotel. Every turnover is thorough, fast and documented.</p>
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

      {/* Areas */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="airbnb-perth-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="airbnb-perth-areas-heading" className="section-heading">Perth areas we cover for Airbnb cleaning</h2>
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
      <section className="section-padding bg-white" aria-labelledby="airbnb-perth-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="airbnb-perth-faq-heading" className="section-heading">Airbnb cleaning Perth — common questions</h2>
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

      {/* Related */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="airbnb-perth-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also useful</p>
            <h2 id="airbnb-perth-related-heading" className="section-heading">More Perth cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/perth/home-cleaning", title: "Home Cleaning Perth", desc: "Regular residential cleans for Perth homes." },
              { href: "/services/airbnb-cleaning", title: "Airbnb Cleaning Australia-wide", desc: "Short stay cleaning also available in Launceston TAS." },
              { href: "/locations/perth", title: "All Perth Services", desc: "View all cleaning services available across Perth WA." },
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
      <section className="section-padding bg-teal-500" aria-labelledby="airbnb-perth-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="airbnb-perth-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Set up reliable Airbnb cleaning for your Perth property</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Tell us about your property and guest schedule — we&apos;ll handle the rest.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=airbnb" className="btn-secondary text-base px-8 py-4">Get a Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
