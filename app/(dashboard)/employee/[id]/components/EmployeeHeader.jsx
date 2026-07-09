"use client";

import { Search, ChevronDown } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function EmployeeHeader({
  pageSize,
  setPageSize,
  search,
  setSearch,
  setPage,
  border,
  isDark,
  t,
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b ${border}`}
    >
      <h2 className={`text-sm font-semibold ${t.textPrimary}`}>
        User&apos;s Projects List
      </h2>

      <div className="flex flex-wrap items-center gap-4">

        {/* Show Dropdown */}
        <label className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
          Show

          <span className="relative inline-block">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className={`appearance-none rounded-lg border py-1.5 pl-3 pr-8 text-sm font-medium
              ${
                isDark
                  ? "border-white/10 bg-white/5 text-gray-100"
                  : "border-gray-200 bg-white text-gray-900"
              }`}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>

            <ChevronDown
              size={13}
              className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 ${t.textMuted}`}
            />
          </span>
        </label>

        {/* Search */}
        <label className={`flex items-center gap-2 text-sm ${t.textMuted}`}>
          Search:

          <span className="relative">
            <Search
              size={13}
              className={`pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 ${t.textMuted}`}
            />

            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search Project"
              className={`rounded-lg border py-1.5 pl-7 pr-3 text-sm outline-none
              ${
                isDark
                  ? "border-white/10 bg-white/5 text-gray-100 placeholder:text-gray-500"
                  : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400"
              }`}
            />
          </span>
        </label>

      </div>
    </div>
  );
}