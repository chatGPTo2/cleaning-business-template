import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "@/app/components/AnimateInView";

export const metadata: Metadata = {
  title: "Commercial & Office Cleaning in Sydney, Melbourne, Perth & Launceston | Taspro",
  description:
    "Professional commercial and office cleaning across Sydney NSW, Melbourne VIC, Perth WA and Launceston TAS. Offices, retail, gyms, medical and more. Get a no-obligation quote.",
  alternates: { canonical: "https://tasprocleaning.com.au/services/commercial" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://tasprocleaning.com.au/services/commercial#service",
  name: "Commercial & Office Cleaning",
  description: "Professional commercial and office cleaning for offices, retail, gyms, medical centres and more across Sydney, Melbourne, Perth and Launceston.",
  provider: { "@id": "https://tasprocleaning.com.au/#organization" },
  areaServed: ["Sydney NSW", "Melbourne VIC", "Perth WA", "Launceston TAS"],
  serviceType: "Commercial Cleaning",
  url: "https://tasprocleaning.com.au/services/commercial",
  offers: {
    "@type": "Offer",
    priceCurrency: "AUD",
    description: "Flexible daily, weekly, fortnightly and monthly commercial cleaning contracts. Custom pricing based on space size.",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://tasprocleaning.com.au/services/commercial" },
    { "@type": "ListItem", position: 3, name: "Commercial Cleaning", item: "https://tasprocleaning.com.au/services/commercial" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do you offer after-hours office cleaning?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. We offer both during-business-hours and after-hours cleaning. When you request a quote online, you can specify your preferred schedule and we'll match you with a cleaner who fits your timetable." },
    },
    {
      "@type": "Question",
      name: "Do you offer sanitary waste collection?",
      acceptedAnswer: { "@type": "Answer", text: "We don't currently offer sanitary waste collection services. You'll need to arrange this through a specialist provider. We're happy to discuss timing so our clean fits around your existing waste service schedule." },
    },
    {
      "@type": "Question",
      name: "How do I specify the number of offices, meeting rooms and kitchens?",
      acceptedAnswer: { "@type": "Answer", text: "Our online quote form lets you select the exact number of offices, meeting rooms and kitchen areas so we can size the job accurately. For large multi-tenancy buildings or unusual layouts, we'll call you to confirm the details." },
    },
    {
      "@type": "Question",
      name: "How often do you recommend cleaning an office?",
      acceptedAnswer: { "@type": "Answer", text: "Most offices benefit from a weekly or twice-weekly clean. High-traffic spaces — kitchens, bathrooms and reception — may need attention more frequently. We offer daily, weekly, fortnightly and monthly schedules with no lock-in contracts." },
    },
    {
      "@type": "Question",
      name: "Are your cleaners police-checked and insured?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Every cleaner holds a current National Police Check and full Public Liability Insurance. We take the security of your workplace seriously." },
    },
  ],
};

const INCLUSIONS = [
  "All floors vacuumed and mopped",
  "Desks, workstations and surfaces wiped down",
  "Kitchen and breakroom cleaned — sink, benches, appliances",
  "Bathrooms sanitised — toilet, basin, mirrors and floors",
  "Bins emptied and liners replaced",
  "Reception and entry area cleaned and presentable",
  "Glass and mirrors polished streak-free",
  "Common areas and corridors maintained",
  "Entrance and foyer swept and mopped",
];

const VENUE_TYPES = [
  { icon: "🏢", label: "Offices & Co-working" },
  { icon: "🛍️", label: "Retail & Showrooms" },
  { icon: "💪", label: "Gyms & Fitness Centres" },
  { icon: "🏥", label: "Medical Centres & Clinics" },
  { icon: "🎓", label: "Education Centres" },
  { icon: "🍺", label: "Pubs, Clubs & Hospitality" },
];

