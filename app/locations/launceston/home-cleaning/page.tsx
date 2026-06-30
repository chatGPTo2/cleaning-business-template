import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Home Cleaning Launceston | Local Cleaners TAS | Taspro",
  description:
    "Professional home cleaning across Launceston and surrounding TAS suburbs. One-off or recurring weekly, fortnightly and monthly cleans. Police-checked, fully insured. Get an instant quote.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/launceston/home-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/launceston/home-cleaning#service",
  name: "Home Cleaning Launceston",
  description: "Professional residential home cleaning across Launceston and surrounding TAS areas. One-off and recurring cleans with a 100% satisfaction guarantee.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Launceston", containedIn: "Tasmania, Australia" },
  url: "https://tasprocleaning.com.au/locations/launceston/home-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Launceston TAS" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Launceston", item: "https://tasprocleaning.com.au/locations/launceston" },
    { "@type": "ListItem", position: 3, name: "Home Cleaning", item: "https://tasprocleaning.com.au/locations/launceston/home-cleaning" },
  ],
};

const FAQS = [
  {
    q: "How much does home cleaning cost in Launceston?",
    a: "Our Launceston home cleaning prices are based on the number of bedrooms and bathrooms. A standard 2-bedroom, 1-bathroom home typically starts from $149. Get an exact fixed price using our online quote tool — no phone calls needed.",
  },
  {
    q: "Do you offer regular home cleaning in Launceston?",
    a: "Yes. We offer weekly, fortnightly and monthly recurring home cleans across Launceston and surrounding suburbs. Regular clients get priority scheduling and a consistent cleaner where possible.",
  },
  {
    q: "Are your Launceston cleaners police-checked?",
    a: "Yes. Every Taspro cleaner in Launceston is police-checked and we carry full public liability insurance. You can trust us in your home.",
  },
  {
    q: "What areas do you cover for home cleaning in Launceston?",
    a: "We cover Launceston CBD and all surrounding suburbs including Newstead, Newnham, Kings Meadows, Riverside, Trevallyn, Mayfield, Mowbray, South Launceston, and beyond. Use our quote tool to confirm availability.",
  },
  {
    q: "What's included in a standard home clean in Launceston?",
    a: "Every home clean includes kitchen benchtops and sink, stovetop, bathrooms scrubbed and disinfected, all floors vacuumed and mopped, bedrooms dusted, living areas cleaned, and bins emptied. Extras like inside oven, inside fridge and windows are available as add-ons.",
  },
  {
    q: "Can I get a one-off clean in Launceston?",
    a: "Absolutely. We do one-off home cleans — pre-party, post-party, spring clean, before guests arrive, or just when life gets busy. No commitment required.",
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
  { room: "Kitchen", items: ["Benchtops wiped and sanitised", "Sink and taps scrubbed", "Stovetop and splashback cleaned", "Cupboard exteriors wiped", "Microwave exterior", "Bin emptied and relined", "Floor vacuumed and mopped"] },
  { room: "Bathrooms", items: ["Shower screens and tiles scrubbed", "Toilet bowl, seat and exterior", "Vanity, mirror and sink", "Taps and fixtures polished", "Floor scrubbed and mopped"] },
  { room: "Bedrooms", items: ["All surfaces dusted", "Skirting boards wiped", "Mirrors cleaned", "Wardrobe exteriors wiped", "Floor vacuumed or mopped"] },
  { room: "Living Areas", items: ["All surfaces dusted", "Cushions straightened", "Window sills wiped", "Light switches cleaned", "Floor vacuumed and mopped"] },
];

const LAUNCESTON_AREAS = [
  "Launceston CBD", "Newstead", "Invermay", "Newnham",
  "South Launceston", "Riverside", "Trevallyn", "Mayfield",
  "Mowbray", "Kings Meadows", "Youngtown", "St Leonards",
  "Summerhill", "Rocherlea", "Norwood", "Prospect",
  "Legana", "Hadspen", "Blackstone Heights", "Ravenswood",
];

export default function LauncestonHomeCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="home-launceston-heading">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="Professional home cleaner in a Launceston home"
          fill priority className="object-cover opacity-10" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Launceston TAS · Residential Cleaning</p>
            <h1 id="home-launceston-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Home Cleaning<br className="hidden md:block" /> in Launceston
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">
              One-off or recurring home cleaning across Launceston and surrounding TAS suburbs. Police-checked cleaners, 100% satisfaction guarantee, fixed pricing.
            </p>
            <p className="text-teal-300 font-semibold text-sm mb-8">
              Police-checked · Fully insured · 100% satisfaction guarantee · All Launceston suburbs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=home-cleaning" className="btn-primary text-base px-8 py-4">Get an Instant Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["100% satisfaction guarantee", "Police-checked cleaners", "Fully insured", "Fixed pricing — no surprises", "All Launceston suburbs"].map((t) => (
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
      <section className="section-padding bg-white" aria-labelledby="home-launceston-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Checklist</p>
            <h2 id="home-launceston-included-heading" className="section-heading">What&apos;s included in every Launceston home clean</h2>
            <p className="section-subheading max-w-2xl mx-auto">Every clean covers the essentials. Add extras like inside oven, inside fridge, or windows at checkout.</p>
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="home-launceston-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="home-launceston-areas-heading" className="section-heading">Launceston suburbs we cover</h2>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {LAUNCESTON_AREAS.map((area, i) => (
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
      <section className="section-padding bg-white" aria-labelledby="home-launceston-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="home-launceston-faq-heading" className="section-heading">Home cleaning Launceston — common questions</h2>
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="home-launceston-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also useful</p>
            <h2 id="home-launceston-related-heading" className="section-heading">More Launceston cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/launceston/end-of-lease-cleaning", title: "End of Lease Cleaning Launceston", desc: "Bond-back guaranteed vacate cleans in Launceston TAS." },
              { href: "/locations/launceston/deep-cleaning", title: "Deep Cleaning Launceston", desc: "Top-to-bottom intensive clean for move-ins and spring cleans." },
              { href: "/locations/launceston", title: "All Launceston Services", desc: "View all cleaning services available in Launceston TAS." },
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
      <section className="section-padding bg-teal-500" aria-labelledby="home-launceston-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="home-launceston-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Book your Launceston home clean today</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Fixed price, no surprises. Get your instant quote in seconds.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=launceston&service=home-cleaning" className="btn-secondary text-base px-8 py-4">Get an Instant Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
