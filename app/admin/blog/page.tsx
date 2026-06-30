import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getAllDbPosts } from "@/lib/blog";
import { allPosts } from "@/lib/blog";
import { formatDate } from "@/lib/blog";
import AdminShell from "../AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();
  const dbPosts = await getAllDbPosts();

  return (
    <AdminShell section="blog">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-950">Blog Posts</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {dbPosts.length} database post{dbPosts.length !== 1 ? "s" : ""} · {allPosts.length} static posts
            </p>
          </div>
          <Link
            href="/admin/blog/new"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Post
          </Link>
        </div>

        {/* DB Posts */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <h3 className="font-semibold text-navy-950 text-sm">Database Posts</h3>
            <span className="rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-xs font-semibold text-teal-700">
              Editable via admin
            </span>
          </div>

          {dbPosts.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-slate-400 text-sm mb-1">No posts yet</p>
              <p className="text-slate-300 text-xs mb-4">Paste WPAutoBlog articles or write new posts here.</p>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dbPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-navy-950 line-clamp-1">{post.title}</p>
                      <p className="text-slate-400 text-xs mt-0.5 font-mono">/blog/{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-600 text-xs">{post.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-slate-400 text-xs">
                        {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {post.status === "published" && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-400 hover:text-teal-600 transition-colors"
                          >
                            View ↗
                          </a>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-teal-400 hover:bg-white hover:text-teal-700 transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Static Posts */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
            <h3 className="font-semibold text-navy-950 text-sm">Static Posts</h3>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-500">
              Hardcoded in codebase
            </span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allPosts.map((post) => (
                <tr key={post.slug} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-navy-950 line-clamp-1">{post.title}</p>
                    <p className="text-slate-400 text-xs mt-0.5 font-mono">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-slate-600 text-xs">{post.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-slate-400 text-xs">{formatDate(post.date)}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-teal-600 transition-colors"
                    >
                      View ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
