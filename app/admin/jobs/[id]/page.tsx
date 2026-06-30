import Link from "next/link";
import AdminShell from "../../AdminShell";
import { DateText, EmptyState, Money, StatusPill } from "../../ui";
import { addNote, generateSquarePaymentLink, updateJobStatus } from "../../actions";
import CopyButton from "../../CopyButton";
import { requireAdmin } from "@/lib/admin-auth";
import { JOB_STATUSES, labelise, NOTE_TYPES, shortReference } from "@/lib/crm";
import { isSquareConfigured } from "@/lib/square";
import { supabaseAdmin } from "@/lib/supabase";
import JobFinalisationForm from "./JobFinalisationForm";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!supabaseAdmin) return <AdminShell><EmptyState label="Supabase is not configured." /></AdminShell>;

  const [{ data: job }, { data: notes }] = await Promise.all([
    supabaseAdmin.from("jobs").select("*,customers(*),quotes(id,status)").eq("id", id).single(),
    supabaseAdmin.from("notes").select("*").eq("job_id", id).order("created_at", { ascending: false }),
  ]);

  if (!job) return <AdminShell><EmptyState label="Job not found." /></AdminShell>;
  const customer = Array.isArray(job.customers) ? job.customers[0] : job.customers;
  const quote = Array.isArray(job.quotes) ? job.quotes[0] : job.quotes;
  const jobReference = shortReference("J", job.id);
  const squareConfigured = isSquareConfigured();
  const customerMessage = job.payment_link
    ? [
        `Hi ${customer?.first_name || "there"},`,
        "",
        `Your ${labelise(job.service_type).toLowerCase()} booking with TASPRO Cleaning Solutions has been reviewed and is ready to confirm.`,
        "",
        `Booking reference: ${jobReference}`,
        `Scheduled date: ${job.scheduled_date || "To be confirmed"}`,
        `Scheduled time: ${job.scheduled_time || "To be confirmed"}`,
        `Confirmed price: $${Number(job.payment_amount ?? job.price ?? 0).toFixed(2)}`,
        "",
        `Please complete payment using this secure Square payment link:`,
        job.payment_link,
        "",
        "Once payment is received, we will confirm the final booking details.",
        "",
        "Thank you,",
        "TASPRO Cleaning Solutions",
      ].join("\n")
    : "";

  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-navy-950">{labelise(job.service_type)} job</h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">Job {jobReference}</p>
              <p className="sr-only">Full job ID {job.id}</p>
            </div>
            <StatusPill value={job.status} />
          </div>
          <dl className="mt-5 grid gap-4 md:grid-cols-3">
            <div><dt className="text-xs uppercase text-slate-500">Scheduled date</dt><dd className="font-semibold"><DateText value={job.scheduled_date} /></dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Scheduled time</dt><dd className="font-semibold">{job.scheduled_time || "Not set"}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Price</dt><dd className="font-semibold"><Money value={job.price} /></dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Frequency</dt><dd className="font-semibold">{labelise(job.frequency)}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Cleaner</dt><dd className="font-semibold">{job.assigned_cleaner || "Not assigned"}</dd></div>
            <div><dt className="text-xs uppercase text-slate-500">Payment</dt><dd className="font-semibold">{labelise(job.payment_status)}</dd></div>
          </dl>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-navy-950">Internal notes</h3>
              <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{job.internal_notes || "None."}</p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-navy-950">Customer notes</h3>
              <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{job.customer_notes || "None."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-bold text-navy-950">Finalise booking</h3>
          <p className="mt-1 text-sm text-slate-500">Confirm scope, price, and payment requirements before sending a payment link.</p>
          <JobFinalisationForm job={job} />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-navy-950">Square payment link</h3>
              <p className="mt-1 text-sm text-slate-500">Generate a hosted Square checkout link. Card details are handled by Square.</p>
            </div>
            <StatusPill value={job.payment_status} />
          </div>
          {!squareConfigured ? (
            <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Add <code>SQUARE_ACCESS_TOKEN</code> and <code>SQUARE_LOCATION_ID</code> to enable payment link generation.
            </div>
          ) : (
            <form action={generateSquarePaymentLink} className="mt-4">
              <input type="hidden" name="id" value={job.id} />
              <button className="btn-primary rounded-md">{job.payment_link ? "Regenerate payment link" : "Generate Square payment link"}</button>
            </form>
          )}
          {job.payment_link ? (
            <div className="mt-4 space-y-3">
              <a href={job.payment_link} target="_blank" rel="noreferrer" className="block break-all rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">
                {job.payment_link}
              </a>
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold text-navy-950">Customer message</h4>
                  <CopyButton text={customerMessage} />
                </div>
                <textarea readOnly value={customerMessage} className="form-input min-h-56 rounded-md text-sm" />
              </div>
            </div>
          ) : null}
        </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-950">Customer</h3>
            <p className="mt-3 font-semibold">{customer?.first_name} {customer?.last_name}</p>
            <p className="text-sm text-slate-600">{customer?.email}</p>
            <p className="text-sm text-slate-600">{customer?.phone}</p>
            {customer?.id ? <Link href={`/admin/customers/${customer.id}`} className="mt-3 inline-block text-sm font-semibold text-teal-700">Open customer</Link> : null}
            {quote?.id ? <Link href={`/admin/quotes/${quote.id}`} className="ml-4 mt-3 inline-block text-sm font-semibold text-teal-700">Source quote</Link> : null}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-950">Status</h3>
            <form action={updateJobStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={job.id} />
              <select name="status" defaultValue={job.status} className="form-input rounded-md">
                {JOB_STATUSES.map((status) => <option key={status} value={status}>{labelise(status)}</option>)}
              </select>
              <button className="btn-primary rounded-md px-4">Save</button>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-bold text-navy-950">Notes</h3>
            <form action={addNote} className="mt-3 space-y-3">
              <input type="hidden" name="customer_id" value={job.customer_id} />
              <input type="hidden" name="job_id" value={job.id} />
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
