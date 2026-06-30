import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import AnimateInView from "./components/AnimateInView";
import FAQAccordion from "./components/FAQAccordion";
import BeforeAfterGallery from "./components/BeforeAfterGallery";
import { getVisibleReviews, getFeaturedReview, getAggregateRating } from "@/lib/reviews";

export const revalidate = 3600; // re-fetch reviews hourly

/* ── SEO metadata ── */
export const metadata: Metadata = {
  title: "Professional Cleaning Services in Perth, Launceston, Melbourne & Sydney | Taspro",
  description:
    "Taspro Cleaning Solutions offers trusted, police-checked home and commercial cleaning across Perth WA, Launceston TAS, Melbourne VIC and Sydney NSW. Full service in Perth & Launceston — end-of-lease, deep cleans & NDIS. 5.0★ Google rating. Book online.",
  alternates: { canonical: "https://tasprocleaning.com.au" },
};

/* ── FAQ data ── */
const FAQS = [
  {
    q: "Do I need to be home during the clean?",
    a: "No, many customers leave a key or provide access instructions. We'll work out the most convenient access method for you.",
  },
  {
    q: "What's included in a standard home clean?",
    a: "Kitchen (stove exteriors, benchtop, sink, microwave exterior, dishwasher stack, mopped floor), bedrooms (beds tidied, dusting, floors), bathrooms (toilet, shower, bath, mirrors, floors), and all floors vacuumed or mopped throughout.",
  },
  {
    q: "How is pricing calculated?",
    a: "Based on the number of bedrooms and bathrooms. Add-on extras are individually priced. You'll see your full price before booking — no hidden fees.",
  },
  {
    q: "Can I book a recurring clean?",
    a: "Yes! Weekly, fortnightly or monthly options are available — with automatic discounts applied. We assign the same cleaner to your home for each recurring visit where possible, so your home is always in familiar, trusted hands. Weekly saves 15%, fortnightly saves 10%, monthly saves 5%.",
  },
  {
    q: "What if I'm not happy with the clean?",
    a: "We offer a 100% satisfaction guarantee. Contact us within 24 hours and we'll send the cleaner back to fix any missed items at absolutely no extra cost.",
  },
  {
    q: "Are your cleaners background checked?",
    a: "Yes. Every cleaner holds a National Police Check and full Public Liability Insurance. Our team are non-smoking and respectful of your home at all times. Only top applicants are accepted.",
  },
  {
    q: "How do I pay?",
    a: "Payment is processed securely and automatically after your clean is complete. No cash required — everything is handled online.",
  },
  {
    q: "How much notice do I need to give?",
    a: "We can often accommodate short-notice bookings. Select your preferred date and time in the booking form and we'll confirm availability within 2 hours.",
  },
];

/* ── Service card data ── */
const SERVICES = [
  {
    icon: "🏠",
    title: "Home Cleaning",
    description: "Regular cleans that keep your home fresh. Fully customisable to your needs.",
    href: "/services/home-cleaning",
    colour: "from-teal-50 to-teal-100/50",
  },
  {
    icon: "🔑",
    title: "End of Lease",
    description: "Bond-back guaranteed. Thorough, checklist-driven cleans for full bond returns.",
    href: "/services/end-of-lease",
    colour: "from-blue-50 to-blue-100/50",
  },
  {
    icon: "🏢",
    title: "Commercial & Office",
    description: "Offices, retail, gyms, medical centres and more. Daily, weekly or monthly.",
    href: "/services/commercial",
    colour: "from-purple-50 to-purple-100/50",
  },
  {
    icon: "🧹",
    title: "Deep Clean",
    description: "Top-to-bottom refresh for homes that haven't been cleaned in a while.",
    href: "/services/deep-clean",
    colour: "from-orange-50 to-orange-100/50",
  },
  {
    icon: "♿",
    title: "NDIS Cleaning",
    description: "NDIS cleaning services for participants across Tasmania.",
    href: "/services/ndis",
    colour: "from-green-50 to-green-100/50",
  },
  {
    icon: "🌿",
    title: "Spring Clean",
    description: "Seasonal deep clean from top to bottom — perfect before or after moving in.",
    href: "/services/deep-clean",
    colour: "from-emerald-50 to-emerald-100/50",
  },
];

