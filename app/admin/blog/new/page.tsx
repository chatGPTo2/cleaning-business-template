import { requireAdmin } from "@/lib/admin-auth";
import { createBlogPost } from "../../actions";
import AdminShell from "../../AdminShell";
import BlogPostForm from "../BlogPostForm";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <AdminShell section="blog">
      <div className="max-w-3xl">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-navy-950">New Blog Post</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Paste your WPAutoBlog HTML or write a new article.
          </p>
        </div>
        <BlogPostForm action={createBlogPost} submitLabel="Create Post" />
      </div>
    </AdminShell>
  );
}
