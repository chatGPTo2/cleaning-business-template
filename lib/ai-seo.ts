import { cookies } from "next/headers";
import { allPosts, getAllDbPosts } from "./blog";
import { addSupportingBlogImages, selectBlogImages } from "./blog-images";
import { generateBlogFeaturedImage } from "./ai-seo-images";
import { blogPostUrl, submitIndexNowUrls } from "./indexnow";
import { supabaseAdmin } from "./supabase";

const GOOGLE_TOKEN_COOKIE = "taspro_google_tokens";
const GOOGLE_STATE_COOKIE = "taspro_google_state";

const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];

const BLOG_CONTENT_MIN_CHARS = 1500;
const BLOG_CONTENT_MAX_CHARS = 2000;

export const PRIORITY_SERVICES = [
  "commercial office cleaning",
  "office cleaning",
  "commercial cleaning",
  "office cleaning services",
  "commercial cleaning services",
  "office cleaner",
];

export const PRIORITY_LOCATIONS = [
  "Perth",
  "Melbourne",
  "Sydney",
  "Launceston",
];

export const DEFAULT_TARGET_LOCATIONS = [
  "Perth CBD",
  "East Perth",
  "West Perth",
  "Northbridge",
  "Subiaco",
  "Leederville",
  "Osborne Park",
  "Malaga",
  "Cannington",
  "Belmont",
  "Joondalup",
  "Midland",
  "Fremantle",
  "Launceston CBD",
  "Launceston",
  "Kings Meadows",
  "Newstead Launceston",
  "George Town Tasmania",
  "Melbourne CBD",
  "Southbank Melbourne",
  "Docklands Melbourne",
  "St Kilda Road Melbourne",
  "Richmond Melbourne",
  "South Yarra Melbourne",
  "Sydney CBD",
  "North Sydney",
  "Parramatta",
  "Surry Hills",
  "Pyrmont Sydney",
];

export const COMPETITOR_URLS = [
  "https://jimscleaning.com.au/local/tas/launceston/",
  "https://janiking.com.au/",
  "https://www.whitespotgroup.com.au/",
  "https://www.pccsclean.com.au/",
  "https://www.devinecommercialcleaning.com.au/",
];

type GoogleTokens = {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  scope?: string;
};

export type AiSeoSettings = {
  enabled: boolean;
  interval_hours: number;
  drafts_per_run: number;
  auto_publish: boolean;
  require_approval_before_publish: boolean;
  target_locations: string[];
  target_services: string[];
  content_brief: string;
  last_run_at: string | null;
  next_run_at: string | null;
};

export type SearchConsoleRow = {
  query: string;
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type AnalyticsPage = {
  path: string;
  sessions: number;
  users: number;
  conversions: number;
};

export type SearchOpportunity = SearchConsoleRow & {
  opportunityScore: number;
  reason: string;
};

export type CompetitorSignal = {
  url: string;
  title: string;
  headings: string[];
};

export type SeoSnapshot = {
  connected: boolean;
  searchConsoleRows: SearchConsoleRow[];
  searchOpportunities: SearchOpportunity[];
  analyticsPages: AnalyticsPage[];
  convertingPages: AnalyticsPage[];
  competitorSignals: CompetitorSignal[];
  error?: string;
  ga4Error?: string;
};

const DEFAULT_AI_SEO_SETTINGS: AiSeoSettings = {
  enabled: false,
  interval_hours: 24,
  drafts_per_run: 3,
  auto_publish: false,
  require_approval_before_publish: true,
  target_locations: DEFAULT_TARGET_LOCATIONS,
  target_services: PRIORITY_SERVICES,
  content_brief: "Focus exclusively on commercial office cleaning topics. Target businesses, property managers, office managers and facilities teams across Perth, Launceston, Melbourne and Sydney. Topics should cover office cleaning tips, how to choose a commercial cleaner, cleaning schedules for offices, and why professional cleaning improves productivity. Always include a local city/suburb in the post title and body.",
  last_run_at: null,
  next_run_at: null,
};

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
};

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://tasprocleaning.com.au";
}

function googleRedirectUri() {
  return process.env.GOOGLE_REDIRECT_URI || `${siteUrl()}/api/google/callback`;
}

