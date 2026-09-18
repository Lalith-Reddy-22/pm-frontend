"use client";

import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-medium text-muted-foreground sm:block">Search:</span>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="h-8 w-56 pl-10 text-sm sm:w-72 focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
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

        <Button
          className="flex items-center gap-2 bg-[#E12729] text-white text-sm hover:bg-[#c81f21] border-[#E12729]"
          onClick={() => setShowDrawer(true)}
        >
          <Plus size={16} />
          Add Employee
        </Button>
      </div>
    </div>
  );
}