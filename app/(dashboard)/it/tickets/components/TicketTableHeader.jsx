"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

export default function TicketTableHeader({
  columns,
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
}) {
  const handleSort = (accessor) => {
    if (sortBy === accessor) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(accessor);
      setSortDirection("asc");
    }
  };

  return (
    <thead className="border-y bg-gray-50">
      <tr>
        {columns.map((column) => {
          const isActive = sortBy === column.accessor;

          return (
            <th
              key={column.accessor}
              className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
            >
              <button
                type="button"
                onClick={() => handleSort(column.accessor)}
                className="flex items-center gap-2 transition"
              >
                {column.header}
                <span className="flex flex-col items-center text-[11px] text-gray-500">
                  <ChevronUp
                    size={12}
                    className={isActive && sortDirection === "asc" ? "text-[#E12729]" : ""}
                  />
                  <ChevronDown
                    size={12}
                    className={isActive && sortDirection === "desc" ? "text-[#E12729]" : ""}
                  />
                </span>
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