export function isGoogleSeoConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GA4_PROPERTY_ID);
}

export function createGoogleOAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: GOOGLE_SCOPES.join(" "),
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function setGoogleStateCookie(state: string) {
  (await cookies()).set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
}

export async function consumeGoogleStateCookie() {
  const cookieStore = await cookies();
  const value = cookieStore.get(GOOGLE_STATE_COOKIE)?.value;
  cookieStore.delete(GOOGLE_STATE_COOKIE);
  return value;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleTokens> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: googleRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error_description || data.error || "Could not connect Google account");
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + Number(data.expires_in ?? 3600) * 1000,
    scope: data.scope,
  };
}

export async function setGoogleTokenCookie(tokens: GoogleTokens) {
  (await cookies()).set(GOOGLE_TOKEN_COOKIE, Buffer.from(JSON.stringify(tokens)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearGoogleTokenCookie() {
  (await cookies()).delete(GOOGLE_TOKEN_COOKIE);
}

export async function saveGoogleTokens(tokens: GoogleTokens) {
  if (!supabaseAdmin) return;

  await supabaseAdmin.from("ai_seo_google_tokens").upsert({
    id: "default",
    token_payload: tokens,
    updated_at: new Date().toISOString(),
  });
}

async function getStoredGoogleTokens(): Promise<GoogleTokens | null> {
  if (!supabaseAdmin) return null;

  const { data } = await supabaseAdmin
    .from("ai_seo_google_tokens")
    .select("token_payload")
    .eq("id", "default")
    .maybeSingle();

  return (data?.token_payload as GoogleTokens | undefined) ?? null;
}

async function getGoogleTokenCookie(): Promise<GoogleTokens | null> {
  const raw = (await cookies()).get(GOOGLE_TOKEN_COOKIE)?.value;
  if (!raw) return null;

  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

async function refreshGoogleAccessToken(tokens: GoogleTokens): Promise<GoogleTokens> {
  if (!tokens.refresh_token) return tokens;
  if (tokens.expires_at > Date.now() + 60_000) return tokens;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  if (!response.ok) return tokens;

  const refreshed = {
    ...tokens,
    access_token: data.access_token,
    expires_at: Date.now() + Number(data.expires_in ?? 3600) * 1000,
  };
  await saveGoogleTokens(refreshed);
  return refreshed;
}

export async function getGoogleTokens() {
  const tokens = await getGoogleTokenCookie();
  if (!tokens) return null;
  return refreshGoogleAccessToken(tokens);
}

export async function getAiSeoSettings(): Promise<AiSeoSettings> {
  if (!supabaseAdmin) return DEFAULT_AI_SEO_SETTINGS;

  const { data, error } = await supabaseAdmin
    .from("ai_seo_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  if (error) return DEFAULT_AI_SEO_SETTINGS;
  return data ? { ...DEFAULT_AI_SEO_SETTINGS, ...data } : DEFAULT_AI_SEO_SETTINGS;
}

export async function saveAiSeoSettings(settings: Partial<AiSeoSettings>) {
  if (!supabaseAdmin) throw new Error("Supabase admin client is not configured.");

  const intervalHours = Math.min(168, Math.max(1, Number(settings.interval_hours ?? DEFAULT_AI_SEO_SETTINGS.interval_hours)));
  const nextRun = new Date(Date.now() + intervalHours * 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin.from("ai_seo_settings").upsert({
    id: "default",
    enabled: Boolean(settings.enabled),
    interval_hours: intervalHours,
    drafts_per_run: Math.min(5, Math.max(1, Number(settings.drafts_per_run ?? DEFAULT_AI_SEO_SETTINGS.drafts_per_run))),
    auto_publish: Boolean(settings.auto_publish),
    require_approval_before_publish: settings.require_approval_before_publish ?? DEFAULT_AI_SEO_SETTINGS.require_approval_before_publish,
    target_locations: settings.target_locations?.length ? settings.target_locations : DEFAULT_AI_SEO_SETTINGS.target_locations,
    target_services: settings.target_services?.length ? settings.target_services : DEFAULT_AI_SEO_SETTINGS.target_services,
    content_brief: settings.content_brief ?? DEFAULT_AI_SEO_SETTINGS.content_brief,
    next_run_at: nextRun,
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
}

export async function markAiSeoRunComplete(settings: AiSeoSettings) {
  if (!supabaseAdmin) return;

  const now = new Date();
  const next = new Date(now.getTime() + settings.interval_hours * 60 * 60 * 1000);

  await supabaseAdmin.from("ai_seo_settings").upsert({
    id: "default",
    ...settings,
    last_run_at: now.toISOString(),
    next_run_at: next.toISOString(),
    updated_at: now.toISOString(),
  });
}

function isoDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

async function fetchSearchConsoleRows(accessToken: string): Promise<SearchConsoleRow[]> {
  const candidates = [
    process.env.GSC_SITE_URL,
    "https://tasprocleaning.com.au/",
    "sc-domain:tasprocleaning.com.au",
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(candidate)}/searchAnalytics/query`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: isoDate(93),
        endDate: isoDate(3),
        dimensions: ["query", "page"],
        rowLimit: 100,
      }),
    });

    if (!response.ok) continue;
    const data = await response.json();
    return (data.rows ?? []).map((row: any) => ({
      query: row.keys?.[0] ?? "",
      page: row.keys?.[1] ?? "",
      clicks: row.clicks ?? 0,
      impressions: row.impressions ?? 0,
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }));
  }

  return [];
}

async function fetchAnalyticsPages(accessToken: string): Promise<{ pages: AnalyticsPage[]; error?: string }> {
  if (!process.env.GA4_PROPERTY_ID) {
    return { pages: [], error: "GA4_PROPERTY_ID is not set in environment variables." };
  }

  const runReport = async (metrics: string[]) => {
    const response = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${process.env.GA4_PROPERTY_ID}:runReport`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: "90daysAgo", endDate: "yesterday" }],
          dimensions: [{ name: "landingPagePlusQueryString" }],
          metrics: metrics.map((name) => ({ name })),
          limit: 25,
          orderBys: [{ metric: { metricName: metrics[0] }, desc: true }],
        }),
      }
    );

    if (!response.ok) {
      let detail = `HTTP ${response.status}`;
      try {
        const body = await response.json();
        const msg = body?.error?.message || body?.error?.status || JSON.stringify(body);
        detail = `${response.status}: ${msg}`;
      } catch { /* ignore parse failure */ }

      if (response.status === 403) {
        throw new Error(`GA4 permission denied (${detail}). Your Google connection may be missing the Analytics scope — reconnect Google to fix.`);
      }
      if (response.status === 400) {
        throw new Error(`GA4 bad request (${detail}). Check that GA4_PROPERTY_ID=${process.env.GA4_PROPERTY_ID} is correct.`);
      }
      throw new Error(`GA4 API error (${detail}).`);
    }

    return response.json();
  };

  const metricSets = [
    ["sessions", "totalUsers", "keyEvents"],
    ["sessions", "totalUsers", "conversions"],
    ["sessions", "totalUsers"],
  ];

  let lastError = "";
  for (const metrics of metricSets) {
    try {
      const data = await runReport(metrics);
      return {
        pages: (data.rows ?? []).map((row: any) => ({
          path: row.dimensionValues?.[0]?.value ?? "",
          sessions: Number(row.metricValues?.[0]?.value ?? 0),
          users: Number(row.metricValues?.[1]?.value ?? 0),
          conversions: Number(row.metricValues?.[2]?.value ?? 0),
        })),
      };
    } catch (err) {
      lastError = err instanceof Error ? err.message : "GA4 error";
      // Only retry on metric-related errors, not auth/property errors
      if (lastError.includes("permission denied") || lastError.includes("bad request")) break;
    }
  }

  return { pages: [], error: lastError };
}

function rankSearchOpportunities(rows: SearchConsoleRow[]): SearchOpportunity[] {
  return rows
    .filter((row) => row.query && row.page && row.impressions >= 20)
    .map((row) => {
      const ctrGap = Math.max(0, 0.08 - row.ctr);
      const positionLift = row.position >= 4 && row.position <= 20
        ? 1
        : row.position > 20 && row.position <= 40
          ? 0.55
          : row.position < 4
            ? 0.25
            : 0.15;
      const opportunityScore = Math.round(row.impressions * positionLift * (1 + ctrGap * 10));
      const reason = row.position >= 4 && row.position <= 20
        ? "near page-one ranking with room to improve"
        : row.ctr < 0.04
          ? "low CTR for the impressions it receives"
          : "existing demand worth supporting";

      return { ...row, opportunityScore, reason };
    })
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 30);
}

