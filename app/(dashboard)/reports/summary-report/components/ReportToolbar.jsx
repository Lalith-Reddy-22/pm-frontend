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
import WeekRangePicker from "@/app/components/WeekRangePicker";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ReportToolbar({
  projects,
  selectedProject,
  setSelectedProject,
  startDate,
  endDate,
  setDateRange,
  search,
  setSearch,
  pageSize,
  setPageSize,
  setPage,
  onExport,
}) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* First row: Project Filter, Date Range */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Project Filter */}
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            Project:
          </span>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="h-8 w-44 text-sm focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.code} value={project.code}>
                  {project.code} - {project.title.substring(0, 30)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1" />

        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            Date Range:
          </span>
          <WeekRangePicker
            start={startDate}
            end={endDate}
            onChange={(s, e) => setDateRange(s, e)}
          />
        </div>
      </div>

      {/* Second row: Search, Export, Show Entries */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-80">
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
            placeholder="Search by project, task, employee..."
            className="h-8 pl-9 text-sm w-full focus-visible:border-[#E12729] focus-visible:ring-[#E12729]/20"
          />
        </div>

        <div className="flex-1" />

        {/* Export Button */}
        <Button
          variant="outline"
          className="gap-1.5 text-sm border-[#E12729] text-[#E12729] hover:bg-red-50 cursor-pointer h-8"
          onClick={onExport}
        >
          <Upload size={14} />
          <span>Export</span>
          <ChevronDown size={13} />
        </Button>

        {/* Show Entries */}
        <div className="flex items-center gap-1.5">
          <span className="hidden text-sm text-muted-foreground sm:block">
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
          <span className="hidden text-sm text-muted-foreground sm:block">
            entries
          </span>
        </div>
      </div>
    </div>
  );
}
