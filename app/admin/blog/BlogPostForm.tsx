"use client";

import { useRef } from "react";
import type { DbBlogPost } from "@/lib/blog";

const CATEGORIES = [
  "Tips", "Melbourne", "Perth", "Sydney", "Launceston",
  "Health & Hygiene", "Sustainability", "Productivity",
  "End of Lease", "Deep Clean", "NDIS", "Airbnb", "Commercial", "General",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface Props {
  post?: DbBlogPost;
  action: (formData: FormData) => Promise<void>;
  submitLabel: string;
}

export default function BlogPostForm({ post, action, submitLabel }: Props) {
  const slugRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!post && slugRef.current && !slugRef.current.dataset.manuallyEdited) {
      slugRef.current.value = slugify(e.target.value);
    }
  }

  function handleSlugChange() {
    if (slugRef.current) {
      slugRef.current.dataset.manuallyEdited = "true";
      slugRef.current.value = slugify(slugRef.current.value);
    }
  }

  const fieldClass = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-navy-950 placeholder-slate-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 transition-colors";
  const labelClass = "block text-xs font-semibold text-slate-600 mb-1.5";

  return (
    <form action={action} className="space-y-6">
      {post && <input type="hidden" name="id" value={post.id} />}
      {post && <input type="hidden" name="previous_slug" value={post.slug} />}
      {post && <input type="hidden" name="was_published" value={post.status === "published" ? "true" : "false"} />}

      {/* Title + Slug */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-navy-950 text-sm border-b border-slate-100 pb-3">Post Details</h3>

        <div>
          <label className={labelClass} htmlFor="title">Title *</label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={post?.title}
            onChange={handleTitleChange}
            className={fieldClass}
            placeholder="e.g. How to Deep Clean a Bathroom in 30 Minutes"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="slug">URL Slug *</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">/blog/</span>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              ref={slugRef}
              defaultValue={post?.slug}
              onChange={handleSlugChange}
              className={`${fieldClass} font-mono`}
              placeholder="how-to-deep-clean-bathroom"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Auto-generated from title. Only lowercase letters, numbers and hyphens.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass} htmlFor="category">Category *</label>
            <select id="category" name="category" defaultValue={post?.category ?? "Tips"} className={fieldClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="read_time">Read Time</label>
            <input
              id="read_time"
              name="read_time"
              type="text"
              defaultValue={post?.read_time ?? "5 min read"}
              className={fieldClass}
              placeholder="5 min read"
            />
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="excerpt">Excerpt * <span className="font-normal text-slate-400">(shown on blog list — 1–2 sentences)</span></label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            defaultValue={post?.excerpt}
            className={fieldClass}
            placeholder="A short summary shown on the blog listing page..."
          />
        </div>
      </div>

      {/* Image */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-navy-950 text-sm border-b border-slate-100 pb-3">Hero Image</h3>
        <div>
          <label className={labelClass} htmlFor="image">Image URL *</label>
          <input
            id="image"
            name="image"
            type="url"
            required
            defaultValue={post?.image}
            className={fieldClass}
            placeholder="https://images.unsplash.com/photo-..."
          />
          <p className="text-xs text-slate-400 mt-1">Use Unsplash URLs (free). Append <code className="bg-slate-100 px-1 rounded">?w=1200&q=80</code> for performance.</p>
        </div>
        <div>
          <label className={labelClass} htmlFor="image_alt">Image Alt Text *</label>
          <input
            id="image_alt"
            name="image_alt"
            type="text"
            required
            defaultValue={post?.image_alt}
            className={fieldClass}
            placeholder="Descriptive alt text for the image"
          />
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <h3 className="font-semibold text-navy-950 text-sm">Article Content (HTML) *</h3>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-md px-2 py-1">
            Paste from WPAutoBlog
          </span>
        </div>
        <textarea
          id="content"
          name="content"
          required
          rows={20}
          defaultValue={post?.content}
          className={`${fieldClass} font-mono text-xs leading-relaxed`}
          placeholder={`<h2>Introduction</h2>\n<p>Your article content here...</p>\n\n<h2>Section 2</h2>\n<p>More content...</p>`}
        />
        <p className="text-xs text-slate-400">
          Paste HTML from WPAutoBlog, or write HTML directly. Use{" "}
          <code className="bg-slate-100 px-1 rounded">&lt;h2&gt;</code>,{" "}
          <code className="bg-slate-100 px-1 rounded">&lt;h3&gt;</code>,{" "}
          <code className="bg-slate-100 px-1 rounded">&lt;p&gt;</code>,{" "}
          <code className="bg-slate-100 px-1 rounded">&lt;ul&gt;</code>,{" "}
          <code className="bg-slate-100 px-1 rounded">&lt;li&gt;</code>,{" "}
          <code className="bg-slate-100 px-1 rounded">&lt;strong&gt;</code> tags.
        </p>
      </div>

      {/* SEO */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5 space-y-4">
        <h3 className="font-semibold text-navy-950 text-sm border-b border-slate-100 pb-3">SEO Meta <span className="font-normal text-slate-400">(optional — defaults to title/excerpt)</span></h3>
        <div>
          <label className={labelClass} htmlFor="meta_title">Meta Title</label>
          <input
            id="meta_title"
            name="meta_title"
            type="text"
            defaultValue={post?.meta_title ?? ""}
            className={fieldClass}
            placeholder="Leave blank to use title"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="meta_description">Meta Description</label>
          <textarea
            id="meta_description"
            name="meta_description"
            rows={2}
            defaultValue={post?.meta_description ?? ""}
            className={fieldClass}
            placeholder="Leave blank to use excerpt. Aim for 120–160 characters."
          />
        </div>
      </div>

      {/* Publish */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
        <h3 className="font-semibold text-navy-950 text-sm border-b border-slate-100 pb-3 mb-4">Publish</h3>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="draft"
              defaultChecked={!post || post.status === "draft"}
              className="accent-teal-600"
            />
            <span className="text-sm font-medium text-navy-950">Save as Draft</span>
            <span className="text-xs text-slate-400">(not visible on site)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="status"
              value="published"
              defaultChecked={post?.status === "published"}
              className="accent-teal-600"
            />
            <span className="text-sm font-medium text-navy-950">Publish</span>
            <span className="text-xs text-slate-400">(live on site within ~60 seconds)</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          {submitLabel}
        </button>
        <a href="/admin/blog" className="text-sm text-slate-500 hover:text-navy-950 transition-colors">
          Cancel
        </a>
      </div>
    </form>
  );
}
