"use client";

import {
  Upload,
  ChevronDown,
  Plus,
} from "lucide-react";

import ExportDropdown from "./ExportDropdown";

export default function EmployeeToolbar({
  search,
  setSearch,
  pageSize,
  setPageSize,
  setPage,
  border,
  inputBg,
  t,
  isDark,
  showExport,
  setShowExport,
  handleCopy,
  handlePrint,
  handlePDF,
  handleCSV,
  setShowDrawer,
}) {
  return (
    <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3">

      {/* Search */}
      <div className={`flex items-center gap-2 text-sm ${t.textSecondary}`}>
        Search:

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search"
          className={`rounded-lg border ${border} ${inputBg}
          px-3 py-1.5 text-sm ${t.textPrimary} w-56
          focus:outline-none focus:ring-2
          ${
            isDark
              ? "focus:ring-red-500/40"
              : "focus:ring-red-500/30"
          }`}
        />
      </div>

      {/* Right Side */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Show Entries */}

        <div className={`flex items-center gap-2 text-sm ${t.textSecondary}`}>
          Show

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className={`rounded-lg border ${border} ${inputBg}
            px-2 py-1 text-sm ${t.textPrimary}`}
          >
            {[10,25,50,100].map((n)=>(
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          entries

        </div>

        {/* Export */}

        <ExportDropdown
          border={border}
          t={t}
          isDark={isDark}
          showExport={showExport}
          setShowExport={setShowExport}
          handleCopy={handleCopy}
          handlePrint={handlePrint}
          handlePDF={handlePDF}
          handleCSV={handleCSV}
        />

        {/* Add Employee */}

        <button
          onClick={() => setShowDrawer(true)}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2
          text-sm font-semibold text-white transition-colors
          ${
            isDark
              ? "bg-gray-100 text-gray-900 hover:bg-white"
              : "bg-gray-900 hover:bg-black"
          }`}
        >
          <Plus size={16} />

          Add Employee

        </button>

      </div>

    </div>
  );
}