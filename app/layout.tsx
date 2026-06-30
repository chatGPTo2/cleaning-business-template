import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import CookieBanner from "./components/CookieBanner";
import WhatsAppWidget from "./components/WhatsAppWidget";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { localBusinessSchema, websiteSchema } from "@/lib/schema";
import { BUSINESS, CITIES } from "@/config/business";

/* ── Fonts ── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const cityList = CITIES.map((c) => `${c.name} ${c.state}`).join(", ");
const fullServiceCities = CITIES.filter((c) => c.fullService).map((c) => c.name).join(" and ");

/* ── Root metadata ── */
export const metadata: Metadata = {
  metadataBase: new URL(BUSINESS.url),
  title: {
    default: `${BUSINESS.name} | Professional Cleaning in ${cityList}`,
    template: `%s | ${BUSINESS.name}`,
  },
  description: `Trusted, police-checked professional cleaners for homes and offices across ${cityList}. Full-service hubs in ${fullServiceCities} — end-of-lease, deep cleans, NDIS and more. Book online in minutes.`,
  keywords: [
    ...CITIES.map((c) => `cleaning services ${c.name.toLowerCase()}`),
    "end of lease cleaning",
    "house cleaning",
    "commercial cleaning",
    "NDIS cleaning",
    "bond cleaning",
    BUSINESS.name.toLowerCase(),
  ],
  authors: [{ name: BUSINESS.name }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: BUSINESS.url,
    siteName: BUSINESS.name,
    title: `${BUSINESS.name} | Professional Cleaning Services`,
    description: `Trusted, police-checked professional cleaners for homes and offices across ${cityList}. Full service in ${fullServiceCities} — end-of-lease, deep cleans, NDIS and more.`,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name} — Professional Cleaning Services`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS.name} | Professional Cleaning Services`,
    description: `Trusted cleaning services across ${cityList}. Book online in minutes.`,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${playfair.variable} ${plusJakarta.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon" sizes="180x180" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <Navigation />
        <main id="main-content">{children}</main>
        <Footer />
        <BackToTop />
        <CookieBanner />
        <WhatsAppWidget />
      </body>
    </html>
  );
}
