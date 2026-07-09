"use client";

import { Search, ChevronDown, Upload } from "lucide-react";
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
    <div className="flex flex-wrap items-center justify-between gap-4 mt-2 bg-white p-5">

      {/* Left */}
      <div className="flex items-center gap-3">

        <span className="text-sm font-medium text-gray-600">
          Search:
        </span>

        <div className="relative">

          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Project Name or Code"
            className="w-72 rounded-lg border border-gray-300 py-2 pl-10 pr-3 outline-none focus:border-red-500"
          />

        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        <span className="text-sm text-gray-600">
          Show
        </span>

        <div className="relative">

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-8"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>

          <ChevronDown
            size={15}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          />

        </div>

        <span className="text-sm text-gray-600">
          entries
        </span>

        <button className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 hover:bg-gray-100">
          <Upload size={16} />
          Export
          <ChevronDown size={15} />
        </button>

        <ViewToggle
  view={view}
  setView={setView}
/>

        {/* <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-lg bg-[#2f2f2f] px-5 py-2 text-white hover:bg-black"
        >
          <Plus size={16} />
          Add Project
        </button> */}

      </div>

    </div>
  );
}