import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Deep Cleaning Services in Sydney, Melbourne, Perth & Launceston | Taspro",
  description:
    "Deep cleaning services in Sydney NSW, Melbourne VIC, Perth WA & Launceston TAS. Perfect for homes that haven't been cleaned in a while, pre-sale cleans, post-renovation, and move-ins.",
  alternates: { canonical: "https://tasprocleaning.com.au/services/deep-clean" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/services/deep-clean#service",
  name: "Deep Cleaning",
  description: "Thorough top-to-bottom deep cleaning for homes in Sydney, Melbourne, Perth and Launceston. Perfect for pre-sale, post-renovation, and seasonal spring cleans.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: ["Perth WA", "Launceston TAS"],
  serviceType: "Deep Cleaning",
  url: "https://tasprocleaning.com.au/services/deep-clean",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "One-off and recurring deep cleaning packages. Pricing based on property size.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://tasprocleaning.com.au/services/deep-clean" },
    { "@type": "ListItem", position: 3, name: "Deep Cleaning", item: "https://tasprocleaning.com.au/services/deep-clean" },
  ],
};

const USE_CASES = [
  { icon: "🏡", label: "Homes not cleaned in a while", description: "Get back to a pristine baseline with a thorough top-to-bottom reset." },
  { icon: "🏷️", label: "Pre-sale / auction prep", description: "Make the best impression on buyers with a sparkling clean property." },
  { icon: "🔨", label: "Post-renovation clean", description: "Remove dust, debris and residue from building work throughout the home." },
  { icon: "📦", label: "Moving in clean", description: "Start fresh in your new home — cleaned before you unpack a single box." },
  { icon: "🌸", label: "Seasonal spring clean", description: "A full yearly reset to refresh every surface, nook and cranny." },
  { icon: "🎉", label: "Post-event clean", description: "After parties or large gatherings, we restore your home to its best." },
];

const INCLUSIONS = [
  "Everything in a standard home clean",
  "Inside oven — racks, trays, walls",
  "Inside fridge & freezer",
  "Interior windows, tracks & sills",
  "Detailed skirting boards & door frames",
  "Ceiling fans & light fixtures cleaned",
  "Inside kitchen and bathroom cupboards",
  "Behind and underneath appliances",
  "Detailed grout scrubbing",
  "Wall spot cleaning",
  "Wardrobe interiors",
];

