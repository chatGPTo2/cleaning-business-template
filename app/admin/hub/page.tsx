import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { logoutAdmin } from "../actions";
import { totalSuburbPages, totalServiceSuburbPages } from "@/lib/suburb-seo";
import { getAllDbPosts } from "@/lib/blog";
import { allPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

const MODULES = [
  {
    href: "/admin/dashboard",
    icon: "👥",
    title: "CRM",
    description: "Manage customers, quote leads, and jobs. Track follow-ups and payment status.",
    links: [
      { label: "Dashboard", href: "/admin/dashboard" },
      { label: "Customers", href: "/admin/customers" },
      { label: "Quotes", href: "/admin/quotes" },
      { label: "Jobs", href: "/admin/jobs" },
    ],
  },
  {
    href: "/admin/blog",
    icon: "✍️",
    title: "Blog",
    description: "Publish articles and paste WPAutoBlog content. No code deploy needed — live within 60 seconds.",
    links: [
      { label: "All Posts", href: "/admin/blog" },
      { label: "New Post", href: "/admin/blog/new" },
    ],
  },
  {
    href: "/admin/ai-seo",
    icon: "🤖",
    title: "AI SEO",
    description: "Use Search Console, Analytics and competitor headings to create non-duplicate blog drafts for review.",
    links: [
      { label: "Planner", href: "/admin/ai-seo" },
      { label: "Review drafts", href: "/admin/blog" },
    ],
  },
  {
    href: "/admin/seo-pages",
    icon: "🔍",
    title: "SEO Pages",
    description: "Programmatic suburb landing pages. Every city, suburb and service combination.",
    links: [
      { label: "View all pages", href: "/admin/seo-pages" },
    ],
  },
  {
    href: "/admin/reviews",
    icon: "⭐",
    title: "Reviews",
    description: "Manage Google reviews displayed on the site. Add, hide, or feature reviews. Auto-imports from Google Places.",
    links: [
      { label: "Manage reviews", href: "/admin/reviews" },
    ],
  },
];

export default async function HubPage() {
  await requireAdmin();
  const seoTotal = totalSuburbPages() + totalServiceSuburbPages();
  const dbPosts = await getAllDbPosts();
  const totalPosts = dbPosts.length + allPosts.length;
  const publishedCount = dbPosts.filter((p) => p.status === "published").length + allPosts.length;

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-10 pt-28">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Taspro Internal</p>
            <h1 className="font-display text-3xl font-bold text-navy-950 mt-1">Admin hub</h1>
            <p className="text-sm text-slate-500 mt-1">Select a section to manage.</p>
          </div>
          <form action={logoutAdmin}>
            <button className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-500 hover:border-red-300 hover:text-red-600 transition-colors">
              Sign out
            </button>
          </form>
        </div>

        {/* Module cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {MODULES.map((mod) => (
            <div key={mod.href} className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl" aria-hidden="true">{mod.icon}</span>
                  <div>
                    <h2 className="font-display text-xl font-bold text-navy-950">{mod.title}</h2>
                    <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{mod.description}</p>
                  </div>
                </div>
                {mod.title === "SEO Pages" && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-700">
                    {seoTotal} pages live
                  </div>
                )}
                {mod.title === "Blog" && (
                  <div className="mb-4 flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-700">
                      {publishedCount} published
                    </span>
                    {dbPosts.filter((p) => p.status === "draft").length > 0 && (
                      <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-700">
                        {dbPosts.filter((p) => p.status === "draft").length} draft{dbPosts.filter((p) => p.status === "draft").length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
                {mod.title === "AI SEO" && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
                    Drafts only
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {mod.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-teal-400 hover:bg-white hover:text-teal-700 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="border-t border-slate-100 bg-slate-50 px-6 py-3">
                <Link href={mod.href} className="text-sm font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1.5">
                  Open {mod.title}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Quick links</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "View live site", href: "https://tasprocleaning.com.au", external: true },
              { label: "Sitemap", href: "https://tasprocleaning.com.au/sitemap.xml", external: true },
              { label: "Get a quote", href: "https://tasprocleaning.com.au/quote", external: true },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-colors"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
