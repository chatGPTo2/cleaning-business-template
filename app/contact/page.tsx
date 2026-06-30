import type { Metadata } from "next";
import AnimateInView from "@/app/components/AnimateInView";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Taspro Cleaning Solutions | Launceston, Melbourne & Perth",
  description:
    "Get in touch with Taspro Cleaning Solutions. Call (08) 7081 6811 or use our contact form. Serving Launceston TAS, Melbourne VIC and Perth WA.",
  alternates: { canonical: "https://tasprocleaning.com.au/contact" },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-navy-950" aria-labelledby="contact-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">Get In Touch</p>
            <h1 id="contact-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              We&apos;d love to hear from you
            </h1>
            <p className="text-white/65 text-lg max-w-xl mx-auto">
              Questions, commercial enquiries, or just want to chat — we&apos;re here and respond quickly.
            </p>
          </AnimateInView>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="section-padding bg-white" aria-labelledby="contact-form-heading">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left: info */}
            <div className="lg:col-span-2 space-y-8">
              <AnimateInView variant="slide-right">
                <h2 id="contact-form-heading" className="font-display text-2xl font-bold text-navy-950 mb-6">
                  Contact information
                </h2>

                {/* Phone */}
                <a
                  href="tel:+61870816811"
                  className="flex items-start gap-4 p-5 rounded-2xl border border-navy-950/8 hover:border-teal-300 hover:bg-teal-50 transition-all group"
                  aria-label="Call us on (08) 7081 6811"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-500 transition-colors">
                    <svg className="w-5 h-5 text-teal-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-navy-950/50 mb-0.5">Phone</p>
                    <p className="font-semibold text-navy-950">(08) 7081 6811</p>
                  </div>
                </a>

                {/* Email */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-navy-950/8">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-navy-950/50 mb-0.5">Email</p>
                    <p className="font-semibold text-navy-950">Use the contact form →</p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-navy-950/8">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-navy-950/50 mb-0.5">Hours</p>
                    <p className="font-semibold text-navy-950">Mon – Sat, 8am – 9:30pm</p>
                    <p className="text-sm text-navy-950/50 mt-0.5">We often respond outside hours too</p>
                  </div>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-4 p-5 rounded-2xl border border-navy-950/8">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-navy-950/50 mb-1">Locations</p>
                    <p className="font-semibold text-navy-950">Perth, WA <span className="text-xs font-normal text-teal-600">(full service)</span></p>
                    <p className="font-semibold text-navy-950">Launceston, TAS</p>
                    <p className="font-semibold text-navy-950">Melbourne, VIC</p>
                    <p className="font-semibold text-navy-950">Sydney, NSW</p>
                    <p className="text-xs text-navy-950/50 mt-1.5">Melbourne &amp; Sydney: recurring cleans only. Launceston: full service including end of lease.</p>
                  </div>
                </div>
                {/* Social media */}
                <div className="p-5 rounded-2xl border border-navy-950/8">
                  <p className="text-sm text-navy-950/50 mb-3">Follow us</p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61553367031598&mibextid=LQQJ4d", path: "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" },
                      { label: "Instagram", href: "https://www.instagram.com/tasprocleaning/", path: "M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" },
                      { label: "TikTok", href: "https://www.tiktok.com/@tasprocleaning", path: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.87a8.2 8.2 0 004.81 1.54V7a4.85 4.85 0 01-1.04-.31z" },
                      { label: "YouTube", href: "https://www.youtube.com/@tasprocleaningsolutions", path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                      { label: "LinkedIn", href: "https://www.linkedin.com/showcase/104814236/", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                      { label: "X (Twitter)", href: "https://x.com/tasprocleaning", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                      { label: "Pinterest", href: "https://au.pinterest.com/tasprocleaning/", path: "M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" },
                    ].map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-teal-500 hover:text-white transition-colors"
                        aria-label={`Follow us on ${social.label}`}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d={social.path} />
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </AnimateInView>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-3">
              <AnimateInView variant="slide-left">
                <ContactForm />
              </AnimateInView>
            </div>
          </div>

          {/* Google Maps — 4 cities */}
          <AnimateInView variant="slide-up" delay={0.2} className="mt-16">
            <h2 className="font-display text-2xl font-bold text-navy-950 mb-5">Find us</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { city: "Perth", state: "WA", src: "https://maps.google.com/maps?q=Perth+WA+Australia&t=&z=11&ie=UTF8&iwloc=&output=embed" },
                { city: "Melbourne", state: "VIC", src: "https://maps.google.com/maps?q=Melbourne+VIC+Australia&t=&z=11&ie=UTF8&iwloc=&output=embed" },
                { city: "Sydney", state: "NSW", src: "https://maps.google.com/maps?q=Sydney+NSW+Australia&t=&z=11&ie=UTF8&iwloc=&output=embed" },
                { city: "Launceston", state: "TAS", src: "https://maps.google.com/maps?q=Launceston+TAS+Australia&t=&z=12&ie=UTF8&iwloc=&output=embed" },
              ].map((loc) => (
                <div key={loc.city} className="rounded-2xl overflow-hidden shadow-card border border-navy-950/8">
                  <div className="h-48">
                    <iframe
                      title={`Taspro Cleaning Solutions — ${loc.city}, ${loc.state}`}
                      src={loc.src}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      aria-label={`Map showing ${loc.city}, ${loc.state}`}
                    />
                  </div>
                  <div className="px-4 py-3 bg-white flex items-center gap-2">
                    <span className="font-semibold text-navy-950 text-sm">{loc.city}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-teal-50 text-teal-700 rounded-full border border-teal-200">{loc.state}</span>
                    {loc.city === "Perth" && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-navy-950 text-teal-400 rounded-full">Headquarters</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
