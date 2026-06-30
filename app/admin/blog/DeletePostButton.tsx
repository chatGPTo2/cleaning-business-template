"use client";

export default function DeletePostButton() {
  return (
    <button
      type="submit"
      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-700"
      onClick={(event) => {
        if (!window.confirm("Delete this post? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      Delete
    </button>
  );
}
