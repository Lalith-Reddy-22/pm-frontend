"use client";

import { useEffect, useState } from "react";
import { Search, Upload, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ExportDropdown from "@/app/(dashboard)/employee/components/ExportDropdown";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function ProjectToolbar({
  search,
  setSearch,
  pageSize,
  setPageSize,
  setPage,
  view,
  setView,
  onExport,
}) {
  const router = useRouter();
  const [role, setRole] = useState("admin");
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    setRole(sessionStorage.getItem("role") || "admin");
  }, []);

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

      {/* ── Right: Export + Add Project ── */}
      <div className="flex flex-wrap items-center gap-2">
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

        {role !== "pm_employee" && (
          <Button
            type="button"
            onClick={() => router.push("/project/add-project")}
            className="gap-2 bg-[#E12729] text-white text-sm hover:bg-[#c81f21] border-[#E12729] cursor-pointer"
          >
            + Add Project
          </Button>
        )}
      </div>

    </div>
  );
}