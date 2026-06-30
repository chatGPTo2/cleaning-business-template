import { BUSINESS, CITIES, SERVICES } from "@/config/business";

const serviceList = [
  SERVICES.homeCleaning && "Home Cleaning",
  SERVICES.endOfLease  && "End of Lease Cleaning",
  SERVICES.commercial  && "Commercial Cleaning",
  SERVICES.deepClean   && "Deep Cleaning",
  SERVICES.ndis        && "NDIS Cleaning",
  SERVICES.airbnb      && "Airbnb Cleaning",
].filter(Boolean) as string[];

const areaServed = CITIES.map((c) => ({
  "@type": "City",
  name: c.name,
  containedIn: `${c.state}, Australia`,
}));

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BUSINESS.url}/#organization`,
  name: BUSINESS.name,
  url: BUSINESS.url,
  telephone: BUSINESS.phone,
  email: BUSINESS.email,
  description: BUSINESS.description,
  priceRange: "$$",
  currenciesAccepted: "AUD",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  areaServed,
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Cleaning Services",
    itemListElement: serviceList.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s },
    })),
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: BUSINESS.googleRating,
    reviewCount: BUSINESS.reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
  sameAs: [
    BUSINESS.facebook,
    BUSINESS.instagram,
    BUSINESS.linkedin,
    BUSINESS.youtube,
  ].filter(Boolean),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BUSINESS.url}/#website`,
  url: BUSINESS.url,
  name: BUSINESS.name,
  publisher: { "@id": `${BUSINESS.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BUSINESS.url}/search?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};