/* ── Featured review (hero placement) ── */
const FEATURED_REVIEW = {
  text: "I recently used TasPro Cleaning Solutions for a deep clean of my home, and I couldn't be more impressed with their service! From the initial consultation to the final result, their professionalism and attention to detail were outstanding. They arrived on time, were friendly and courteous, and left my home spotless. They paid attention to all the areas I requested and even went above and beyond to make sure everything was pristine. I highly recommend TasPro Cleaning Solutions to anyone looking for reliable, high-quality cleaning services. Will definitely be using them again!",
  author: "Nethmi Y.",
  initial: "N",
  service: "Deep Clean",
};

/* ── Testimonial data ── */
const TESTIMONIALS = [
  {
    text: "Taspro are awesome. Prompt impeccable work. Completed the work on time. Great to communicate with and returned calls etc immediately. Overall, couldn't recommend them highly enough.",
    author: "Terry Youd",
    initial: "T",
    badge: "Local Guide",
    service: "Home Cleaning",
    serviceColour: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  },
  {
    text: "Beth and the team were absolutely top tier. They cleaned our house to perfection, could not fault them. Would highly recommend.",
    author: "Nick C.",
    initial: "N",
    badge: undefined,
    service: "Home Cleaning",
    serviceColour: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  },
  {
    text: "A very satisfied customer — had my end of lease done and it was amazing. They took their time and were happy to come back if there was a point that needed corrections. Would definitely come back again.",
    author: "Joan C.",
    initial: "J",
    badge: undefined,
    service: "End of Lease",
    serviceColour: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  },
  {
    text: "Our office has never looked better! These guys are thorough and professional. Highly recommended!",
    author: "Jannina S.",
    initial: "J",
    badge: undefined,
    service: "Office Cleaning",
    serviceColour: "bg-purple-500/15 text-purple-300 border-purple-500/20",
  },
  {
    text: "Beth and his team was very professional. I needed to delay my booking and Beth happily agreed and did outstanding work. Their communication was prompt and clear.",
    author: "Arpan P.",
    initial: "A",
    badge: undefined,
    service: "Home Cleaning",
    serviceColour: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  },
];

/* ── Why Choose Us data ── */
const WHY_US = [
  {
    icon: "✓",
    title: "100% Satisfaction Guarantee",
    description: "If anything is missed, we come back within 24 hours to fix it — no charge, no questions asked.",
  },
  {
    icon: "🔒",
    title: "Police-Cleared & Fully Insured",
    description: "Every cleaner holds a National Police Check and full Public Liability Insurance. Only top applicants join our team.",
  },
  {
    icon: "👤",
    title: "Same Cleaner Each Visit",
    description: "For recurring bookings, we assign the same cleaner where possible — so your home is always in familiar, trusted hands.",
  },
  {
    icon: "🔄",
    title: "Backup Coverage Provided",
    description: "If your regular cleaner is unavailable due to illness or public holidays, we arrange a vetted backup — your schedule never slips.",
  },
  {
    icon: "🌿",
    title: "Eco-Friendly & Non-Smoking Team",
    description: "Safe for your family and pets. Our team are non-smoking and respectful of your home at all times.",
  },
  {
    icon: "📍",
    title: "4 Cities, Local Cleaners",
    description: "Serving Sydney NSW, Melbourne VIC, Perth WA and Launceston TAS — with locally vetted, background-checked cleaners in each city.",
  },
];

/* ── HOW IT WORKS steps ── */
const STEPS = [
  {
    num: "01",
    title: "Tell us about your space",
    description: "Choose your service type, number of bedrooms and bathrooms, and any add-on extras you need.",
  },
  {
    num: "02",
    title: "Pick your date & frequency",
    description: "Select your preferred date, time of day, and whether you'd like a one-off or recurring clean.",
  },
  {
    num: "03",
    title: "We confirm in 2 hours",
    description: "We match you with a vetted local cleaner and confirm your booking via SMS and email within 2 hours.",
  },
];

