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
import ViewToggle from "./ViewToggle";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ProjectToolbar({
  search,
  setSearch,
  pageSize,
  setPageSize,
  setPage,
  view,
  setView,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">

      {/* ── Left: Search ── */}
      <div className="flex items-center gap-2">
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
            placeholder="Project name or code…"
            className="h-8 w-56 pl-9 text-sm sm:w-72 focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>
      </div>

      {/* ── Right: Page size + Export + View toggle ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Page size */}
        {/* <div className="flex items-center gap-1.5">
          <span className="text-sm text-muted-foreground">Show</span>
          <Select
            value={String(pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-20 text-sm">
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
          <span className="text-sm text-muted-foreground">entries</span>
        </div> */}

        {/* Export */}
        <Button variant="outline" className="gap-1.5 text-sm border-[#E12729] cursor-pointer">
          <Upload size={14} />
          <span>Export</span>
          <ChevronDown size={13} />
        </Button>

        {/* Add Project Button */}
        <div className="flex justify-end">
          <Button
            className="gap-2 bg-[#E12729] text-white text-sm hover:bg-[#c81f21] border-[#E12729] cursor-pointer"
          >
            + Add Project
          </Button>
        </div>
        {/* List / Grid toggle */}
        {/* <ViewToggle view={view} setView={setView} /> */}
      </div>

    </div>
  );
}