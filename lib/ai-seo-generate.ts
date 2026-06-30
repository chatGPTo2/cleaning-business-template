import { allPosts, getAllDbPosts } from "./blog";
import { generateBlogImageSet } from "./ai-seo-images";
import { supabaseAdmin } from "./supabase";

const BLOG_CONTENT_MIN_CHARS = 7000;   // ~1,250 words of visible text
const BLOG_CONTENT_MAX_CHARS = 14000;  // ~2,500 words of visible text
const BATCH_SIZE = 5;

export type GenerationMode = "standard" | "cluster";

export type GenerateOptions = {
  keyword: string;
  qty: number;
  mode: GenerationMode;
  location?: string;
  audience?: string;
  offerAngle?: string;
  requireApproval: boolean;
  runId: string;
};

export type ScheduleOptions = {
  postIds: string[];
  startTime: string; // ISO string (UTC)
  intervalHours: number;
  windowStartHour: number; // local AEST hour, e.g. 7
  windowEndHour: number;   // local AEST hour, e.g. 19
  skipWeekends: boolean;
};

const INTERNAL_SERVICE_LINKS = [
  { name: "Home Cleaning", url: "https://tasprocleaning.com.au/services/home-cleaning" },
  { name: "End of Lease Cleaning", url: "https://tasprocleaning.com.au/services/end-of-lease" },
  { name: "Commercial Cleaning", url: "https://tasprocleaning.com.au/services/commercial" },
  { name: "Deep Cleaning", url: "https://tasprocleaning.com.au/services/deep-clean" },
  { name: "NDIS Cleaning", url: "https://tasprocleaning.com.au/services/ndis" },
  { name: "Airbnb Cleaning", url: "https://tasprocleaning.com.au/services/airbnb-cleaning" },
  { name: "Perth Cleaning", url: "https://tasprocleaning.com.au/locations/perth" },
  { name: "Launceston Cleaning", url: "https://tasprocleaning.com.au/locations/launceston" },
  { name: "Melbourne Cleaning", url: "https://tasprocleaning.com.au/locations/melbourne" },
  { name: "Sydney Cleaning", url: "https://tasprocleaning.com.au/locations/sydney" },
  { name: "Get a Free Quote", url: "https://tasprocleaning.com.au/quote" },
];

// AEST offset: UTC+10 (or +11 AEDT, but we use +10 as conservative base)
const AEST_OFFSET_HOURS = 10;

type AiDraft = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageAlt: string;
  metaTitle: string;
  metaDescription: string;
  targetKeyword: string;
  qualityScore: number;
  duplicateRisk: number;
  content: string;
  isClusterPillar?: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/, "");
}

function comparableTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function visibleTextLength(html: string) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
    .length;
}

