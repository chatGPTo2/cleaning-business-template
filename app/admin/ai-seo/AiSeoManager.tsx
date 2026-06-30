"use client";

import { useState, useTransition, useRef } from "react";
import Link from "next/link";
import type { DbBlogPost } from "@/lib/blog";

type Props = {
  initialDrafts: DbBlogPost[];
  activeRun?: { id: string; keyword: string; processed: number; target: number } | null;
};

type ComplianceResult = {
  id: string;
  title: string;
  slug: string;
  status: string;
  char_count: number;
  passes_length: boolean;
  internal_link_count: number;
  passes_internal_links: boolean;
  has_quote_link: boolean;
  has_gbp_link: boolean;
  has_body_images: boolean;
  passes_all: boolean;
};

type StatusBadgeProps = { status: DbBlogPost["status"]; approved: boolean };

function StatusBadge({ status, approved }: StatusBadgeProps) {
  const map: Record<string, string> = {
    draft: approved
      ? "bg-slate-100 text-slate-600"
      : "bg-amber-50 text-amber-700 border border-amber-200",
    scheduled: "bg-blue-50 text-blue-700 border border-blue-200",
    published: "bg-green-50 text-green-700 border border-green-200",
    failed: "bg-red-50 text-red-700 border border-red-200",
  };
  const label =
    status === "draft" && !approved
      ? "Draft — awaiting approval"
      : status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${map[status] ?? map.draft}`}>
      {label}
    </span>
  );
}

export default function AiSeoManager({ initialDrafts, activeRun }: Props) {
  const [drafts, setDrafts] = useState<DbBlogPost[]>(initialDrafts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [publishError, setPublishError] = useState<string>("");
  const [regenProgress, setRegenProgress] = useState<{ current: number; total: number; label: string } | null>(null);
  const [bulkPublishProgress, setBulkPublishProgress] = useState<{ current: number; total: number } | null>(null);
  const [sortCol, setSortCol] = useState<"title" | "status" | "keyword" | "created" | "scheduled" | "approved" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [draftsOpen, setDraftsOpen] = useState(true);

  // Compliance audit state
  const [complianceResults, setComplianceResults] = useState<ComplianceResult[] | null>(null);
  const [auditLoading, setAuditLoading] = useState(false);
  const [fixingId, setFixingId] = useState<string | null>(null);
  const [fixProgress, setFixProgress] = useState<{ current: number; total: number; label: string } | null>(null);
  const [complianceError, setComplianceError] = useState("");
  const [forceRegenImages, setForceRegenImages] = useState(false);
  const [fixImagesProgress, setFixImagesProgress] = useState<{ current: number; total: number; label: string } | null>(null);

  async function handleAudit() {
    setAuditLoading(true);
    setComplianceError("");
    try {
      const res = await fetch("/api/admin/ai-seo/audit");
      const data = await res.json();
      if (!res.ok) { setComplianceError(data.error ?? "Audit failed."); return; }
      setComplianceResults(data.results ?? []);
    } catch {
      setComplianceError("Network error — could not run audit.");
    } finally {
      setAuditLoading(false);
    }
  }

  async function handleFixPost(postId: string, withImages?: boolean): Promise<boolean> {
    setFixingId(postId);
    try {
      const res = await fetch("/api/admin/ai-seo/fix-compliance", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId, forceImages: withImages ?? forceRegenImages }),
      });
      const data = await res.json();
      if (res.ok && data.fixed) {
        setComplianceResults((prev) =>
          prev ? prev.map((r) => r.id === postId ? {
            ...r,
            has_quote_link: true, has_gbp_link: true,
            passes_internal_links: true, passes_length: true,
            has_body_images: (withImages ?? forceRegenImages) ? true : r.has_body_images,
            passes_all: true,
          } : r) : prev
        );
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      setFixingId(null);
    }
  }

  async function handleFixAll() {
    if (!complianceResults) return;
    const toFix = forceRegenImages
      ? complianceResults.filter((r) => r.status !== "failed")
      : complianceResults.filter((r) => !r.passes_all && r.status !== "failed");
    if (!toFix.length) { alert("Nothing to fix."); return; }
    const imageNote = forceRegenImages ? " + regenerate all body images (DALL-E)" : "";
    if (!confirm(`Fix ${toFix.length} post${toFix.length === 1 ? "" : "s"}${imageNote}? Each post takes ~15–45s.`)) return;
    setComplianceError("");
    let done = 0;
    const errors: string[] = [];
    for (const post of toFix) {
      setFixProgress({ current: done, total: toFix.length, label: post.title });
      const ok = await handleFixPost(post.id, forceRegenImages);
      if (ok) done++;
      else errors.push(post.title);
    }
    setFixProgress(null);
    await handleAudit();
    if (errors.length) setComplianceError(`Fixed ${done}/${toFix.length}. Failed: ${errors.join(", ")}`);
  }

  function handleSort(col: typeof sortCol) {
    if (sortCol === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  const sortedDrafts = [...drafts].sort((a, b) => {
    if (!sortCol) return 0;
    let av: string | number = "";
    let bv: string | number = "";
    if (sortCol === "title")    { av = a.title.toLowerCase(); bv = b.title.toLowerCase(); }
    if (sortCol === "status")   { av = a.status; bv = b.status; }
    if (sortCol === "keyword")  { av = (a.generation_keyword ?? "").toLowerCase(); bv = (b.generation_keyword ?? "").toLowerCase(); }
    if (sortCol === "created")  { av = a.created_at; bv = b.created_at; }
    if (sortCol === "scheduled") { av = a.scheduled_at ?? ""; bv = b.scheduled_at ?? ""; }
    if (sortCol === "approved") { av = a.approved ? 1 : 0; bv = b.approved ? 1 : 0; }
    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  // Generator form state
  const [keyword, setKeyword] = useState("");
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"standard" | "cluster">("standard");
  const [location, setLocation] = useState("");
  const [audience, setAudience] = useState("");
  const [offerAngle, setOfferAngle] = useState("");
  const [requireApproval, setRequireApproval] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState<{ processed: number; target: number } | null>(null);
  const [generateError, setGenerateError] = useState("");
  const [generateSuccess, setGenerateSuccess] = useState("");
  const stopRef = useRef(false);

  // Schedule panel state — default start time to after the last scheduled post
  const [startTime, setStartTime] = useState(() => {
    const lastScheduled = initialDrafts
      .map((d) => d.scheduled_at)
      .filter(Boolean)
      .sort()
      .at(-1);
    const base = lastScheduled ? new Date(lastScheduled) : new Date();
    // Add 2 hours after the last scheduled post (matches default interval)
    base.setHours(base.getHours() + 2);
    return base.toISOString().slice(0, 16);
  });
  const [intervalHours, setIntervalHours] = useState(2);
  const [windowStart, setWindowStart] = useState(7);
  const [windowEnd, setWindowEnd] = useState(19);
  const [skipWeekends, setSkipWeekends] = useState(true);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState("");

  async function refreshDrafts() {
    const res = await fetch("/api/admin/ai-seo/drafts");
    if (res.ok) {
      const data = await res.json();
      setDrafts(data.drafts ?? []);
    }
  }

  // Shared worker loop — drives processing for any runId from a given starting point
  async function driveWorkerLoop(runId: string, startProcessed: number, target: number, label: string) {
    let processed = startProcessed;
    stopRef.current = false;
    setProgress({ processed, target });

    while (processed < target) {
      if (stopRef.current) {
        setGenerateSuccess(`Stopped at ${processed}/${target} — use Resume to continue or start a new run.`);
        return processed;
      }

      const workerRes = await fetch("/api/admin/ai-seo/worker", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ runId }),
      });
      const workerData = await workerRes.json();

      if (!workerRes.ok) {
        setGenerateError(workerData.error ?? "Worker error — some drafts may have been saved.");
        return processed;
      }

      processed = workerData.processed ?? processed + 1;
      setProgress({ processed, target });
      await refreshDrafts();
      if (workerData.done) break;
    }

    if (!stopRef.current) {
      setGenerateSuccess(`Done — created ${processed} draft${processed === 1 ? "" : "s"} for "${label}".`);
    }
    return processed;
  }

  function handleStop() {
    stopRef.current = true;
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!keyword.trim()) return;
    setGenerating(true);
    setGenerateError("");
    setGenerateSuccess("");
    setProgress(null);

    try {
      const res = await fetch("/api/admin/ai-seo/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ keyword, qty, mode, location, audience, offerAngle, requireApproval }),
      });
      const data = await res.json();
      if (!res.ok) {
        setGenerateError(data.error ?? "Could not start generation.");
        return;
      }
      const { runId, target } = data as { runId: string; target: number };
      await driveWorkerLoop(runId, 0, target, keyword);
    } catch {
      setGenerateError("Network error — please try again.");
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  }

  async function handleResume() {
    if (!activeRun) return;
    setGenerating(true);
    setGenerateError("");
    setGenerateSuccess("");
    try {
      await driveWorkerLoop(activeRun.id, activeRun.processed, activeRun.target, activeRun.keyword);
    } catch {
      setGenerateError("Network error during resume — the cron will continue automatically.");
    } finally {
      setGenerating(false);
      setProgress(null);
    }
  }

  async function handleDelete(postId: string) {
    if (!confirm("Delete this draft? This cannot be undone.")) return;
    const res = await fetch("/api/admin/ai-seo/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      setDrafts((prev) => prev.filter((d) => d.id !== postId));
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(postId); return next; });
    }
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds);
    if (!confirm(`Delete ${ids.length} selected draft${ids.length === 1 ? "" : "s"}? This cannot be undone.`)) return;
    const res = await fetch("/api/admin/ai-seo/delete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postIds: ids }),
    });
    if (res.ok) {
      setDrafts((prev) => prev.filter((d) => !selectedIds.has(d.id)));
      setSelectedIds(new Set());
    }
  }

  async function handleRegenerateHeroImages(selectedPostIds?: string[]) {
    const confirmed = confirm(
      selectedPostIds
        ? `Regenerate hero images for ${selectedPostIds.length} selected post${selectedPostIds.length === 1 ? "" : "s"} with DALL-E? (~${selectedPostIds.length * 12}s)`
        : "Regenerate hero images for ALL published posts with DALL-E? This runs one post at a time and will take a while."
    );
    if (!confirmed) return;

    // Fetch the full list of posts to process
    let ids: { id: string; title: string }[] = [];
    if (selectedPostIds) {
      ids = selectedPostIds.map((id) => ({ id, title: drafts.find((d) => d.id === id)?.title ?? id }));
    } else {
      const listRes = await fetch("/api/admin/ai-seo/regenerate-hero-images");
      if (!listRes.ok) { alert("Failed to fetch post list."); return; }
      const listData = await listRes.json();
      ids = listData.posts ?? [];
    }

    if (!ids.length) { alert("No published posts found."); return; }

    let done = 0;
    const errors: string[] = [];
    for (const post of ids) {
      setRegenProgress({ current: done, total: ids.length, label: post.title });
      const res = await fetch("/api/admin/ai-seo/regenerate-hero-images", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      if (res.ok) {
        done++;
      } else {
        const d = await res.json().catch(() => ({}));
        errors.push(`"${post.title}": ${d.error ?? "failed"}`);
      }
      // 12s gap between posts to stay under rate limits
      if (done + errors.length < ids.length) await new Promise((r) => setTimeout(r, 12000));
    }

    setRegenProgress(null);
    await refreshDrafts();
    let msg = `Done — regenerated ${done}/${ids.length} hero images.`;
    if (errors.length) msg += `\n\nErrors:\n${errors.join("\n")}`;
    alert(msg);
  }

  async function handleFixLocalImages() {
    const audit = await fetch("/api/admin/ai-seo/fix-images").then((r) => r.json()).catch(() => null);
    const posts: { id: string; title: string; heroLocal: boolean; inlineCount: number }[] = audit?.posts ?? [];
    if (posts.length === 0) { alert("No local images found — all posts already use unique AI-generated images."); return; }
    const heroCount = posts.filter((p) => p.heroLocal).length;
    const inlineCount = posts.filter((p) => p.inlineCount > 0).length;
    if (!confirm(`Found ${heroCount} posts with local hero images and ${inlineCount} with local inline images.\n\nStep 1 (this): Generate unique DALL-E hero images + strip local inline figures (~${heroCount * 15}s).\nStep 2: Run "Fix all body images" to add fresh DALL-E inline images.\n\nProceed?`)) return;

    let done = 0;
    const errors: string[] = [];
    for (const post of posts) {
      setFixImagesProgress({ current: done, total: posts.length, label: post.title });
      const res = await fetch("/api/admin/ai-seo/fix-images", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      if (res.ok) {
        done++;
      } else {
        const d = await res.json().catch(() => ({}));
        errors.push(`"${post.title}": ${d.error ?? `HTTP ${res.status}`}`);
      }
      if (done + errors.length < posts.length) await new Promise((r) => setTimeout(r, 5000));
    }

    setFixImagesProgress(null);
    await refreshDrafts();
    let msg = `Done — fixed images on ${done}/${posts.length} posts.`;
    if (errors.length) msg += `\n\nErrors:\n${errors.join("\n")}`;
    alert(msg);
  }

  async function handleAddBodyImages(postIds: string[] | "all") {
    const isAll = postIds === "all";
    const res = await fetch("/api/admin/ai-seo/add-body-images", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(isAll ? { fixAll: true } : { postIds }),
    });
    const data = await res.json();
    if (res.ok) {
      const method = data.method === "dall-e" ? "DALL-E" : "local library";
      let msg = `Done — added body images to ${data.fixed} post${data.fixed === 1 ? "" : "s"} using ${method}.`;
      if (data.errors?.length) msg += `\n\nErrors:\n${data.errors.join("\n")}`;
      alert(msg);
      await refreshDrafts();
    } else {
      alert(data.error ?? "Failed to add body images.");
    }
  }

  async function handleBulkApprove() {
    const ids = Array.from(selectedIds);
    await Promise.all(
      ids.map((id) =>
        fetch("/api/admin/ai-seo/approve", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ postId: id, approved: true }),
        })
      )
    );
    setDrafts((prev) =>
      prev.map((d) => (selectedIds.has(d.id) ? { ...d, approved: true } : d))
    );
    setSelectedIds(new Set());
  }

  async function handleApprove(postId: string, approved: boolean) {
    const res = await fetch("/api/admin/ai-seo/approve", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId, approved }),
    });
    if (res.ok) {
      setDrafts((prev) =>
        prev.map((d) => (d.id === postId ? { ...d, approved } : d))
      );
    }
  }

  async function handleBulkPublish() {
    const ids = Array.from(selectedIds);
    if (!confirm(`Publish ${ids.length} selected post${ids.length === 1 ? "" : "s"} now? Each post will have DALL-E images generated if missing.`)) return;
    setBulkPublishProgress({ current: 0, total: ids.length });
    setPublishError("");
    let published = 0;
    const errors: string[] = [];
    for (let i = 0; i < ids.length; i++) {
      setBulkPublishProgress({ current: i, total: ids.length });
      try {
        const res = await fetch("/api/admin/ai-seo/publish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ postId: ids[i] }),
        });
        const data = await res.json();
        if (!res.ok || data.published === 0) {
          errors.push(data.error ?? `Post ${i + 1} failed`);
        } else {
          published++;
        }
      } catch {
        errors.push(`Post ${i + 1}: network error`);
      }
    }
    setBulkPublishProgress(null);
    await refreshDrafts();
    setSelectedIds(new Set());
    if (errors.length) setPublishError(`Published ${published}/${ids.length}. Errors:\n${errors.join("\n")}`);
  }

  async function handlePublishNow(postId: string) {
    setPublishError("");
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/ai-seo/publish", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ postId }),
        });
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.error ?? `Publish failed (${res.status}). Try refreshing the page and logging in again.`);
        } else if (data.published === 0) {
          setPublishError("Post could not be published — it may already be published or the session expired. Try refreshing.");
        }
        await refreshDrafts();
      } catch {
        setPublishError("Network error — could not reach the server.");
      }
    });
  }

  async function handleRetry(postId: string) {
    // Reset to scheduled so publish job picks it up, then trigger immediately
    await fetch("/api/admin/ai-seo/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ postId }),
    });
    await refreshDrafts();
  }

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    const ids = Array.from(selectedIds);
    if (ids.length === 0) {
      setScheduleError("Select at least one draft to schedule.");
      return;
    }
    setScheduleError("");
    setScheduleSuccess("");

    const res = await fetch("/api/admin/ai-seo/schedule", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        postIds: ids,
        startTime: new Date(startTime).toISOString(),
        intervalHours,
        windowStartHour: windowStart,
        windowEndHour: windowEnd,
        skipWeekends,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setScheduleError(data.error ?? "Scheduling failed.");
    } else {
      setScheduleSuccess(`Scheduled ${data.scheduled} post${data.scheduled === 1 ? "" : "s"}.`);
      setSelectedIds(new Set());
      await refreshDrafts();
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === drafts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(drafts.map((d) => d.id)));
    }
  }

  function selectByStatus(status: string) {
    const ids = drafts.filter((d) => d.status === status).map((d) => d.id);
    // If all posts of that status are already selected, deselect them
    const allAlreadySelected = ids.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allAlreadySelected) {
        ids.forEach((id) => next.delete(id));
      } else {
        ids.forEach((id) => next.add(id));
      }
      return next;
    });
  }

  const schedulableDrafts = drafts.filter((d) => d.status === "draft");

  return (
    <div className="space-y-6">
      {/* ── RESUME BANNER (shown when a run crashed mid-way) ── */}
      {activeRun && !generating && activeRun.processed < activeRun.target && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-amber-900">Generation interrupted</p>
            <p className="text-sm text-amber-700">
              Run for &ldquo;{activeRun.keyword}&rdquo; stopped at {activeRun.processed}/{activeRun.target} posts.
              The background cron will slowly resume it, or click Resume to continue now.
            </p>
          </div>
          <button
            onClick={handleResume}
            className="shrink-0 rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
          >
            Resume now
          </button>
        </div>
      )}

      {/* ── KEYWORD GENERATOR ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-navy-950">Keyword Draft Generator</h3>
          <p className="mt-1 text-sm text-slate-500">
            Enter a keyword to generate SEO blog drafts. No Google connection needed.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto_auto]">
            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-600">Keyword *</span>
              <input
                type="text"
                required
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. office cleaning contracts"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 placeholder:text-slate-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-600">Quantity</span>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                {[1, 5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>{n} post{n > 1 ? "s" : ""}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="block text-xs font-semibold text-slate-600">Mode</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "standard" | "cluster")}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="standard">Standard</option>
                <option value="cluster">Topic Cluster</option>
              </select>
            </label>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={generating || !keyword.trim()}
                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {generating ? "Generating…" : "Generate Drafts"}
              </button>
              {generating && (
                <button
                  type="button"
                  onClick={handleStop}
                  className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Stop
                </button>
              )}
            </div>
          </div>

          {/* Optional brief */}
          <details className="group">
            <summary className="cursor-pointer text-xs font-semibold text-teal-600 hover:text-teal-700 select-none">
              + Content brief (optional)
            </summary>
            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-600">Location</span>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="">All service areas</option>
                  <option value="Launceston TAS">Launceston TAS</option>
                  <option value="Perth WA">Perth WA</option>
                  <option value="Melbourne VIC">Melbourne VIC</option>
                  <option value="Sydney NSW">Sydney NSW</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-600">Audience</span>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="">General</option>
                  <option value="facility managers">Facility managers</option>
                  <option value="real estate agents">Real estate agents</option>
                  <option value="NDIS participants and coordinators">NDIS participants</option>
                  <option value="Airbnb hosts and short-stay landlords">Airbnb hosts</option>
                  <option value="small business owners">Small business owners</option>
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-600">Offer angle</span>
                <select
                  value={offerAngle}
                  onChange={(e) => setOfferAngle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  <option value="">Reliability + quality</option>
                  <option value="reliability and consistency">Reliability</option>
                  <option value="quality assurance and satisfaction guarantee">Quality assurance</option>
                  <option value="after-hours and flexible scheduling">After-hours availability</option>
                  <option value="compliance and police-checked staff">Compliance + police checks</option>
                  <option value="competitive pricing and no lock-in contracts">Pricing + no lock-in</option>
                </select>
              </label>
            </div>
          </details>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requireApproval}
              onChange={(e) => setRequireApproval(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-slate-600">Require approval before scheduling</span>
          </label>

          {mode === "cluster" && (
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
              Topic Cluster mode generates 1 pillar post + {qty - 1} supporting posts, all internally linked.
            </p>
          )}

          {/* Progress bar */}
          {generating && progress && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Generating drafts…</span>
                <span>{progress.processed} / {progress.target}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-teal-500 transition-all duration-500"
                  style={{ width: `${Math.round((progress.processed / progress.target) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {generating && !progress && (
            <p className="text-xs text-slate-500 animate-pulse">Starting generation…</p>
          )}

          {generateError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {generateError}
            </p>
          )}
          {generateSuccess && (
            <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-700 font-semibold">
              {generateSuccess}
            </p>
          )}
        </form>
      </div>

      {bulkPublishProgress && (
        <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-teal-900">
            <span className="font-semibold">Publishing posts…</span>
            <span>{bulkPublishProgress.current} / {bulkPublishProgress.total}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-teal-100">
            <div
              className="h-2 rounded-full bg-teal-500 transition-all duration-500"
              style={{ width: `${Math.round((bulkPublishProgress.current / bulkPublishProgress.total) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {regenProgress && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-blue-900">
            <span className="font-semibold">Regenerating hero images…</span>
            <span>{regenProgress.current} / {regenProgress.total}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-blue-100">
            <div
              className="h-2 rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${Math.round((regenProgress.current / regenProgress.total) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-blue-700 truncate">Processing: {regenProgress.label}</p>
        </div>
      )}

      {publishError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-4">
          <span>{publishError}</span>
          <button onClick={() => setPublishError("")} className="shrink-0 text-red-400 hover:text-red-600 font-bold">✕</button>
        </div>
      )}

      {/* ── DRAFTS TABLE ── */}
      {drafts.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setDraftsOpen((o) => !o)}
              className="flex items-center gap-2 text-sm font-semibold text-navy-950 hover:text-teal-700 transition-colors"
              aria-expanded={draftsOpen}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${draftsOpen ? "rotate-90" : "rotate-0"}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Generated Drafts ({drafts.length})
            </button>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && (
                <>
                  <button
                    onClick={handleBulkApprove}
                    className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700"
                  >
                    Approve {selectedIds.size} selected
                  </button>
                  <button
                    onClick={handleBulkPublish}
                    className="rounded-lg bg-navy-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800"
                  >
                    Publish {selectedIds.size} selected
                  </button>
                  <button
                    onClick={() => handleAddBodyImages(Array.from(selectedIds))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Add body images ({selectedIds.size})
                  </button>
                  <button
                    onClick={() => handleRegenerateHeroImages(Array.from(selectedIds))}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Regen hero images ({selectedIds.size})
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete {selectedIds.size} selected
                  </button>
                </>
              )}
              {drafts.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => selectByStatus("draft")}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700"
                    title="Select / deselect all drafts"
                  >
                    {drafts.filter((d) => d.status === "draft").every((d) => selectedIds.has(d.id)) && drafts.some((d) => d.status === "draft")
                      ? "Deselect drafts"
                      : "Select drafts"}
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={() => selectByStatus("published")}
                    className="text-xs font-semibold text-green-600 hover:text-green-700"
                    title="Select / deselect all published posts"
                  >
                    {drafts.filter((d) => d.status === "published").every((d) => selectedIds.has(d.id)) && drafts.some((d) => d.status === "published")
                      ? "Deselect published"
                      : "Select published"}
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={toggleSelectAll}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700"
                  >
                    {selectedIds.size === drafts.length ? "Deselect all" : "Select all"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {draftsOpen && <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500">
                <tr>
                  <th className="px-4 py-2 w-8">
                    <input
                      type="checkbox"
                      checked={drafts.length > 0 && selectedIds.size === drafts.length}
                      ref={(el) => { if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < drafts.length; }}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      title="Select all"
                    />
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">Hero</th>
                  {(["title", "status", "keyword", "created", "scheduled", "approved"] as const).map((col) => (
                    <th key={col} className="px-4 py-2 cursor-pointer select-none hover:text-slate-700 whitespace-nowrap" onClick={() => handleSort(col)}>
                      {col.charAt(0).toUpperCase() + col.slice(1)}
                      {sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDrafts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(post.id)}
                        onChange={() => toggleSelect(post.id)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      {post.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.image}
                          alt={post.image_alt || post.title}
                          className="w-14 h-10 object-cover rounded-md border border-slate-200 bg-slate-100"
                        />
                      ) : (
                        <div className="w-14 h-10 rounded-md border border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-300 text-xs">
                          —
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-start gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-navy-950 hover:text-teal-700 line-clamp-2 flex-1"
                        >
                          {post.title}
                        </Link>
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="shrink-0 text-xs text-slate-400 hover:text-teal-600 mt-0.5"
                        >
                          Edit
                        </Link>
                      </div>
                      {post.cluster_id && (
                        <span className="mt-0.5 block text-xs text-slate-400">
                          {post.generation_run_id === post.cluster_id ? "Pillar" : "Supporting"} · cluster
                        </span>
                      )}
                      {post.error && (
                        <p className="mt-1 text-xs text-red-600 line-clamp-2">{post.error}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <StatusBadge status={post.status} approved={post.approved} />
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {post.generation_keyword ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(post.created_at).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                      {post.scheduled_at
                        ? new Date(post.scheduled_at).toLocaleString("en-AU", { dateStyle: "short", timeStyle: "short" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleApprove(post.id, !post.approved)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          post.approved ? "bg-teal-500" : "bg-slate-200"
                        }`}
                        title={post.approved ? "Approved — click to revoke" : "Click to approve"}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            post.approved ? "translate-x-4.5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </td>
                    {post.status === "failed" && (
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleRetry(post.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Retry
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>}
        </div>
      )}

      {/* ── COMPLIANCE AUDIT ── */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-sm font-semibold text-navy-950">Content Compliance Audit</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Check every post against quality standards — length, internal links, quote CTA, GBP link, and images.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={forceRegenImages}
                onChange={(e) => setForceRegenImages(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <span className="text-xs font-semibold text-slate-600">Regenerate body images (DALL-E)</span>
            </label>
            {complianceResults && !fixProgress && (
              <button
                onClick={handleFixAll}
                disabled={!!fixingId}
                className="rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {forceRegenImages ? `Fix + regen images (${complianceResults.filter((r) => r.status !== "failed").length})` : `Fix all failing (${complianceResults.filter((r) => !r.passes_all && r.status !== "failed").length})`}
              </button>
            )}
            <button
              onClick={handleAudit}
              disabled={auditLoading}
              className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-50"
            >
              {auditLoading ? "Auditing…" : complianceResults ? "Re-audit" : "Audit all posts"}
            </button>
          </div>
        </div>

        {fixProgress && (
          <div className="px-5 py-3 border-b border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-teal-900">
              <span className="font-semibold">Fixing posts…</span>
              <span>{fixProgress.current} / {fixProgress.total}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-teal-500 transition-all duration-500"
                style={{ width: `${Math.round((fixProgress.current / fixProgress.total) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 truncate">Processing: {fixProgress.label}</p>
          </div>
        )}

        {complianceError && (
          <div className="px-5 py-3 border-b border-slate-100">
            <p className="text-sm text-red-600">{complianceError}</p>
          </div>
        )}

        {!complianceResults && !auditLoading && (
          <div className="px-5 py-8 text-center text-sm text-slate-400">
            Click &ldquo;Audit all posts&rdquo; to check compliance across every post.
          </div>
        )}

        {auditLoading && (
          <div className="px-5 py-8 text-center text-sm text-slate-400 animate-pulse">
            Scanning posts…
          </div>
        )}

        {complianceResults && !auditLoading && (() => {
          const failing = complianceResults.filter((r) => !r.passes_all).length;
          const passing = complianceResults.length - failing;
          return (
            <>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-6 text-xs">
                <span className="font-semibold text-slate-700">{complianceResults.length} posts audited</span>
                <span className="text-green-700 font-semibold">{passing} passing</span>
                <span className={failing > 0 ? "text-red-600 font-semibold" : "text-slate-400"}>{failing} failing</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-left font-semibold text-slate-500">
                    <tr>
                      <th className="px-4 py-2">Post</th>
                      <th className="px-4 py-2 whitespace-nowrap">Status</th>
                      <th className="px-4 py-2 whitespace-nowrap text-center">Length</th>
                      <th className="px-4 py-2 whitespace-nowrap text-center">Int. links</th>
                      <th className="px-4 py-2 whitespace-nowrap text-center">Quote CTA</th>
                      <th className="px-4 py-2 whitespace-nowrap text-center">GBP link</th>
                      <th className="px-4 py-2 whitespace-nowrap text-center">Images</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complianceResults.map((r) => (
                      <tr key={r.id} className={r.passes_all ? "hover:bg-slate-50/50" : "bg-red-50/40 hover:bg-red-50/70"}>
                        <td className="px-4 py-2.5 max-w-xs">
                          <Link href={`/admin/blog/${r.id}`} className="font-medium text-navy-950 hover:text-teal-700 line-clamp-2">
                            {r.title}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                            r.status === "published" ? "bg-green-50 text-green-700 border border-green-200" :
                            r.status === "scheduled" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                            "bg-slate-100 text-slate-600"
                          }`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${r.passes_length ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {r.passes_length ? "✓" : `${r.char_count.toLocaleString()}ch`}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${r.passes_internal_links ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {r.passes_internal_links ? "✓" : `${r.internal_link_count}/2`}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${r.has_quote_link ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {r.has_quote_link ? "✓" : "✗"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${r.has_gbp_link ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {r.has_gbp_link ? "✓" : "✗"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 font-semibold ${r.has_body_images ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {r.has_body_images ? "✓" : "✗"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {(!r.passes_all || forceRegenImages) && (
                            <button
                              onClick={() => handleFixPost(r.id, forceRegenImages)}
                              disabled={fixingId === r.id || !!fixProgress}
                              className="rounded-lg bg-teal-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
                            >
                              {fixingId === r.id ? "Fixing…" : forceRegenImages && r.passes_all ? "Regen images" : "Fix"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          );
        })()}
      </div>

      {/* ── SCHEDULE PANEL ── */}
      {selectedIds.size > 0 && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-navy-950">
            Schedule {selectedIds.size} selected post{selectedIds.size > 1 ? "s" : ""}
          </h3>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-600">Start time (AEST)</span>
                <input
                  type="datetime-local"
                  value={startTime}
                  min={(() => {
                    const lastScheduled = drafts.map((d) => d.scheduled_at).filter(Boolean).sort().at(-1);
                    return lastScheduled ? new Date(lastScheduled).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16);
                  })()}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <span className="block text-xs text-slate-400">Auto-set after last scheduled post</span>
              </label>

              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-600">Interval between posts</span>
                <select
                  value={intervalHours}
                  onChange={(e) => setIntervalHours(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                >
                  {[1, 2, 3, 4, 6, 8, 12, 24, 48].map((h) => (
                    <option key={h} value={h}>Every {h} hour{h > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5">
                <span className="block text-xs font-semibold text-slate-600">Publish window</span>
                <div className="flex items-center gap-2">
                  <select
                    value={windowStart}
                    onChange={(e) => setWindowStart(Number(e.target.value))}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
                    ))}
                  </select>
                  <span className="text-xs text-slate-400">to</span>
                  <select
                    value={windowEnd}
                    onChange={(e) => setWindowEnd(Number(e.target.value))}
                    className="flex-1 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-navy-950 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((i) => (
                      <option key={i} value={i}>{String(i).padStart(2, "0")}:00</option>
                    ))}
                  </select>
                </div>
              </label>

              <div className="flex items-end">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={skipWeekends}
                    onChange={(e) => setSkipWeekends(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-600">Skip weekends</span>
                </label>
              </div>
            </div>

            {scheduleError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {scheduleError}
              </p>
            )}
            {scheduleSuccess && (
              <p className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
                {scheduleSuccess}
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="rounded-lg bg-navy-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
              >
                Schedule posts
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
