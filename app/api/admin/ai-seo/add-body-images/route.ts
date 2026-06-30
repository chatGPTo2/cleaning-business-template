import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { generateBlogFeaturedImage } from "@/lib/ai-seo-images";
import { stripBlogFigures } from "@/lib/blog-images";
import { revalidatePath } from "next/cache";

export const maxDuration = 300;

function hasBodyImages(content: string) {
  return content.includes("<img") || content.includes("<figure");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function figureHtml(url: string, alt: string) {
  return [
    `<figure class="blog-figure">`,
    `<img src="${url}" alt="${alt}" loading="lazy" />`,
    `<figcaption>${alt}</figcaption>`,
  ].join("") + `</figure>`;
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

export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* no body */ }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  let postIds: string[] = Array.isArray(body.postIds) ? (body.postIds as string[]) : [];
  const isBulkFix = Boolean(body.fixAll);
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "OPENAI_API_KEY not configured — cannot generate unique images." }, { status: 500 });
  }

  if (isBulkFix) {
    const { data } = await supabaseAdmin.from("blog_posts").select("id, content");
    postIds = (data ?? []).filter((p) => !hasBodyImages(p.content)).map((p) => p.id);
  }

  if (postIds.length === 0) {
    return NextResponse.json({ fixed: 0, message: "No posts need body images." });
  }

  const { data: posts, error: fetchError } = await supabaseAdmin
    .from("blog_posts")
    .select("id, slug, title, category, generation_keyword, content")
    .in("id", postIds);

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  // When triggered for specific posts (not bulk fix), always replace existing images
  const toProcess = (posts ?? []).filter((p) => isBulkFix ? !hasBodyImages(p.content) : true);
  let fixed = 0;
  const errors: string[] = [];

  for (const post of toProcess) {
    try {
      // Two unique scene-aware DALL-E images per post
      const keyword1 = `${post.generation_keyword ?? ""} ${post.title}`.trim();
      const keyword2 = `${post.category ?? "cleaning"} ${post.title}`.trim();
      const img1 = await generateBlogFeaturedImage(keyword1, 2, post.title);
      await sleep(10000);
      const img2 = await generateBlogFeaturedImage(keyword2, 2, post.title);
      const images = [img1, img2];

      const updatedContent = injectImages(post.content, images);
      await supabaseAdmin
        .from("blog_posts")
        .update({ content: updatedContent })
        .eq("id", post.id);

      if (post.slug) revalidatePath(`/blog/${post.slug}`);
      revalidatePath("/blog");
      fixed++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error(`[add-body-images] ${post.id}:`, msg);
      errors.push(`"${post.title}": ${msg}`);
    }
  }

  return NextResponse.json({
    fixed,
    method: "dall-e",
    ...(errors.length > 0 && { errors }),
  });
}