export default function CommercialPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {/* Hero */}
      <section
        className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden"
        aria-labelledby="comm-heading"
      >
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Clean modern office space with bright lighting"
          fill
          priority
          className="object-cover opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Commercial Cleaning</p>
            <h1 id="comm-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Commercial &amp; Office Cleaning in<br className="hidden md:block" /> Sydney, Melbourne, Perth &amp; Launceston
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              A clean workplace is a productive workplace. We service offices, retail, gyms, medical centres and more — on your schedule.
            </p>
            <Link href="/quote" className="btn-primary text-base px-8 py-4">
              Get a Free Office Cleaning Quote
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Venues we serve */}
      <section className="section-padding bg-white" aria-labelledby="comm-venues-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Venue Types</p>
            <h2 id="comm-venues-heading" className="section-heading">We clean all types of commercial spaces</h2>
          </AnimateInView>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {VENUE_TYPES.map((v, i) => (
              <AnimateInView key={v.label} variant="slide-up" delay={i * 0.07}>
                <div className="flex items-center gap-4 p-5 bg-navy-950/[0.03] rounded-2xl">
                  <span className="text-3xl" aria-hidden="true">{v.icon}</span>
                  <span className="font-semibold text-navy-950 text-sm">{v.label}</span>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* What's included + Contact split */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="comm-inclusions-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <div>
              <AnimateInView variant="slide-right">
                <p className="section-label">What&apos;s Included</p>
                <h2 id="comm-inclusions-heading" className="section-heading mb-8">Every clean, every visit</h2>
                <ul className="space-y-4" aria-label="Commercial cleaning inclusions">
                  {INCLUSIONS.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-navy-950/70">
                      <svg className="w-5 h-5 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  {["Daily", "Weekly", "Fortnightly", "Monthly", "One-off"].map((freq) => (
                    <span key={freq} className="px-4 py-2 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-sm font-medium">
                      {freq}
                    </span>
                  ))}
                </div>
              </AnimateInView>
            </div>

            {/* Contact CTA card */}
            <AnimateInView variant="slide-left">
              <div className="bg-navy-950 rounded-3xl p-8 text-white">
                <h3 className="font-display text-2xl font-bold mb-3">Get a No-Obligation Quote</h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Commercial pricing is tailored to your space and frequency. Fill in the form below and we&apos;ll call you within 1 business day with a custom quote.
                </p>
                <div className="space-y-3 mb-6">
                  {[
                    "Flexible scheduling — before/after hours available",
                    "Local, vetted cleaners in your city",
                    "Fully insured & police-checked staff",
                    "No lock-in contracts",
                  ].map((point) => (
                    <div key={point} className="flex items-start gap-3 text-sm text-white/70">
                      <svg className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {point}
                    </div>
                  ))}
                </div>
                <Link href="/quote" className="btn-primary w-full justify-center">
                  Get an Online Quote
                </Link>
                <p className="text-center text-white/40 text-xs mt-4">
                  We&apos;ll respond within 1 business day
                </p>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Cities We Serve */}
      <section className="section-padding bg-white" aria-labelledby="comm-cities-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Where We Clean</p>
            <h2 id="comm-cities-heading" className="section-heading">Commercial cleaning across Australia</h2>
            <p className="section-subheading max-w-xl mx-auto">
              We offer commercial cleaning in four cities. See your city for local pricing and availability.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/locations/perth", icon: "🌅", city: "Perth", state: "WA", note: "Full-service hub — all clean types" },
              { href: "/locations/melbourne", icon: "🏙️", city: "Melbourne", state: "VIC", note: "Recurring home & commercial cleans" },
              { href: "/locations/sydney", icon: "🌉", city: "Sydney", state: "NSW", note: "Recurring home & commercial cleans" },
              { href: "/locations/launceston", icon: "🏔️", city: "Launceston", state: "TAS", note: "Full-service hub — all clean types" },
            ].map((loc, i) => (
              <AnimateInView key={loc.href} variant="slide-up" delay={i * 0.07}>
                <Link href={loc.href} className="group flex flex-col p-5 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full">
                  <span className="text-3xl mb-3" aria-hidden="true">{loc.icon}</span>
                  <p className="font-semibold text-navy-950 text-sm mb-0.5 group-hover:text-teal-700 transition-colors">{loc.city}, {loc.state}</p>
                  <p className="text-navy-950/55 text-xs leading-relaxed flex-1">{loc.note}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View location <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
          <AnimateInView variant="slide-up" delay={0.35} className="text-center mt-8">
            <p className="text-navy-950/50 text-sm">
              Want to know the exact price?{" "}
              <Link href="/pricing" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
                See our pricing guide
              </Link>{" "}
              or{" "}
              <Link href="/quote" className="text-teal-600 font-semibold hover:text-teal-700 transition-colors underline underline-offset-2">
                get a free instant quote
              </Link>.
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* Office Cleaning FAQ */}
      <section className="section-padding bg-white" aria-labelledby="comm-faq-heading">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">FAQ</p>
            <h2 id="comm-faq-heading" className="section-heading">Office cleaning questions answered</h2>
          </AnimateInView>
          <div className="space-y-5">
            {[
              {
                q: "Do you offer after-hours office cleaning?",
                a: "Yes. We offer both during-business-hours and after-hours cleaning. When you request a quote online, you can specify your preferred schedule and we'll match you with a cleaner who fits your timetable.",
              },
              {
                q: "Do you offer sanitary waste collection?",
                a: "We don't currently offer sanitary waste collection services. You'll need to arrange this through a specialist provider. We're happy to discuss timing so our clean fits around your existing waste service schedule.",
              },
              {
                q: "How do I specify the number of offices, meeting rooms and kitchens?",
                a: "Our online quote form lets you select the exact number of offices, meeting rooms and kitchen areas so we can size the job accurately. For large multi-tenancy buildings or unusual layouts, we'll call you to confirm the details.",
              },
              {
                q: "How often do you recommend cleaning an office?",
                a: "Most offices benefit from a weekly or twice-weekly clean. High-traffic spaces — kitchens, bathrooms and reception — may need attention more frequently. We offer daily, weekly, fortnightly and monthly schedules with no lock-in contracts.",
              },
              {
                q: "Are your cleaners police-checked and insured?",
                a: "Yes. Every cleaner holds a current National Police Check and full Public Liability Insurance. We take the security of your workplace seriously.",
              },
            ].map((item, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.06}>
                <div className="bg-navy-950/[0.03] rounded-2xl p-6 border border-navy-950/8">
                  <h3 className="font-display font-semibold text-navy-950 mb-2">{item.q}</h3>
                  <p className="text-navy-950/60 text-sm leading-relaxed">{item.a}</p>
                </div>
              </AnimateInView>
            ))}
          </div>
          <AnimateInView variant="slide-up" delay={0.35} className="text-center mt-8">
            <Link href="/quote" className="btn-primary">
              Book Your Office Clean Online
            </Link>
          </AnimateInView>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-navy-950/[0.03]" aria-labelledby="comm-related-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Available</p>
            <h2 id="comm-related-heading" className="section-heading">Other cleaning services</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/services/home-cleaning", icon: "🏠", title: "Home Cleaning", desc: "Regular residential cleaning with transparent pricing." },
              { href: "/services/end-of-lease", icon: "🔑", title: "End of Lease", desc: "Bond-back guaranteed. We follow the agent checklist." },
              { href: "/services/deep-clean", icon: "✨", title: "Deep Clean", desc: "Top-to-bottom refresh for offices and commercial spaces." },
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
