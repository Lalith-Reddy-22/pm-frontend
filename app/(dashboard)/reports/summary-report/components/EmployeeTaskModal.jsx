"use client";

import { X, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import DataPagination from "@/components/DataPagination";

export default function EmployeeTaskModal({
  open,
  onOpenChange,
  employee,
}) {
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [showExport, setShowExport] = useState(false);

  if (!open || !employee) return null;

  // Temporary sample data
  const rows = [
    {
      id: 3965,
      title: "Addressing fixes to the build",
      start: "10-11-23",
      end: "10-11-23",
      actual: 8,
      planned: 8,
      tasks: 1,
    },
    {
      id: 4080,
      title: "Weekly status call with Neilda_November",
      start: "10-11-23",
      end: "17-11-23",
      actual: 0,
      planned: 1,
      tasks: 6,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
<div className="flex h-[85vh] w-full max-w-7xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl mt-4">
            Employee Name :
            <span className="ml-2 text-black-400">
              {employee.name}
            </span>
          </h2>

          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
<div className="relative z-20 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Search:</span>

            <div className="flex items-center rounded-md border px-2">
              <Search size={16} className="text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-2 py-2 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div>
              Show
              <select
                className="mx-2 rounded border px-2 py-1"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option>5</option>
                <option>10</option>
                <option>20</option>
              </select>
              entries
            </div>

            <div className="relative">
  <button
    onClick={() => setShowExport(!showExport)}
    className="flex items-center gap-2 rounded-md border bg-white px-4 py-2 hover:bg-gray-50"
  >
    Export
    <ChevronDown size={16} />
  </button>

  {showExport && (
<div className="absolute right-0 top-full mt-2 z-[9999] w-40 rounded-md border bg-white shadow-xl">      <button
        onClick={() => {
          setShowExport(false);
          console.log("Export Excel");
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export Excel
      </button>

      <button
        onClick={() => {
          setShowExport(false);
          console.log("Export CSV");
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export CSV
      </button>

      <button
        onClick={() => {
          setShowExport(false);
          console.log("Export PDF");
        }}
        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
      >
        Export PDF
      </button>
    </div>
  )}
</div>
          </div>

        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">

          <table className="w-full">

            <thead className="sticky top-0 bg-[#F2F2F2]">
              <tr className="border-b text-left text-sm">

                {[
                  "Task ID",
                  "Task Title",
                  "Start Date",
                  "End Date",
                  "Actual Hours",
                  "Planned Hours",
                  "Tasks",
                ].map((item) => (
                  <th key={item} className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {item}

                      <div className="flex flex-col">
                        <ChevronUp size={12} />
                        <ChevronDown size={12} />
                      </div>
                    </div>
                  </th>
                ))}

              </tr>
            </thead>

            <tbody>

              {rows.map((row) => (
                <tr key={row.id} className="border-b">

                  <td className="px-5 py-4">{row.id}</td>

                  <td className="px-5 py-4">{row.title}</td>

                  <td className="px-5 py-4">{row.start}</td>

                  <td className="px-5 py-4">{row.end}</td>

                  <td className="px-5 py-4">{row.actual}</td>

                  <td className="px-5 py-4">{row.planned}</td>

                  <td className="px-5 py-4">{row.tasks}</td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">

          <DataPagination
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            total={34}
            totalPages={7}
          />

        </div>

      </div>
    </div>
  );
}