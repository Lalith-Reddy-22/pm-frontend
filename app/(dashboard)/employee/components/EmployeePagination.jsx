"use client";

export default function EmployeePagination({
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
      className={`flex flex-wrap items-center justify-between border-t ${border} px-4 py-3 text-xs ${t.textMuted}`}
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

      <div className="flex items-center gap-1">

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
          onClick={() =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
          disabled={clampedPage === totalPages}
          className={`rounded-lg px-3 py-1 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${t.userHover}`}
        >
          Next
        </button>

      </div>
    </div>
  );
}