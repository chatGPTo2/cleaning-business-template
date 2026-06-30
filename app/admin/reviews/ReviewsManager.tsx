"use client";

import { useState } from "react";
import type { Review } from "@/lib/reviews";

const SERVICE_COLOURS: Record<string, string> = {
  "Home Cleaning":   "bg-teal-100 text-teal-700",
  "End of Lease":    "bg-blue-100 text-blue-700",
  "Deep Clean":      "bg-orange-100 text-orange-700",
  "Office Cleaning": "bg-purple-100 text-purple-700",
  "NDIS":            "bg-green-100 text-green-700",
  "Commercial":      "bg-slate-100 text-slate-700",
};

const EMPTY_FORM = {
  author_name: "",
  author_initial: "",
  rating: 5,
  review_body: "",
  service_type: "",
  date_published: new Date().toISOString().split("T")[0],
  source: "google",
  place_review_id: "",
  is_featured: false,
  is_visible: true,
};

export default function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const aggregate = reviews.filter(r => r.is_visible);
  const avgRating = aggregate.length
    ? (aggregate.reduce((s, r) => s + r.rating, 0) / aggregate.length).toFixed(1)
    : "0.0";

  function startEdit(review: Review) {
    setEditingId(review.id);
    setForm({
      author_name: review.author_name,
      author_initial: review.author_initial,
      rating: review.rating,
      review_body: review.review_body,
      service_type: review.service_type ?? "",
      date_published: review.date_published,
      source: review.source,
      place_review_id: review.place_review_id ?? "",
      is_featured: review.is_featured,
      is_visible: review.is_visible,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setError(null);
  }

  async function handleSave() {
    if (!form.author_name || !form.review_body || !form.date_published) {
      setError("Author name, review text and date are required.");
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      ...form,
      place_review_id: form.place_review_id || null,
      service_type: form.service_type || null,
    };

    const url = editingId ? `/api/admin/reviews/${editingId}` : "/api/admin/reviews";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(json.error ?? "Failed to save review.");
      setSaving(false);
      return;
    }

    // Refresh list
    const listRes = await fetch("/api/admin/reviews");
    const listJson = await listRes.json().catch(() => ({ reviews: [] }));
    setReviews(listJson.reviews ?? []);
    setSuccess(editingId ? "Review updated." : "Review added.");
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setSaving(false);
  }

  async function toggleVisible(review: Review) {
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_visible: !review.is_visible }),
    });
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_visible: !r.is_visible } : r));
  }

  async function toggleFeatured(review: Review) {
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !review.is_featured }),
    });
    setReviews((prev) => prev.map((r) => r.id === review.id ? { ...r, is_featured: !r.is_featured } : r));
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-6">

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total reviews", value: reviews.length },
          { label: "Visible on site", value: aggregate.length },
          { label: "Average rating", value: `${avgRating} ★` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-slate-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy-950">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <h3 className="text-sm font-semibold text-navy-950 mb-4">
          {editingId ? "Edit review" : "Add review"}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Author name *</label>
            <input
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
              placeholder="Nethmi Y."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Initial (avatar letter)</label>
            <input
              value={form.author_initial}
              onChange={(e) => setForm((f) => ({ ...f, author_initial: e.target.value.slice(0, 1).toUpperCase() }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
              placeholder="N"
              maxLength={1}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Rating *</label>
            <select
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} star{r !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Service type</label>
            <select
              value={form.service_type}
              onChange={(e) => setForm((f) => ({ ...f, service_type: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
            >
              <option value="">— Select —</option>
              {Object.keys(SERVICE_COLOURS).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Date published *</label>
            <input
              type="date"
              value={form.date_published}
              onChange={(e) => setForm((f) => ({ ...f, date_published: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Source</label>
            <select
              value={form.source}
              onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
            >
              <option value="google">Google</option>
              <option value="manual">Manual</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-600 mb-1">Review text *</label>
            <textarea
              value={form.review_body}
              onChange={(e) => setForm((f) => ({ ...f, review_body: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-400 focus:outline-none"
              placeholder="Paste the customer's review here…"
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm text-slate-600">Visible on site</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500" />
              <span className="text-sm text-slate-600">Featured (hero review)</span>
            </label>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>}
        {success && <p className="mt-3 text-sm text-green-600 font-medium">{success}</p>}

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : editingId ? "Update review" : "Add review"}
          </button>
          {editingId && (
            <button onClick={cancelEdit} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Reviews list */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-navy-950">All reviews ({reviews.length})</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {reviews.map((review) => (
            <div key={review.id} className={`px-5 py-4 ${!review.is_visible ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-semibold text-sm text-navy-950">{review.author_name}</span>
                    <span className="text-yellow-500 text-xs">{"★".repeat(review.rating)}</span>
                    {review.service_type && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${SERVICE_COLOURS[review.service_type] ?? "bg-slate-100 text-slate-600"}`}>
                        {review.service_type}
                      </span>
                    )}
                    {review.is_featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium">Featured</span>
                    )}
                    <span className="text-xs text-slate-400">{review.date_published} · {review.source}</span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{review.review_body}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleFeatured(review)}
                    className={`text-xs font-semibold ${review.is_featured ? "text-orange-600 hover:text-orange-700" : "text-slate-400 hover:text-orange-600"}`}
                    title={review.is_featured ? "Remove featured" : "Set as featured"}
                  >
                    {review.is_featured ? "★" : "☆"}
                  </button>
                  <button
                    onClick={() => toggleVisible(review)}
                    className={`text-xs font-semibold ${review.is_visible ? "text-teal-600 hover:text-teal-700" : "text-slate-400 hover:text-teal-600"}`}
                  >
                    {review.is_visible ? "Visible" : "Hidden"}
                  </button>
                  <button onClick={() => startEdit(review)} className="text-xs font-semibold text-slate-500 hover:text-navy-950">Edit</button>
                  <button onClick={() => handleDelete(review.id)} className="text-xs font-semibold text-slate-400 hover:text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {reviews.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No reviews yet. Add your first review above.</p>
          )}
        </div>
      </div>
    </div>
  );
}
