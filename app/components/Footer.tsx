import Link from "next/link";
import Image from "next/image";
import { BUSINESS, CITIES, SERVICES } from "@/config/business";

const SERVICE_LINKS = [
  SERVICES.homeCleaning && { href: "/services/home-cleaning",    label: "Home Cleaning" },
  SERVICES.endOfLease  && { href: "/services/end-of-lease",      label: "End of Lease" },
  SERVICES.commercial  && { href: "/services/commercial",         label: "Commercial Cleaning" },
  SERVICES.deepClean   && { href: "/services/deep-clean",         label: "Deep Clean" },
  SERVICES.airbnb      && { href: "/services/airbnb-cleaning",    label: "Airbnb Cleaning" },
  SERVICES.ndis        && { href: "/services/ndis",               label: "NDIS Cleaning" },
].filter(Boolean) as { href: string; label: string }[];

const COMPANY_LINKS = [
  { href: "/about",   label: "About Us" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog",    label: "Tips & Guides" },
  { href: "/contact", label: "Contact" },
  { href: "/quote",   label: "Get a Free Instant Quote" },
];

const LOCATION_LINKS = CITIES.map((c) => ({
  href: `/locations/${c.slug}`,
  label: `${c.name}, ${c.state}`,
}));

const fullServiceCities = CITIES.filter((c) => c.fullService).map((c) => `${c.name} ${c.state}`);
const recurringCities   = CITIES.filter((c) => !c.fullService).map((c) => c.name);

const SOCIAL_LINKS = [
  BUSINESS.facebook  && { label: "Facebook",   href: BUSINESS.facebook,  path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
  BUSINESS.instagram && { label: "Instagram",  href: BUSINESS.instagram, path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
  BUSINESS.tiktok    && { label: "TikTok",     href: BUSINESS.tiktok,    path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.2 8.2 0 004.81 1.54V7a4.85 4.85 0 01-1.04-.31z" },
  BUSINESS.youtube   && { label: "YouTube",    href: BUSINESS.youtube,   path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  BUSINESS.linkedin  && { label: "LinkedIn",   href: BUSINESS.linkedin,  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  BUSINESS.twitter   && { label: "X (Twitter)", href: BUSINESS.twitter,  path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  BUSINESS.pinterest && { label: "Pinterest",  href: BUSINESS.pinterest, path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
].filter(Boolean) as { label: string; href: string; path: string }[];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-white" role="contentinfo" aria-label="Site footer">
      {/* Main footer content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="inline-block mb-6 focus-visible:outline-none"
              aria-label={`${BUSINESS.name} — Home`}
            >
              <Image src="/taspro-logo.png" alt={BUSINESS.name} width={200} height={76} className="object-contain" />
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {fullServiceCities.length > 0 && recurringCities.length > 0
                ? `Recurring home and commercial cleaning across ${CITIES.map((c) => c.name).join(", ")}. Full-service hubs in ${fullServiceCities.join(" and ")} — end-of-lease, deep cleans, NDIS and more. Insured, police-checked cleaners.`
                : `Professional cleaning services across ${CITIES.map((c) => c.name).join(", ")}. Insured, police-checked cleaners.`}
            </p>
            <div className="flex flex-col gap-3">
              <a
                href={`tel:${BUSINESS.phone}`}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-teal-400 transition-colors"
                aria-label={`Phone: ${BUSINESS.phoneFormatted}`}
              >
                <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                {BUSINESS.phoneFormatted}
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2 text-sm text-white/70 hover:text-teal-400 transition-colors"
                aria-label="Send us a message via our contact form"
              >
                <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Send us a message
              </Link>
            </div>
          </div>

          {/* Services column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-500 mb-4">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {SERVICE_LINKS.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className="text-sm text-white/60 hover:text-teal-400 transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-500 mb-4">Company</h3>
            <ul className="flex flex-col gap-2.5">
              {COMPANY_LINKS.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="text-sm text-white/60 hover:text-teal-400 transition-colors">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-500 mb-4">Locations</h3>
            <ul className="flex flex-col gap-2.5">
              {LOCATION_LINKS.map((loc) => (
                <li key={loc.href}>
                  <Link
                    href={loc.href}
                    className="flex items-center gap-2 text-sm text-white/60 hover:text-teal-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                    </svg>
                    {loc.label}
                  </Link>
                </li>
              ))}
            </ul>
            {fullServiceCities.length > 0 && recurringCities.length > 0 && (
              <p className="mt-4 text-xs text-white/30 leading-relaxed">
                {fullServiceCities.join(" & ")} — full service &middot; {recurringCities.join(" & ")} — recurring cleans only
              </p>
            )}

            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-teal-500 mb-4">Follow Us</h3>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-teal-500 hover:text-white transition-colors"
                      aria-label={`Follow us on ${social.label}`}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {currentYear} {BUSINESS.name}. All rights reserved.</p>
          {BUSINESS.abn && <p>ABN {BUSINESS.abn}</p>}
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-teal-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
