import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getAiSeoSettings,
  getSeoSnapshot,
  isGoogleSeoConfigured,
} from "@/lib/ai-seo";
import { getAllDbPosts } from "@/lib/blog";
import { supabaseAdmin } from "@/lib/supabase";
import AdminShell from "../AdminShell";
import { generateAiSeoDrafts, updateAiSeoSchedule } from "./actions";
import GenerateDraftsButton from "./GenerateDraftsButton";
import SaveScheduleButton from "./SaveScheduleButton";
import AiSeoManager from "./AiSeoManager";

export const dynamic = "force-dynamic";

function percent(value: number) {
  return `${Math.round(value * 1000) / 10}%`;
}

export default async function AiSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ connected?: string; disconnected?: string; drafts?: string; schedule?: string; error?: string }>;
}) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;

  const [snapshot, dbPosts, settings] = await Promise.all([getSeoSnapshot(), getAllDbPosts(), getAiSeoSettings()]);
  const recentAiDrafts = dbPosts
    .filter((post) => post.status === "draft")
    .slice(0, 5);

  // Load AI-generated posts for the new manager (posts with a generation_run_id)
  const aiGeneratedPosts = supabaseAdmin
    ? (
        await supabaseAdmin
          .from("blog_posts")
          .select("*")
          .not("generation_run_id", "is", null)
          .order("created_at", { ascending: false })
          .limit(200)
      ).data ?? []
    : [];

  // Check for any interrupted generation run to show the Resume banner
  const activeRunData = supabaseAdmin
    ? (
        await supabaseAdmin
          .from("generation_runs")
          .select("id, keyword, processed, target")
          .in("status", ["queued", "running"])
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      ).data
    : null;

  return (
    <AdminShell section="ai-seo">
      <div className="space-y-6">

        {/* ── NEW: Keyword Generator + Draft Manager ── */}
        <AiSeoManager initialDrafts={aiGeneratedPosts} activeRun={activeRunData} />

        <hr className="border-slate-200" />

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-950">AI SEO Planner</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
              Researches Google Search Console, GA4, competitor headings and existing posts, then creates review-ready blog drafts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {snapshot.connected ? (
              <>
                <form action={generateAiSeoDrafts}>
                  <GenerateDraftsButton />
                </form>
                <form action="/api/google/disconnect" method="post">
                  <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-red-300 hover:text-red-600">
                    Disconnect Google
                  </button>
                </form>
              </>
            ) : (
              <a
                href="/api/google/connect"
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
              >
                Connect Google
              </a>
            )}
          </div>
        </div>

        {resolvedSearchParams.connected && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
            Google connected. Search Console and GA4 data can now be used for draft generation.
          </div>
        )}
        {resolvedSearchParams.drafts && (
          <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800">
            Created {resolvedSearchParams.drafts} new AI SEO draft{resolvedSearchParams.drafts === "1" ? "" : "s"} in Blog.
          </div>
        )}
        {resolvedSearchParams.schedule && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">
            AI SEO schedule saved. Current setting: {settings.enabled ? "enabled" : "paused"}, every {settings.interval_hours} hours, {settings.drafts_per_run} post{settings.drafts_per_run === 1 ? "" : "s"} per run.
          </div>
        )}
        {resolvedSearchParams.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {resolvedSearchParams.error}
          </div>
        )}
        {snapshot.error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
            {snapshot.error}
          </div>
        )}
        {snapshot.ga4Error && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            <span className="font-semibold">GA4 data unavailable: </span>{snapshot.ga4Error}
            {snapshot.ga4Error.includes("permission denied") || snapshot.ga4Error.includes("scope") ? (
              <span> — <a href="/api/google/connect" className="underline font-semibold">Reconnect Google</a> to refresh permissions.</span>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {[
            { label: "Google", value: snapshot.connected ? "Connected" : "Not connected" },
            { label: "Search queries", value: snapshot.searchConsoleRows.length },
            { label: "SEO opportunities", value: snapshot.searchOpportunities.length },
            { label: "Lead pages", value: snapshot.convertingPages.length },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-navy-950">{item.value}</p>
            </div>
          ))}
        </div>

        {!isGoogleSeoConfigured() && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="text-sm font-semibold text-amber-900">Google setup incomplete</h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-800">
              Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI and GA4_PROPERTY_ID to the environment before connecting Google.
            </p>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-navy-950">Autopilot Schedule</h3>
            <p className="mt-1 text-sm text-slate-500">
              Scheduled runs create drafts by default. Auto-publish is available, but drafts are safer for quality review.
            </p>
            {settings.require_approval_before_publish && (
              <p className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800">
                Approval gate is ON. Autopilot will create drafts — nothing publishes until manually approved.
              </p>
            )}
            {settings.auto_publish && !settings.require_approval_before_publish && (
              <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                Auto-publish is on and approval gate is off. Posts will go live without review.
              </p>
            )}
          </div>
          <form action={updateAiSeoSchedule} className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-600">Status</span>
              <select
                name="enabled"
                defaultValue={settings.enabled ? "on" : "off"}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="off">Paused</option>
                <option value="on">Enabled</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-600">Interval</span>
              <select
                name="interval_hours"
                defaultValue={settings.interval_hours}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="1">Every 1 hour</option>
                <option value="2">Every 2 hours</option>
                <option value="6">Every 6 hours</option>
                <option value="12">Every 12 hours</option>
                <option value="24">Daily</option>
                <option value="72">Every 3 days</option>
                <option value="168">Weekly</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-600">Posts per run</span>
              <select
                name="drafts_per_run"
                defaultValue={settings.drafts_per_run}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="1">1 post</option>
                <option value="2">2 posts</option>
                <option value="3">3 posts</option>
                <option value="5">5 posts</option>
              </select>
            </label>
            <SaveScheduleButton />
            <label className="flex items-center gap-2 md:col-span-4">
              <input
                type="checkbox"
                name="auto_publish"
                defaultChecked={settings.auto_publish}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-slate-600">Auto-publish instead of saving drafts</span>
            </label>
            <label className="flex items-center gap-2 md:col-span-4">
              <input
                type="checkbox"
                name="require_approval_before_publish"
                defaultChecked={settings.require_approval_before_publish}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-slate-600">
                Require approval before publishing <span className="text-slate-400">(overrides auto-publish — nothing goes live until approved in drafts)</span>
              </span>
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="block text-xs font-semibold text-slate-600">Target locations</span>
              <textarea
                name="target_locations"
                defaultValue={settings.target_locations.join("\n")}
                rows={8}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <span className="block text-xs text-slate-400">One suburb/location per line. AI SEO will stay inside this list.</span>
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="block text-xs font-semibold text-slate-600">Target services</span>
              <textarea
                name="target_services"
                defaultValue={settings.target_services.join("\n")}
                rows={8}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
              <span className="block text-xs text-slate-400">One service per line. Keep this focused for better draft quality.</span>
            </label>
            <label className="space-y-1.5 md:col-span-4">
              <span className="block text-xs font-semibold text-slate-600">Content targeting brief</span>
              <textarea
                name="content_brief"
                defaultValue={settings.content_brief}
                rows={4}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </label>
          </form>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
            <span>Last run: {settings.last_run_at ? new Date(settings.last_run_at).toLocaleString("en-AU") : "Not yet"}</span>
            <span>·</span>
            <span>Next run: {settings.next_run_at ? new Date(settings.next_run_at).toLocaleString("en-AU") : "Not scheduled"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-navy-950">Rankable Search Opportunities</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {snapshot.searchOpportunities.slice(0, 8).map((row) => (
                <div key={`${row.query}-${row.page}`} className="px-5 py-3">
                  <p className="text-sm font-semibold text-navy-950">{row.query}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">{row.page}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Score {row.opportunityScore} · {row.impressions} impressions · {row.clicks} clicks · {percent(row.ctr)} CTR · position {row.position.toFixed(1)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {row.reason}
                  </p>
                </div>
              ))}
              {snapshot.searchOpportunities.length === 0 && (
                <p className="px-5 py-8 text-sm text-slate-400">
                  Connect Google, or confirm the Search Console property is verified for tasprocleaning.com.au.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-sm font-semibold text-navy-950">GA4 Lead Landing Pages</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {(snapshot.convertingPages.length > 0 ? snapshot.convertingPages : snapshot.analyticsPages).slice(0, 8).map((page) => (
                <div key={page.path} className="px-5 py-3">
                  <p className="line-clamp-1 text-sm font-semibold text-navy-950">{page.path}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {page.sessions} sessions · {page.users} users · {page.conversions} key events
                  </p>
                </div>
              ))}
              {snapshot.analyticsPages.length === 0 && (
                <p className="px-5 py-8 text-sm text-slate-400">
                  Connect Google, or confirm the GA4 Property ID is correct.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-navy-950">Priority Services</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {settings.target_services.map((service) => (
                <span key={service} className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                  {service}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-navy-950">Priority Locations</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {settings.target_locations.map((location) => (
                <span key={location} className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {location}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-navy-950">Recent Drafts</h3>
            <div className="mt-3 space-y-2">
              {recentAiDrafts.map((post) => (
                <Link key={post.id} href={`/admin/blog/${post.id}`} className="block text-sm font-medium text-teal-700 hover:text-teal-800">
                  {post.title}
                </Link>
              ))}
              {recentAiDrafts.length === 0 && (
                <p className="text-sm text-slate-400">No draft posts yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
