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

/* ── Fonts ── */
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  // Subset to Latin characters only for performance
  weight: ["400", "600", "700", "800"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* ── Root metadata ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://tasprocleaning.com.au"),
  title: {
    default: "Taspro Cleaning Solutions | Professional Cleaning in Sydney, Melbourne, Perth & Launceston",
    template: "%s | Taspro Cleaning Solutions",
  },
  description:
    "Trusted, police-checked professional cleaners for homes and offices across Sydney NSW, Melbourne VIC, Perth WA and Launceston TAS. Full-service hubs in Perth and Launceston — end-of-lease, deep cleans, NDIS and more. Book online in minutes.",
  keywords: [
    "cleaning services sydney",
    "cleaning services melbourne",
    "cleaning services perth",
    "cleaning services launceston",
    "end of lease cleaning sydney",
    "end of lease cleaning tasmania",
    "house cleaning launceston",
    "commercial cleaning",
    "NDIS cleaning",
    "bond cleaning",
    "taspro cleaning",
  ],
  authors: [{ name: "Taspro Cleaning Solutions" }],
  creator: "Taspro Cleaning Solutions",
  publisher: "Taspro Cleaning Solutions",
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://tasprocleaning.com.au",
    siteName: "Taspro Cleaning Solutions",
    title: "Taspro Cleaning Solutions | Professional Cleaning Services",
    description:
      "Trusted, police-checked professional cleaners for homes and offices across Sydney, Melbourne, Perth and Launceston. Full service in Perth and Launceston — end-of-lease, deep cleans, NDIS and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Taspro Cleaning Solutions — Professional Cleaning Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Taspro Cleaning Solutions | Professional Cleaning Services",
    description:
      "Trusted cleaning services across Sydney, Melbourne, Perth and Launceston. Book online in minutes.",
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
