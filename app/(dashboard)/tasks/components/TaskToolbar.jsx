"use client";

import { Search, Upload, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import WeekRangePicker from "@/app/components/WeekRangePicker";
import { useState } from "react";
import ExportDropdown from "@/app/(dashboard)/employee/components/ExportDropdown";

export default function TaskToolbar({
  search,
  setSearch,
  setPage,
  onAddTask,
  dateRange,
  setDateRange,
  handleFullData,
  handleSelectedPages,
  totalPages,
}) {
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      {/* ── Left: Search + Date Range ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="hidden text-sm font-medium text-muted-foreground sm:block">
          Search:
        </span>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage?.(1);
            }}
            placeholder="Task title, project code, or employee…"
            className="h-8 w-56 pl-9 text-sm sm:w-72 focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>

        <WeekRangePicker
  start={dateRange?.from ?? new Date()}
  end={dateRange?.to ?? new Date()}
  onChange={(s, e) => {
    setDateRange({
      from: s,
      to: e,
    });
    setPage(1);
  }}
/>
      </div>

      {/* ── Right: Export + Add Task ── */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
  <ExportDropdown
  showExport={showExport}
  setShowExport={setShowExport}
  handleFullData={handleFullData}
  handleSelectedPages={handleSelectedPages}
  totalPages={totalPages}
  border="border-gray-200"
  t={{
    cardBg: "bg-white",
    textPrimary: "text-gray-700",
  }}
  isDark={false}
/>
</div>
        <Button className="bg-[#E12729] hover:bg-[#E12729] cursor-pointer" onClick={onAddTask}>
          + Add Task
        </Button>
      </div>
    </div>
  );
}
