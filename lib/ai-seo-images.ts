import { supabaseAdmin } from "./supabase";

// Spaces-only base — no people, no equipment
const PHOTO_BASE =
  "Interior lifestyle photograph of a spotlessly clean, beautifully maintained space. " +
  "ABSOLUTE PROHIBITIONS — the following must NEVER appear anywhere in the image: " +
  "text, words, letters, numbers, typography, logos, labels, captions, signage of any kind; " +
  "cleaning equipment of any kind including mops, brooms, buckets, spray bottles, vacuum cleaners, cleaning carts, cloths, sponges, gloves; " +
  "safety or warning signs including caution signs, wet floor signs, hazard signs, exit signs; " +
  "cleaning products, bottles, containers, packaging; " +
  "people, hands, or any human presence. " +
  "Show ONLY the finished clean result: the room itself, surfaces, floors, furniture, windows, walls. " +
  "Pure interior architecture and décor photography. " +
  "Natural lighting, photorealistic, high quality, navy blue and teal colour accents where appropriate.";

// People-friendly base — professional staff in action, photorealistic
const PHOTO_BASE_PEOPLE =
  "Professional editorial photograph, photorealistic, high quality, natural lighting. " +
  "ABSOLUTE PROHIBITIONS — the following must NEVER appear anywhere in the image: " +
  "text, words, letters, numbers, typography, logos, labels, captions, signage of any kind; " +
  "safety or warning signs, caution signs, wet floor signs; " +
  "cartoon or illustration style. " +
  "Show real, natural-looking people — not posed or stock-photo stiff. Faces must look realistic and natural. ";

// Each rule matches title/keyword text → a distinct scene (with optional people flag)
type SceneRule = { match: RegExp; scene: string; people?: boolean };
const SCENE_RULES: SceneRule[] = [
  { match: /carpet|rug/i,                             scene: "close-up of pristine plush carpet fibres with natural light, soft texture, immaculate condition" },
  { match: /tile|grout|floor/i,                       scene: "gleaming tiled floor reflecting soft light, perfectly clean grout lines, polished surface" },
  { match: /bathroom|shower|toilet|basin/i,           scene: "sparkling modern bathroom interior — clear glass shower screen, chrome tapware, white tiles, fresh towels neatly folded" },
  { match: /kitchen|oven|bench|stovetop/i,            scene: "immaculate modern kitchen interior — polished stone benchtop, stainless steel sink, clean appliances, bright overhead lighting" },
  { match: /window|glass/i,                           scene: "streak-free floor-to-ceiling windows flooding a bright room with natural light, clean white frames, clear view outside" },
  { match: /end.of.lease|bond|vacate|move.out/i,      scene: "empty vacant apartment interior — freshly cleaned walls and polished floors, ready for inspection, neutral colours" },
  { match: /airbnb|short.stay|holiday|rental/i,       scene: "stylish holiday apartment interior — crisp white linen on a made bed, clean timber floors, contemporary décor" },
  { match: /ndis|disability|accessible/i,             scene: "a friendly professional cleaner in neat navy and teal uniform smiling while wiping down a kitchen bench in a bright accessible home, natural light, warm and welcoming atmosphere", people: true },
  { match: /deep.clean|spring.clean/i,                scene: "a professional cleaner in uniform carefully scrubbing a bathroom tile with a cloth, focused and thorough, bright clean bathroom, photorealistic candid style", people: true },
  { match: /strata|lobby|hallway|common/i,            scene: "gleaming building lobby interior — polished marble or stone floor, clean walls, modern lighting fixtures" },
  { match: /warehouse|industrial/i,                   scene: "a professional cleaner in high-vis vest and uniform mopping a large polished concrete warehouse floor, bright industrial lighting, organised shelving in background", people: true },
  { match: /gym|fitness/i,                            scene: "spotless gym interior — clean rubber floors, well-maintained equipment surfaces, bright mirrors reflecting light" },
  { match: /medical|clinic|dental|allied.health|health.pract/i, scene: "a healthcare cleaning professional in scrubs and gloves wiping down a clinic treatment room bench, sterile clinical environment, bright white lighting, professional and reassuring atmosphere", people: true },
  { match: /school|childcare|classroom|child/i,       scene: "a friendly professional cleaner in uniform mopping a bright clean classroom floor, colourful children's artwork on walls, cheerful and safe environment", people: true },
  { match: /restaurant|café|hospitality/i,            scene: "spotless restaurant dining area — clean tables with fresh settings, polished floors, warm atmospheric lighting" },
  { match: /bedroom|home|house|residential|living/i,  scene: "a professional home cleaner in neat uniform dusting a bright living room, natural light through large windows, tidy modern interior", people: true },
  { match: /germ|bacteria|hygiene|health.*office/i,   scene: "pristine office reception desk — spotless white counter, clean keyboard and monitor, minimal decor, bright even lighting" },
  { match: /productiv|employee|staff|wellbeing/i,     scene: "bright airy office breakout space — clean soft seating, polished floors, indoor plants, natural light streaming in" },
  { match: /checklist|daily|weekly|monthly|routine/i, scene: "a professional cleaner in uniform checking items on a clipboard while standing in a clean office corridor, organised and methodical, bright lighting", people: true },
  { match: /green|eco|sustainable|environment/i,      scene: "a professional cleaner in eco-friendly uniform using a microfibre cloth to wipe down a surface in a sunlit office with indoor plants, natural materials", people: true },
  { match: /choos|hire|select|best.*company|company/i, scene: "two professional cleaners in matching navy uniforms confidently walking into a modern office building, friendly and trustworthy expressions, professional setting", people: true },
  { match: /meeting|boardroom|conference/i,           scene: "spotless boardroom interior — long polished table, clean ergonomic chairs, whiteboard, panoramic windows" },
  { match: /reception|foyer|entry|entrance/i,         scene: "clean modern office reception area — polished marble floor, minimalist desk, soft lighting, contemporary artwork" },
  { match: /perth|wa$/i,                              scene: "a professional cleaner in uniform mopping a bright modern Perth office floor, floor-to-ceiling windows with warm afternoon light in background", people: true },
  { match: /launceston|tas$/i,                        scene: "a professional cleaner in uniform wiping down a timber boardroom table in a clean Tasmanian commercial interior, natural light from large windows", people: true },
  { match: /melbourne|vic$/i,                         scene: "a professional cleaner in uniform cleaning a Melbourne loft-style office, exposed brick walls, polished concrete floors, natural light", people: true },
  { match: /sydney|nsw$/i,                            scene: "a professional cleaner in uniform wiping a glass window in a clean Sydney office with harbour light streaming in, sleek contemporary interior", people: true },
  { match: /retail|shop|store/i,                      scene: "a professional cleaner in uniform wiping down display shelving in a spotless retail store, bright even lighting, neatly arranged products in background", people: true },
  { match: /office|commercial|business|workplace/i,   scene: "a professional cleaner in neat navy and teal uniform mopping a polished open-plan office floor, tidy ergonomic desks and indoor plants in background, natural light", people: true },
];