/* ── Service availability data ── */
const AVAILABILITY_ROWS = [
  {
    service: "Recurring Home Cleaning",
    sub: "Weekly or fortnightly",
    perth: true as const,
    other: true as const,
  },
  {
    service: "Office Cleaning",
    sub: "Scheduled commercial cleans",
    perth: true as const,
    other: true as const,
  },
  {
    service: "NDIS Cleaning Support",
    sub: "NDIS cleaning services",
    perth: "Full NDIS support",
    other: "General support only",
  },
  {
    service: "End-of-Lease Cleaning",
    sub: "Bond-back guaranteed",
    perth: true as const,
    other: false as const,
  },
  {
    service: "Deep Cleaning",
    sub: "Top-to-bottom refresh",
    perth: true as const,
    other: false as const,
  },
  {
    service: "One-off Cleans",
    sub: "No recurring commitment required",
    perth: true as const,
    other: false as const,
  },
];

/* ── Locations data ── */
const LOCATIONS_DATA = [
  {
    city: "Sydney",
    state: "NSW",
    href: "/locations/sydney",
    mapSrc:
      "https://maps.google.com/maps?q=Sydney+NSW+Australia&t=&z=11&ie=UTF8&iwloc=&output=embed",
    desc: "Recurring home and commercial cleaning across Sydney houses and high-rise apartments. Strata-experienced, police-checked cleaners.",
    isHome: false,
  },
  {
    city: "Melbourne",
    state: "VIC",
    href: "/locations/melbourne",
    mapSrc:
      "https://maps.google.com/maps?q=Melbourne+VIC+Australia&t=&z=11&ie=UTF8&iwloc=&output=embed",
    desc: "Recurring home and office cleaning across Greater Melbourne. Local vetted cleaners, no lock-in contracts, transparent online pricing.",
    isHome: false,
  },
  {
    city: "Perth",
    state: "WA",
    href: "/locations/perth",
    mapSrc:
      "https://maps.google.com/maps?q=Perth+WA+Australia&t=&z=11&ie=UTF8&iwloc=&output=embed",
    desc: "Residential and commercial cleaning across Perth suburbs. Bond-back guaranteed end of lease cleaning following REIWA-standard checklists.",
    isHome: true,
  },
  {
    city: "Launceston",
    state: "TAS",
    href: "/locations/launceston",
    mapSrc:
      "https://maps.google.com/maps?q=Launceston+TAS+Australia&t=&z=12&ie=UTF8&iwloc=&output=embed",
    desc: "Where Taspro was founded. Home, end-of-lease, deep cleaning, NDIS and commercial cleaning across Launceston and northern Tasmania.",
    isHome: false,
  },
];

/* ── AggregateRating + Review JSON-LD built dynamically from DB ── */

/* ── FAQPage JSON-LD ── */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

/* ── Locations ItemList JSON-LD ── */
const locationsSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Taspro Cleaning Solutions — Service Locations",
  description: "Australian cities served by Taspro Cleaning Solutions",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Sydney Cleaning Services",
      url: "https://tasprocleaning.com.au/locations/sydney",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Melbourne Cleaning Services",
      url: "https://tasprocleaning.com.au/locations/melbourne",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Perth Cleaning Services",
      url: "https://tasprocleaning.com.au/locations/perth",
    },
    {
      "@type": "ListItem",
      position: 4,
      name: "Launceston Cleaning Services",
      url: "https://tasprocleaning.com.au/locations/launceston",
    },
  ],
};

