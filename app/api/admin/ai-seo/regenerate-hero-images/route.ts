import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { generateBlogFeaturedImage } from "@/lib/ai-seo-images";
import { revalidatePath } from "next/cache";

export const maxDuration = 60;

// GET — returns list of all published post IDs + titles so the UI can drive the loop
export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, title, generation_keyword")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ posts: data ?? [] });
}

// POST — regenerates the hero image for a single post
export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!supabaseAdmin) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* no body */ }

  const postId = body.postId ? String(body.postId) : null;
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const { data: post, error } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, generation_keyword")
    .eq("id", postId)
    .maybeSingle();

  if (error || !post) return NextResponse.json({ error: error?.message ?? "Post not found" }, { status: 404 });

  const keyword = `${post.generation_keyword ?? ""} ${post.title}`.trim();
  const img = await generateBlogFeaturedImage(keyword);

  await supabaseAdmin
    .from("blog_posts")
    .update({ image: img.url, image_alt: img.alt, featured_image_url: img.url, featured_image_alt: img.alt })
    .eq("id", post.id);

  if (post.slug) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/blog");

  return NextResponse.json({ done: true, title: post.title, url: img.url });
}
