"use client";

import { useEffect, useRef, useState } from "react";
import { updateJobFinalisation } from "../../actions";

type Milestone = { id: string; pct: string; amtStr: string; due: string };

type Job = {
  id: string;
  service_type: string;
  frequency: string | null;
  scheduled_date: string | null;
  scheduled_time: string | null;
  final_scope_notes: string | null;
  price: number | null;
  payment_percentage: number | null;
  payment_amount: number | null;
  deposit_required: boolean | null;
  full_payment_required: boolean | null;
  payment_due_timing: string | null;
  milestones: Milestone[] | null;
};

const SERVICE_TYPE_OPTIONS = [
  { value: "home", label: "Home Clean" },
  { value: "end-of-lease", label: "End of Lease" },
  { value: "deep-clean", label: "Deep Clean" },
  { value: "commercial", label: "Commercial" },
  { value: "ndis", label: "NDIS" },
];

const FREQUENCY_OPTIONS_OFFERED = [
  { value: "once", label: "One-off" },
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

const FREQUENCY_OPTIONS_OTHER = [
  { value: "twice-weekly", label: "Twice weekly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "as-required", label: "As required" },
];

const TIME_OPTIONS: { value: string; label: string }[] = Array.from({ length: 21 }, (_, i) => {
  const totalMins = 8 * 60 + i * 30;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const period = h < 12 ? "am" : "pm";
  const h12 = h > 12 ? h - 12 : h;
  return {
    value: `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`,
    label: `${h12}:${m === 0 ? "00" : "30"} ${period}`,
  };
});

const TEXT_DUE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "upon_receipt", label: "Upon receipt" },
  { value: "in_7_days", label: "In 7 days" },
  { value: "in_14_days", label: "In 14 days" },
  { value: "in_30_days", label: "In 30 days" },
  { value: "in_60_days", label: "In 60 days" },
];

