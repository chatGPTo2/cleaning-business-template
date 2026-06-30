import Link from "next/link";
import { labelise } from "@/lib/crm";

const STATUS_STYLES: Record<string, string> = {
  new: "border-sky-200 bg-sky-50 text-sky-800",
  reviewing: "border-amber-200 bg-amber-50 text-amber-800",
  quote_sent: "border-blue-200 bg-blue-50 text-blue-800",
  follow_up: "border-orange-200 bg-orange-50 text-orange-800",
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-800",
  declined: "border-red-200 bg-red-50 text-red-800",
  converted_to_job: "border-violet-200 bg-violet-50 text-violet-800",
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  scheduled: "border-blue-200 bg-blue-50 text-blue-800",
  in_progress: "border-amber-200 bg-amber-50 text-amber-800",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-red-200 bg-red-50 text-red-800",
  invoiced: "border-purple-200 bg-purple-50 text-purple-800",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  not_required: "border-slate-200 bg-slate-50 text-slate-700",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  failed: "border-red-200 bg-red-50 text-red-800",
  refunded: "border-cyan-200 bg-cyan-50 text-cyan-800",
  recurring: "border-emerald-200 bg-emerald-50 text-emerald-800",
  repeat: "border-blue-200 bg-blue-50 text-blue-800",
};

export function statusControlClass(value?: string | null) {
  const key = value ?? "";
  const style = STATUS_STYLES[key] ?? "border-slate-200 bg-white text-slate-700";
  return style.replace("bg-", "bg-").replace("text-", "text-");
}

export function StatusPill({ value }: { value?: string | null }) {
  const key = value ?? "";
  const style = STATUS_STYLES[key] ?? "border-slate-200 bg-slate-100 text-slate-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}>
      {labelise(value)}
    </span>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
      {label}
    </div>
  );
}

export function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const content = (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-navy-950">{value}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function Money({ value }: { value?: number | string | null }) {
  const amount = Number(value ?? 0);
  if (!Number.isFinite(amount) || amount === 0) return <>Not set</>;
  return <>${amount.toFixed(2)}</>;
}

export function DateText({ value }: { value?: string | null }) {
  if (!value) return <>Not set</>;
  const d = new Date(value.includes("T") ? value : `${value}T12:00:00`);
  return <>{isNaN(d.getTime()) ? value : d.toLocaleDateString("en-AU")}</>;
}
