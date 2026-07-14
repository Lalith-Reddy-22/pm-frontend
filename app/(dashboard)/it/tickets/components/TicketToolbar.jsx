"use client";

import { Search, ChevronDown, Upload, Plus } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function TicketToolbar({
  search = "",
  setSearch = () => {},
  pageSize = 50,
  setPageSize = () => {},
  setPage = () => {},
  onCreate,
  activeTab = "raise",
}) {
  const { t, isDark } = useTheme();

  const border = isDark ? "border-white/10" : "border-gray-200";

  const inputBg = isDark
    ? "bg-white/5 text-white"
    : "bg-white text-gray-700";

  return (
    <div className="flex flex-wrap items-center justify-between bg-white px-6 py-5">

      {/* Left */}
      <div className="relative w-full max-w-xs">

        <Search
          size={16}
          className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted}`}
        />

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search..."
          className={`w-full rounded-lg border ${border} ${inputBg} py-2 pl-10 pr-3 outline-none focus:border-[#E12729]`}
        />

      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Page Size */}
        <div className="relative">

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className={`appearance-none rounded-lg border ${border} ${inputBg} px-3 py-2 pr-8`}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 ${t.textMuted}`}
          />

        </div>

        {/* Export */}
        <button
          className={`flex items-center gap-2 rounded-lg border ${border} ${inputBg} px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10`}
        >
          <Upload size={16} />
          Export
          <ChevronDown size={15} />
        </button>

        {/* Create */}
        {activeTab === "raise" && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 rounded-lg bg-[#2f2f2f] px-5 py-2 text-white transition hover:bg-black"
          >
            <Plus size={18} />
            Create Issue
          </button>
        )}

      </div>
    </div>
  );
}