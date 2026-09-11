"use client";

import { Search, Upload, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ExportDropdown from "@/app/(dashboard)/employee/components/ExportDropdown";
import { useState } from "react";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function EmployeeToolbar({
  search,
  setSearch,
  pageSize,
  setPageSize,
  setPage,
  onExport,
  searchPlaceholder = "Search employees...",
}) {

  const [showExport, setShowExport] = useState(false);
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Search:
        </span>

        <div className="relative w-64">
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
            placeholder={searchPlaceholder}
            className="h-8 pl-9 text-sm w-full focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>
      </div>

      <div className="flex-1" />

      {/* Show Entries */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">
          Show
        </span>

        <Select
          value={String(pageSize)}
          onValueChange={(val) => {
            setPageSize(Number(val));
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-20 text-sm focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="text-sm font-medium text-muted-foreground">
          entries
        </span>
      </div>

      {/* Export Button */}
      <ExportDropdown
  showExport={showExport}
  setShowExport={setShowExport}
  handleCopy={() => onExport("copy")}
  handlePrint={() => onExport("print")}
  handlePDF={() => onExport("pdf")}
  handleCSV={() => onExport("csv")}
  border="border-gray-200"
  t={{
    cardBg: "bg-white",
    textPrimary: "text-gray-700",
  }}
  isDark={false}
/>
    </div>
  );
}