function rankConvertingPages(pages: AnalyticsPage[]) {
  return [...pages]
    .filter((page) => page.conversions > 0)
    .sort((a, b) => (b.conversions - a.conversions) || (b.sessions - a.sessions))
    .slice(0, 20);
}

function extractHeadings(html: string) {
  return Array.from(html.matchAll(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi))
    .map((match) => match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .slice(0, 12);
}

function extractTitle(html: string) {
  return html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

export async function fetchCompetitorSignals(): Promise<CompetitorSignal[]> {
  const results = await Promise.allSettled(
    COMPETITOR_URLS.map(async (url) => {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      const html = await response.text();
      return { url, title: extractTitle(html), headings: extractHeadings(html) };
    })
  );

  return results.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
}

export async function getSeoSnapshot(): Promise<SeoSnapshot> {
  if (!isGoogleSeoConfigured()) {
    return { connected: false, searchConsoleRows: [], searchOpportunities: [], analyticsPages: [], convertingPages: [], competitorSignals: [], error: "Google API env vars are not configured." };
  }

  const tokens = await getGoogleTokens();
  if (!tokens) return { connected: false, searchConsoleRows: [], searchOpportunities: [], analyticsPages: [], convertingPages: [], competitorSignals: [] };

  return getSeoSnapshotForTokens(tokens);
}

export async function getStoredSeoSnapshot(): Promise<SeoSnapshot> {
  if (!isGoogleSeoConfigured()) {
    return { connected: false, searchConsoleRows: [], searchOpportunities: [], analyticsPages: [], convertingPages: [], competitorSignals: [], error: "Google API env vars are not configured." };
  }

  const tokens = await getStoredGoogleTokens();
  if (!tokens) return { connected: false, searchConsoleRows: [], searchOpportunities: [], analyticsPages: [], convertingPages: [], competitorSignals: [], error: "Google must be connected in admin before scheduled runs can start." };

  return getSeoSnapshotForTokens(await refreshGoogleAccessToken(tokens));
}

async function getSeoSnapshotForTokens(tokens: GoogleTokens): Promise<SeoSnapshot> {
  try {
    const [searchConsoleRows, ga4Result, competitorSignals] = await Promise.all([
      fetchSearchConsoleRows(tokens.access_token),
      fetchAnalyticsPages(tokens.access_token),
      fetchCompetitorSignals(),
    ]);

    return {
      connected: true,
      searchConsoleRows,
      searchOpportunities: rankSearchOpportunities(searchConsoleRows),
      analyticsPages: ga4Result.pages,
      convertingPages: rankConvertingPages(ga4Result.pages),
      competitorSignals,
      ga4Error: ga4Result.error,
    };
  } catch (error) {
    return {
      connected: true,
      searchConsoleRows: [],
      searchOpportunities: [],
      analyticsPages: [],
      convertingPages: [],
      competitorSignals: [],
      error: error instanceof Error ? error.message : "Could not fetch SEO data.",
    };
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/-$/g, "");
}

function extractOpenAiText(data: any) {
  if (typeof data.output_text === "string") return data.output_text;
  const chunks = data.output?.flatMap((item: any) => item.content ?? []) ?? [];
  return chunks.map((chunk: any) => chunk.text ?? "").join("\n").trim();
}

function parseJsonArray(text: string): AiDraft[] {
  const clean = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("AI did not return a JSON array");
  return JSON.parse(clean.slice(start, end + 1));
}

async function generateAiDrafts(
  snapshot: SeoSnapshot,
  existingTitles: string[],
  blockedTopics: string[] = [],
  settings: AiSeoSettings = DEFAULT_AI_SEO_SETTINGS
) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");

  const prompt = {
    brand: "Taspro Cleaning Solutions",
    site: "https://tasprocleaning.com.au",
    services: settings.target_services,
    locations: settings.target_locations,
    contentBrief: settings.content_brief,
    searchConsoleRows: snapshot.searchConsoleRows.slice(0, 60),
    searchOpportunities: snapshot.searchOpportunities.slice(0, 25),
    analyticsPages: snapshot.analyticsPages.slice(0, 20),
    convertingPages: snapshot.convertingPages.slice(0, 20),
    competitorSignals: snapshot.competitorSignals,
    existingTitles,
    blockedTopics,
    requirements: [
      "Create 3 non-duplicative local SEO blog drafts.",
      "Use searchOpportunities first when choosing topics: favour queries with high impressions, low CTR, or positions 4-20 that match the supplied services and locations.",
      "Use convertingPages to reinforce topics and internal links that already attract leads; do not copy those pages, support them with helpful related blog content.",
      "If a topic does not support a supplied target service/location or a converting Search Console/GA4 opportunity, reject it and choose a stronger one.",
      "Every post must target one of the supplied services and one of the supplied locations.",
      "Do not generate blogs for locations outside the supplied locations list.",
      "Follow contentBrief as a hard targeting rule, especially service radius and audience constraints.",
      "Do not create posts with titles, slugs, or core topics similar to existingTitles or blockedTopics.",
      "If obvious topics already exist, choose a different supplied suburb, service angle, room type, checklist, seasonal need, or customer concern.",
      "Do not invent pricing, awards, reviews, certifications, or guarantees beyond the Taspro website claims.",
      "Use HTML content only for the article body: h2, h3, p, ul, li, strong, and internal a href links. Do not include images; the CMS will insert real relevant images.",
      `The visible article body text must be ${BLOG_CONTENT_MIN_CHARS}-${BLOG_CONTENT_MAX_CHARS} characters long after HTML tags are removed. This is mandatory.`,
      "Include useful headings, practical cleaning advice, local relevance, and links to /quote plus relevant service/location pages.",
      "Write like an experienced Australian cleaning operator: specific, practical, calm, and human. Avoid AI clichés, filler phrases, exaggerated claims, and generic paragraphs.",
      "Keep status draft quality: polished enough for admin review, not thin or generic. Aim for clear local intent, natural keyword use, and helpful next steps.",
    ],
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      instructions: [
        "You are an expert Australian local SEO strategist and senior cleaning industry copywriter.",
        "Return only a JSON array. No markdown, no prose outside JSON.",
        "Each item must have: title, slug, excerpt, category, readTime, imageAlt, metaTitle, metaDescription, targetKeyword, qualityScore, duplicateRisk, content.",
      ].join(" "),
      input: JSON.stringify(prompt),
      temperature: 0.4,
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "OpenAI draft generation failed.");
  return parseJsonArray(extractOpenAiText(data));
}

function uniqueSlug(baseSlug: string, usedSlugs: Set<string>) {
  const base = slugify(baseSlug);
  let slug = base;
  let suffix = 2;
  while (!slug || usedSlugs.has(slug)) {
    slug = `${base || "ai-seo-cleaning-guide"}-${suffix}`;
    suffix += 1;
  }
  usedSlugs.add(slug);
  return slug;
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

function normalizeDraft(draft: AiDraft) {
  return {
    ...draft,
    qualityScore: Number(draft.qualityScore ?? 75),
    duplicateRisk: Number(draft.duplicateRisk ?? 35),
    slug: slugify(draft.slug || draft.title || ""),
  };
}

export async function createAiSeoBlogDrafts(
  snapshot: SeoSnapshot,
  options: { limit?: number; autoPublish?: boolean; settings?: AiSeoSettings } = {}
) {
  if (!supabaseAdmin) throw new Error("Supabase admin client is not configured.");

  const dbPosts = await getAllDbPosts();
  const existingPosts = [...dbPosts.map((post) => ({
    slug: post.slug,
    title: post.title,
  })), ...allPosts.map((post) => ({ slug: post.slug, title: post.title }))];

  const usedSlugs = new Set(existingPosts.map((post) => post.slug));
  const usedTitles = new Set(existingPosts.map((post) => comparableTitle(post.title)));
  const requestedCount = Math.min(5, Math.max(1, options.limit ?? 3));
  const existingTitles = existingPosts.map((post) => post.title);
  const blockedTopics = [...existingTitles];
  const settings = options.settings ?? DEFAULT_AI_SEO_SETTINGS;
  const qualifiedDrafts: ReturnType<typeof normalizeDraft>[] = [];

  for (let attempt = 0; attempt < 3 && qualifiedDrafts.length < requestedCount; attempt += 1) {
    const drafts = await generateAiDrafts(snapshot, existingTitles, blockedTopics, settings);
    for (const draft of drafts.map(normalizeDraft)) {
      if (!draft.title || !draft.excerpt || !draft.content) {
        blockedTopics.push(draft.title || draft.slug || "missing required fields");
        continue;
      }

      const contentLength = visibleTextLength(draft.content);
      if (contentLength < BLOG_CONTENT_MIN_CHARS || contentLength > BLOG_CONTENT_MAX_CHARS) {
        blockedTopics.push(`${draft.title || draft.slug} rejected for ${contentLength} visible characters; required ${BLOG_CONTENT_MIN_CHARS}-${BLOG_CONTENT_MAX_CHARS}`);
        continue;
      }

      const titleKey = comparableTitle(draft.title);
      if (usedTitles.has(titleKey) || usedSlugs.has(draft.slug)) {
        blockedTopics.push(draft.title);
        continue;
      }

      usedTitles.add(titleKey);
      usedSlugs.add(draft.slug);
      blockedTopics.push(draft.title);
      qualifiedDrafts.push(draft);
      if (qualifiedDrafts.length >= requestedCount) break;
    }
  }

  qualifiedDrafts.sort((a, b) => (b.qualityScore - a.qualityScore) || (a.duplicateRisk - b.duplicateRisk));

  if (qualifiedDrafts.length === 0) {
    throw new Error(`AI tried multiple times but only produced duplicates, incomplete posts, or posts outside the ${BLOG_CONTENT_MIN_CHARS}-${BLOG_CONTENT_MAX_CHARS} character requirement. Try fewer posts per run or broaden the target topics.`);
  }

  // Approval gate: if require_approval_before_publish is on, never auto-publish
  const requireApproval = options.settings?.require_approval_before_publish ?? true;
  const canAutoPublish = options.autoPublish && !requireApproval;
  const publishedAt = canAutoPublish ? new Date().toISOString() : null;

  // Generate unique DALL-E images for each draft (with rate-limit handling + local fallback)
  const featuredImages = await Promise.all(
    qualifiedDrafts.slice(0, requestedCount).map((draft) =>
      generateBlogFeaturedImage(`${draft.targetKeyword || draft.title} ${draft.title}`)
    )
  );

  const rows = qualifiedDrafts.slice(0, requestedCount).map((draft, i) => {
    const featuredImg = featuredImages[i];
    // Keep supporting inline images from local library for in-content figures
    const inlineImages = selectBlogImages({
      title: draft.title,
      category: draft.category,
      content: draft.content,
      count: 3,
    });

    return {
      slug: uniqueSlug(draft.slug || draft.title, usedSlugs),
      title: draft.title,
      excerpt: draft.excerpt,
      content: addSupportingBlogImages(draft.content, inlineImages),
      category: draft.category || "Tips",
      image: featuredImg.url,
      image_alt: featuredImg.alt,
      featured_image_url: featuredImg.url,
      featured_image_alt: featuredImg.alt,
      meta_title: draft.metaTitle || draft.title,
      meta_description: draft.metaDescription || draft.excerpt,
      read_time: draft.readTime || "6 min read",
      status: canAutoPublish ? "published" : "draft",
      published_at: publishedAt,
      approved: !requireApproval,
    };
  });

  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .insert(rows)
    .select("id,title,slug");

  if (error) throw new Error(error.message);
  if (canAutoPublish) {
    await submitIndexNowUrls((data ?? []).map((post) => blogPostUrl(post.slug)));
  }
  return data ?? [];
}
