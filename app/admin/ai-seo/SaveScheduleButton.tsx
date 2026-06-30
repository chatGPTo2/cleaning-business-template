"use client";

import { useFormStatus } from "react-dom";

export default function SaveScheduleButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-navy-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-900 disabled:cursor-wait disabled:opacity-80"
      aria-live="polite"
    >
      {pending && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {pending ? "Saving..." : "Save Schedule"}
    </button>
  );
}
