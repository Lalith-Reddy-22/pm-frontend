"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  page = 1,
  totalPages = 1,
  totalEntries = 0,
  pageSize = 50,
  onPageChange,
}) {
  const start =
    totalEntries === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const end = Math.min(
    page * pageSize,
    totalEntries
  );

  return (
    <div className="flex flex-wrap items-center justify-between bg-white px-6 py-5">

      <p className="text-sm text-gray-600">
        Showing {start} to {end} of {totalEntries} entries
      </p>

      <div className="flex items-center gap-2">

        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border bg-gray-50 px-4 py-2 text-sm disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border bg-gray-50 px-4 py-2 text-sm disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>

      </div>

    </div>
  );
}