export default async function HomePage() {
  // Fetch reviews from DB; fall back gracefully if DB not available
  const [dbReviews, dbFeatured] = await Promise.all([
    getVisibleReviews(),
    getFeaturedReview(),
  ]);

  const hasDbReviews = dbReviews.length > 0;
  const aggregate = hasDbReviews ? getAggregateRating(dbReviews) : { ratingValue: "5.0", reviewCount: 12 };

  // Featured review: prefer DB featured, else first DB review, else hardcoded fallback
  const featuredReview = dbFeatured ?? (hasDbReviews ? dbReviews[0] : null);
  const displayFeatured = featuredReview ? {
    text: featuredReview.review_body,
    author: featuredReview.author_name,
    initial: featuredReview.author_initial,
    service: featuredReview.service_type ?? "Google Review",
  } : FEATURED_REVIEW;

  // Grid reviews: DB reviews excluding featured, else hardcoded fallback
  const gridReviews = hasDbReviews
    ? dbReviews.filter((r) => r.id !== featuredReview?.id).map((r) => ({
        text: r.review_body,
        author: r.author_name,
        initial: r.author_initial,
        badge: undefined as string | undefined,
        service: r.service_type ?? "Google Review",
        serviceColour: "bg-teal-500/15 text-teal-400 border-teal-500/20",
      }))
    : TESTIMONIALS;

  // Build schema with individual Review items for Google star eligibility
  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://tasprocleaning.com.au/#organization",
    name: "Taspro Cleaning Solutions",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: aggregate.ratingValue,
      reviewCount: String(aggregate.reviewCount),
      bestRating: "5",
      worstRating: "1",
    },
    review: (hasDbReviews ? dbReviews : []).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author_name },
      datePublished: r.date_published,
      reviewBody: r.review_body,
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationsSchema) }}
      />

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center grain-overlay overflow-hidden bg-navy-950"
        aria-labelledby="hero-heading"
      >
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
          alt="Clean, bright modern living room interior"
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80"
          aria-hidden="true"
        />

        {/* Decorative teal glow */}
        <div
          className="absolute top-1/3 -right-48 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1/4 -left-24 w-72 h-72 rounded-full bg-teal-500/8 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative container-custom pt-32 pb-24 lg:pt-40 lg:pb-32">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <AnimateInView variant="slide-up" delay={0}>
              <div className="inline-flex items-center gap-2 bg-teal-500/15 border border-teal-500/30 text-teal-400 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse-slow" aria-hidden="true" />
                Serving Sydney · Melbourne · Perth · Launceston
              </div>
            </AnimateInView>

            {/* Headline */}
            <AnimateInView variant="slide-up" delay={0.1}>
              <h1
                id="hero-heading"
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
              >
                Professional Cleaning,{" "}
                <span className="text-gradient">Booked in Minutes</span>
              </h1>
            </AnimateInView>

            {/* Subheading */}
            <AnimateInView variant="slide-up" delay={0.2}>
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                Trusted, police-checked cleaners for homes, offices, and end-of-lease cleans
                across Sydney, Melbourne, Perth &amp; Launceston.
              </p>
            </AnimateInView>

            {/* CTA buttons */}
            <AnimateInView variant="slide-up" delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/quote"
                  className="btn-primary text-base px-8 py-4"
                  aria-label="Get an instant quote — opens quote form"
                >
                  Get a Free Instant Quote
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <a
                  href="#services"
                  className="btn-outline-white text-base px-8 py-4"
                  aria-label="See our cleaning services"
                >
                  See Our Services
                </a>
              </div>
            </AnimateInView>

            {/* Trust bar */}
            <AnimateInView variant="fade" delay={0.45}>
              <div
                className="mt-12 flex flex-wrap gap-x-6 gap-y-3"
                aria-label="Trust indicators"
              >
                {[
                  { icon: "⭐", text: `${aggregate.ratingValue}★ · ${aggregate.reviewCount} Google Reviews` },
                  { icon: "✓", text: "Police-Checked" },
                  { icon: "✓", text: "Fully Insured" },
                  { icon: "✓", text: "100% Satisfaction Guarantee" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-white/70 text-sm">
                    <span className="text-teal-400" aria-hidden="true">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </AnimateInView>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40" aria-hidden="true">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* ── SERVICE AVAILABILITY ── */}
      <section className="py-14 bg-white border-b border-navy-950/8" aria-labelledby="availability-heading">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Service Availability</p>
            <h2 id="availability-heading" className="font-display text-2xl md:text-3xl font-bold text-navy-950 leading-tight">
              What&apos;s available in your city
            </h2>
            <p className="text-navy-950/60 mt-3 text-sm max-w-2xl mx-auto leading-relaxed">
              Perth and Launceston are our full-service hubs. Customers in Melbourne and Sydney can book recurring home cleaning, office cleaning and NDIS support.
            </p>
          </AnimateInView>

          <AnimateInView variant="slide-up" delay={0.1}>
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <div className="min-w-[520px] rounded-2xl border border-navy-950/8 overflow-hidden shadow-card">

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_180px_1fr]">
                  <div className="bg-navy-950/[0.03] px-6 py-4">
                    <span className="text-navy-950/40 text-xs font-semibold uppercase tracking-wider">Service</span>
                  </div>
                  <div className="bg-teal-500 px-4 py-4 text-center">
                    <p className="font-display font-bold text-navy-950 text-sm">Perth WA · Launceston TAS</p>
                    <p className="text-navy-950/65 text-xs mt-0.5">Full service</p>
                  </div>
                  <div className="bg-navy-950/[0.05] px-4 py-4 text-center border-l border-navy-950/8">
                    <p className="font-display font-bold text-navy-950 text-sm">Melbourne · Sydney</p>
                    <p className="text-navy-950/50 text-xs mt-0.5">Recurring services</p>
                  </div>
                </div>

                {/* Service rows */}
                {AVAILABILITY_ROWS.map((row, i) => (
                  <div
                    key={row.service}
                    className={`grid grid-cols-[1fr_180px_1fr] border-t border-navy-950/8 ${i % 2 === 0 ? "bg-white" : "bg-navy-950/[0.015]"}`}
                  >
                    {/* Service name */}
                    <div className="px-6 py-4">
                      <p className="font-medium text-navy-950 text-sm">{row.service}</p>
                      {row.sub && <p className="text-navy-950/45 text-xs mt-0.5">{row.sub}</p>}
                    </div>

                    {/* Perth cell */}
                    <div className="px-4 py-4 flex items-center justify-center bg-teal-500/[0.04] border-l-2 border-l-teal-400/25">
                      {typeof row.perth === "string" ? (
                        <span className="text-teal-700 text-xs font-medium text-center leading-tight">{row.perth}</span>
                      ) : (
                        <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Available">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Other cities cell */}
                    <div className="px-4 py-4 flex items-center justify-center border-l border-navy-950/8">
                      {row.other === false ? (
                        <span className="text-navy-950/30 text-xs font-medium">Not available</span>
                      ) : typeof row.other === "string" ? (
                        <span className="text-navy-950/55 text-xs font-medium text-center leading-tight">{row.other}</span>
                      ) : (
                        <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-label="Available">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        className="section-padding bg-white"
        aria-labelledby="how-it-works-heading"
      >
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-16">
            <p className="section-label">Simple Process</p>
            <h2 id="how-it-works-heading" className="section-heading">
              Booked, confirmed, and done
            </h2>
            <p className="section-subheading max-w-xl mx-auto">
              We&apos;ve made booking a clean as easy as ordering takeaway — just three steps.
            </p>
          </AnimateInView>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-teal-300 to-transparent"
              aria-hidden="true"
            />

            {STEPS.map((step, i) => (
              <AnimateInView key={step.num} variant="slide-up" delay={i * 0.12}>
                <div className="relative flex flex-col items-center text-center p-8">
                  {/* Step number bubble */}
                  <div
                    className="w-20 h-20 rounded-2xl bg-teal-500 text-navy-950 font-display font-bold text-2xl flex items-center justify-center mb-6 shadow-teal"
                    aria-hidden="true"
                  >
                    {step.num}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-navy-950 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-navy-950/60 leading-relaxed">{step.description}</p>
                </div>
              </AnimateInView>
            ))}
          </div>

          <AnimateInView variant="slide-up" delay={0.36} className="text-center mt-10">
            <Link href="/quote" className="btn-primary text-base px-8 py-4">
              Start Your Booking
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-5 text-navy-950/50 text-xs">
              <span className="flex items-center gap-1.5"><span className="text-yellow-500" aria-hidden="true">★</span> {aggregate.ratingValue} · {aggregate.reviewCount} Google Reviews</span>
              <span className="flex items-center gap-1.5"><span className="text-teal-500" aria-hidden="true">✓</span> Police-checked cleaners</span>
              <span className="flex items-center gap-1.5"><span className="text-teal-500" aria-hidden="true">✓</span> Fully insured</span>
              <span className="flex items-center gap-1.5"><span className="text-teal-500" aria-hidden="true">✓</span> No lock-in contracts</span>
            </div>
          </AnimateInView>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section
        id="services"
        className="section-padding bg-navy-950/[0.03]"
        aria-labelledby="services-heading"
      >
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-16">
            <p className="section-label">What We Do</p>
            <h2 id="services-heading" className="section-heading">
              Cleaning services for every need
            </h2>
            <p className="section-subheading max-w-xl mx-auto">
              From regular home cleans to end-of-lease, commercial, and NDIS — we&apos;ve got you covered.
            </p>
          </AnimateInView>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, i) => (
              <AnimateInView key={service.title} variant="slide-up" delay={i * 0.08}>
                <Link
                  href={service.href}
                  className={`group flex flex-col p-8 rounded-2xl bg-gradient-to-br ${service.colour} border border-transparent hover:border-teal-200 card-hover shadow-card block`}
                  aria-label={`Learn more about ${service.title}`}
                >
                  <span
                    className="text-4xl mb-5 block"
                    aria-hidden="true"
                  >
                    {service.icon}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-navy-950 mb-2 group-hover:text-teal-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-navy-950/60 text-sm leading-relaxed flex-1">
                    {service.description}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-teal-600 flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                    Learn more
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE & AFTER ── */}
      <BeforeAfterGallery />

      {/* ── TESTIMONIALS ── */}
      <section
        className="section-padding bg-navy-950 relative overflow-hidden"
        aria-labelledby="testimonials-heading"
      >
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-teal-500/5 blur-3xl" aria-hidden="true" />

        <div className="container-custom relative">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="text-teal-500 font-semibold text-sm uppercase tracking-widest mb-3">
              Real Reviews
            </p>
            <h2 id="testimonials-heading" className="font-display text-3xl md:text-4xl lg:text-5xl text-white leading-tight">
              What our customers say
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4" aria-label="5.0 out of 5 stars — 12 Google reviews">
              <div className="flex gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-white/70 text-sm">{aggregate.ratingValue}★ &middot; {aggregate.reviewCount} Google Reviews</span>
            </div>
          </AnimateInView>

          {/* Featured review */}
          <AnimateInView variant="slide-up" className="mb-8">
            <article className="bg-white/8 border border-teal-500/30 rounded-3xl p-8 md:p-10">
              <div className="flex gap-0.5 mb-5" aria-label="5 star review">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote>
                <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6 italic">
                  &ldquo;{displayFeatured.text}&rdquo;
                </p>
                <footer className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500/40 flex items-center justify-center text-teal-300 font-bold text-sm shrink-0" aria-hidden="true">
                    {displayFeatured.initial}
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-white text-sm">{displayFeatured.author}</cite>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/20 font-medium">{displayFeatured.service}</span>
                      <span className="text-white/40 text-xs">via Google</span>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </article>
          </AnimateInView>

          {/* Review grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {gridReviews.map((t, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.07}>
                <article className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-teal-500/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex gap-0.5 mb-4" aria-label="5 star review">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="flex flex-col flex-1">
                    <p className="text-white/80 text-sm leading-relaxed mb-5 flex-1">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer className="flex items-center gap-3 mt-auto">
                      <div className="w-8 h-8 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-semibold shrink-0" aria-hidden="true">
                        {t.initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <cite className="not-italic text-white/70 text-xs font-medium">{t.author}</cite>
                          {t.badge && <span className="text-teal-400/70 text-xs">&middot; {t.badge}</span>}
                        </div>
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full border mt-1 font-medium ${t.serviceColour}`}>{t.service}</span>
                      </div>
                    </footer>
                  </blockquote>
                </article>
              </AnimateInView>
            ))}
          </div>

          {/* Google link */}
          <AnimateInView variant="slide-up" className="text-center">
            <a
              href="https://share.google/fj0GWzfRnsnWRg5w3"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/55 hover:text-white text-sm transition-colors group"
              aria-label="Read all Taspro reviews on Google (opens in new tab)"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 5.03l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 15.07 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Read all {aggregate.reviewCount} reviews on Google
              <svg className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </AnimateInView>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section
        className="section-padding bg-white"
        aria-labelledby="why-us-heading"
      >
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: image */}
            <AnimateInView variant="slide-right">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-card-hover">
                <Image
                  src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80"
                  alt="Professional cleaner at work in a bright clean home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Rating badge */}
                <div className="absolute bottom-6 left-6 bg-white rounded-2xl px-4 py-3 shadow-card-hover flex items-center gap-3" aria-label="5.0 Google rating">
                  <div className="text-2xl font-display font-bold text-navy-950">5.0</div>
                  <div>
                    <div className="flex gap-0.5" aria-hidden="true">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-navy-950/50 text-xs mt-0.5">{aggregate.reviewCount} Google Reviews</p>
                  </div>
                </div>
              </div>
            </AnimateInView>

            {/* Right: content */}
            <div>
              <AnimateInView variant="slide-up">
                <p className="section-label">Why Choose Taspro</p>
                <h2 id="why-us-heading" className="section-heading mb-4">
                  Cleaning you can trust in your home
                </h2>
                <p className="text-navy-950/60 leading-relaxed mb-10">
                  We built Taspro around one principle: if we wouldn&apos;t trust a cleaner in our own home, we won&apos;t send them to yours.
                </p>
              </AnimateInView>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {WHY_US.map((item, i) => (
                  <AnimateInView key={item.title} variant="slide-up" delay={i * 0.07}>
                    <div className="flex gap-4">
                      <div
                        className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-lg shrink-0"
                        aria-hidden="true"
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-950 text-sm mb-1">{item.title}</h3>
                        <p className="text-navy-950/55 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </AnimateInView>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section
        className="section-padding bg-navy-950/[0.03]"
        aria-labelledby="locations-heading"
      >
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Where We Operate</p>
            <h2 id="locations-heading" className="section-heading">
              Locations We Serve
            </h2>
            <p className="section-subheading max-w-xl mx-auto">
              Taspro operates across four Australian cities. Each location is covered by vetted,
              insured cleaners — all bookable online with instant transparent pricing.
            </p>
          </AnimateInView>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {LOCATIONS_DATA.map((loc, i) => (
              <AnimateInView key={loc.city} variant="slide-up" delay={i * 0.08}>
                <div className="bg-white rounded-3xl border border-navy-950/8 shadow-card overflow-hidden flex flex-col h-full">

                  {/* Map embed */}
                  <div className="relative h-52 overflow-hidden bg-navy-950/5">
                    <iframe
                      src={loc.mapSrc}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Service area map — ${loc.city}, ${loc.state}`}
                      aria-label={`Map showing ${loc.city} service area`}
                    />
                  </div>

                  {/* Card content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <h3 className="font-display text-xl font-bold text-navy-950">
                        {loc.city}
                      </h3>
                      <span className="text-xs font-semibold px-2.5 py-0.5 bg-teal-50 text-teal-700 rounded-full border border-teal-200">
                        {loc.state}
                      </span>
                      {loc.isHome && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-navy-950 text-teal-400 rounded-full">
                          Headquarters
                        </span>
                      )}
                    </div>

                    <p className="text-navy-950/60 text-sm leading-relaxed mb-5 flex-1">
                      {loc.desc}
                    </p>

                    <Link
                      href={loc.href}
                      className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-700 hover:gap-3 transition-all duration-200"
                      aria-label={`View cleaning services in ${loc.city}, ${loc.state}`}
                    >
                      View {loc.city} services
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="section-padding bg-white"
        aria-labelledby="faq-heading"
      >
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 id="faq-heading" className="section-heading">
              Frequently asked questions
            </h2>
          </AnimateInView>
          <FAQAccordion faqs={FAQS} />
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section
        className="section-padding bg-teal-500 relative overflow-hidden grain-overlay"
        aria-labelledby="cta-heading"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-400 to-teal-600"
          aria-hidden="true"
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center">
          <AnimateInView variant="slide-up">
            <h2
              id="cta-heading"
              className="font-display text-4xl md:text-5xl font-bold text-navy-950 mb-4"
            >
              Ready for a spotless space?
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-lg mx-auto">
              Get your instant quote in 2 minutes — no phone calls, no fuss.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 bg-navy-950 text-white font-semibold px-10 py-4 rounded-xl text-base hover:bg-navy-900 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              aria-label="Get your free instant quote"
            >
              Get a Free Instant Quote
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-navy-950/60 text-xs">
              <span className="flex items-center gap-1.5"><span className="text-yellow-600" aria-hidden="true">★</span> {aggregate.ratingValue} &middot; {aggregate.reviewCount} Google Reviews</span>
              <span className="flex items-center gap-1.5"><span aria-hidden="true">✓</span> Fully insured</span>
              <span className="flex items-center gap-1.5"><span aria-hidden="true">✓</span> Police-checked</span>
              <span className="flex items-center gap-1.5"><span aria-hidden="true">✓</span> No lock-in contracts</span>
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
