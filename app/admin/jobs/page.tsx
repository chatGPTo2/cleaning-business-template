import Link from "next/link";
import AdminShell from "../AdminShell";
import { DateText, EmptyState, Money, StatusPill } from "../ui";
import { requireAdmin } from "@/lib/admin-auth";
import { JOB_STATUSES, labelise, shortReference } from "@/lib/crm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_SORTS: Record<string, string> = {
  created_at: "created_at",
  scheduled_date: "scheduled_date",
  payment_created_at: "payment_created_at",
  service_type: "service_type",
  status: "status",
  price: "price",
};

function SortTh({
  col, label, sort, dir, params,
}: {
  col: string; label: string; sort: string; dir: string; params: Record<string, string>;
}) {
  const active = sort === col;
  const nextDir = active && dir === "desc" ? "asc" : "desc";
  const href = "?" + new URLSearchParams({ ...params, sort: col, dir: nextDir });
  return (
    <th className="px-4 py-3">
      <Link href={href} className={`inline-flex items-center gap-1 transition-colors hover:text-slate-700 ${active ? "text-slate-700" : ""}`}>
        {label}
        <span className="text-[10px] text-slate-400">
          {active ? (dir === "asc" ? "▲" : "▼") : "▲▼"}
        </span>
      </Link>
    </th>
  );
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; service?: string; sort?: string; dir?: string }>;
}) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  if (!supabaseAdmin) return <AdminShell><EmptyState label="Supabase is not configured." /></AdminShell>;

  const sortCol = VALID_SORTS[resolvedSearchParams?.sort ?? ""] ?? "created_at";
  const ascending = resolvedSearchParams?.dir === "asc";

  let query = supabaseAdmin
    .from("jobs")
    .select("*,customers(first_name,last_name,email,phone)")
    .order(sortCol, { ascending, nullsFirst: false })
    .limit(200);

  if (resolvedSearchParams?.status) query = query.eq("status", resolvedSearchParams.status);
  if (resolvedSearchParams?.service) query = query.eq("service_type", resolvedSearchParams.service);

  const { data: jobs } = await query;

  const sort = sortCol;
  const dir = ascending ? "asc" : "desc";
  const fp: Record<string, string> = {};
  if (resolvedSearchParams?.status) fp.status = resolvedSearchParams.status;
  if (resolvedSearchParams?.service) fp.service = resolvedSearchParams.service;
  const th = (col: string, label: string) => <SortTh col={col} label={label} sort={sort} dir={dir} params={fp} />;

  return (
    <AdminShell>
      <form className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-3">
        <select name="status" defaultValue={resolvedSearchParams?.status ?? ""} className="form-input rounded-md">
          <option value="">All statuses</option>
          {JOB_STATUSES.map((s) => <option key={s} value={s}>{labelise(s)}</option>)}
        </select>
        <select name="service" defaultValue={resolvedSearchParams?.service ?? ""} className="form-input rounded-md">
          <option value="">All services</option>
          {["home", "end-of-lease", "commercial", "deep-clean", "ndis"].map((s) => <option key={s} value={s}>{labelise(s)}</option>)}
        </select>
        <button className="btn-primary rounded-md px-5">Filter</button>
      </form>

      {!jobs?.length ? <EmptyState label="No jobs created yet." /> : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                {th("created_at", "Date")}
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">ID</th>
                {th("service_type", "Service")}
                {th("scheduled_date", "Service date")}
                {th("payment_created_at", "Invoiced")}
                {th("status", "Status")}
                {th("price", "Amount")}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => {
                const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers;
                return (
                  <tr key={job.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500"><DateText value={job.created_at} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/jobs/${job.id}`} className="font-semibold text-navy-950 hover:text-teal-700">
                        {[customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || customer?.email || "Unknown"}
                      </Link>
                      <div className="text-xs text-slate-400">{customer?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{shortReference("J", job.id)}</td>
                    <td className="px-4 py-3 text-slate-600">{labelise(job.service_type)}</td>
                    <td className="px-4 py-3 text-slate-600"><DateText value={job.scheduled_date} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {job.payment_created_at ? <DateText value={job.payment_created_at} /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3"><StatusPill value={job.status} /></td>
                    <td className="px-4 py-3 text-slate-600"><Money value={job.price} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
