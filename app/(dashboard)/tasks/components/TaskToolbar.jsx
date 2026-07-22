"use client";

import { Search, Upload, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/DateRangePicker";

export default function TaskToolbar({
  search,
  setSearch,
  setPage,
  dateRange,
  setDateRange,
}) {
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
              setPage(1);
            }}
            placeholder="Task title, project code, or employee…"
            className="h-8 w-56 pl-9 text-sm sm:w-72 focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>

        {/* Date Range Picker */}
        <DateRangePicker
          dateRange={dateRange}
          onChange={(range) => {
            setDateRange(range ?? { from: undefined, to: undefined });
            setPage(1);
          }}
          onClear={() => {
            setDateRange({ from: undefined, to: undefined });
            setPage(1);
          }}
        />
      </div>

      {/* ── Right: Export + Add Task ── */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" className="gap-1.5 text-sm border-[#E12729] cursor-pointer">
          <Upload size={14} />
          <span>Export</span>
          <ChevronDown size={13} />
        </Button>
        <Button
          className="gap-2 bg-[#E12729] text-white text-sm hover:bg-[#c81f21] border-[#E12729] cursor-pointer"
        >
          + Add Task
        </Button>
      </div>
    </div>
  );
}
