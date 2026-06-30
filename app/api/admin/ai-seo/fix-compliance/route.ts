import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { generateBlogFeaturedImage } from "@/lib/ai-seo-images";
import { stripBlogFigures } from "@/lib/blog-images";

export const maxDuration = 300;

const MIN_CHARS = 2000;
const GBP_URL = "https://g.page/tasprocleaning";
const QUOTE_URL = "https://tasprocleaning.com.au/quote";

const INTERNAL_LINKS = [
  { name: "home cleaning services", url: "https://tasprocleaning.com.au/services/home-cleaning" },
  { name: "end of lease cleaning", url: "https://tasprocleaning.com.au/services/end-of-lease" },
  { name: "commercial cleaning services", url: "https://tasprocleaning.com.au/services/commercial" },
  { name: "deep cleaning services", url: "https://tasprocleaning.com.au/services/deep-clean" },
  { name: "NDIS cleaning services", url: "https://tasprocleaning.com.au/services/ndis" },
  { name: "Airbnb cleaning services", url: "https://tasprocleaning.com.au/services/airbnb-cleaning" },
  { name: "cleaning services in Perth", url: "https://tasprocleaning.com.au/locations/perth" },
  { name: "cleaning services in Melbourne", url: "https://tasprocleaning.com.au/locations/melbourne" },
  { name: "cleaning services in Sydney", url: "https://tasprocleaning.com.au/locations/sydney" },
  { name: "cleaning services in Launceston", url: "https://tasprocleaning.com.au/locations/launceston" },
];

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countInternalLinks(html: string): number {
  const matches = html.match(/href="([^"]*tasprocleaning\.com\.au[^"]*)"/gi) ?? [];
  return new Set(matches.map((m) => m.slice(6, -1))).size;
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

function figureHtml(url: string, alt: string) {
  return `<figure class="blog-figure"><img src="${url}" alt="${alt}" loading="lazy" /><figcaption>${alt}</figcaption></figure>`;
}

function injectImages(content: string, images: { url: string; alt: string }[]) {
  let html = stripBlogFigures(content);
  let nextImage = 0;
  html = html.replace(/(<h2\b[^>]*>[\s\S]*?<\/h2>)/gi, (heading, _match, offset) => {
    if (offset === 0 || nextImage >= images.length) return heading;
    const img = images[nextImage++];
    return `${figureHtml(img.url, img.alt)}${heading}`;
  });
  while (nextImage < images.length) {
    const img = images[nextImage++];
    html += figureHtml(img.url, img.alt);
  }
  return html;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callOpenAI(systemPrompt: string, userContent: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions: systemPrompt,
      input: userContent,
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "OpenAI request failed.");

  const output = data.output ?? [];
  for (const block of output) {
    if (block.type === "message") {
      for (const c of block.content ?? []) {
        if (c.type === "output_text") return c.text ?? "";
      }
    }
  }
  throw new Error("No text output from OpenAI.");
}

export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const postId = body.postId ? String(body.postId) : null;
  const forceImages = Boolean(body.forceImages);

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  const { data: post, error: fetchError } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, slug, status, content, generation_keyword, category")
    .eq("id", postId)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: fetchError?.message ?? "Post not found" }, { status: 404 });
  }

  const content = post.content ?? "";
  const charCount = stripHtml(content).length;
  const internalCount = countInternalLinks(content);
  const needsLength = charCount < MIN_CHARS;
  const needsInternalLinks = internalCount < 2;
  const needsQuoteLink = !hasQuoteLink(content);
  const needsGbpLink = !hasGbpLink(content);
  const hasTextIssues = needsLength || needsInternalLinks || needsQuoteLink || needsGbpLink;

  if (!hasTextIssues && !forceImages) {
    return NextResponse.json({ fixed: false, message: "Post already passes all checks." });
  }

  let workingContent = content;

  // Step 1: fix text/link issues with GPT if needed
  if (hasTextIssues) {
    const issues: string[] = [];
    if (needsLength) issues.push(`Expand content: currently ${charCount} visible characters, needs at least ${MIN_CHARS}. Add more detail, examples, tips, or a richer FAQ section.`);
    if (needsInternalLinks) {
      const needed = 2 - internalCount;
      const examples = INTERNAL_LINKS.slice(0, 4).map((l) => `<a href="${l.url}">${l.name}</a>`).join(", ");
      issues.push(`Add ${needed} more internal link(s) to tasprocleaning.com.au. Choose relevant anchors from: ${examples} (and others that fit the topic naturally).`);
    }
    if (needsQuoteLink) issues.push(`Add a CTA paragraph near the end with a link to ${QUOTE_URL}. Example: <p>Ready for a spotless result? <a href="${QUOTE_URL}">Get a free quote from Taspro Cleaning Solutions</a> today.</p>`);
    if (needsGbpLink) issues.push(`Add a natural mention of customer reviews linking to the Google Business Profile: <a href="${GBP_URL}">Taspro Cleaning Solutions on Google</a>. Place it in the conclusion or a trust paragraph.`);

    const systemPrompt = [
      "You are a senior cleaning industry copywriter for Taspro Cleaning Solutions (tasprocleaning.com.au).",
      "Fix the provided blog post HTML to resolve the listed issues.",
      "Preserve all existing HTML structure, headings, images, and figures exactly.",
      "Use only these HTML tags: h2, h3, p, ul, ol, li, strong, a, figure, img, figcaption.",
      "Write in Australian English. Do not add AI filler phrases or fabricate reviews, prices, or certifications.",
      "Return ONLY the complete fixed HTML. No markdown fences, no explanation, no wrapper tags.",
    ].join(" ");

    const userContent = `Post title: "${post.title}"\n\nIssues to fix:\n${issues.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\nCurrent HTML:\n${content}`;

    try {
      workingContent = await callOpenAI(systemPrompt, userContent);
      workingContent = workingContent.replace(/^```html?\s*/i, "").replace(/\s*```$/i, "").trim();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "OpenAI error";
      return NextResponse.json({ error: msg }, { status: 500 });
    }
  }

  // Step 2: regenerate body images if requested
  if (forceImages) {
    try {
      const title = post.title ?? "professional cleaning";
      const keyword1 = `${post.generation_keyword ?? ""} ${title}`.trim();
      const keyword2 = `${post.category ?? "cleaning"} ${title}`.trim();
      const img1 = await generateBlogFeaturedImage(keyword1, 2, title);
      await sleep(10000);
      const img2 = await generateBlogFeaturedImage(keyword2, 2, title);
      workingContent = injectImages(workingContent, [img1, img2]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Image generation error";
      return NextResponse.json({ error: `Text fixed but image generation failed: ${msg}` }, { status: 500 });
    }
  }

  const { error: updateError } = await supabaseAdmin
    .from("blog_posts")
    .update({ content: workingContent })
    .eq("id", post.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  if (post.slug) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");

  return NextResponse.json({ fixed: true, images_regenerated: forceImages });
}
