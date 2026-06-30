import { NextRequest, NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { supabaseAdmin } from "@/lib/supabase";
import { blogPostUrl, submitIndexNowUrls } from "@/lib/indexnow";
import { generateBlogFeaturedImage } from "@/lib/ai-seo-images";
import { stripBlogFigures } from "@/lib/blog-images";

export const maxDuration = 300;

const MAX_RETRIES = 3;

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

function isAuthorizedCron(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return (
    request.headers.get("authorization") === `Bearer ${secret}` ||
    request.nextUrl.searchParams.get("secret") === secret
  );
}

// GET — called by Vercel Cron every 10 minutes
export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runPublishJob();
}

// POST — called manually from admin (publish now / retry)
export async function POST(request: NextRequest) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine for "run all due"
  }

  const postId = body.postId ? String(body.postId) : undefined;
  return runPublishJob(postId);
}

async function runPublishJob(specificPostId?: string) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const now = new Date().toISOString();

  // Find posts due to publish
  let query = supabaseAdmin
    .from("blog_posts")
    .select("id, slug, retry_count, title, category, content, generation_keyword")
    .eq("approved", true)
    .lte("scheduled_at", now)
    .lte("retry_count", MAX_RETRIES - 1);

  if (specificPostId) {
    // Publish a single post now (admin action) — allow any status except published
    query = supabaseAdmin
      .from("blog_posts")
      .select("id, slug, retry_count, title, category, content, generation_keyword")
      .eq("id", specificPostId)
      .neq("status", "published");
  } else {
    query = query.eq("status", "scheduled");
  }

  const { data: posts, error: fetchError } = await query;

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!posts || posts.length === 0) {
    return NextResponse.json({ published: 0, message: "No posts due." });
  }

  const publishedSlugs: string[] = [];
  const failedIds: string[] = [];

  for (const post of posts) {
    try {
      const updatePayload: Record<string, unknown> = {
        status: "published",
        published_at: now,
        error: null,
      };

      // Auto-inject DALL-E body images if the post has none yet
      const hasImages = post.content && (post.content.includes("<img") || post.content.includes("<figure"));
      if (!hasImages && post.content) {
        const title = post.title ?? "professional cleaning";
        const keyword1 = `${post.generation_keyword ?? ""} ${title}`.trim();
        const keyword2 = `${post.category ?? "cleaning"} ${title}`.trim();
        const img1 = await generateBlogFeaturedImage(keyword1, 2, title);
        await sleep(10000);
        const img2 = await generateBlogFeaturedImage(keyword2, 2, title);
        updatePayload.content = injectImages(post.content, [img1, img2]);
      }

      const { error: updateError } = await supabaseAdmin
        .from("blog_posts")
        .update(updatePayload)
        .eq("id", post.id);

      if (updateError) throw new Error(updateError.message);

      publishedSlugs.push(post.slug);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed.";
      const newRetryCount = (post.retry_count ?? 0) + 1;
      await supabaseAdmin
        .from("blog_posts")
        .update({
          status: newRetryCount >= MAX_RETRIES ? "failed" : "scheduled",
          error: message,
          retry_count: newRetryCount,
        })
        .eq("id", post.id);
      failedIds.push(post.id);
    }
  }

  // Trigger IndexNow for all successfully published posts
  if (publishedSlugs.length > 0) {
    await submitIndexNowUrls(publishedSlugs.map(blogPostUrl));
  }

  return NextResponse.json({
    published: publishedSlugs.length,
    failed: failedIds.length,
    slugs: publishedSlugs,
  });
}
