import { redirect } from "next/navigation";
import { isAdminSession } from "@/lib/admin-auth";
import { loginAdmin } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  if (await isAdminSession()) redirect("/admin/hub");
  const resolvedSearchParams = await searchParams;

  const missingPassword = !process.env.ADMIN_DASHBOARD_PASSWORD;

  return (
    <section className="min-h-[70vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Taspro Internal</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy-950">CRM admin</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage quote leads, customers, jobs, and notes.</p>

        {missingPassword ? (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Add <code>ADMIN_DASHBOARD_PASSWORD</code> to your environment before using the dashboard.
          </div>
        ) : (
          <form action={loginAdmin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="password" className="form-label">Admin password</label>
              <input id="password" name="password" type="password" className="form-input" autoComplete="current-password" required />
            </div>
            {resolvedSearchParams?.error ? (
              <p className="text-sm font-medium text-red-600">That password did not match.</p>
            ) : null}
            <button type="submit" className="btn-primary w-full rounded-md">Sign in</button>
          </form>
        )}
      </div>
    </section>
  );
}
