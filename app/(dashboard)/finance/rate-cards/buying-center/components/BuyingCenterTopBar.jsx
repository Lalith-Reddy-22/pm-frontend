"use client";

import { Search, ChevronDown, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BuyingCenterTopBar({
  search,
  setSearch,
  pageSize,
  setPageSize,
  onAdd,
}) {
  const router = useRouter();
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

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Show</span>

          <div className="relative">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-10 appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-8 text-sm outline-none"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            />
          </div>

          <span>entries</span>
        </div>

        <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Download size={16} />
          Export
          <ChevronDown size={16} />
        </button>

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