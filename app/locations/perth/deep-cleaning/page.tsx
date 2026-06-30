import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Deep Cleaning Perth | Top-to-Bottom Intensive Clean | Taspro",
  description:
    "Professional deep cleaning across all Perth suburbs. Move-in, pre-sale, spring clean and post-renovation. Police-checked, fully insured. Get an instant quote online.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/perth/deep-cleaning" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/perth/deep-cleaning#service",
  name: "Deep Cleaning Perth",
  description: "Top-to-bottom intensive deep cleaning across Perth WA. Move-in, pre-sale, spring clean and post-renovation cleans.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Perth", containedIn: "Western Australia, Australia" },
  url: "https://tasprocleaning.com.au/locations/perth/deep-cleaning",
  offers: { "@type": "Offer", availability: "https://schema.org/InStock", areaServed: "Perth WA" },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Perth", item: "https://tasprocleaning.com.au/locations/perth" },
    { "@type": "ListItem", position: 3, name: "Deep Cleaning", item: "https://tasprocleaning.com.au/locations/perth/deep-cleaning" },
  ],
};

const FAQS = [
  {
    q: "How much does a deep clean cost in Perth?",
    a: "Deep cleaning in Perth is priced based on the number of bedrooms and bathrooms — the same as our standard clean but with a premium added for the extra time and detail required. Get an exact fixed price instantly using our online quote tool.",
  },
  {
    q: "What is the difference between a regular clean and a deep clean in Perth?",
    a: "A deep clean goes significantly further than a standard home clean. It includes inside the oven, inside the fridge, inside cupboards, behind appliances, grout scrubbing, window tracks, and all the areas that get skipped in a regular clean.",
  },
  {
    q: "How long does a deep clean take in Perth?",
    a: "A deep clean typically takes 2–3 times longer than a standard clean. A 3-bedroom, 2-bathroom home in Perth usually takes 4–6 hours depending on the condition of the property.",
  },
  {
    q: "Do I need to be home during the deep clean in Perth?",
    a: "No. Many Perth customers leave a key or use a lockbox. As long as we have access, you don't need to be home. We'll send you a confirmation when we're done.",
  },
  {
    q: "Is a deep clean suitable before selling my Perth property?",
    a: "Yes — a pre-sale deep clean is one of the most popular reasons Perth homeowners book with us. A thoroughly cleaned home photographs better and makes a stronger impression at open homes.",
  },
  {
    q: "What Perth suburbs do you cover for deep cleaning?",
    a: "We cover all of Greater Perth for deep cleaning — north, south, east and west. Use our quote tool or contact us to confirm availability for your suburb.",
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
  { room: "Kitchen (deep)", items: ["Oven interior, racks and grills degreased", "Range hood and filters", "Inside fridge and freezer", "Inside all cupboards and drawers", "Stovetop, splashback and benchtops", "Behind and under appliances"] },
  { room: "Bathrooms (deep)", items: ["Grout scrubbed", "Shower screens de-scaled", "Inside all cabinets", "Exhaust fan cleaned", "All tiles scrubbed", "Taps and fixtures polished"] },
  { room: "Bedrooms & Living (deep)", items: ["Inside all wardrobes and drawers", "Behind furniture", "Skirting boards scrubbed", "Window sills and tracks", "Light fittings wiped", "All surfaces deep dusted"] },
  { room: "Throughout", items: ["All windows interior washed", "Blinds and venetians wiped", "Wall marks removed", "Cobwebs removed", "Air vents dusted", "All floors vacuumed and mopped"] },
];

const PERTH_AREAS = [
  "Perth CBD", "East Perth", "West Perth", "Northbridge",
  "Subiaco", "Fremantle", "Cottesloe", "Claremont",
  "Leederville", "Mt Lawley", "Scarborough", "Joondalup",
  "Midland", "Cannington", "Canning Vale", "Armadale",
  "Osborne Park", "Balga", "Victoria Park", "Bentley",
  "Rockingham", "Mandurah", "Karrinyup", "Belmont",
];

export default function PerthDeepCleaningPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="deep-perth-heading">
        <Image
          src="https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1920&q=80"
          alt="Professional deep cleaner scrubbing a Perth kitchen"
          fill priority className="object-cover opacity-10" sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Perth WA · Deep Cleaning</p>
            <h1 id="deep-perth-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Deep Cleaning<br className="hidden md:block" /> in Perth
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-3">
              Top-to-bottom intensive cleaning across all Perth suburbs. Move-in, pre-sale, spring clean or post-renovation — we go where regular cleans don&apos;t.
            </p>
            <p className="text-teal-300 font-semibold text-sm mb-8">
              Police-checked · Fully insured · Fixed pricing · All Perth suburbs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=deep-clean" className="btn-primary text-base px-8 py-4">Get an Instant Quote</Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-teal-500 py-5" aria-label="Trust signals">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-2 text-sm font-semibold text-navy-950">
            {["Inside oven & fridge included", "Police-checked cleaners", "Fully insured", "Fixed pricing", "All Perth suburbs covered"].map((t) => (
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
      <section className="section-padding bg-white" aria-labelledby="deep-perth-included-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Checklist</p>
            <h2 id="deep-perth-included-heading" className="section-heading">What&apos;s included in a Perth deep clean</h2>
            <p className="section-subheading max-w-2xl mx-auto">We go where regular cleans don&apos;t. Inside ovens, inside fridges, inside cupboards, grout, window tracks — all of it.</p>
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

      {/* Use cases */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="deep-perth-uses-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">When to Book</p>
            <h2 id="deep-perth-uses-heading" className="section-heading">Popular reasons to book a deep clean in Perth</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              { title: "Moving into a new home", desc: "Start fresh in your new Perth home — even if it looks clean, a deep clean before you move in makes all the difference." },
              { title: "Pre-sale / before listing", desc: "A deep-cleaned home photographs better and makes a stronger impression at open homes across Perth." },
              { title: "Spring clean", desc: "Once a year, get into all the corners. Our Perth spring clean tackles everything that builds up over months." },
              { title: "Post-renovation", desc: "Construction dust gets everywhere. We'll clean your Perth home top-to-bottom after tradespeople have finished." },
              { title: "After a long rental", desc: "If the previous tenants weren't great with cleaning, a deep clean resets the property." },
              { title: "Before or after a big event", desc: "Hosting something at your Perth home? We'll get it spotless before or clean up after." },
            ].map((c, i) => (
              <AnimateInView key={c.title} variant="slide-up" delay={i * 0.07}>
                <div className="bg-white rounded-2xl border border-navy-950/8 p-5">
                  <p className="font-semibold text-navy-950 text-sm mb-1">{c.title}</p>
                  <p className="text-navy-950/60 text-xs leading-relaxed">{c.desc}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding bg-white" aria-labelledby="deep-perth-areas-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="deep-perth-areas-heading" className="section-heading">Perth suburbs we cover for deep cleaning</h2>
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
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="deep-perth-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="deep-perth-faq-heading" className="section-heading">Deep cleaning Perth — common questions</h2>
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
      <section className="section-padding bg-white" aria-labelledby="deep-perth-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also useful</p>
            <h2 id="deep-perth-related-heading" className="section-heading">More Perth cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
            {[
              { href: "/locations/perth/end-of-lease-cleaning", title: "End of Lease Cleaning Perth", desc: "Bond-back guaranteed vacate cleans across Perth." },
              { href: "/locations/perth/home-cleaning", title: "Home Cleaning Perth", desc: "Recurring home cleaning for Perth homes." },
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
      <section className="section-padding bg-teal-500" aria-labelledby="deep-perth-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="deep-perth-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">Book your Perth deep clean today</h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">Fixed price, instant quote. No phone calls needed.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote?city=perth&service=deep-clean" className="btn-secondary text-base px-8 py-4">Get an Instant Quote</Link>
              <a href="tel:+61870816811" className="btn-secondary text-base px-8 py-4">Call (08) 7081 6811</a>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
