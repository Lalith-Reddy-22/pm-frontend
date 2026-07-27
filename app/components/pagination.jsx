"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  pageNumbers,
  setPage,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between border-t bg-white px-6 py-5">

      <p className="text-sm text-gray-600">
        Showing {startIndex} to {endIndex} of {totalItems} entries
      </p>

      <div className="flex items-center gap-2">

        <button
          onClick={() => setPage(1)}
          disabled={!hasPrev}
          className="rounded-md border bg-gray-50 px-3 py-2 disabled:opacity-40"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={prevPage}
          disabled={!hasPrev}
          className="rounded-md border bg-gray-50 px-3 py-2 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((item, index) =>
          item === "..." ? (
            <span
              key={index}
              className="px-2 text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => setPage(item)}
              className={`h-9 min-w-9 rounded-md border px-3 text-sm ${
                page === item
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-300 bg-white hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          onClick={nextPage}
          disabled={!hasNext}
          className="rounded-md border bg-gray-50 px-3 py-2 disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => setPage(totalPages)}
          disabled={!hasNext}
          className="rounded-md border bg-gray-50 px-3 py-2 disabled:opacity-40"
        >
          <ChevronsRight size={16} />
        </button>

      </div>
    </div>
  );
}