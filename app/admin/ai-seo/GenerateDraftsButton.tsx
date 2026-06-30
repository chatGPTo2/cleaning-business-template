"use client";

import { useFormStatus } from "react-dom";

export default function GenerateDraftsButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-wait disabled:bg-teal-700 disabled:opacity-80"
      aria-live="polite"
    >
      {pending && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      {pending ? "Generating drafts..." : "Generate SEO Drafts"}
    </button>
  );
}
