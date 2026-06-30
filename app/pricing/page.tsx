import type { Metadata } from "next";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Cleaning Prices & Rates | Taspro Cleaning Solutions",
  description:
    "Transparent cleaning prices for Perth, Launceston, Melbourne and Sydney. See our bedroom/bathroom pricing matrix, add-on prices, and recurring clean discounts.",
  alternates: { canonical: "https://tasprocleaning.com.au/pricing" },
};

const PRICING_FAQS = [
  {
    q: "What determines the price of my clean?",
    a: "Price is primarily based on the number of bedrooms and bathrooms. Each additional bathroom adds to the base price. Optional add-ons (inside oven, fridge, windows, etc.) are individually priced and shown in your quote.",
  },
  {
    q: "Are end-of-lease cleans more expensive than regular cleans?",
    a: "Yes. End-of-lease (bond) cleans carry a 25% surcharge over the standard price. This reflects the additional time and attention required to meet real estate agent checklists and guarantee your bond back. End-of-lease cleaning is available in Perth WA and Launceston TAS.",
  },
  {
    q: "Why is a deep clean more expensive?",
    a: "Deep cleans go significantly further than a regular clean — covering areas not typically included like inside ovens and fridges, behind appliances, ceiling fans, window tracks, and carpet steam cleaning. They attract a 15% surcharge over the base price. Deep cleaning is available in Perth WA and Launceston TAS.",
  },
  {
    q: "How do recurring clean discounts work?",
    a: "Choose a recurring schedule when booking and the discount is automatically applied. Weekly cleans save 15%, fortnightly 10%, and monthly 5%. There's no lock-in — you can pause or cancel anytime.",
  },
  {
    q: "Do your prices include GST?",
    a: "Yes. All prices shown on this page and in your quote include GST. There are no hidden fees or extras added at checkout.",
  },
  {
    q: "How do I get an exact price?",
    a: "Use our online quote wizard — select your service type, property size, add-ons, and frequency. Your total price is shown in real time, before you commit to anything.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Pricing", item: "https://tasprocleaning.com.au/pricing" },
  ],
};

/* Pricing matrix: rows = bedrooms, cols = bathrooms */
const PRICE_MATRIX = [
  { bedrooms: "Studio", b1: 120, b2: 145, b3: 165, b4: 185 },
  { bedrooms: "1 Bedroom", b1: 140, b2: 165, b3: 185, b4: 210 },
  { bedrooms: "2 Bedrooms", b1: 175, b2: 200, b3: 225, b4: 250 },
  { bedrooms: "3 Bedrooms", b1: 210, b2: 240, b3: 265, b4: 295 },
  { bedrooms: "4 Bedrooms", b1: 260, b2: 290, b3: 320, b4: 350 },
  { bedrooms: "5+ Bedrooms", b1: 310, b2: 345, b3: 375, b4: 415 },
];

const ADDONS = [
  { label: "Inside Oven", price: 45, icon: "🔥", description: "Interior walls, trays and racks" },
  { label: "Inside Fridge", price: 35, icon: "🧊", description: "Full interior clean and wipe-down" },
  { label: "Interior Windows", price: 40, icon: "🪟", description: "Glass, tracks, sills + 1 set of glass doors" },
  { label: "Balcony / Deck", price: 30, icon: "🌿", description: "Per area — swept and wiped" },
  { label: "Garage", price: 50, icon: "🏠", description: "Swept, surfaces wiped" },
  { label: "Carpet Steam Clean", price: 80, icon: "🧹", description: "Hot water extraction clean" },
  { label: "Wall Washing", price: 60, icon: "🪣", description: "Full wall wash throughout home" },
  { label: "Extra Glass Door Set", price: 25, icon: "🚪", description: "Per additional set beyond included" },
];

const FREQUENCIES = [
  { label: "One-off", discount: 0, colour: "bg-navy-950/[0.04] border-navy-950/10" },
  { label: "Monthly", discount: 5, colour: "bg-teal-50 border-teal-200" },
  { label: "Fortnightly", discount: 10, colour: "bg-teal-50 border-teal-300" },
  { label: "Weekly", discount: 15, colour: "bg-teal-500/10 border-teal-400", highlight: true },
];

