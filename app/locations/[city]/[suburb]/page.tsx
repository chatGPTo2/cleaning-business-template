import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import AnimateInView from "@/app/components/AnimateInView";
import {
  CITIES,
  getCity,
  getSuburb,
  cityServices,
  nearbySuburbs,
  allSuburbParams,
} from "@/lib/suburb-seo";

const BASE_URL = "https://tasprocleaning.com.au";

interface Props {
  params: Promise<{ city: string; suburb: string }>;
}

export async function generateStaticParams() {
  return allSuburbParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: citySlug, suburb: suburbSlug } = await params;
  const city = getCity(citySlug);
  const suburb = city ? getSuburb(city, suburbSlug) : undefined;
  if (!city || !suburb) return {};

  const title = `Cleaning Services ${suburb.name} | Taspro ${city.name}`;
  const description = `Professional cleaning services in ${suburb.name}, ${city.name} ${city.stateCode}. Police-checked, fully insured cleaners. ${city.fullService ? "Home cleaning, end of lease, NDIS, deep cleans & more." : "Home & commercial cleaning."} Book online or call (08) 7081 6811.`;

  return {
    title,
    description,
    alternates: { canonical: `${BASE_URL}/locations/${city.slug}/${suburb.slug}` },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/locations/${city.slug}/${suburb.slug}`,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
  };
}

export default async function SuburbPage({ params }: Props) {
  const { city: citySlug, suburb: suburbSlug } = await params;
  const city = getCity(citySlug);
  const suburb = city ? getSuburb(city, suburbSlug) : undefined;
  if (!city || !suburb) notFound();

  const services = cityServices(city);
  const nearby = nearbySuburbs(city, suburb.slug);
  const otherCities = CITIES.filter((c) => c.slug !== city.slug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Locations", item: `${BASE_URL}/locations/${city.slug}` },
      { "@type": "ListItem", position: 3, name: city.name, item: `${BASE_URL}/locations/${city.slug}` },
      { "@type": "ListItem", position: 4, name: suburb.name, item: `${BASE_URL}/locations/${city.slug}/${suburb.slug}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Cleaning Services ${suburb.name}`,
    description: `Professional cleaning services in ${suburb.name}, ${city.name} ${city.stateCode}.`,
    provider: { "@id": `${BASE_URL}/#organization` },
    areaServed: { "@type": "City", name: suburb.name, containedIn: `${city.name}, ${city.state}, Australia` },
    url: `${BASE_URL}/locations/${city.slug}/${suburb.slug}`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Do you offer cleaning services in ${suburb.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `Yes, Taspro Cleaning Solutions services ${suburb.name} and the surrounding ${city.name} area. Our team is available Monday to Saturday, 8am–9:30pm.` },
      },
      {
        "@type": "Question",
        name: `What cleaning services are available in ${suburb.name}?`,
        acceptedAnswer: { "@type": "Answer", text: `In ${suburb.name} we offer: ${services.map((s) => s.name).join(", ")}.` },
      },
      {
        "@type": "Question",
        name: `Are your ${suburb.name} cleaners police checked?`,
        acceptedAnswer: { "@type": "Answer", text: `Yes. Every cleaner on our ${city.name} team undergoes a National Police Check and holds Public Liability Insurance before joining Taspro.` },
      },
    ],
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
          alt={`${suburb.name}, ${city.name}`}
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
              <span className="text-white/80">{suburb.name}</span>
            </nav>
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {suburb.name} · {city.name} {city.stateCode}
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
              Cleaning Services<br className="hidden md:block" /> in {suburb.name}
            </h1>
            <p className="text-white/65 text-lg max-w-2xl mx-auto mb-8">
              Professional, police-checked cleaners serving {suburb.name} and surrounding {city.name} suburbs.{" "}
              {city.fullService
                ? "Full range of services — home cleaning, end of lease, NDIS, deep cleans and more."
                : "Recurring home and commercial cleans tailored to your schedule."}
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

      {/* Trust strip */}
      {city.fullService && (
        <section className="bg-teal-500 border-b border-teal-600/20">
          <div className="container-custom py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              <span className="font-display font-bold text-navy-950 text-sm shrink-0">{suburb.name} — Full Service Available</span>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
                {["Police Checked", "Fully Insured", "Satisfaction Guarantee", "Online Booking", "Same-Day Available"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-navy-950/80 text-xs font-medium">
                    <svg className="w-3.5 h-3.5 text-navy-950/70 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-14">
            <p className="section-label">Our Services</p>
            <h2 className="section-heading">What we offer in {suburb.name}</h2>
            <p className="section-subheading max-w-2xl mx-auto">
              All services are performed by background-checked, insured cleaners. Book online and get a price in seconds.
            </p>
          </AnimateInView>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc, i) => (
              <AnimateInView key={svc.slug} variant="slide-up" delay={i * 0.07}>
                <Link
                  href={`/locations/${city.slug}/${suburb.slug}/${svc.slug}`}
                  className="group flex items-start gap-5 p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover h-full"
                >
                  <span className="text-4xl shrink-0" aria-hidden="true">{svc.icon}</span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-950 mb-1 group-hover:text-teal-700 transition-colors">
                      {svc.name}
                    </h3>
                    <p className="text-navy-950/60 text-sm leading-relaxed">{svc.tagline}</p>
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

      {/* Why Taspro */}
      <section className="section-padding bg-navy-950/[0.03]">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">Why Taspro</p>
            <h2 className="section-heading">The trusted choice in {suburb.name}</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Police-checked cleaners", desc: `Every cleaner in our ${city.name} team holds a current National Police Check and public liability insurance.` },
              { title: "Satisfaction guarantee", desc: "Not happy? We return within 24 hours to fix any missed areas — at absolutely no extra charge." },
              { title: "Instant online pricing", desc: "No phone calls, no guessing. Get your exact price in under 60 seconds using our online quote tool." },
              { title: "Flexible scheduling", desc: "Early mornings, evenings and weekends available — we work around your schedule, not the other way around." },
              { title: "Consistent cleaners", desc: "Wherever possible we send the same cleaner each visit so you always know who's coming to your home." },
              { title: "Local team", desc: `We know ${suburb.name} and the surrounding ${city.name} area — reliable, on-time, every visit.` },
            ].map((point, i) => (
              <AnimateInView key={point.title} variant="slide-up" delay={i * 0.06}>
                <div className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-navy-950/8">
                  <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-navy-950 text-sm">{point.title}</p>
                    <p className="text-navy-950/60 text-sm mt-1 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby suburbs */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">Also Nearby</p>
            <h2 className="section-heading">Other suburbs we service in {city.name}</h2>
          </AnimateInView>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {nearby.map((s) => (
              <Link
                key={s.slug}
                href={`/locations/${city.slug}/${s.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-navy-950/[0.03] rounded-xl border border-navy-950/8 text-sm text-navy-950/70 font-medium hover:border-teal-400 hover:text-teal-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {s.name}
              </Link>
            ))}
            <Link
              href={`/locations/${city.slug}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-50 rounded-xl border border-teal-200 text-sm text-teal-700 font-semibold hover:bg-teal-100 transition-colors"
            >
              View all {city.name} suburbs →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-navy-950/[0.03]">
        <div className="container-custom max-w-3xl">
          <AnimateInView variant="slide-up" className="text-center mb-12">
            <p className="section-label">FAQ</p>
            <h2 className="section-heading">{suburb.name} cleaning questions answered</h2>
          </AnimateInView>
          <div className="space-y-4">
            {[
              {
                q: `Do you clean in ${suburb.name}?`,
                a: `Yes — Taspro services ${suburb.name} and surrounding ${city.name} suburbs. We're available Monday to Saturday, 8am–9:30pm, and often accommodate same-day requests.`,
              },
              {
                q: `What cleaning services do you offer in ${suburb.name}?`,
                a: `In ${suburb.name} we offer ${services.map((s) => s.name).join(", ")}. ${city.fullService ? "All service types are available — from one-off bookings to regular recurring cleans." : "We specialise in recurring home and commercial cleaning in your area."}`,
              },
              {
                q: `Are your ${suburb.name} cleaners police checked?`,
                a: `Yes. Every cleaner on our ${city.name} team undergoes a National Police Check and holds current Public Liability Insurance before joining Taspro.`,
              },
              {
                q: `How do I book a cleaner in ${suburb.name}?`,
                a: `Use our online quote tool at tasprocleaning.com.au/quote — select your service, enter your details and get an instant price. No phone calls required. You can also call us on (08) 7081 6811.`,
              },
            ].map((faq, i) => (
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

      {/* Other cities */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <AnimateInView variant="slide-up" className="text-center mb-10">
            <p className="section-label">We Also Serve</p>
            <h2 className="section-heading">Other cities</h2>
          </AnimateInView>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {otherCities.map((c, i) => (
              <AnimateInView key={c.slug} variant="slide-up" delay={i * 0.07}>
                <Link href={`/locations/${c.slug}`} className="group flex flex-col items-center p-6 bg-navy-950/[0.03] rounded-2xl border border-navy-950/8 card-hover text-center">
                  <p className="font-semibold text-navy-950 text-sm mb-1 group-hover:text-teal-700 transition-colors">{c.name}</p>
                  <p className="text-navy-950/55 text-xs">{c.stateCode}</p>
                  <span className="mt-3 text-teal-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2.5 transition-all">
                    View services
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
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
              Ready to book your {suburb.name} clean?
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
