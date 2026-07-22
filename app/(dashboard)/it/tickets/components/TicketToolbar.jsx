"use client";

import { Search, ChevronDown, Upload, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateRangePicker from "@/components/DateRangePicker";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function TicketToolbar({
  search = "",
  setSearch = () => {},
  pageSize = 50,
  setPageSize = () => {},
  setPage = () => {},
  onCreate,
  activeTab = "raise",
  dateRange,
  setDateRange,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
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
            placeholder="Search ticket, issue or status..."
            className="h-8 w-56 pl-9 text-sm sm:w-72 focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>

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

      <div className="flex flex-wrap items-center gap-2">
        {/* <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Show</span>
          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="h-8 w-20 rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-700"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
          <span className="text-sm text-muted-foreground">entries</span>
        </div> */}

        <Button variant="outline" className="gap-1.5 text-sm border-[#E12729]">
          <Upload size={14} />
          Export
          <ChevronDown size={13} />
        </Button>

        {activeTab === "raise" && (
          <Button className="gap-2 bg-[#E12729] text-white text-sm hover:bg-[#c81f21] border-[#E12729]">
            <Plus size={18} />
            Create Issue
          </Button>
        )}
      </div>
    </div>
  );
}
