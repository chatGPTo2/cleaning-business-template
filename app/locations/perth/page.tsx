import type { Metadata } from "next";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Cleaning Services Perth | Home, Office & Bond Cleaning | Taspro",
  description:
    "Taspro Cleaning Solutions — Perth's trusted cleaning service. Home cleaning, end of lease, commercial, NDIS & deep cleaning across all Perth suburbs. Police-checked, insured, 5-star rated. Book online or call (08) 7081 6811.",
  alternates: { canonical: "https://tasprocleaning.com.au/locations/perth" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/locations/perth#service",
  name: "Cleaning Services Perth",
  description: "Professional home, office and end-of-lease cleaning across Perth WA.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: { "@type": "City", name: "Perth", containedIn: "Western Australia, Australia" },
  url: "https://tasprocleaning.com.au/locations/perth",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Locations", item: "https://tasprocleaning.com.au/locations/perth" },
    { "@type": "ListItem", position: 3, name: "Perth", item: "https://tasprocleaning.com.au/locations/perth" },
  ],
};

const PERTH_SUBURBS = [
  "Perth CBD", "East Perth", "West Perth", "Northbridge", "Leederville",
  "Subiaco", "Claremont", "Cottesloe", "Fremantle", "Victoria Park",
  "Bentley", "Cannington", "Canning Vale", "Gosnells", "Armadale",
  "Thornlie", "Joondalup", "Wanneroo", "Scarborough", "Karrinyup",
  "Midland", "Bassendean", "Rockingham", "Mandurah", "Balga",
  "Mirrabooka", "Belmont", "Bayswater", "Morley", "Mount Lawley",
];

const SERVICES = [
  { href: "/services/home-cleaning", icon: "🏠", title: "Home Cleaning", desc: "One-off or recurring weekly, fortnightly and monthly cleans. 100% satisfaction guarantee." },
  { href: "/locations/perth/end-of-lease-cleaning", icon: "🔑", title: "End of Lease Cleaning", desc: "Bond-back guarantee. REIWA-standard checklist, every time." },
  { href: "/services/commercial", icon: "🏢", title: "Commercial Cleaning", desc: "Offices, retail, gyms and medical centres across Greater Perth." },
  { href: "/services/deep-clean", icon: "✨", title: "Deep Cleaning", desc: "Top-to-bottom deep clean — perfect for move-ins, pre-sale and spring cleans." },
  { href: "/services/ndis", icon: "💙", title: "NDIS Cleaning", desc: "NDIS cleaning services for participants across Perth — plan, agency and self-managed." },
];

const REVIEWS = [
  {
    author: "Jannina Santos",
    service: "Commercial Cleaning",
    body: "Our office has never looked better! These guys are thorough and professional. Highly recommended!",
    rating: 5,
  },
  {
    author: "Terry Youd",
    service: "Deep Clean",
    body: "Taspro are awesome. Prompt impeccable work. Completed the work on time. Great to communicate with and returned calls immediately. Overall, couldn't recommend them highly enough.",
    rating: 5,
  },
  {
    author: "Nethmi Y.",
    service: "Deep Clean",
    body: "From the initial consultation to the final result, their professionalism and attention to detail were outstanding. They arrived on time, were friendly and courteous, and left my home spotless.",
    rating: 5,
  },
];

