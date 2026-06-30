"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { BUSINESS, CITIES, SERVICES } from "@/config/business";

const SERVICE_LINKS = [
  SERVICES.homeCleaning && { href: "/services/home-cleaning",    label: "Home Cleaning" },
  SERVICES.endOfLease  && { href: "/services/end-of-lease",      label: "End of Lease" },
  SERVICES.commercial  && { href: "/services/commercial",         label: "Commercial" },
  SERVICES.deepClean   && { href: "/services/deep-clean",         label: "Deep Clean" },
  SERVICES.airbnb      && { href: "/services/airbnb-cleaning",    label: "Airbnb Cleaning" },
  SERVICES.ndis        && { href: "/services/ndis",               label: "NDIS Cleaning" },
].filter(Boolean) as { href: string; label: string }[];

const LOCATION_LINKS = CITIES.map((c) => ({
  href: `/locations/${c.slug}`,
  label: `${c.name}, ${c.state}`,
}));

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services/home-cleaning", label: "Services",  children: SERVICE_LINKS },
  { href: LOCATION_LINKS[0]?.href ?? "/locations", label: "Locations", children: LOCATION_LINKS },
  { href: "/pricing",  label: "Pricing" },
  { href: "/blog",     label: "Tips & Guides" },
  { href: "/about",    label: "About" },
  { href: "/contact",  label: "Contact" },
];

export default function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const darkMode = true;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
          darkMode ? "bg-navy-950/55 py-3" : "bg-navy-950/55 py-5"
        )}
        role="banner"
      >
        <div className="container-custom flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 focus-visible:outline-none"
            aria-label={`${BUSINESS.name} — Home`}
          >
            <Logo variant={darkMode ? "dark" : "light"} size="md" />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-1",
                      "text-white/90 hover:text-white hover:bg-white/10"
                    )}
                    aria-expanded={openDropdown === link.label}
                    aria-haspopup="true"
                  >
                    {link.label}
                    <svg className="w-3.5 h-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-card-hover border border-navy-950/5 py-2 w-52 z-50"
                      >
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "flex items-center px-4 py-2.5 text-sm font-medium transition-colors",
                              pathname === child.href
                                ? "text-teal-600 bg-teal-50"
                                : "text-navy-950 hover:text-teal-600 hover:bg-teal-50"
                            )}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    pathname === link.href
                      ? "text-teal-300"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA button */}
          <div className="hidden lg:flex">
            <Link href="/quote" className="btn-primary text-sm" aria-label="Get a free instant quote">
              Get a Free Instant Quote
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg transition-colors text-white hover:bg-white/10"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{menuOpen ? "Close" : "Open"} navigation menu</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={cn("block h-0.5 rounded-full bg-white transition-all duration-300", menuOpen && "rotate-45 translate-y-2")} />
              <span className={cn("block h-0.5 rounded-full bg-white transition-all duration-300", menuOpen && "opacity-0")} />
              <span className={cn("block h-0.5 rounded-full bg-white transition-all duration-300", menuOpen && "-rotate-45 -translate-y-2")} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-40 bg-navy-950 flex flex-col overflow-y-auto"
          >
            <div className="container-custom pt-24 pb-8 flex flex-col flex-1">
              <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
                {NAV_LINKS.map((link) => (
                  <div key={link.href}>
                    {link.children ? (
                      <>
                        <button
                          className="w-full text-left px-4 py-4 text-white/80 text-lg font-medium border-b border-white/10 flex items-center justify-between"
                          onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                        >
                          {link.label}
                          <svg className={cn("w-4 h-4 transition-transform", openDropdown === link.label && "rotate-180")} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        <AnimatePresence>
                          {openDropdown === link.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              {link.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className="block px-8 py-3 text-white/70 text-base hover:text-teal-400 transition-colors border-b border-white/5"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className={cn(
                          "block px-4 py-4 text-lg font-medium border-b border-white/10 transition-colors",
                          pathname === link.href ? "text-teal-400" : "text-white/80 hover:text-white"
                        )}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-auto pt-8 flex flex-col gap-3">
                <Link href="/quote" className="btn-primary w-full text-center justify-center text-base py-4">
                  Get a Free Instant Quote
                </Link>
                <a href={`tel:${BUSINESS.phone}`} className="btn-outline-white w-full text-center justify-center text-base py-4">
                  Call {BUSINESS.phoneFormatted}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