function labelise(value?: string | null) {
  if (!value) return "";
  const acronyms: Record<string, string> = { ndis: "NDIS" };
  if (acronyms[value]) return acronyms[value];
  return value.replace(/_/g, " ").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        checked ? "bg-slate-900" : "bg-slate-300"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function DuePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(() => new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const displayLabel = (() => {
    const opt = TEXT_DUE_OPTIONS.find((o) => o.value === value);
    if (opt) return opt.label;
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const d = new Date(value + "T00:00:00");
      return d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
    }
    return value || "Today";
  })();

  const year = calMonth.getFullYear();
  const month = calMonth.getMonth();
  const monthName = calMonth.toLocaleString("en-US", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;

  function selectDate(day: number) {
    const str = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    onChange(str);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        {displayLabel}
        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-1 flex rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="w-36 border-r border-slate-100 py-2">
            {TEXT_DUE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                  value === opt.value
                    ? "bg-slate-100 font-medium text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="w-64 p-4">
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCalMonth(new Date(year, month - 1, 1))}
                className="rounded-full p-1 hover:bg-slate-100"
              >
                <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-slate-900">{monthName} {year}</span>
              <button
                type="button"
                onClick={() => setCalMonth(new Date(year, month + 1, 1))}
                className="rounded-full p-1 hover:bg-slate-100"
              >
                <svg className="h-4 w-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7">
              {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                <div key={d} className="py-1 text-center text-xs font-medium text-slate-400">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {Array.from({ length: offset }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const isToday = dateStr === todayStr;
                const isSelected = value === dateStr;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDate(day)}
                    className={`m-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm transition-colors ${
                      isSelected || isToday
                        ? "bg-slate-900 font-semibold text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeTabs({
  mode,
  onChange,
}: {
  mode: "percent" | "amount";
  onChange: (m: "percent" | "amount") => void;
}) {
  return (
    <div className="mb-5 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 text-sm">
      <button
        type="button"
        onClick={() => onChange("percent")}
        className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
          mode === "percent" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Percentage (%)
      </button>
      <button
        type="button"
        onClick={() => onChange("amount")}
        className={`rounded-md px-4 py-1.5 font-medium transition-colors ${
          mode === "amount" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        Amount ($)
      </button>
    </div>
  );
}

function ScheduleTable({
  rows,
  mode,
  onChangeRow,
  readOnly = false,
}: {
  rows: { pct: string; amtStr: string; due: string; name: string; id: string }[];
  mode: "percent" | "amount";
  onChangeRow: (id: string, field: "pct" | "amtStr" | "due", val: string) => void;
  readOnly?: boolean;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100">
          <th className="pb-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Amount</th>
          <th className="pb-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Due</th>
          <th className="pb-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
          <th className="pb-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Payment reminders</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-50">
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="py-3 pr-4">
              {readOnly ? (
                <div className="w-24 select-none rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-right text-sm text-slate-400">
                  {mode === "percent" ? `${row.pct}%` : `$${row.amtStr}`}
                </div>
              ) : mode === "percent" ? (
                <div className="relative w-24">
                  <input
                    type="number" min="0" max="100" step="1"
                    value={row.pct}
                    onChange={(e) => onChangeRow(row.id, "pct", e.target.value)}
                    className="w-full rounded-md border border-slate-200 py-1.5 pl-2.5 pr-7 text-right text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                    placeholder="0"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                </div>
              ) : (
                <div className="relative w-24">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                  <input
                    type="number" min="0" step="0.01"
                    value={row.amtStr}
                    onChange={(e) => onChangeRow(row.id, "amtStr", e.target.value)}
                    className="w-full rounded-md border border-slate-200 py-1.5 pl-5 pr-2 text-right text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              )}
            </td>
            <td className="py-3 pr-4">
              <DuePicker value={row.due} onChange={(v) => onChangeRow(row.id, "due", v)} />
            </td>
            <td className="py-3 pr-4 font-medium text-slate-700">{row.name}</td>
            <td className="py-3">
              <span className="cursor-default text-sm font-semibold text-teal-700 underline decoration-dotted">
                4 reminders
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function JobFinalisationForm({ job }: { job: Job }) {
  const [serviceType, setServiceType] = useState(job.service_type ?? "");
  const [priceStr, setPriceStr] = useState(job.price != null ? String(job.price) : "");

  const hasExistingSchedule = Boolean(
    job.deposit_required ||
      (job.payment_percentage != null && job.payment_percentage > 0 && job.payment_percentage < 100),
  );
  const [showSchedule, setShowSchedule] = useState(hasExistingSchedule);
  const [requestDeposit, setRequestDeposit] = useState(Boolean(job.deposit_required));
  const [splitMilestones, setSplitMilestones] = useState(
    Array.isArray(job.milestones) && job.milestones.length > 0,
  );

  // Deposit state
  const [depositMode, setDepositMode] = useState<"percent" | "amount">("percent");
  const [depositPct, setDepositPct] = useState(
    job.payment_percentage != null && job.payment_percentage > 0 && job.payment_percentage < 100
      ? String(job.payment_percentage)
      : "0",
  );
  const [depositAmtStr, setDepositAmtStr] = useState("0");
  const [depositDue, setDepositDue] = useState(job.payment_due_timing ?? "today");

  // Milestone state
  const [splitMode, setSplitMode] = useState<"percent" | "amount">("percent");
  const [milestones, setMilestones] = useState<Milestone[]>(
    Array.isArray(job.milestones) && job.milestones.length > 0
      ? job.milestones
      : [
          { id: "m1", pct: "0", amtStr: "0.00", due: "in_30_days" },
          { id: "m2", pct: "0", amtStr: "0.00", due: "in_60_days" },
        ],
  );

  const total = parseFloat(priceStr) || 0;
  const fmt = (n: number) => `$${n.toFixed(2)}`;

  const depositValue = (() => {
    if (!requestDeposit || !showSchedule) return 0;
    if (depositMode === "percent") return Math.round(total * ((parseFloat(depositPct) || 0) / 100) * 100) / 100;
    return Math.min(parseFloat(depositAmtStr) || 0, total);
  })();

  const balanceValue = Math.max(0, total - depositValue);
  const balancePct = Math.max(0, 100 - (parseFloat(depositPct) || 0));

  const computedPercentage =
    total > 0 && requestDeposit && showSchedule ? Math.round((depositValue / total) * 100) : 100;

  // Milestone amounts (each milestone is a % or $ of the balance)
  const milestoneAmounts = milestones.map((m) => {
    if (splitMode === "percent") return Math.round(balanceValue * ((parseFloat(m.pct) || 0) / 100) * 100) / 100;
    return parseFloat(m.amtStr) || 0;
  });
  const totalMilestonePct = milestones.reduce((s, m) => s + (parseFloat(m.pct) || 0), 0);
  const totalMilestoneAmt = milestoneAmounts.reduce((s, a) => s + a, 0);

  function updateMilestone(id: string, field: "pct" | "amtStr" | "due", val: string) {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: val } : m)));
  }

  function addMilestone() {
    setMilestones((prev) => [
      ...prev,
      { id: `m${Date.now()}`, pct: "0", amtStr: "0.00", due: "in_30_days" },
    ]);
  }

  function removeMilestone(id: string) {
    setMilestones((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev));
  }

  const milestonesPayload = splitMilestones ? milestones : [];

  return (
    <form action={updateJobFinalisation} className="mt-4 space-y-4">
      {/* Hidden fields */}
      <input type="hidden" name="id" value={job.id} />
      <input type="hidden" name="deposit_required" value={showSchedule && requestDeposit ? "on" : ""} />
      <input type="hidden" name="full_payment_required" value="on" />
      <input type="hidden" name="payment_due_timing" value={showSchedule ? depositDue : ""} />
      <input type="hidden" name="payment_percentage" value={computedPercentage} />
      <input type="hidden" name="milestones" value={JSON.stringify(milestonesPayload)} />

      {/* Job detail fields */}
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Service type</span>
          <select
            name="service_type"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            className="form-input rounded-md"
          >
            {SERVICE_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Frequency</span>
          <select name="frequency" defaultValue={job.frequency ?? "once"} className="form-input rounded-md">
            <optgroup label="Offered">
              {FREQUENCY_OPTIONS_OFFERED.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </optgroup>
            <optgroup label="Other">
              {FREQUENCY_OPTIONS_OTHER.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </optgroup>
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Scheduled date</span>
          <input name="scheduled_date" type="date" defaultValue={job.scheduled_date ?? ""} className="form-input rounded-md" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Scheduled time</span>
          <select name="scheduled_time" defaultValue={job.scheduled_time ?? ""} className="form-input rounded-md">
            <option value="">Select a time…</option>
            {TIME_OPTIONS.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Line items */}
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="grid grid-cols-[1fr_52px_132px_96px] gap-x-2 border-b border-slate-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Item</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Price</span>
          <span className="text-right">Total</span>
        </div>
        <div className="grid grid-cols-[1fr_52px_132px_96px] items-center gap-x-2 border-b border-slate-100 bg-white px-4 py-3">
          <span className="truncate text-sm font-medium text-slate-800">{labelise(serviceType) || "Service"}</span>
          <span className="text-center text-sm text-slate-500">1</span>
          <div className="flex justify-end">
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">$</span>
              <input
                name="price" type="number" step="0.01" min="0"
                value={priceStr} onChange={(e) => setPriceStr(e.target.value)}
                className="w-28 rounded-md border border-slate-200 py-1.5 pl-6 pr-2 text-right text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                placeholder="0.00"
              />
            </div>
          </div>
          <span className="text-right text-sm font-semibold text-slate-800">{total > 0 ? fmt(total) : "—"}</span>
        </div>
        <div className="space-y-1.5 bg-slate-50/70 px-4 py-3 text-sm">
          <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{total > 0 ? fmt(total) : "—"}</span></div>
          <div className="flex justify-between text-slate-500"><span>Tax</span><span>$0.00</span></div>
          <div className="mt-1.5 flex justify-between border-t border-slate-200 pt-1.5 font-bold text-slate-900">
            <span>Total</span><span>{total > 0 ? fmt(total) : "—"}</span>
          </div>
        </div>
      </div>

      {/* Payment schedule */}
      {!showSchedule ? (
        <button
          type="button"
          onClick={() => setShowSchedule(true)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          + Add payment schedule
        </button>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h4 className="font-semibold text-slate-900">Payment schedule</h4>
            <button
              type="button"
              onClick={() => { setShowSchedule(false); setRequestDeposit(false); setSplitMilestones(false); }}
              className="text-xs text-slate-400 transition-colors hover:text-slate-600"
            >
              Remove
            </button>
          </div>

          {/* Request deposit toggle */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <span className="text-sm text-slate-700">Request deposit</span>
            <Toggle checked={requestDeposit} onChange={setRequestDeposit} />
          </div>

          {/* Split balance into milestones toggle */}
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <span className="text-sm text-slate-700">Split balance into milestones</span>
            <Toggle checked={splitMilestones} onChange={setSplitMilestones} />
          </div>

          {/* Deposit request section */}
          {requestDeposit && (
            <div className="border-b border-slate-100 px-5 py-5">
              <h5 className="mb-4 text-sm font-bold text-slate-900">Deposit request</h5>
              <ModeTabs mode={depositMode} onChange={setDepositMode} />

              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-28">Amount</th>
                    <th className="pb-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Due</th>
                    <th className="pb-2.5 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                    <th className="pb-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Payment reminders</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {/* Deposit row */}
                  <tr>
                    <td className="py-3 pr-4">
                      {depositMode === "percent" ? (
                        <div className="relative w-24">
                          <input
                            type="number" min="0" max="100" step="1"
                            value={depositPct} onChange={(e) => setDepositPct(e.target.value)}
                            className="w-full rounded-md border border-slate-200 py-1.5 pl-2.5 pr-7 text-right text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                            placeholder="0"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                        </div>
                      ) : (
                        <div className="relative w-24">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">$</span>
                          <input
                            type="number" min="0" step="0.01"
                            value={depositAmtStr} onChange={(e) => setDepositAmtStr(e.target.value)}
                            className="w-full rounded-md border border-slate-200 py-1.5 pl-5 pr-2 text-right text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <DuePicker value={depositDue} onChange={setDepositDue} />
                    </td>
                    <td className="py-3 pr-4 font-medium text-slate-700">Deposit</td>
                    <td className="py-3">
                      <span className="cursor-default text-sm font-semibold text-teal-700 underline decoration-dotted">4 reminders</span>
                    </td>
                  </tr>

                  {/* Balance row */}
                  <tr>
                    <td className="py-3 pr-4">
                      <div className="w-24 select-none rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-right text-sm text-slate-400">
                        {depositMode === "percent" ? `${balancePct.toFixed(0)}%` : fmt(balanceValue)}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="inline-block select-none rounded-md border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-sm text-slate-400">
                        {splitMilestones ? "Multiple due dates" : "Before service"}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400">Balance</td>
                    <td className="py-3 text-sm text-slate-400">
                      {splitMilestones ? "Multiple reminder schedules" : "—"}
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className="mt-3 text-sm text-slate-600">
                Request <strong className="text-slate-800">{fmt(depositValue)}</strong> deposit on{" "}
                <strong className="text-slate-800">{fmt(total)}</strong> invoice.
              </p>
            </div>
          )}

          {/* Balance split section */}
          {splitMilestones && (
            <div className="px-5 py-5">
              <h5 className="mb-4 text-sm font-bold text-slate-900">Balance split</h5>
              <ModeTabs mode={splitMode} onChange={setSplitMode} />

              <ScheduleTable
                mode={splitMode}
                rows={milestones.map((m, i) => ({ ...m, name: `Payment ${i + 1}` }))}
                onChangeRow={updateMilestone}
              />

              {milestones.length > 1 && (
                <div className="mt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => milestones.length > 2 ? removeMilestone(milestones[milestones.length - 1].id) : undefined}
                    className={`text-xs text-slate-400 hover:text-slate-600 transition-colors ${milestones.length <= 2 ? "invisible" : ""}`}
                  >
                    Remove last
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={addMilestone}
                className="mt-3 text-sm font-semibold text-slate-700 underline hover:text-slate-900 transition-colors"
              >
                Add another payment
              </button>

              <p className="mt-3 text-sm text-slate-600">
                {splitMode === "percent" ? (
                  <>
                    Request{" "}
                    <strong className="text-slate-800">{totalMilestonePct.toFixed(0)}%</strong> of{" "}
                    <strong className="text-slate-800">{fmt(balanceValue)}</strong> invoice balance over{" "}
                    <strong className="text-slate-800">{milestones.length}</strong> payments ({milestoneAmounts.map(fmt).join(", ")}).
                  </>
                ) : (
                  <>
                    Request{" "}
                    <strong className="text-slate-800">{fmt(totalMilestoneAmt)}</strong> of{" "}
                    <strong className="text-slate-800">{fmt(balanceValue)}</strong> invoice balance over{" "}
                    <strong className="text-slate-800">{milestones.length}</strong> payments.
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Final scope notes */}
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Final scope notes</span>
        <textarea
          name="final_scope_notes"
          defaultValue={job.final_scope_notes ?? ""}
          className="form-input rounded-md"
          rows={3}
          placeholder="Confirmed service scope, access notes, inclusions, exclusions"
        />
      </label>

      <button className="btn-primary rounded-md">Save final details</button>
    </form>
  );
}