export default function PricingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section className="pt-40 pb-16 bg-navy-950" aria-labelledby="pricing-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Transparent Pricing</p>
            <h1 id="pricing-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Simple, honest pricing
            </h1>
            <p className="text-white/65 text-lg max-w-xl mx-auto">
              No hidden fees. See exactly what you&apos;ll pay before you book. Prices in AUD.
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* Pricing matrix */}
      <section className="section-padding bg-white" aria-labelledby="matrix-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Base Pricing</p>
            <h2 id="matrix-heading" className="section-heading">Home &amp; standard clean rates</h2>
            <p className="section-subheading max-w-lg mx-auto">
              Prices are based on number of bedrooms and bathrooms. End-of-lease and deep cleans attract a small surcharge — you&apos;ll see this in your instant quote.
            </p>
          </AnimateInView>

          <AnimateInView variant="slide-up" delay={0.1}>
            <div className="overflow-x-auto rounded-2xl border border-navy-950/10 shadow-card">
              <table className="w-full text-sm" aria-label="Cleaning price matrix by bedrooms and bathrooms">
                <thead>
                  <tr className="bg-navy-950 text-white">
                    <th scope="col" className="text-left px-5 py-4 font-semibold rounded-tl-2xl">Property</th>
                    <th scope="col" className="text-center px-5 py-4 font-semibold">1 Bathroom</th>
                    <th scope="col" className="text-center px-5 py-4 font-semibold">2 Bathrooms</th>
                    <th scope="col" className="text-center px-5 py-4 font-semibold">3 Bathrooms</th>
                    <th scope="col" className="text-center px-5 py-4 font-semibold rounded-tr-2xl">4+ Bathrooms</th>
                  </tr>
                </thead>
                <tbody>
                  {PRICE_MATRIX.map((row, i) => (
                    <tr
                      key={row.bedrooms}
                      className={i % 2 === 0 ? "bg-white" : "bg-navy-950/[0.02]"}
                    >
                      <td className="px-5 py-4 font-semibold text-navy-950">{row.bedrooms}</td>
                      {[row.b1, row.b2, row.b3, row.b4].map((price, j) => (
                        <td key={j} className="text-center px-5 py-4 text-navy-950/80 font-medium">
                          ${price}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-navy-950/40 text-xs mt-3 text-center">
              * End-of-lease cleans +25% · Deep cleans +15% · All prices include GST
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="addons-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Optional Extras</p>
            <h2 id="addons-heading" className="section-heading">Add-on services</h2>
            <p className="section-subheading max-w-lg mx-auto">
              Customise your clean with any of these add-ons. They&apos;re shown in your live price during booking.
            </p>
          </AnimateInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ADDONS.map((addon, i) => (
              <AnimateInView key={addon.label} variant="slide-up" delay={i * 0.06}>
                <div className="bg-white rounded-2xl p-5 border border-navy-950/8 shadow-card h-full">
                  <span className="text-2xl block mb-3" aria-hidden="true">{addon.icon}</span>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-navy-950 text-sm">{addon.label}</h3>
                    <span className="text-teal-600 font-bold text-sm shrink-0">+${addon.price}</span>
                  </div>
                  <p className="text-navy-950/50 text-xs leading-relaxed">{addon.description}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Recurring discounts */}
      <section className="section-padding bg-white" aria-labelledby="frequency-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Recurring Discounts</p>
            <h2 id="frequency-heading" className="section-heading">Save more, clean more often</h2>
            <p className="section-subheading max-w-lg mx-auto">
              Set up a recurring schedule and we automatically apply your discount every clean.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {FREQUENCIES.map((f, i) => (
              <AnimateInView key={f.label} variant="slide-up" delay={i * 0.07}>
                <div className={`rounded-2xl border-2 p-5 text-center ${f.colour} ${f.highlight ? "ring-2 ring-teal-500" : ""}`}>
                  {f.highlight && (
                    <span className="inline-block bg-teal-500 text-navy-950 text-xs font-bold px-2 py-0.5 rounded-full mb-2">Best Value</span>
                  )}
                  <p className="font-display font-bold text-navy-950 text-lg">{f.label}</p>
                  {f.discount > 0 ? (
                    <p className="text-green-600 font-bold text-2xl mt-1">{f.discount}% off</p>
                  ) : (
                    <p className="text-navy-950/40 text-sm mt-1">No discount</p>
                  )}
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* How pricing works */}
      <section className="section-padding bg-white" aria-labelledby="how-pricing-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">How It Works</p>
            <h2 id="how-pricing-heading" className="section-heading">How our pricing is calculated</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Choose your service",
                desc: "Select your service type. Home cleaning, commercial and NDIS are available in all cities. End-of-lease and deep cleaning are available in Perth WA and Launceston TAS.",
                links: [
                  { href: "/services/home-cleaning", label: "Home Cleaning" },
                  { href: "/services/end-of-lease", label: "End of Lease" },
                  { href: "/services/deep-clean", label: "Deep Clean" },
                ],
              },
              {
                step: "2",
                title: "Select property size",
                desc: "Pick your number of bedrooms and bathrooms. The matrix above shows base prices for every combination.",
                links: [],
              },
              {
                step: "3",
                title: "Add extras & frequency",
                desc: "Toggle any add-ons you need (oven, fridge, windows, etc.) and choose a frequency to unlock your recurring discount.",
                links: [],
              },
            ].map((item, i) => (
              <AnimateInView key={item.step} variant="slide-up" delay={i * 0.08}>
                <div className="bg-navy-950/[0.03] rounded-2xl p-6 border border-navy-950/8 h-full">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-navy-950 font-bold text-lg mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-display font-bold text-navy-950 text-lg mb-2">{item.title}</h3>
                  <p className="text-navy-950/60 text-sm leading-relaxed mb-3">{item.desc}</p>
                  {item.links.length > 0 && (
                    <ul className="space-y-1">
                      {item.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="text-teal-600 text-sm font-medium hover:text-teal-700 transition-colors flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Operate */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="pricing-locations-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Availability</p>
            <h2 id="pricing-locations-heading" className="section-heading">Where our prices apply</h2>
            <p className="section-subheading max-w-xl mx-auto">
              Pricing above applies across all four cities. Note: end-of-lease and deep cleaning are available in Perth WA and Launceston TAS.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/locations/perth", icon: "🌅", city: "Perth", state: "WA", services: ["Home Cleaning", "End of Lease", "Deep Clean", "Commercial", "NDIS"] },
              { href: "/locations/melbourne", icon: "🏙️", city: "Melbourne", state: "VIC", services: ["Home Cleaning", "Commercial", "NDIS"] },
              { href: "/locations/sydney", icon: "🌉", city: "Sydney", state: "NSW", services: ["Home Cleaning", "Commercial", "NDIS"] },
              { href: "/locations/launceston", icon: "🏔️", city: "Launceston", state: "TAS", services: ["Home Cleaning", "End of Lease", "Deep Clean", "Commercial", "NDIS"] },
            ].map((loc, i) => (
              <AnimateInView key={loc.href} variant="slide-up" delay={i * 0.07}>
                <Link href={loc.href} className="group flex flex-col p-5 bg-white rounded-2xl border border-navy-950/8 card-hover h-full">
                  <span className="text-3xl mb-3" aria-hidden="true">{loc.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-2 group-hover:text-teal-700 transition-colors">{loc.city}, {loc.state}</p>
                  <ul className="space-y-1 flex-1">
                    {loc.services.map((s) => (
                      <li key={s} className="text-navy-950/55 text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" aria-hidden="true" />
                        {s}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-4 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View location <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="pricing-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="pricing-faq-heading" className="section-heading">Pricing questions answered</h2>
          </AnimateInView>
          <div className="space-y-4">
            {PRICING_FAQS.map((faq, i) => (
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

      {/* CTA */}
      <section className="bg-teal-500 py-14">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 className="font-display text-3xl font-bold text-navy-950 mb-3">See your exact price now</h2>
            <p className="text-navy-950/70 max-w-md mx-auto mb-6">
              Use our quote wizard — it calculates your price live as you select options.
            </p>
            <Link href="/quote" className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold px-8 py-4 rounded-xl hover:bg-navy-900 hover:-translate-y-0.5 transition-all duration-200">
              Get a Free Instant Quote
            </Link>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
