import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";

const MIN_CHARS = 2000;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countInternalLinks(html: string): number {
  const matches = html.match(/href="([^"]*tasprocleaning\.com\.au[^"]*)"/gi) ?? [];
  const urls = new Set(matches.map((m) => m.slice(6, -1)));
  return urls.size;
}

function hasQuoteLink(html: string): boolean {
  return /href="[^"]*\/quote[^"]*"/i.test(html);
}

function hasGbpLink(html: string): boolean {
  return (
    html.includes("g.page/tasprocleaning") ||
    html.includes("maps.google.com") ||
    html.includes("goo.gl/maps")
  );
}

function hasBodyImages(html: string): boolean {
  return html.includes("<img") || html.includes("<figure");
}

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: posts, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, status, content")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const results = (posts ?? []).map((post) => {
    const content = post.content ?? "";
    const charCount = stripHtml(content).length;
    const internalLinkCount = countInternalLinks(content);
    const passesLength = charCount >= MIN_CHARS;
    const passesInternalLinks = internalLinkCount >= 2;
    const hasQuote = hasQuoteLink(content);
    const hasGbp = hasGbpLink(content);
    const hasImages = hasBodyImages(content);

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      status: post.status,
      char_count: charCount,
      passes_length: passesLength,
      internal_link_count: internalLinkCount,
      passes_internal_links: passesInternalLinks,
      has_quote_link: hasQuote,
      has_gbp_link: hasGbp,
      has_body_images: hasImages,
      passes_all: passesLength && passesInternalLinks && hasQuote && hasGbp && hasImages,
    };
  });

  return NextResponse.json({ results });
}