function buildPrompt(titleAndKeyword: string): string {
  const text = titleAndKeyword.toLowerCase();
  const rule = SCENE_RULES.find((r) => r.match.test(text));
  const scene = rule?.scene ?? "clean modern interior space — polished floors, tidy furniture, bright natural light";
  const base = rule?.people ? PHOTO_BASE_PEOPLE : PHOTO_BASE;
  return `${base} Scene: ${scene}.`;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim()
    .replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 50);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns the set of image URLs already used by published DB posts. */
export async function getUsedImageUrls(): Promise<Set<string>> {
  if (!supabaseAdmin) return new Set();
  const { data } = await supabaseAdmin
    .from("blog_posts")
    .select("image")
    .eq("status", "published");
  return new Set((data ?? []).map((r: { image: string }) => r.image).filter(Boolean));
}

/**
 * Generate a unique DALL-E image for a blog post.
 * Never falls back to /public images — throws on failure so the caller can decide.
 */
export async function generateBlogFeaturedImage(
  keyword: string,
  retries = 3,
  cleanTitle?: string
): Promise<{ url: string; alt: string }> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY not configured");
  if (!supabaseAdmin) throw new Error("Supabase admin client not available");

  const prompt = buildPrompt(keyword);
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ model: "gpt-image-1", prompt, n: 1, size: "1024x1024", quality: "medium" }),
  });

  if (res.status === 429 && retries > 0) {
    const retryAfter = Number(res.headers.get("retry-after") ?? 15);
    await sleep(retryAfter * 1000);
    return generateBlogFeaturedImage(keyword, retries - 1, cleanTitle);
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    if (retries > 0) {
      await sleep(5000);
      return generateBlogFeaturedImage(keyword, retries - 1, cleanTitle);
    }
    throw new Error(`DALL-E error ${res.status}: ${body?.error?.message ?? "unknown"}`);
  }

  const data = await res.json();
  const b64 = data.data?.[0]?.b64_json as string | undefined;
  const imageUrl = data.data?.[0]?.url as string | undefined;

  let buffer: Buffer;
  if (b64) {
    buffer = Buffer.from(b64, "base64");
  } else if (imageUrl) {
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Failed to download generated image: ${imageRes.status}`);
    buffer = Buffer.from(await imageRes.arrayBuffer());
  } else {
    throw new Error("DALL-E returned no image data");
  }

  const filename = `${Date.now()}-${slugify(keyword)}.png`;
  const { error: uploadError } = await supabaseAdmin.storage
    .from("blog-images").upload(filename, buffer, { contentType: "image/png", upsert: false });
  if (uploadError) throw new Error(`Storage upload failed: ${uploadError.message}`);

  const { data: pub } = supabaseAdmin.storage.from("blog-images").getPublicUrl(filename);
  const label = cleanTitle ?? keyword;
  return { url: pub.publicUrl, alt: `${label} — Taspro Cleaning Solutions` };
}

export async function generateBlogImageSet(keywords: string[]): Promise<{ url: string; alt: string }[]> {
  const results: { url: string; alt: string }[] = [];
  for (const kw of keywords) {
    results.push(await generateBlogFeaturedImage(kw));
    if (keywords.length > 1) await sleep(9000);
  }
  return results;
}
