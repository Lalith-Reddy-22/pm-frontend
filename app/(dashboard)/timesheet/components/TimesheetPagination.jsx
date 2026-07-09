"use client";

export default function TimesheetPagination({
  filtered,
  clampedPage,
  pageSize,
  totalPages,
  setPage,
  border,
  t,
}) {
  return (
    <div
      className={`sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t ${border} bg-white px-4 py-3 text-xs dark:bg-[#111827] ${t.textMuted}`}
    >
      <span>
        Showing{" "}
        {filtered.length === 0
          ? 0
          : (clampedPage - 1) * pageSize + 1}{" "}
        to{" "}
        {Math.min(clampedPage * pageSize, filtered.length)}{" "}
        of {filtered.length} entries
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={clampedPage === 1}
          className={`rounded-lg px-3 py-1 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${t.userHover}`}
        >
          Previous
        </button>

        <span className={`px-2 ${t.textSecondary}`}>
          {clampedPage} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={clampedPage === totalPages}
          className={`rounded-lg px-3 py-1 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${t.userHover}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}