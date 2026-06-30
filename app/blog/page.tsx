import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllPostsMerged, formatDate } from "@/lib/blog";
import AnimateInView from "@/app/components/AnimateInView";

export const revalidate = 60; // re-fetch DB posts every 60 seconds
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tips & Guides | Cleaning Insights for Sydney, Melbourne, Perth & Launceston | Taspro",
  description:
    "Expert cleaning tips, checklists, and guides for Sydney, Melbourne, Perth and Launceston. Home cleaning, commercial, and bond cleaning insights from Taspro Cleaning Solutions.",
  alternates: { canonical: "https://tasprocleaning.com.au/blog" },
};

const CATEGORY_COLOURS: Record<string, string> = {
  Melbourne: "bg-blue-100 text-blue-700",
  Perth: "bg-purple-100 text-purple-700",
  Sydney: "bg-indigo-100 text-indigo-700",
  Launceston: "bg-pink-100 text-pink-700",
  Tips: "bg-teal-100 text-teal-700",
  "Health & Hygiene": "bg-green-100 text-green-700",
  Productivity: "bg-orange-100 text-orange-700",
  Sustainability: "bg-emerald-100 text-emerald-700",
  NDIS: "bg-cyan-100 text-cyan-700",
  Airbnb: "bg-rose-100 text-rose-700",
  Commercial: "bg-slate-100 text-slate-700",
  General: "bg-gray-100 text-gray-600",
};

export default async function BlogPage() {
  const allPosts = await getAllPostsMerged();
  const [featured, ...rest] = allPosts;

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 bg-navy-950" aria-labelledby="blog-heading">
        <div className="container-custom text-center">
          <AnimateInView variant="slide-up">
            <p className="inline-block bg-teal-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              Cleaning Insights
            </p>
            <h1 id="blog-heading" className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-4">
              Tips & Guides
            </h1>
            <p className="text-white/65 text-lg max-w-xl mx-auto">
              Expert tips, checklists, and guides for Sydney, Melbourne, Perth and Launceston.
            </p>
          </AnimateInView>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">

          {/* Featured post */}
          {featured && (
            <AnimateInView variant="slide-up" className="mb-16">
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-navy-950/[0.03] rounded-3xl overflow-hidden border border-navy-950/8 card-hover shadow-card"
                aria-label={`Read: ${featured.title}`}
              >
                <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[320px]">
                  <Image
                    src={featured.image}
                    alt={featured.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${CATEGORY_COLOURS[featured.category] ?? "bg-gray-100 text-gray-600"}`}>
                      {featured.category}
                    </span>
                    <span className="text-navy-950/40 text-sm">{featured.readTime}</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-navy-950 mb-3 group-hover:text-teal-700 transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-navy-950/60 leading-relaxed mb-5 text-sm">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-navy-950/40 text-sm">{formatDate(featured.date)}</span>
                    <span className="text-teal-600 font-semibold text-sm flex items-center gap-1.5 group-hover:gap-3 transition-all">
                      Read article
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            </AnimateInView>
          )}

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {rest.map((post, i) => (
              <AnimateInView key={post.slug} variant="slide-up" delay={i * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-navy-950/8 shadow-card card-hover overflow-hidden h-full"
                  aria-label={`Read: ${post.title}`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLOURS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                        {post.category}
                      </span>
                      <span className="text-navy-950/40 text-xs">{post.readTime}</span>
                    </div>
                    <h2 className="font-display text-lg font-bold text-navy-950 mb-2 group-hover:text-teal-700 transition-colors leading-snug flex-1">
                      {post.title}
                    </h2>
                    <p className="text-navy-950/55 text-sm leading-relaxed mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-navy-950/8">
                      <span className="text-navy-950/40 text-xs">{formatDate(post.date)}</span>
                      <span className="text-teal-600 font-semibold text-sm flex items-center gap-1 group-hover:gap-2.5 transition-all">
                        Read
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimateInView>
            ))}
          </div>

          {/* CTA */}
          <AnimateInView variant="slide-up" className="mt-20 text-center bg-teal-500/10 border border-teal-200 rounded-3xl p-10">
            <p className="section-label">Ready to Get Started?</p>
            <h2 className="font-display text-3xl font-bold text-navy-950 mb-3">
              Get a free cleaning quote
            </h2>
            <p className="text-navy-950/60 mb-6 max-w-md mx-auto">
              Serving Sydney, Melbourne, Perth and Launceston. Instant pricing, no phone calls required.
            </p>
            <Link href="/quote" className="btn-primary text-base px-8 py-4">
              Get a Free Instant Quote
            </Link>
          </AnimateInView>
        </div>
      </section>
    </>
  );
}