const FAQS: { q: string; a: string; jsx?: React.ReactNode }[] = [
  {
    q: "What suburbs in Perth do you service?",
    a: "We service all suburbs across Greater Perth — from the CBD and inner suburbs like Northbridge, Subiaco and Victoria Park, through to the northern suburbs (Joondalup, Scarborough, Karrinyup), southern suburbs (Rockingham, Mandurah, Canning Vale), and eastern suburbs (Midland, Belmont, Cannington). Use our quote tool to confirm availability for your address.",
  },
  {
    q: "How quickly can you arrange a Perth cleaner?",
    a: "We can often accommodate same-day or next-day bookings in Perth. Select your date in our online booking tool and we'll confirm within 2 hours.",
  },
  {
    q: "Are your Perth cleaners background checked?",
    a: "Yes. Every cleaner on our Perth team is police checked, thoroughly vetted, and fully insured before joining Taspro.",
  },
  {
    q: "Do you offer end of lease cleaning in Perth?",
    a: "Yes. We offer bond-back guaranteed end of lease cleaning across all Perth suburbs, following REIWA-standard checklists used by Perth property managers.",
    jsx: (
      <>
        Yes. We offer bond-back guaranteed{" "}
        <Link href="/locations/perth/end-of-lease-cleaning" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          end of lease cleaning in Perth
        </Link>{" "}
        across all Perth suburbs, following REIWA-standard checklists used by Perth property managers.
        See our{" "}
        <Link href="/pricing" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          pricing guide
        </Link>{" "}
        for bond-clean rates.
      </>
    ),
  },
  {
    q: "Do you offer NDIS cleaning in Perth?",
    a: "Yes. Taspro provides NDIS cleaning services to participants across Perth for plan-managed, agency-managed and self-managed plans. We work with your support coordinator to arrange cleans that suit your schedule and NDIS plan.",
    jsx: (
      <>
        Yes. Taspro provides{" "}
        <Link href="/services/ndis" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
          NDIS cleaning services
        </Link>{" "}
        to participants across Perth for plan-managed, agency-managed and self-managed plans. We work with your support coordinator to arrange cleans that suit your schedule and NDIS plan.
      </>
    ),
  },
  {
    q: "Can you clean apartments in the Perth CBD?",
    a: "Yes — apartments, units, townhouses and houses across the Perth CBD and surrounding inner suburbs. We're experienced with strata buildings and can work within your building's access requirements.",
  },
  {
    q: "Do you offer commercial office cleaning in Perth after hours?",
    a: "Yes. We offer after-hours and weekend commercial cleaning across Perth so your staff aren't disrupted. All commercial quotes are provided via email after a quick discussion about your premises — prices are not shown online as every office is different.",
  },
  {
    q: "What's included in a standard home clean in Perth?",
    a: "A standard home clean covers all living areas, bedrooms, kitchen (benches, stovetop, sink, appliances exterior), bathrooms and toilets, vacuuming and mopping all floors, and wiping down surfaces. Deep cleans and end of lease cleans include additional items such as oven interiors, window tracks, skirting boards and more.",
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

export default function PerthPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden" aria-labelledby="perth-heading">
        <Image
          src="https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?w=1920&q=80"
          alt="Perth city skyline along the Swan River"
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Perth WA</p>
            <h1 id="perth-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Professional Cleaning Services<br className="hidden md:block" /> in Perth
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Perth is our full-service hub. Background-checked, insured cleaners available for home cleaning, end-of-lease, NDIS, commercial, deep cleans and one-off bookings — all bookable online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-primary text-base px-8 py-4">
                Get a Free Instant Quote
              </Link>
              <a href="tel:+61870816811" className="btn-outline-white text-base px-8 py-4">
                Call (08) 7081 6811
              </a>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-navy-950 border-t border-white/10" aria-label="Taspro Perth trust indicators">
        <div className="container-custom py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
            {[
              { stat: "5.0★", label: "Google Rating" },
              { stat: "100%", label: "Satisfaction Guarantee" },
              { stat: "Police-checked", label: "All Cleaners" },
              { stat: "Fully Insured", label: "Public Liability" },
              { stat: "30+ Suburbs", label: "Covered in Perth" },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <p className="font-display font-bold text-teal-400 text-lg leading-none">{item.stat}</p>
                <p className="text-white/50 text-xs mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Service Hub Strip */}
      <section className="bg-teal-500 border-b border-teal-600/20" aria-label="Perth full-service availability">
        <div className="container-custom py-4">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
            <span className="font-display font-bold text-navy-950 text-sm shrink-0">Perth — Full Service Hub</span>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
              {["Home Cleaning", "End-of-Lease", "NDIS Cleaning", "Office Cleaning", "Deep Cleans", "One-off Bookings"].map((svc) => (
                <span key={svc} className="flex items-center gap-1.5 text-navy-950/80 text-xs font-medium">
                  <svg className="w-3.5 h-3.5 text-navy-950/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {svc}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-white" aria-labelledby="perth-services-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Our Services</p>
            <h2 id="perth-services-heading" className="section-heading">Cleaning services we offer in Perth</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              Perth is our full-service hub — every service type available, from regular home cleans and bond cleaning to NDIS, deep cleans and one-off bookings.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s, i) => (
              <AnimateInView key={s.href} variant="slide-up" delay={i * 0.07}>
                <Link
                  href={s.href}
                  className="group flex items-start gap-5 p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full"
                >
                  <span className="text-4xl shrink-0" aria-hidden="true">{s.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950 mb-1 group-hover:text-teal-700 transition-colors">{s.title}</h3>
                    <p className="text-navy-950/60 text-sm leading-relaxed">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 mt-3 text-teal-600 text-sm font-semibold group-hover:gap-3 transition-all">
                      Learn more
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Office Cleaning callout */}
      <section className="bg-teal-500 py-10" aria-label="Office cleaning Perth">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="font-semibold text-navy-950/70 text-sm mb-1">🏢 Office &amp; Commercial Cleaning — Perth</p>
              <h2 className="font-display text-2xl font-bold text-navy-950">Perth&apos;s trusted office cleaning team.</h2>
              <p className="text-navy-950/70 text-sm mt-1 max-w-lg">
                Full-service office cleaning in Perth — offices, meeting rooms, kitchens, bathrooms. During business hours or after hours. All service types available.{" "}
                <Link href="/services/commercial" className="underline underline-offset-2 font-semibold hover:text-navy-800 transition-colors">
                  Learn about office cleaning
                </Link>.
              </p>
            </div>
            <Link href="/quote" className="btn-secondary shrink-0 whitespace-nowrap">
              Get an Office Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Suburbs */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="perth-suburbs-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Coverage</p>
            <h2 id="perth-suburbs-heading" className="section-heading">Perth suburbs we service</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We cover all of Greater Perth — from the CBD to the outer suburbs. Not sure about your area?{" "}
              <Link href="/contact" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Contact us</Link> or get a quote to confirm.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
            {PERTH_SUBURBS.map((suburb, i) => (
              <AnimateInView key={suburb} variant="slide-up" delay={i * 0.02}>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-navy-950/8 text-sm text-navy-950/70 font-medium">
                  <svg className="w-3 h-3 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {suburb}
                </div>
              </AnimateInView>
            ))}
          </div>
          <AnimateInView variant="slide-up" className="text-center mt-8">
            <p className="text-navy-950/50 text-sm">…and all surrounding Perth suburbs and regional areas. <Link href="/quote" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors">Check your suburb →</Link></p>
          </AnimateInView>
        </div>
      </section>

      {/* Why Taspro in Perth */}
      <section className="section-padding bg-white" aria-labelledby="perth-why-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimateInView variant="slide-right">
              <p className="section-label">Why Taspro in Perth</p>
              <h2 id="perth-why-heading" className="section-heading mb-6">Perth&apos;s trusted cleaning team</h2>
              <div className="space-y-5">
                {[
                  { title: "Local Perth cleaners", desc: "Our Perth team knows the city. Local, reliable, and experienced with Perth's unique property types — from riverside CBD apartments to suburban family homes in the north and south." },
                  { title: "Fully insured & police-checked", desc: "Every cleaner undergoes a National Police Check and holds Public Liability Insurance. Your home and office are fully protected." },
                  { title: "100% satisfaction guarantee", desc: "If you're not happy, we'll return within 24 hours to fix any missed areas at no extra charge." },
                  { title: "Transparent online pricing", desc: "No phone calls needed. See your exact price before booking using our online quote tool — home cleans, bond cleans and deep cleans all priced instantly." },
                  { title: "Flexible scheduling", desc: "Early mornings, evenings, and weekends available to fit around your schedule or business hours across all Perth suburbs." },
                ].map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-navy-950 text-sm">{point.title}</p>
                      <p className="text-navy-950/60 text-sm mt-1">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimateInView>

            <AnimateInView variant="slide-left">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800&q=80"
                  alt="Taspro cleaner cleaning a Perth home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="perth-reviews-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">What Customers Say</p>
            <h2 id="perth-reviews-heading" className="section-heading">Reviewed by Perth customers</h2>
            <p className="section-subheading max-w-xl mx-auto">
              5.0 stars across all our reviews — see what Perth customers say about Taspro.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {REVIEWS.map((review, i) => (
              <AnimateInView key={review.author} variant="slide-up" delay={i * 0.08}>
                <div className="bg-white rounded-2xl border border-navy-950/8 p-6 flex flex-col h-full">
                  <div className="flex gap-0.5 mb-3" aria-label="5 stars">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-navy-950/70 text-sm leading-relaxed flex-1">&ldquo;{review.body}&rdquo;</p>
                  <div className="mt-4 pt-4 border-t border-navy-950/8">
                    <p className="font-semibold text-navy-950 text-sm">{review.author}</p>
                    <p className="text-navy-950/45 text-xs mt-0.5">{review.service} · Google Review</p>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white" aria-labelledby="perth-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="perth-faq-heading" className="section-heading">Perth cleaning questions answered</h2>
          </AnimateInView>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.06}>
                <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-6">
                  <h3 className="font-semibold text-navy-950 mb-2">{faq.q}</h3>
                  <p className="text-navy-950/65 text-sm leading-relaxed">{faq.jsx ?? faq.a}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Other Locations */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="perth-locations-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">We Also Serve</p>
            <h2 id="perth-locations-heading" className="section-heading">Other locations</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { href: "/locations/sydney", icon: "🌉", city: "Sydney", state: "NSW" },
              { href: "/locations/melbourne", icon: "🏙️", city: "Melbourne", state: "VIC" },
              { href: "/locations/launceston", icon: "🏔️", city: "Launceston", state: "TAS" },
            ].map((loc, i) => (
              <AnimateInView key={loc.href} variant="slide-up" delay={i * 0.07}>
                <Link href={loc.href} className="group flex flex-col items-center p-6 bg-white rounded-2xl border border-navy-950/8 card-hover text-center">
                  <span className="text-3xl mb-3" aria-hidden="true">{loc.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{loc.city}</p>
                  <p className="text-navy-950/55 text-xs">{loc.state}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View services <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-teal-500" aria-labelledby="perth-cta-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 id="perth-cta-heading" className="font-display text-4xl font-bold text-navy-950 mb-4">
              Ready to book your Perth clean?
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">
              Get an instant quote online — no phone calls, no forms, just a price in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote" className="btn-secondary text-base px-8 py-4">
                Get a Free Instant Quote
              </Link>
              <Link href="/contact" className="btn-secondary text-base px-8 py-4">
                Contact Us
              </Link>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