function uniqueSlug(base: string, usedSlugs: Set<string>): string {
  const b = slugify(base) || "cleaning-guide";
  let slug = b;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${b}-${suffix}`;
    suffix++;
  }
  usedSlugs.add(slug);
  return slug;
}

function extractOpenAiText(data: any): string {
  if (typeof data.output_text === "string") return data.output_text;
  const chunks = data.output?.flatMap((item: any) => item.content ?? []) ?? [];
  return chunks.map((chunk: any) => chunk.text ?? "").join("\n").trim();
}

function parseJsonArray(text: string): AiDraft[] {
  const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("AI did not return a JSON array");
  return JSON.parse(clean.slice(start, end + 1));
}

function buildPrompt(opts: {
  keyword: string;
  qty: number;
  mode: GenerationMode;
  location?: string;
  audience?: string;
  offerAngle?: string;
  existingTitles: string[];
  blockedTopics: string[];
  isPillar?: boolean;
  pillarTitle?: string;
  pillarSlug?: string;
  supportingTitlesSoFar?: string[];
}): string {
  return JSON.stringify({
    brand: "Taspro Cleaning Solutions",
    site: "https://tasprocleaning.com.au",
    primaryKeyword: opts.keyword,
    quantity: opts.qty,
    mode: opts.mode,
    location: opts.location || "all service areas (Perth WA, Launceston TAS, Melbourne VIC, Sydney NSW)",
    audience: opts.audience || "residential and commercial customers",
    offerAngle: opts.offerAngle || "reliability, police-checked cleaners, 100% satisfaction guarantee",
    existingTitles: opts.existingTitles.slice(0, 50),
    blockedTopics: opts.blockedTopics,
    internalLinks: INTERNAL_SERVICE_LINKS,
    clusterContext: opts.isPillar
      ? { role: "PILLAR", instruction: "Write a comprehensive, authoritative overview of the keyword. It will be linked to from many supporting posts." }
      : opts.pillarTitle
        ? { role: "SUPPORTING", pillarTitle: opts.pillarTitle, pillarUrl: `https://tasprocleaning.com.au/blog/${opts.pillarSlug}`, instruction: "Link back to the pillar post. Choose a distinct subtopic angle.", alreadyGenerated: opts.supportingTitlesSoFar ?? [] }
        : null,
    requirements: [
      `Generate exactly ${opts.qty} unique blog post draft(s) targeting the keyword: "${opts.keyword}".`,
      "Each post must have a different angle, subtopic, location, or audience focus from the others.",
      "Never duplicate any title, slug, or core topic from existingTitles or blockedTopics.",
      "⚠️ LENGTH IS MANDATORY: The content field MUST be at least 1,500 words. Articles shorter than 1,500 words will be rejected. Write every section in full — never summarise or truncate.",
      `The visible text of the content field (after stripping all HTML tags) must be ${BLOG_CONTENT_MIN_CHARS}–${BLOG_CONTENT_MAX_CHARS} characters. This is enforced programmatically.`,
      "REQUIRED CONTENT STRUCTURE — include ALL sections in full:",
      "1. Introduction (h2): 3 full paragraphs, each 3–4 sentences.",
      "2. Section 2 (h2): What it is / how it works — 3 paragraphs of at least 4 sentences each.",
      "3. Section 3 (h2): Key benefits — 3 paragraphs of at least 4 sentences each, plus a ul list of 6+ items each with 1–2 sentences of explanation.",
      "4. Section 4 (h2): Practical tips / how to choose — 3 paragraphs plus an ol list of 7+ items each with 2–3 sentences of explanation.",
      "5. Section 5 (h2): Location-specific or audience-specific context — 3 full paragraphs.",
      "6. Section 6 (h2): Common mistakes or what to look for — 2–3 paragraphs.",
      "7. FAQ (h2): At least 6 questions as h3 headings, each with a 4–5 sentence answer as a p tag.",
      "8. Conclusion (h2): 3 full sentences summarising the key points.",
      "Include at least 2 internal <a href> links to pages from internalLinks.",
      "Include a CTA paragraph linking to https://tasprocleaning.com.au/quote near the end.",
      "Tone: professional, practical, Australian English. No AI clichés or filler phrases.",
      "Do not claim NDIS registration, specific awards, or certifications not on the Taspro website.",
      "Do not fabricate reviews, ratings, or pricing.",
      opts.isPillar ? "Set isClusterPillar: true in the JSON." : "",
    ].filter(Boolean),
  });
}

async function callOpenAI(userContent: string): Promise<AiDraft[]> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o",
      max_output_tokens: 16000,
      instructions: [
        "You are an expert Australian local SEO strategist and senior cleaning industry copywriter for Taspro Cleaning Solutions.",
        "Return ONLY a JSON array. No markdown fences, no prose outside JSON.",
        "Each item must have: title, slug, excerpt, category, readTime, imageAlt, metaTitle, metaDescription, targetKeyword, qualityScore (0-100), duplicateRisk (0-100), content.",
        "CRITICAL: The content field must be 1,700–2,200 words long. This is a hard requirement. Short content will be rejected. Write every section in full — do not summarise or truncate.",
        "content must be valid HTML using ONLY these tags: h2, h3, p, ul, ol, li, strong, a. NEVER use table, tr, td, th, thead, tbody, dl, dt, dd, div, span, figure, img, or any other tag. No img tags. Use ul/li for any list, comparison, or checklist — not tables.",
      ].join(" "),
      input: userContent,
      temperature: 0.45,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "OpenAI generation failed.");
  return parseJsonArray(extractOpenAiText(data));
}

