"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomSelect from "@/components/ui/CustomSelect";
import { useRouter } from "next/navigation";
import ExportDropdown from "@/app/(dashboard)/employee/components/ExportDropdown";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100].map((size) => ({
  id: String(size),
  name: String(size),
}));

export default function BuyingCenterTopBar({
  search,
  setSearch,
  pageSize,
  setPageSize,
  onAdd,
  border,
  t,
  isDark,
  handleCopy,
  handlePrint,
  handlePDF,
  handleCSV,
}) {
  const router = useRouter();
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 bg-white p-6 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}
      <div className="flex flex-1 items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search buying center..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm outline-none transition focus:border-[#E12729] focus:ring-2 focus:ring-red-100"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Page Size */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>

          <div className="w-20">
            <CustomSelect
              value={String(pageSize)}
              onChange={(value) => setPageSize(Number(value))}
              options={PAGE_SIZE_OPTIONS}
              placeholder="10"
            />
          </div>

          <span>entries</span>
        </div>

        

        {/* COMMON EXPORT DROPDOWN */}
        
        <ExportDropdown
          showExport={showExport}
          setShowExport={setShowExport}
          handleCopy={handleCopy}
          handlePrint={handlePrint}
          handlePDF={handlePDF || (() => console.log("PDF clicked"))}
          handleCSV={handleCSV}
          border={border || "border-gray-200"}
          t={
            t || {
              cardBg: "bg-white",
              textPrimary: "text-gray-700",
            }
          }
          isDark={isDark || false}
        />

        {/* Add Project */}
        <Button
          type="button"
          onClick={() => router.push("/project/add-project")}
          className="gap-2 bg-[#E12729] text-white text-sm hover:bg-[#c81f21] border-[#E12729] cursor-pointer"
        >
          + Add Project
        </Button>

      </div>
    </div>
  );
}