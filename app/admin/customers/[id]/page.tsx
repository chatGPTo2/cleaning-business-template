import Link from "next/link";
import AdminShell from "../../AdminShell";
import { DateText, EmptyState, Money, StatusPill } from "../../ui";
import { addNote } from "../../actions";
import { requireAdmin } from "@/lib/admin-auth";
import { labelise, NOTE_TYPES } from "@/lib/crm";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!supabaseAdmin) return <AdminShell><EmptyState label="Supabase is not configured." /></AdminShell>;

  const [{ data: customer }, { data: quotes }, { data: jobs }, { data: notes }] = await Promise.all([
    supabaseAdmin.from("customers").select("*").eq("id", id).single(),
    supabaseAdmin.from("quotes").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
    supabaseAdmin.from("jobs").select("*").eq("customer_id", id).order("scheduled_date", { ascending: false, nullsFirst: false }),
    supabaseAdmin.from("notes").select("*").eq("customer_id", id).order("created_at", { ascending: false }),
  ]);

  if (!customer) return <AdminShell><EmptyState label="Customer not found." /></AdminShell>;

  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-2xl font-bold text-navy-950">{customer.first_name} {customer.last_name}</h2>
            <dl className="mt-5 grid gap-4 md:grid-cols-3">
              <div><dt className="text-xs uppercase text-slate-500">Email</dt><dd className="font-semibold">{customer.email}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Phone</dt><dd className="font-semibold">{customer.phone || "Not set"}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Location</dt><dd className="font-semibold">{labelise(customer.city)}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Type</dt><dd className="font-semibold">{labelise(customer.customer_type)}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Source</dt><dd className="font-semibold">{labelise(customer.source)}</dd></div>
              <div><dt className="text-xs uppercase text-slate-500">Follow-up</dt><dd className="font-semibold"><DateText value={customer.next_follow_up_date} /></dd></div>
            </dl>
            <p className="mt-5 rounded-md bg-slate-50 p-3 text-sm text-slate-700">
              {[customer.street, customer.suburb, customer.state, customer.postcode].filter(Boolean).join(", ") || "No address stored."}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-950">Quotes</h3>
            <div className="mt-3 divide-y divide-slate-100">
              {quotes?.length ? quotes.map((quote) => (
                <Link key={quote.id} href={`/admin/quotes/${quote.id}`} className="flex items-center justify-between gap-4 py-3 text-sm hover:text-teal-700">
                  <span>{labelise(quote.service_type)} in {labelise(quote.location)}</span>
                  <StatusPill value={quote.status} />
                </Link>
              )) : <p className="py-3 text-sm text-slate-500">No quotes yet.</p>}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-950">Jobs</h3>
            <div className="mt-3 divide-y divide-slate-100">
              {jobs?.length ? jobs.map((job) => (
                <Link key={job.id} href={`/admin/jobs/${job.id}`} className="grid gap-2 py-3 text-sm hover:text-teal-700 md:grid-cols-[1fr_auto_auto]">
                  <span>{labelise(job.service_type)}</span>
                  <span><DateText value={job.scheduled_date} /></span>
                  <span><Money value={job.price} /></span>
                </Link>
              )) : <p className="py-3 text-sm text-slate-500">No jobs yet.</p>}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-950">Notes</h3>
            <form action={addNote} className="mt-3 space-y-3">
              <input type="hidden" name="customer_id" value={customer.id} />
              <select name="note_type" className="form-input rounded-md">
                {NOTE_TYPES.map((type) => <option key={type} value={type}>{labelise(type)}</option>)}
              </select>
              <textarea name="content" className="form-input rounded-md" rows={3} placeholder="Add internal note" required />
              <button className="btn-primary w-full rounded-md">Add note</button>
            </form>
            <div className="mt-4 space-y-3">
              {(notes ?? []).map((note) => (
                <div key={note.id} className="rounded-md bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-700">{labelise(note.note_type)}</p>
                  <p className="mt-1 text-slate-600">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AdminShell>
  );
}