export async function createKeywordDrivenDrafts(
  opts: GenerateOptions
): Promise<{ created: number; skipped: number }> {
  if (!supabaseAdmin) throw new Error("Supabase admin client is not configured.");

  const dbPosts = await getAllDbPosts();
  const existingTitles = [
    ...dbPosts.map((p) => p.title),
    ...allPosts.map((p) => p.title),
  ];
  const usedSlugs = new Set([
    ...dbPosts.map((p) => p.slug),
    ...allPosts.map((p) => p.slug),
  ]);
  const usedTitles = new Set(existingTitles.map(comparableTitle));
  const blockedTopics = [...existingTitles];
  const qualifiedDrafts: AiDraft[] = [];
  let pillarDraft: AiDraft | null = null;
  const clusterId = opts.mode === "cluster" ? crypto.randomUUID() : null;

  // --- Cluster mode: generate pillar first ---
  if (opts.mode === "cluster") {
    const pillarBatch = await callOpenAI(
      buildPrompt({
        keyword: opts.keyword,
        qty: 1,
        mode: "cluster",
        location: opts.location,
        audience: opts.audience,
        offerAngle: opts.offerAngle,
        existingTitles,
        blockedTopics,
        isPillar: true,
      })
    );

    const pillar = pillarBatch[0];
    if (pillar?.title && pillar?.content) {
      pillar.slug = uniqueSlug(pillar.slug || pillar.title, usedSlugs);
      usedTitles.add(comparableTitle(pillar.title));
      blockedTopics.push(pillar.title);
      pillarDraft = { ...pillar, isClusterPillar: true };
      qualifiedDrafts.push(pillarDraft);
    }
  }

  // --- Generate remaining posts in batches ---
  const remaining = opts.mode === "cluster"
    ? Math.max(0, opts.qty - 1)
    : opts.qty;
  let generated = 0;
  const maxAttempts = Math.ceil(remaining / BATCH_SIZE) + 6;

  for (let attempt = 0; attempt < maxAttempts && generated < remaining; attempt++) {
    const batchSize = Math.min(BATCH_SIZE, remaining - generated);
    const currentTitles = [
      ...existingTitles,
      ...qualifiedDrafts.map((d) => d.title),
    ];

    let batch: AiDraft[] = [];
    try {
      batch = await callOpenAI(
        buildPrompt({
          keyword: opts.keyword,
          qty: batchSize,
          mode: opts.mode,
          location: opts.location,
          audience: opts.audience,
          offerAngle: opts.offerAngle,
          existingTitles: currentTitles,
          blockedTopics,
          pillarTitle: pillarDraft?.title,
          pillarSlug: pillarDraft?.slug,
          supportingTitlesSoFar: qualifiedDrafts
            .filter((d) => !d.isClusterPillar)
            .map((d) => d.title),
        })
      );
    } catch {
      continue;
    }

    for (const draft of batch) {
      if (!draft.title || !draft.content || !draft.excerpt) {
        blockedTopics.push(draft.title || "missing fields");
        continue;
      }

      const len = visibleTextLength(draft.content);
      if (len < BLOG_CONTENT_MIN_CHARS || len > BLOG_CONTENT_MAX_CHARS) {
        blockedTopics.push(`${draft.title} (${len} chars — out of range)`);
        continue;
      }

      const titleKey = comparableTitle(draft.title);
      const candidateSlug = slugify(draft.slug || draft.title);
      if (usedTitles.has(titleKey) || usedSlugs.has(candidateSlug)) {
        blockedTopics.push(draft.title);
        continue;
      }

      draft.slug = uniqueSlug(candidateSlug, usedSlugs);
      usedTitles.add(titleKey);
      blockedTopics.push(draft.title);
      qualifiedDrafts.push(draft);
      generated++;
      if (generated >= remaining) break;
    }
  }

  if (qualifiedDrafts.length === 0) {
    throw new Error(
      `AI could not generate unique valid drafts for "${opts.keyword}". ` +
      "Try a different keyword, broader brief, or fewer posts per run."
    );
  }

  // --- Generate one unique DALL-E image per post (rate-limited internally) ---
  const imageKeywords = qualifiedDrafts.map((d) => `${opts.keyword} ${d.title}`);
  const images = await generateBlogImageSet(imageKeywords);

  // --- For cluster mode: inject pillar links into supporting posts and vice versa ---
  if (opts.mode === "cluster" && pillarDraft) {
    const pillarUrl = `https://tasprocleaning.com.au/blog/${pillarDraft.slug}`;
    const supportingRows = qualifiedDrafts.filter((d) => !d.isClusterPillar);

    // Append supporting post links to pillar
    const supportingLinks = supportingRows
      .map((d) => `<li><a href="https://tasprocleaning.com.au/blog/${d.slug}">${d.title}</a></li>`)
      .join("\n");
    pillarDraft.content += `\n<h2>Related Guides in This Series</h2>\n<ul>\n${supportingLinks}\n</ul>`;

    // Inject pillar backlink into each supporting post if not already present
    for (const d of supportingRows) {
      if (!d.content.includes(pillarUrl)) {
        d.content += `\n<p>See our complete guide: <a href="${pillarUrl}">${pillarDraft.title}</a>.</p>`;
      }
    }
  }

  // --- Build and insert rows ---
  const rows = qualifiedDrafts.map((draft, i) => {
    const img = images[i];
    return {
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt || "",
      content: draft.content,
      category: draft.category || "Tips",
      image: img.url,
      image_alt: draft.imageAlt || img.alt,
      meta_title: draft.metaTitle || draft.title,
      meta_description: draft.metaDescription || draft.excerpt,
      read_time: draft.readTime || "6 min read",
      status: "draft",
      published_at: null,
      featured_image_url: img.url,
      featured_image_alt: draft.imageAlt || img.alt,
      generation_keyword: opts.keyword,
      generation_run_id: opts.runId,
      cluster_id: clusterId,
      approved: !opts.requireApproval,
      retry_count: 0,
    };
  });

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert(rows)
    .select("id,title,slug");

  if (error) throw new Error(error.message);
  return {
    created: data?.length ?? 0,
    skipped: qualifiedDrafts.length - (data?.length ?? 0),
  };
}

