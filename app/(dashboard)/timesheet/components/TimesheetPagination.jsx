"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function TimesheetPagination({
  startIndex,
  endIndex,
  totalItems,
  page,
  totalPages,
  pageNumbers,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  setPage,
  border,
  t,
}) {
  return (
    <div
      className={`sticky bottom-0 flex items-center justify-between border-t ${border} bg-white dark:bg-[#111827] px-4 py-3`}
    >
      <span className={`text-sm ${t.textMuted}`}>
        Showing {startIndex} to {endIndex} of {totalItems} entries
      </span>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(1)}
          disabled={!hasPrev}
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={prevPage}
          disabled={!hasPrev}
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((item, i) =>
          item === "…" ? (
            <span key={i}>…</span>
          ) : (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={
                page === item
                  ? "bg-red-500 text-white rounded px-3 py-1"
                  : "rounded px-3 py-1"
              }
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={nextPage}
          disabled={!hasNext}
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => setPage(totalPages)}
          disabled={!hasNext}
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}