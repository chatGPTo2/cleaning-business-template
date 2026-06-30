import { notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getDbPostById } from "@/lib/blog";
import { updateBlogPost, deleteBlogPost } from "../../actions";
import AdminShell from "../../AdminShell";
import BlogPostForm from "../BlogPostForm";
import DeletePostButton from "../DeletePostButton";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getDbPostById(id);
  if (!post) notFound();

  return (
    <AdminShell section="blog">
      <div className="max-w-3xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-navy-950">Edit Post</h2>
            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{post.title}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {post.status === "published" && (
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-colors flex items-center gap-1.5"
              >
                View live ↗
              </a>
            )}
            <form action={deleteBlogPost}>
              <input type="hidden" name="id" value={post.id} />
              <input type="hidden" name="slug" value={post.slug} />
              <DeletePostButton />
            </form>
          </div>
        </div>

        {/* Status badge */}
        <div className="mb-6 flex items-center gap-3">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
            post.status === "published"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {post.status === "published" ? "Published" : "Draft"}
          </span>
          <span className="text-xs text-slate-400 font-mono">/blog/{post.slug}</span>
        </div>

        <BlogPostForm post={post} action={updateBlogPost} submitLabel="Save Changes" />
      </div>
    </AdminShell>
  );
}
