import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {(phase: string) => import('next').NextConfig} */
const nextConfig = (phase) => ({
  // Keep local dev assets separate from production build output. This prevents
  // `next build`/Vercel deploys from breaking a running `next dev` session.
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  turbopack: {
    root: projectRoot,
  },
  // Redirect trailing slashes to canonical non-slash URLs to avoid duplicate content
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "xkzapbdpzdjczarrpqnj.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/about-taspro{/}?",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/faq-cleaning{/}?",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/cleaning-prices-launceston{/}?",
        destination: "/pricing",
        permanent: true,
      },
      {
        source: "/contact-cleaning-launceston{/}?",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/get-a-quote{/}?",
        destination: "/quote",
        permanent: true,
      },
      {
        source: "/get-cleaning-service-quotes-online{/}?",
        destination: "/quote",
        permanent: true,
      },
      {
        source: "/bond-cleaning-launceston{/}?",
        destination: "/locations/launceston/end-of-lease-cleaning",
        permanent: true,
      },
      {
        source: "/end-of-lease-cleaning/:path*",
        destination: "/services/end-of-lease",
        permanent: true,
      },
      {
        source: "/office-cleaning{/}?",
        destination: "/services/commercial",
        permanent: true,
      },
      {
        source: "/listings{/}?",
        destination: "/",
        permanent: true,
      },
      {
        source: "/search_term-in-location-ndis-home-cleaning-taspro-cleaning/:slug*",
        destination: "/services/ndis",
        permanent: true,
      },
      {
        source: "/search_term-in-location-after-party-cleaning-taspro-cleaning/:slug*",
        destination: "/services/deep-clean",
        permanent: true,
      },
      {
        source: "/search_term-in-location-:category/:slug*",
        destination: "/services/home-cleaning",
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
