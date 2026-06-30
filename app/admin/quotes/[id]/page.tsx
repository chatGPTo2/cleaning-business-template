import Link from "next/link";
import AdminShell from "../../AdminShell";
import { DateText, EmptyState, Money, StatusPill, statusControlClass } from "../../ui";
import { addNote, convertQuoteToJob, updateQuoteStatus } from "../../actions";
import { requireAdmin } from "@/lib/admin-auth";
import { EXACT_TIME_OPTIONS, labelise, NOTE_TYPES, QUOTE_STATUSES, shortReference, TIME_SLOT_OPTIONS } from "@/lib/crm";
import { getAvailableFrequencies, getAvailableServices } from "@/lib/quote-config";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-navy-950">{children}</dd>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {children}
    </label>
  );
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  if (!supabaseAdmin) return <AdminShell><EmptyState label="Supabase is not configured." /></AdminShell>;

  const [{ data: quote }, { data: notes }] = await Promise.all([
    supabaseAdmin.from("quotes").select("*,customers(*)").eq("id", id).single(),
    supabaseAdmin.from("notes").select("*").order("created_at", { ascending: false }),
  ]);

  if (!quote) return <AdminShell><EmptyState label="Quote not found." /></AdminShell>;
  const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers;
  const quoteNotes = (notes ?? []).filter((note) => note.customer_id === quote.customer_id && !note.job_id);
  const quoteReference = shortReference("Q", quote.id);
  const serviceOptions = getAvailableServices(quote.location ?? "perth");
  const frequencyOptions = getAvailableFrequencies(quote.location ?? "perth");
  const hasCurrentService = serviceOptions.some((service) => service.id === quote.service_type);
  const hasCurrentFrequency = frequencyOptions.some((frequency) => frequency.id === quote.frequency);
  const hasCurrentTimeSlot = TIME_SLOT_OPTIONS.some((slot) => slot.id === quote.preferred_time);
  const preferredExactTimeLabel = EXACT_TIME_OPTIONS.find((time) => time.value === quote.preferred_exact_time)?.label;

  return (
    <AdminShell>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-teal-600">Quote detail</p>
                <h2 className="mt-1 text-2xl font-bold text-navy-950">{labelise(quote.service_type)} quote</h2>
                <p className="mt-1 text-sm font-semibold text-slate-600">Quote {quoteReference}</p>
                <p className="sr-only">Full quote ID {quote.id}</p>
              </div>
              <StatusPill value={quote.status} />
            </div>
            <dl className="mt-5 grid gap-3 md:grid-cols-3">
              <Field label="Location">{labelise(quote.location)}</Field>
              <Field label="Frequency">{labelise(quote.frequency)}</Field>
              <Field label="Estimate"><Money value={quote.estimated_price} /></Field>
              <Field label="Preferred date"><DateText value={quote.preferred_date} /></Field>
              <Field label="Preferred time">{preferredExactTimeLabel ?? labelise(quote.preferred_time)}</Field>
              <Field label="Property">{quote.hourly ? `${quote.hours ?? 3} hours` : `${quote.bedrooms ?? "-"} bed / ${quote.bathrooms ?? "-"} bath`}</Field>
            </dl>
            <div className="mt-5">
              <h3 className="text-sm font-bold text-navy-950">Special instructions</h3>
              <p className="mt-2 min-h-12 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{quote.special_instructions || "None provided."}</p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-navy-950">Convert quote to job</h3>
              <p className="text-sm text-slate-500">Review the final details before creating the job record.</p>
            </div>
            <form action={convertQuoteToJob} className="mt-4 grid gap-3 md:grid-cols-2">
              <input type="hidden" name="quote_id" value={quote.id} />
              <FormField label="Service type">
                <select name="service_type" defaultValue={quote.service_type} className="form-input rounded-md">
                  {!hasCurrentService && quote.service_type ? (
                    <option value={quote.service_type}>{labelise(quote.service_type)}</option>
                  ) : null}
                  {serviceOptions.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Frequency">
                <select name="frequency" defaultValue={quote.frequency ?? ""} className="form-input rounded-md">
                  {!hasCurrentFrequency && quote.frequency ? (
                    <option value={quote.frequency}>{labelise(quote.frequency)}</option>
                  ) : null}
                  {frequencyOptions.map((frequency) => (
                    <option key={frequency.id} value={frequency.id}>
                      {frequency.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Scheduled date">
                <input name="scheduled_date" type="date" defaultValue={quote.preferred_date ?? ""} className="form-input rounded-md" />
              </FormField>
              <input type="hidden" name="scheduled_time" value={quote.preferred_time ?? "flexible"} />
              <FormField label="Preferred start time">
                <select name="scheduled_exact_time" defaultValue={quote.preferred_exact_time ?? ""} className="form-input rounded-md">
                  <option value="">Select start time</option>
                  {EXACT_TIME_OPTIONS.map((time) => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Final price">
                <input name="price" type="number" step="0.01" defaultValue={quote.estimated_price ?? ""} className="form-input rounded-md" placeholder="Final price" />
              </FormField>
              <FormField label="Initial job status">
                <select name="status" defaultValue="draft" className="form-input rounded-md">
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </FormField>
              <label className="block md:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Internal job notes</span>
                <textarea name="internal_notes" className="form-input rounded-md" rows={3} placeholder="Notes only visible to the admin team" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Customer-facing notes</span>
                <textarea name="customer_notes" className="form-input rounded-md" rows={3} placeholder="Notes that can be used when confirming the booking" />
              </label>
              <button className="btn-primary rounded-md md:col-span-2">Create job</button>
            </form>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-navy-950">Customer</h3>
            <p className="mt-3 font-semibold">{customer?.first_name} {customer?.last_name}</p>
            <p className="text-sm text-slate-600">{customer?.email}</p>
            <p className="text-sm text-slate-600">{customer?.phone}</p>
            {customer?.id ? <Link href={`/admin/customers/${customer.id}`} className="mt-3 inline-block text-sm font-semibold text-teal-700">Open customer</Link> : null}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-navy-950">Status</h3>
            <form action={updateQuoteStatus} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={quote.id} />
              <select name="status" defaultValue={quote.status} className={`form-input rounded-md font-semibold ${statusControlClass(quote.status)}`}>
                {QUOTE_STATUSES.map((status) => <option key={status} value={status}>{labelise(status)}</option>)}
              </select>
              <button className="btn-primary rounded-md px-4">Save</button>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-bold text-navy-950">Notes</h3>
            <form action={addNote} className="mt-3 space-y-3">
              <input type="hidden" name="customer_id" value={quote.customer_id} />
              <select name="note_type" className="form-input rounded-md">
                {NOTE_TYPES.map((type) => <option key={type} value={type}>{labelise(type)}</option>)}
              </select>
              <textarea name="content" className="form-input rounded-md" rows={3} placeholder="Add internal note" required />
              <button className="btn-primary w-full rounded-md">Add note</button>
            </form>
            <div className="mt-4 space-y-3">
              {quoteNotes.map((note) => (
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
