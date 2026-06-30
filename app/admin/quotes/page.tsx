import Link from "next/link";
import AdminShell from "../AdminShell";
import { DateText, EmptyState, Money, StatusPill } from "../ui";
import { requireAdmin } from "@/lib/admin-auth";
import { labelise, QUOTE_STATUSES, shortReference } from "@/lib/crm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const VALID_SORTS: Record<string, string> = {
  created_at: "created_at",
  service_type: "service_type",
  location: "location",
  status: "status",
  estimated_price: "estimated_price",
  preferred_date: "preferred_date",
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

export default async function QuotesPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; status?: string; service?: string; location?: string; sort?: string; dir?: string }>;
}) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  if (!supabaseAdmin) return <AdminShell><EmptyState label="Supabase is not configured." /></AdminShell>;

  const searchTerm = (resolvedSearchParams?.q ?? "").trim().toLowerCase();
  const sortCol = VALID_SORTS[resolvedSearchParams?.sort ?? ""] ?? "created_at";
  const ascending = resolvedSearchParams?.dir === "asc";

  let query = supabaseAdmin
    .from("quotes")
    .select("*,customers(first_name,last_name,email,phone)")
    .order(sortCol, { ascending, nullsFirst: false })
    .limit(200);

  if (resolvedSearchParams?.status) query = query.eq("status", resolvedSearchParams.status);
  if (resolvedSearchParams?.service) query = query.eq("service_type", resolvedSearchParams.service);
  if (resolvedSearchParams?.location) query = query.eq("location", resolvedSearchParams.location);

  const { data: quotes } = await query;

  const filteredQuotes = searchTerm
    ? (quotes ?? []).filter((quote) => {
        const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers;
        return [quote.id, quote.service_type, quote.location, quote.status, customer?.first_name, customer?.last_name, customer?.email, customer?.phone, [customer?.first_name, customer?.last_name].filter(Boolean).join(" ")]
          .filter(Boolean).join(" ").toLowerCase().includes(searchTerm);
      })
    : quotes ?? [];

  const sort = sortCol;
  const dir = ascending ? "asc" : "desc";
  const fp: Record<string, string> = {};
  if (resolvedSearchParams?.status) fp.status = resolvedSearchParams.status;
  if (resolvedSearchParams?.service) fp.service = resolvedSearchParams.service;
  if (resolvedSearchParams?.location) fp.location = resolvedSearchParams.location;
  if (resolvedSearchParams?.q) fp.q = resolvedSearchParams.q;
  const th = (col: string, label: string) => <SortTh col={col} label={label} sort={sort} dir={dir} params={fp} />;

  return (
    <AdminShell>
      <form className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[minmax(220px,1.3fr)_1fr_1fr_1fr_auto]">
        <input name="q" defaultValue={resolvedSearchParams?.q ?? ""} className="form-input rounded-md" placeholder="Search name, email, phone, or quote ID" type="search" />
        <select name="status" defaultValue={resolvedSearchParams?.status ?? ""} className="form-input rounded-md">
          <option value="">All statuses</option>
          {QUOTE_STATUSES.map((s) => <option key={s} value={s}>{labelise(s)}</option>)}
        </select>
        <select name="service" defaultValue={resolvedSearchParams?.service ?? ""} className="form-input rounded-md">
          <option value="">All services</option>
          {["home", "end-of-lease", "commercial", "deep-clean", "ndis"].map((s) => <option key={s} value={s}>{labelise(s)}</option>)}
        </select>
        <select name="location" defaultValue={resolvedSearchParams?.location ?? ""} className="form-input rounded-md">
          <option value="">All locations</option>
          {["perth", "sydney", "melbourne", "launceston"].map((l) => <option key={l} value={l}>{labelise(l)}</option>)}
        </select>
        <button className="btn-primary rounded-md px-5">Filter</button>
      </form>

      {!filteredQuotes.length ? <EmptyState label="No quote leads matched those filters." /> : (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                {th("created_at", "Received")}
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">ID</th>
                {th("service_type", "Service")}
                {th("location", "Location")}
                {th("preferred_date", "Requested date")}
                {th("estimated_price", "Price")}
                {th("status", "Status")}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuotes.map((quote) => {
                const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers;
                return (
                  <tr key={quote.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-xs text-slate-500"><DateText value={quote.created_at} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/quotes/${quote.id}`} className="font-semibold text-navy-950 hover:text-teal-700">
                        {[customer?.first_name, customer?.last_name].filter(Boolean).join(" ") || customer?.email || "Unknown"}
                      </Link>
                      <div className="text-xs text-slate-400">{customer?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{shortReference("Q", quote.id)}</td>
                    <td className="px-4 py-3 text-slate-600">{labelise(quote.service_type)}</td>
                    <td className="px-4 py-3 text-slate-600">{labelise(quote.location)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {quote.preferred_date ? <DateText value={quote.preferred_date} /> : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-600"><Money value={quote.estimated_price} /></td>
                    <td className="px-4 py-3"><StatusPill value={quote.status} /></td>
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
