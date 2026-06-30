import Link from "next/link";
import AdminShell from "../AdminShell";
import { EmptyState, StatusPill } from "../ui";
import { requireAdmin } from "@/lib/admin-auth";
import { labelise } from "@/lib/crm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function CustomersPage({ searchParams }: { searchParams?: Promise<{ q?: string; city?: string }> }) {
  await requireAdmin();
  const resolvedSearchParams = await searchParams;
  if (!supabaseAdmin) return <AdminShell><EmptyState label="Supabase is not configured." /></AdminShell>;

  let query = supabaseAdmin
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  if (resolvedSearchParams?.q) {
    query = query.or(`first_name.ilike.%${resolvedSearchParams.q}%,last_name.ilike.%${resolvedSearchParams.q}%,email.ilike.%${resolvedSearchParams.q}%,phone.ilike.%${resolvedSearchParams.q}%`);
  }
  if (resolvedSearchParams?.city) query = query.eq("city", resolvedSearchParams.city);

  const { data: customers } = await query;

  return (
    <AdminShell>
      <form className="mb-5 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_180px_auto]">
        <input name="q" defaultValue={resolvedSearchParams?.q ?? ""} className="form-input rounded-md" placeholder="Search name, email, or phone" />
        <select name="city" defaultValue={resolvedSearchParams?.city ?? ""} className="form-input rounded-md">
          <option value="">All locations</option>
          {["perth", "sydney", "melbourne", "launceston"].map((city) => <option key={city} value={city}>{labelise(city)}</option>)}
        </select>
        <button className="btn-primary rounded-md px-5">Search</button>
      </form>

      {!customers?.length ? <EmptyState label="No customers found yet." /> : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${customer.id}`} className="font-semibold text-navy-950 hover:text-teal-700">
                      {customer.first_name} {customer.last_name}
                    </Link>
                    <div className="text-xs text-slate-500">{customer.email}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{customer.phone || "Not set"}</td>
                  <td className="px-4 py-3 text-slate-600">{labelise(customer.city)}</td>
                  <td className="px-4 py-3 text-slate-600">{labelise(customer.customer_type)}</td>
                  <td className="px-4 py-3"><StatusPill value={customer.recurring_customer ? "recurring" : customer.repeat_customer ? "repeat" : "new"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
