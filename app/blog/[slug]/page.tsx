import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getPostBySlugMerged,
  getRelatedPostsMerged,
} from "@/lib/blog";
import AnimateInView from "@/app/components/AnimateInView";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

/* ── Per-page SEO metadata ── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlugMerged(slug);
  if (!post) return {};
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `https://tasprocleaning.com.au/blog/${slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      images: [{ url: post.image, alt: post.imageAlt }],
    },
  };
}

/* ── Article page ── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BlogPostContent slug={slug} />;
}

async function BlogPostContent({ slug }: { slug: string }) {
  const post = await getPostBySlugMerged(slug);
  if (!post) notFound();

  const related = await getRelatedPostsMerged(post.slug, 3);

  /* Article JSON-LD schema */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `https://tasprocleaning.com.au/blog/${post.slug}#article`,
    headline: post.title,
    description: post.metaDescription,
    image: post.image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      "@id": "https://tasprocleaning.com.au/#organization",
      name: "Taspro Cleaning Solutions",
      url: "https://tasprocleaning.com.au",
    },
    publisher: {
      "@type": "Organization",
      "@id": "https://tasprocleaning.com.au/#organization",
      name: "Taspro Cleaning Solutions",
      url: "https://tasprocleaning.com.au",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tasprocleaning.com.au/blog/${post.slug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tasprocleaning.com.au" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://tasprocleaning.com.au/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://tasprocleaning.com.au/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero image */}
      <div className="relative h-72 md:h-96 w-full mt-[72px]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 container-custom">
          <span className="inline-block bg-teal-500 text-navy-950 text-xs font-bold px-3 py-1 rounded-full mb-3">
            {post.category}
          </span>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Article body */}
      <div className="bg-white">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 max-w-5xl mx-auto">

            {/* Main content */}
            <article>
              {/* Meta row */}
              <div className="flex items-center gap-4 text-sm text-navy-950/50 mb-8 pb-8 border-b border-navy-950/10">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readTime}</span>
                <span>·</span>
                <span>By Taspro Cleaning Solutions</span>
              </div>

              {/* Article HTML content */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Back to blog */}
              <div className="mt-12 pt-8 border-t border-navy-950/10">
                <Link
                  href="/blog"
                  className="flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Back to all articles
                </Link>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="space-y-6" aria-label="Sidebar">
              {/* CTA card */}
              <div className="bg-navy-950 rounded-2xl p-6 text-white sticky top-24">
                <h3 className="font-display text-xl font-bold mb-2">Get a Free Instant Quote</h3>
                <p className="text-white/60 text-sm mb-5 leading-relaxed">
                  Serving Melbourne, Perth &amp; Launceston. Instant pricing online.
                </p>
                <Link href="/quote" className="btn-primary w-full justify-center text-sm py-3">
                  Get a Free Instant Quote
                </Link>
                <a href="tel:+61870816811" className="mt-3 flex items-center justify-center gap-2 text-white/60 text-sm hover:text-teal-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  (08) 7081 6811
                </a>
              </div>

              {/* Services quick links */}
              <div className="bg-navy-950/[0.04] rounded-2xl p-5">
                <h3 className="font-semibold text-navy-950 text-sm mb-3">Our Services</h3>
                <ul className="space-y-2">
                  {[
                    { href: "/services/commercial", label: "Commercial Cleaning" },
                    { href: "/services/home-cleaning", label: "Home Cleaning" },
                    { href: "/services/deep-clean", label: "Deep Clean" },
                    { href: "/services/end-of-lease", label: "End of Lease" },
                    { href: "/services/ndis", label: "NDIS Cleaning" },
                  ].map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors flex items-center gap-1.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="max-w-5xl mx-auto mt-16 pt-12 border-t border-navy-950/10">
              <h2 className="font-display text-2xl font-bold text-navy-950 mb-8">More articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((rp) => (
                  <AnimateInView key={rp.slug} variant="slide-up">
                    <Link
                      href={`/blog/${rp.slug}`}
                      className="group flex flex-col bg-navy-950/[0.03] rounded-2xl overflow-hidden border border-navy-950/8 card-hover h-full"
                    >
                      <div className="relative aspect-[16/9]">
                        <Image src={rp.image} alt={rp.imageAlt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <div className="p-5">
                        <p className="font-semibold text-navy-950 text-sm leading-snug group-hover:text-teal-700 transition-colors">{rp.title}</p>
                        <p className="text-navy-950/40 text-xs mt-2">{rp.readTime}</p>
                      </div>
                    </Link>
                  </AnimateInView>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
