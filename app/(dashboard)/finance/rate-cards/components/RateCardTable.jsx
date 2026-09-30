"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

// Keys that are never rate columns
const META_KEYS = new Set(["Employee_Name", "EmpId", "Designation", "Team_Type"]);

/**
 * Derive sorted column keys from the first row of API data.
 * Excludes meta fields; sorts alphabetically so columns are stable.
 */
function deriveRateColumns(rows) {
  if (!rows || rows.length === 0) return [];
  return Object.keys(rows[0])
    .filter((k) => !META_KEYS.has(k))
    .sort((a, b) => a.localeCompare(b));
}

/** Format a rate value: null → "—", number → display as-is */
function formatRate(value) {
  if (value === null || value === undefined) return "—";
  return value;
}

export default function RateCardTable({ rows = [] }) {
  const rateColumns = deriveRateColumns(rows);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: `${250 + rateColumns.length * 140}px` }}>
        {/* ── Header ── */}
        <thead>
          <tr className="border-b bg-[#FCFCFD]">
            {/* Sticky employee header */}
            <th
              className="
                sticky left-0 z-30
                w-[250px] max-w-[250px]
                bg-[#FCFCFD]
                px-5 py-4
                text-left text-xs font-semibold uppercase tracking-wide text-gray-600
                border-r border-b border-gray-200
                shadow-[8px_0_12px_-8px_rgba(0,0,0,0.18)]
              "
            >
              <div className="flex items-center justify-between gap-2">
                Employee Name
                {/* <span className="flex flex-col">
                  <ChevronUp size={12} />
                  <ChevronDown size={12} />
                </span> */}
              </div>
            </th>

            {/* Dynamic rate column headers */}
            {rateColumns.map((col) => (
              <th
                key={col}
                className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600 border-b border-gray-200"
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Replace underscores with spaces for display */}
                  {col.replace(/_/g, " ")}
                  {/* <span className="flex flex-col">
                    <ChevronUp size={12} />
                    <ChevronDown size={12} />
                  </span> */}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── Body ── */}
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={rateColumns.length + 1}
                className="py-12 text-center text-sm text-gray-400"
              >
                No employees found
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.EmpId}
                className="border-b border-gray-200 transition hover:bg-red-50/30"
              >
                {/* Sticky employee cell */}
                <td
                  className="
                    sticky left-0 z-20
                    w-[250px] max-w-[250px]
                    bg-white
                    px-5 py-4
                    border-r border-b border-gray-200
                    shadow-[8px_0_12px_-8px_rgba(0,0,0,0.18)]
                  "
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar initials */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-[#E12729] text-sm">
                      {(row.Employee_Name ?? "")
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0] ?? "")
                        .join("")
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900 text-sm">
                        {row.Employee_Name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="truncate text-xs text-gray-500">
                          {row.Designation}
                        </span>
                        {/* <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-[#E12729] ring-1 ring-red-200">
                          #{row.EmpId}
                        </span> */}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Rate cells */}
                {rateColumns.map((col) => (
                  <td
                    key={col}
                    className="whitespace-nowrap px-5 py-4 text-sm text-gray-700 border-b border-gray-200"
                  >
                    {formatRate(row[col])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
