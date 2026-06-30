import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnimateInView from "@/app/components/AnimateInView";
import {
  CITIES,
  getCity,
  getSuburb,
  getService,
  cityServices,
  nearbySuburbs,
  allServiceSuburbParams,
} from "@/lib/suburb-seo";

const BASE_URL = "https://tasprocleaning.com.au";

interface Props {
  params: Promise<{ city: string; suburb: string; service: string }>;
}

export async function generateStaticParams() {
  return allServiceSuburbParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, suburb: suburbSlug, service: serviceSlug } = await params;
  const city = getCity(citySlug);
  const suburb = city ? getSuburb(city, suburbSlug) : undefined;
  const service = getService(serviceSlug);
  if (!city || !suburb || !service) return {};
  if (!(city.services as string[]).includes(serviceSlug)) return {};

  const title = `${service.name} ${suburb.name} ${city.stateCode} | Taspro`;
  const description = `${service.name} in ${suburb.name}, ${city.name} ${city.stateCode}. ${service.tagline} Police-checked, fully insured cleaners. Book online or call (08) 7081 6811.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/locations/${city.slug}/${suburb.slug}/${service.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/locations/${city.slug}/${suburb.slug}/${service.slug}`,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function ServiceSuburbPage({ params }: Props) {
  const { city: citySlug, suburb: suburbSlug, service: serviceSlug } = await params;
  const city = getCity(citySlug);
  const suburb = city ? getSuburb(city, suburbSlug) : undefined;
  const service = getService(serviceSlug);

  if (!city || !suburb || !service) notFound();
  if (!(city.services as string[]).includes(serviceSlug)) notFound();

  const otherServices = cityServices(city).filter((s) => s.slug !== service.slug);
  const nearby = nearbySuburbs(city, suburb.slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: city.name, item: `${BASE_URL}/locations/${city.slug}` },
      { "@type": "ListItem", position: 3, name: suburb.name, item: `${BASE_URL}/locations/${city.slug}/${suburb.slug}` },
      { "@type": "ListItem", position: 4, name: service.name, item: `${BASE_URL}/locations/${city.slug}/${suburb.slug}/${service.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service.name} ${suburb.name}`,
    description: `${service.name} in ${suburb.name}, ${city.name} ${city.stateCode}. ${service.tagline}`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "City", name: suburb.name, containedIn: `${city.name}, ${city.state}, Australia` },
    serviceType: service.name,
    url: `${BASE_URL}/locations/${city.slug}/${suburb.slug}/${service.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      description: `${service.name} in ${suburb.name}. Get an instant quote online.`,
    },
  };

  const faqItems = [
    {
      q: `Do you offer ${service.name.toLowerCase()} in ${suburb.name}?`,
      a: `Yes — Taspro provides ${service.name.toLowerCase()} in ${suburb.name} and surrounding ${city.name} suburbs. Available Monday to Saturday, 8am–9:30pm.`,
    },
    {
      q: `How much does ${service.name.toLowerCase()} cost in ${suburb.name}?`,
      a: `Pricing depends on property size and specific requirements. Use our instant online quote tool to get your exact price in under 60 seconds — no phone call needed.`,
    },
    {
      q: `Are your ${suburb.name} cleaners police checked?`,
      a: `Yes. All cleaners on our ${city.name} team hold a current National Police Check and Public Liability Insurance.`,
    },
    ...(service.slug === "end-of-lease"
      ? [{ q: `Is the bond-back guarantee included?`, a: `Yes. Our end of lease cleans in ${suburb.name} include our bond-back guarantee — if your property manager identifies any cleaning issues, we return to fix them at no extra charge.` }]
      : []),
    ...(service.slug === "ndis"
      ? [{ q: `Do you accept NDIS funding for cleaning in ${suburb.name}?`, a: `Yes. We work with plan-managed, agency-managed and self-managed NDIS participants in ${suburb.name}. We handle all invoicing and documentation.` }]
      : []),
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="relative pt-40 pb-20 bg-navy-950 grain-overlay overflow-hidden">
        <Image
          src={city.heroImage}
          alt={`${service.name} in ${suburb.name}`}
          fill
          priority
          className="object-cover opacity-10"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-950/90 to-navy-900/80" aria-hidden="true" />
        <div className="relative container-custom text-center">
          <AnimateInView variant="slide-up">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center gap-2 text-white/50 text-xs mb-6" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white/80 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/locations/${city.slug}`} className="hover:text-white/80 transition-colors">{city.name}</Link>
              <span>/</span>
              <Link href={`/locations/${city.slug}/${suburb.slug}`} className="hover:text-white/80 transition-colors">{suburb.name}</Link>
              <span>/</span>
              <span className="text-white/80">{service.name}</span>
            </nav>
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {suburb.name} · {city.name} {city.stateCode}
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              {service.name}<br className="hidden md:block" /> in {suburb.name}
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              {service.tagline} Serving {suburb.name} and surrounding {city.name} suburbs — book online in minutes.
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

      {/* What's included */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
            <AnimateInView variant="slide-right">
              <p className="section-label">What&apos;s Included</p>
              <h2 className="section-heading mb-6">{service.name} in {suburb.name}</h2>
              <p className="text-navy-950/65 mb-8 leading-relaxed">
                Every {service.name.toLowerCase()} we carry out in {suburb.name} follows a thorough, standardised process. Our cleaners are trained, insured and background-checked — you can trust the result every time.
              </p>
              <ul className="space-y-3">
                {service.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-navy-950/75 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-navy-950/40 italic">
                Plus any extras you add when booking. Full checklist provided in your booking confirmation.
              </p>
            </AnimateInView>

            <AnimateInView variant="slide-left">
              {/* Trust signals card */}
              <div className="bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 p-7 space-y-5">
                <h3 className="font-display text-xl font-bold text-navy-950">Why choose Taspro in {suburb.name}</h3>
                {[
                  { icon: "🛡️", title: "Police-checked & insured", desc: `Every cleaner on our ${city.name} team holds a National Police Check and Public Liability Insurance.` },
                  { icon: "✅", title: "Satisfaction guarantee", desc: "We return within 24 hours to fix any missed areas — at no extra cost." },
                  { icon: "💰", title: "Transparent pricing", desc: "Instant online quote. No hidden fees. What you see is what you pay." },
                  ...(service.slug === "end-of-lease" ? [{ icon: "🔑", title: "Bond-back guarantee", desc: "We follow the REIWA-standard checklist used by Perth property managers." }] : []),
                  ...(service.slug === "ndis" ? [{ icon: "💙", title: "NDIS registered", desc: "We accept plan, agency and self-managed NDIS funding with full documentation." }] : []),
                ].map((point) => (
                  <div key={point.title} className="flex items-start gap-4">
                    <span className="text-2xl shrink-0" aria-hidden="true">{point.icon}</span>
                    <div>
                      <p className="font-semibold text-navy-950 text-sm">{point.title}</p>
                      <p className="text-navy-950/60 text-sm mt-0.5 leading-relaxed">{point.desc}</p>
                    </div>
                  </div>
                ))}
                <Link href="/quote" className="btn-primary w-full text-center mt-2">
                  Get Your Instant Quote
                </Link>
              </div>
            </AnimateInView>
          </div>
        </div>
      </section>

      {/* Other services in suburb */}
      {otherServices.length > 0 && (
        <section className="section-padding bg-navy-950/[0.03]">
          <div className="container-custom">
            <AnimateInView variant="slide-up" className="text-center mb-12">
              <p className="section-label">More Services</p>
              <h2 className="section-heading">Other cleaning services in {suburb.name}</h2>
            </AnimateInView>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherServices.map((svc, i) => (
                <AnimateInView key={svc.slug} variant="slide-up" delay={i * 0.07}>
                  <Link
                    href={`/locations/${city.slug}/${suburb.slug}/${svc.slug}`}
                    className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-navy-950/8 card-hover h-full"
                  >
                    <span className="text-3xl shrink-0" aria-hidden="true">{svc.icon}</span>
                    <div>
                      <h3 className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{svc.name}</h3>
                      <p className="text-navy-950/55 text-xs leading-relaxed">{svc.tagline}</p>
                    </div>
                  </Link>
                </AnimateInView>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby suburbs for same service */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Nearby Areas</p>
            <h2 className="section-heading">{service.name} near {suburb.name}</h2>
          </AnimateInView>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {nearby.map((s) => (
              <Link
                key={s.slug}
                href={`/locations/${city.slug}/${s.slug}/${service.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-navy-950/[0.03] rounded-xl border border-navy-950/8 text-sm text-navy-950/70 font-medium hover:border-teal-400 hover:text-teal-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {service.name} {s.name}
              </Link>
            ))}
            <Link
              href={`/locations/${city.slug}/${suburb.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 rounded-xl border border-teal-200 text-sm text-teal-700 font-semibold hover:bg-teal-100 transition-colors"
            >
              All services in {suburb.name} →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-navy-950/[0.03]">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 className="section-heading">{service.name} {suburb.name} — questions answered</h2>
          </AnimateInView>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <AnimateInView key={i} variant="slide-up" delay={i * 0.06}>
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
      <section className="section-padding bg-teal-500">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <h2 className="font-display text-4xl font-bold text-navy-950 mb-4">
              Book your {service.name.toLowerCase()} in {suburb.name}
            </h2>
            <p className="text-navy-950/70 text-lg mb-8 max-w-xl mx-auto">
              Instant online quote — your exact price in under 60 seconds. No phone calls needed.
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