// --- Scheduling helpers ---

function toLocalHour(utcDate: Date): number {
  return (utcDate.getUTCHours() + AEST_OFFSET_HOURS) % 24;
}

function isWeekend(utcDate: Date): boolean {
  // Day of week in AEST
  const aestDay = new Date(utcDate.getTime() + AEST_OFFSET_HOURS * 3600 * 1000).getUTCDay();
  return aestDay === 0 || aestDay === 6;
}

function snapToWindow(date: Date, opts: Pick<ScheduleOptions, "windowStartHour" | "windowEndHour" | "skipWeekends">): Date {
  let d = new Date(date);
  const localHour = toLocalHour(d);

  if (localHour < opts.windowStartHour) {
    // Before window start today — snap to window start
    d = new Date(d.getTime() + (opts.windowStartHour - localHour) * 3600 * 1000);
    d.setUTCMinutes(0, 0, 0);
  } else if (localHour >= opts.windowEndHour) {
    // Past window end — move to next day's window start
    const hoursUntilNextWindow = (24 - localHour) + opts.windowStartHour;
    d = new Date(d.getTime() + hoursUntilNextWindow * 3600 * 1000);
    d.setUTCMinutes(0, 0, 0);
  }

  // Skip weekends
  if (opts.skipWeekends) {
    while (isWeekend(d)) {
      d = new Date(d.getTime() + 24 * 3600 * 1000);
      // Snap to window start on the new day
      const lh = toLocalHour(d);
      if (lh < opts.windowStartHour) {
        d = new Date(d.getTime() + (opts.windowStartHour - lh) * 3600 * 1000);
        d.setUTCMinutes(0, 0, 0);
      }
    }
  }

  return d;
}

