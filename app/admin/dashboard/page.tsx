import Link from "next/link";
import AdminShell from "../AdminShell";
import { DateText, EmptyState, Stat, StatusPill } from "../ui";
import { requireAdmin } from "@/lib/admin-auth";
import { labelise } from "@/lib/crm";
import { supabaseAdmin } from "@/lib/supabase";
import { totalSuburbPages, totalServiceSuburbPages } from "@/lib/suburb-seo";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  await requireAdmin();

  if (!supabaseAdmin) {
    return (
      <AdminShell>
        <EmptyState label="Supabase is not configured. Add the Supabase environment variables and restart the app." />
      </AdminShell>
    );
  }

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [customers, quotes, jobs, recentQuotes] = await Promise.all([
    supabaseAdmin.from("customers").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("quotes").select("id,status,created_at", { count: "exact" }).gte("created_at", weekAgo.toISOString()),
    supabaseAdmin.from("jobs").select("id,status,payment_status", { count: "exact" }),
    supabaseAdmin
      .from("quotes")
      .select("id,service_type,location,status,created_at,customers(first_name,last_name,email)")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const quotesThisWeek = quotes.data ?? [];
  const allJobs = jobs.data ?? [];
  const followUps = quotesThisWeek.filter((quote) => ["new", "reviewing", "quote_sent", "follow_up"].includes(quote.status)).length;
  const unpaidJobs = allJobs.filter((job) => ["pending", "failed"].includes(job.payment_status ?? "") || job.status === "invoiced").length;
  const scheduledJobs = allJobs.filter((job) => job.status === "scheduled").length;

  return (
    <AdminShell>
      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Customers" value={customers.count ?? 0} href="/admin/customers" />
        <Stat label="New leads this week" value={quotesThisWeek.length} href="/admin/quotes" />
        <Stat label="Follow-up queue" value={followUps} href="/admin/quotes?status=follow_up" />
        <Stat label="Unpaid jobs" value={unpaidJobs} href="/admin/jobs?status=invoiced" />
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Stat label="Scheduled jobs" value={scheduledJobs} href="/admin/jobs?status=scheduled" />
        <Stat label="Jobs total" value={jobs.count ?? 0} href="/admin/jobs" />
        <Stat label="SEO pages live" value={totalSuburbPages() + totalServiceSuburbPages()} href="/admin/seo-pages" />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy-950">Recent quote leads</h2>
          <Link href="/admin/quotes" className="text-sm font-semibold text-teal-700">View all</Link>
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recentQuotes.data ?? []).map((quote) => {
                const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers;
                return (
                  <tr key={quote.id}>
                    <td className="px-4 py-3">
                      <Link href={`/admin/quotes/${quote.id}`} className="font-semibold text-navy-950 hover:text-teal-700">
                        {[customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || customer?.email || "Unknown customer"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{labelise(quote.service_type)}</td>
                    <td className="px-4 py-3 text-slate-600">{labelise(quote.location)}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs"><DateText value={quote.created_at} /></td>
                    <td className="px-4 py-3"><StatusPill value={quote.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