export default function DeepCleanPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {/* Hero */}
      <section
        className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden"
        aria-labelledby="dc-heading"
      >
        <Image
          src="https://images.unsplash.com/photo-1527515637462-cff94edd5dcf?w=1920&q=80"
          alt="Professional cleaner doing detailed deep cleaning work"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Deep Clean</p>
            <h1 id="dc-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Deep Cleaning Services —<br className="hidden md:block" /> Top to Bottom Refresh
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              When a regular clean isn&apos;t enough. Our deep clean reaches every corner, crevice and surface for a complete reset.
            </p>
            <Link href="/quote?service=deep-clean" className="btn-primary text-base px-8 py-4">
              Book a Deep Clean
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Service availability notice */}
      <section className="bg-navy-950/[0.04] border-b border-navy-950/10" aria-label="Service availability">
        <div className="container-custom py-5">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-navy-950/75 text-sm leading-relaxed">
              <strong className="font-semibold text-navy-950">Available in Perth WA and Launceston TAS.</strong> Deep cleaning is not currently available in Melbourne or Sydney. Customers in those cities can book <Link href="/services/home-cleaning" className="text-teal-600 underline underline-offset-2 font-medium hover:text-teal-700 transition-colors">recurring home cleaning</Link> instead.
            </p>
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="section-padding bg-white" aria-labelledby="dc-usecases-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Perfect For</p>
            <h2 id="dc-usecases-heading" className="section-heading">When is a deep clean right for you?</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {USE_CASES.map((uc, i) => (
              <AnimateInView key={uc.label} variant="slide-up" delay={i * 0.07}>
                <div className="p-6 bg-navy-950/[0.03] rounded-2xl h-full">
                  <span className="text-3xl block mb-3" aria-hidden="true">{uc.icon}</span>
                  <h3 className="font-semibold text-navy-950 mb-2">{uc.label}</h3>
                  <p className="text-navy-950/60 text-sm leading-relaxed">{uc.description}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Inclusions */}
      <section className="section-padding bg-navy-950" aria-labelledby="dc-inclusions-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimateInView variant="slide-right">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80"
                  alt="Detailed professional cleaning of kitchen oven"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimateInView>
            <AnimateInView variant="slide-left">
              <p className="text-white font-semibold text-sm uppercase tracking-widest mb-3">What&apos;s Included</p>
              <h2 id="dc-inclusions-heading" className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-8">
                We don&apos;t miss a thing
              </h2>
              <ul className="space-y-3" aria-label="Deep clean inclusions">
                {INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm">
                    <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/quote?service=deep-clean" className="btn-primary">
                  Get a Deep Clean Quote
                </Link>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section-padding bg-white" aria-labelledby="dc-location-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Where We Clean</p>
            <h2 id="dc-location-heading" className="section-heading">Deep cleaning in Perth &amp; Launceston</h2>
            <p className="section-subheading max-w-xl mx-auto">
              Our deep clean service is available in Perth WA and Launceston TAS. If you&apos;re in Melbourne or Sydney, our{" "}
              <Link href="/services/home-cleaning" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
                recurring home cleaning
              </Link>{" "}
              service is available in your city.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-3xl mx-auto">
            <AnimateInView variant="slide-up" delay={0.07}>
              <Link href="/locations/perth" className="group flex flex-col p-6 bg-teal-500/[0.08] rounded-2xl border-2 border-teal-500/30 card-hover h-full">
                <span className="text-3xl mb-3" aria-hidden="true">🌅</span>
                <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">Perth, WA</p>
                <p className="text-navy-950/55 text-xs leading-relaxed flex-1">Deep cleans, end-of-lease, recurring & more</p>
                <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                  View Perth services <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </AnimateInView>
            <AnimateInView variant="slide-up" delay={0.14}>
              <Link href="/locations/launceston" className="group flex flex-col p-6 bg-teal-500/[0.08] rounded-2xl border-2 border-teal-500/30 card-hover h-full">
                <span className="text-3xl mb-3" aria-hidden="true">🏔️</span>
                <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">Launceston, TAS</p>
                <p className="text-navy-950/55 text-xs leading-relaxed flex-1">Deep cleans, end-of-lease, recurring & more</p>
                <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                  View Launceston services <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </AnimateInView>
            <AnimateInView variant="slide-up" delay={0.21}>
              <Link href="/pricing" className="group flex flex-col p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full">
                <span className="text-3xl mb-3" aria-hidden="true">💲</span>
                <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">Pricing guide</p>
                <p className="text-navy-950/55 text-xs leading-relaxed flex-1">See exact prices — deep cleans attract a 15% surcharge over the base rate</p>
                <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                  See pricing <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </span>
              </Link>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="deep-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Available</p>
            <h2 id="deep-related-heading" className="section-heading">Other cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/services/home-cleaning", icon: "🏠", title: "Home Cleaning", desc: "Regular weekly, fortnightly or monthly residential cleans." },
              { href: "/services/end-of-lease", icon: "🔑", title: "End of Lease", desc: "Bond-back guaranteed. We follow the agent checklist." },
              { href: "/services/commercial", icon: "🏢", title: "Commercial Cleaning", desc: "Offices, retail, gyms and medical centres." },
              { href: "/services/ndis", icon: "💙", title: "NDIS Cleaning", desc: "NDIS cleaning services across Tasmania." },
            ].map((s, i) => (
              <AnimateInView key={s.href} variant="slide-up" delay={i * 0.07}>
                <Link href={s.href} className="group flex flex-col p-5 bg-white rounded-2xl border border-navy-950/8 card-hover h-full">
                  <span className="text-3xl mb-3" aria-hidden="true">{s.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{s.title}</p>
                  <p className="text-navy-950/55 text-xs leading-relaxed flex-1">{s.desc}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    Learn more <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
