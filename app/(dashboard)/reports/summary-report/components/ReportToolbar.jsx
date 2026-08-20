"use client";

import { Search, Upload, ChevronDown } from "lucide-react";
import { useState } from "react";
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
import WeekRangePicker from "@/app/components/WeekRangePicker";
import CustomSelect from "@/components/ui/CustomSelect";


const PAGE_SIZE_SELECT_OPTIONS = [
  { id: "10", name: "10" },
  { id: "25", name: "25" },
  { id: "50", name: "50" },
  { id: "100", name: "100" },
];


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
  const [showExport, setShowExport] = useState(false);
  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      {/* First row: Project Filter, Date Range */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Project Filter */}
        <div className="flex items-center gap-2">
          <span className="hidden text-sm font-medium text-muted-foreground sm:block">
            Project:
          </span>
          <CustomSelect
  value={selectedProject}
  onChange={setSelectedProject}
  placeholder="All Projects"
  options={[
    {
      value: "all",
      label: "All Projects",
    },
    ...projects
      .filter((project) => project.project_ID != null)
      .map((project) => ({
        value: String(project.project_ID),
        label: `${project.project_ID} - ${
          project.project_Title || "Unnamed Project"
        }`.substring(0, 50),
      })),
  ]}
/>
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
        <div className="relative">
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

        {/* Show Entries */}
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">
            Show
          </span>

          <div className="w-20">
            <CustomSelect
              value={String(pageSize)}
              onChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
              options={PAGE_SIZE_SELECT_OPTIONS}
              placeholder="10"
            />
          </div>

          <span className="hidden text-sm text-muted-foreground sm:block">
            entries
          </span>
        </div>
      </div>
    </div>
  );
}