// --- Single-post generator for the async worker ---
// Generates and saves exactly ONE post for the given run.
// Worker calls this repeatedly until run.processed >= run.target.
export async function generateOneDraftForRun(run: {
  id: string;
  keyword: string;
  mode: GenerationMode;
  location?: string | null;
  audience?: string | null;
  offer_angle?: string | null;
  require_approval: boolean;
  cluster_id?: string | null;
  processed: number;
  target: number;
}): Promise<{ saved: boolean; title?: string; slug?: string }> {
  if (!supabaseAdmin) throw new Error("Supabase admin client is not configured.");

  // Load existing posts fresh each call to avoid slug/title collisions
  const dbPosts = await getAllDbPosts();
  const existingTitles = [...dbPosts.map((p) => p.title), ...allPosts.map((p) => p.title)];
  const usedSlugs = new Set([...dbPosts.map((p) => p.slug), ...allPosts.map((p) => p.slug)]);
  const usedTitles = new Set(existingTitles.map(comparableTitle));
  const blockedTopics = [...existingTitles];

  const opts = {
    keyword: run.keyword,
    qty: 1,
    mode: run.mode,
    location: run.location ?? undefined,
    audience: run.audience ?? undefined,
    offerAngle: run.offer_angle ?? undefined,
    existingTitles,
    blockedTopics,
    isPillar: run.mode === "cluster" && run.processed === 0,
    pillarTitle: undefined as string | undefined,
    pillarSlug: undefined as string | undefined,
    supportingTitlesSoFar: [] as string[],
  };

  // For cluster supporting posts: find the pillar from DB
  if (run.mode === "cluster" && run.processed > 0 && run.cluster_id) {
    const { data: pillar } = await supabaseAdmin
      .from("blog_posts")
      .select("title, slug")
      .eq("cluster_id", run.cluster_id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (pillar) {
      opts.pillarTitle = pillar.title;
      opts.pillarSlug = pillar.slug;
    }
  }

  let draft: AiDraft | null = null;
  const rejectionReasons: string[] = [];

  for (let attempt = 0; attempt < 5 && !draft; attempt++) {
    try {
      const batch = await callOpenAI(buildPrompt(opts));
      for (const candidate of batch) {
        if (!candidate.title || !candidate.content || !candidate.excerpt) {
          rejectionReasons.push(`attempt ${attempt + 1}: missing title/content/excerpt`);
          continue;
        }
        const len = visibleTextLength(candidate.content);
        if (len < BLOG_CONTENT_MIN_CHARS || len > BLOG_CONTENT_MAX_CHARS) {
          rejectionReasons.push(`attempt ${attempt + 1}: "${candidate.title}" — ${len} chars (need ${BLOG_CONTENT_MIN_CHARS}–${BLOG_CONTENT_MAX_CHARS})`);
          continue;
        }
        candidate.slug = uniqueSlug(slugify(candidate.slug || candidate.title), usedSlugs);
        if (usedTitles.has(comparableTitle(candidate.title))) {
          rejectionReasons.push(`attempt ${attempt + 1}: duplicate title "${candidate.title}"`);
          continue;
        }
        draft = candidate;
        break;
      }
    } catch (err) {
      rejectionReasons.push(`attempt ${attempt + 1}: API error — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (!draft) {
    console.error("[ai-seo] Failed to generate draft after 5 attempts:", rejectionReasons);
    throw new Error(`Could not generate a valid draft after 5 attempts. Reasons: ${rejectionReasons.join(" | ")}`);
  }

  const { generateBlogFeaturedImage } = await import("./ai-seo-images");
  const img = await generateBlogFeaturedImage(`${run.keyword} ${draft.title}`);

  const clusterId = run.cluster_id ?? (run.mode === "cluster" && run.processed === 0 ? crypto.randomUUID() : null);

  // For cluster: store clusterId back to run so subsequent posts can use it
  if (run.mode === "cluster" && run.processed === 0 && clusterId) {
    await supabaseAdmin.from("generation_runs").update({ params: { ...(run as any), cluster_id: clusterId } }).eq("id", run.id);
  }

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert({
      slug: draft.slug,
      title: draft.title,
      excerpt: draft.excerpt || "",
      content: draft.content,
      category: draft.category || "Tips",
      image: img.url,
      image_alt: draft.imageAlt || img.alt,
      meta_title: draft.metaTitle || draft.title,
      meta_description: draft.metaDescription || draft.excerpt,
      read_time: draft.readTime || "6 min read",
      status: "draft",
      published_at: null,
      featured_image_url: img.url,
      featured_image_alt: draft.imageAlt || img.alt,
      generation_keyword: run.keyword,
      generation_run_id: run.id,
      cluster_id: clusterId,
      approved: !run.require_approval,
      retry_count: 0,
    })
    .select("id,title,slug")
    .single();

  if (error) throw new Error(error.message);
  return { saved: true, title: data.title, slug: data.slug };
}

export function calculateScheduledTimes(opts: ScheduleOptions): string[] {
  const times: string[] = [];
  let current = snapToWindow(new Date(opts.startTime), opts);

  for (let i = 0; i < opts.postIds.length; i++) {
    times.push(current.toISOString());
    // Advance by interval then snap to next valid window slot
    current = snapToWindow(
      new Date(current.getTime() + opts.intervalHours * 3600 * 1000),
      opts
    );
  }

  return times;
}
