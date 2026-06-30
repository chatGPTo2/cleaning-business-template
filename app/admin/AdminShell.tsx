import Link from "next/link";
import { logoutAdmin } from "./actions";

type Section = "crm" | "seo" | "blog" | "ai-seo" | "reviews";

const CRM_NAV = [
  ["Dashboard", "/admin/dashboard"],
  ["Customers", "/admin/customers"],
  ["Quotes", "/admin/quotes"],
  ["Jobs", "/admin/jobs"],
];

const SEO_NAV = [
  ["SEO Pages", "/admin/seo-pages"],
];

const BLOG_NAV = [
  ["All Posts", "/admin/blog"],
  ["New Post", "/admin/blog/new"],
];

const AI_SEO_NAV = [
  ["Planner", "/admin/ai-seo"],
  ["Drafts", "/admin/blog"],
];

const SECTION_META: Record<Section, { label: string; nav: string[][] }> = {
  crm: { label: "CRM", nav: CRM_NAV },
  seo: { label: "SEO Pages", nav: SEO_NAV },
  blog: { label: "Blog", nav: BLOG_NAV },
  "ai-seo": { label: "AI SEO", nav: AI_SEO_NAV },
  reviews: { label: "Reviews", nav: [["All Reviews", "/admin/reviews"]] },
};

interface Props {
  children: React.ReactNode;
  section?: Section;
}

export default function AdminShell({ children, section = "crm" }: Props) {
  const { label, nav } = SECTION_META[section];

  return (
    <section className="min-h-screen bg-slate-50 px-4 pb-10 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/hub"
              className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 hover:border-teal-400 hover:bg-white hover:text-teal-700 transition-colors"
              aria-label="Back to admin hub"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Hub
            </Link>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Taspro · {label}</p>
              <h1 className="font-display text-2xl font-bold leading-tight text-navy-950">Internal dashboard</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {nav.map(([navLabel, href]) => (
              <Link
                key={href}
                href={href}
                className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-teal-400 hover:bg-white hover:text-teal-700 transition-colors"
              >
                {navLabel}
              </Link>
            ))}
            <form action={logoutAdmin}>
              <button className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 hover:border-red-300 hover:bg-white hover:text-red-600 transition-colors">
                Sign out
              </button>
            </form>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
