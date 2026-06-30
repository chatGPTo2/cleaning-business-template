import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { generateBlogFeaturedImage } from "@/lib/ai-seo-images";
import { revalidatePath } from "next/cache";

export const maxDuration = 60;

const LOCAL_RE = /^\/[a-z]/; // matches /office-after.jpg etc.

/** Strip <figure> blocks that contain a local /public src (keeps DALL-E figures intact) */
function stripLocalFigures(content: string): string {
  return content.replace(
    /<figure\b[^>]*>[\s\S]*?<\/figure>/gi,
    (match) => (/<img\b[^>]+src="\/[a-z][^"]*"/.test(match) ? "" : match)
  ).replace(/\n{3,}/g, "\n\n").trim();
}

/** GET — returns the list of published posts that have local /public images */
export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { data: posts, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, image, content")
    .eq("status", "published");

  if (error || !posts) {
    return NextResponse.json({ error: error?.message ?? "Failed to fetch" }, { status: 500 });
  }

  const needsFix = posts
    .map((p) => {
      const heroLocal = LOCAL_RE.test(p.image ?? "");
      const inlineCount = (p.content ?? "").match(/<img\b[^>]+src="\/[a-z][^"]*"/g)?.length ?? 0;
      if (!heroLocal && inlineCount === 0) return null;
      return { id: p.id, slug: p.slug, title: p.title, heroLocal, inlineCount };
    })
    .filter(Boolean);

  const counts: Record<string, number> = {};
  for (const p of posts) { if (p.image) counts[p.image] = (counts[p.image] ?? 0) + 1; }
  const duplicates = Object.entries(counts).filter(([, n]) => n > 1).map(([url, n]) => ({ url, n }));

  return NextResponse.json({ posts: needsFix, duplicates, total: needsFix.length });
}

/**
 * POST { postId } — fixes ONE post:
 * - Hero image: generates a new unique DALL-E image
 * - Inline figures with local src: stripped immediately (no API cost).
 *   Re-add with "Fix all body images" afterward.
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const body = await request.json().catch(() => ({}));
  const postId = body.postId ? String(body.postId) : null;
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const { data: post, error: fetchErr } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, image, generation_keyword, category, content")
    .eq("id", postId)
    .single();

  if (fetchErr || !post) {
    return NextResponse.json({ error: fetchErr?.message ?? "Post not found" }, { status: 404 });
  }

  const heroLocal = LOCAL_RE.test(post.image ?? "");
  const strippedContent = stripLocalFigures(post.content ?? "");
  const inlineWasFixed = strippedContent !== (post.content ?? "");

  if (!heroLocal && !inlineWasFixed) {
    return NextResponse.json({ fixed: false, message: "No local images found" });
  }

  const update: Record<string, string> = {};
  let heroError: string | null = null;

  // Strip local inline figures immediately — no API needed
  if (inlineWasFixed) {
    update.content = strippedContent;
  }

  // Generate DALL-E hero image — may fail independently of inline strip
  if (heroLocal) {
    try {
      const keyword = `${post.generation_keyword ?? post.category ?? "office cleaning"} ${post.title}`;
      const img = await generateBlogFeaturedImage(keyword, 3, post.title);
      update.image = img.url;
      update.image_alt = img.alt;
      update.featured_image_url = img.url;
      update.featured_image_alt = img.alt;
    } catch (err) {
      heroError = err instanceof Error ? err.message : String(err);
    }
  }

  if (Object.keys(update).length > 0) {
    const { error: updateErr } = await supabaseAdmin
      .from("blog_posts")
      .update(update)
      .eq("id", post.id);
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
  }

  if (heroError) {
    return NextResponse.json({ error: heroError, inlineStripped: inlineWasFixed }, { status: 500 });
  }

  return NextResponse.json({ fixed: true, heroFixed: heroLocal, inlineStripped: inlineWasFixed, slug: post.slug });
}
