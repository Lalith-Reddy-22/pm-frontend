"use client";

import {
  Upload,
  ChevronDown,
  Copy,
  Printer,
  FileText,
  FileSpreadsheet,
} from "lucide-react";

export default function ExportDropdown({
  showExport,
  setShowExport,
  handleCopy,
  handlePrint,
  handlePDF,
  handleCSV,
  border,
  t,
  isDark,
}) {
  return (
    <div className="relative">

      <button
        onClick={() => setShowExport(!showExport)}
        className={`flex items-center gap-1.5 rounded-lg border ${border}
        px-3 py-2 text-sm font-medium transition-colors
        ${
          isDark
            ? "bg-white/5 text-gray-300 hover:bg-white/10"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        <Upload size={14} />
        Export
        <ChevronDown size={14} />
      </button>

      {showExport && (
        <div
          className={`absolute right-0 mt-2 w-40 rounded-lg border ${border}
          ${t.cardBg} shadow-xl z-50`}
        >

          <button
            onClick={() => {
              handleCopy();
              setShowExport(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${t.textPrimary} hover:bg-red-50`}
          >
            <Copy size={16} />
            Copy
          </button>

          <button
            onClick={() => {
              handlePrint();
              setShowExport(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${t.textPrimary} hover:bg-red-50`}
          >
            <Printer size={16} />
            Print
          </button>

          <button
            onClick={() => {
              handlePDF();
              setShowExport(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${t.textPrimary} hover:bg-red-50`}
          >
            <FileText size={16} />
            PDF
          </button>

          <button
            onClick={() => {
              handleCSV();
              setShowExport(false);
            }}
            className={`flex w-full items-center gap-2 px-3 py-2 text-sm ${t.textPrimary} hover:bg-red-50`}
          >
            <FileSpreadsheet size={16} />
            CSV
          </button>

        </div>
      )}

    </div>
  );
}