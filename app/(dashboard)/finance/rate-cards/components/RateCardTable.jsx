"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { columns } from "../data";

export default function RateCardTable({ employees, department, search, }) {
  return (
    <div className="overflow-x-auto">
<table className="min-w-[1500px] w-full border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b bg-[#FCFCFD]">

            {/* Sticky Employee Header */}
            <th
  className="
    sticky left-0 z-30
    w-[250px] max-w-[250px]
    bg-[#FCFCFD]
    px-5 py-4
    text-left text-xs font-semibold uppercase tracking-wide text-gray-600
    border-r border-b border-gray-200
    shadow-[8px_0_12px_-8px_rgba(0,0,0,0.18)]
  "
>
  <div className="flex items-center justify-between">
    {columns[0].label}

    <div className="flex flex-col">
      <ChevronUp size={12} />
      <ChevronDown size={12} />
    </div>
  </div>
</th>

            {/* Remaining Headers */}
            {columns.slice(1).map((column) => (
              <th
                key={column.key}
                className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
              >
                <div className="flex items-center justify-between">
                  {column.label}

                  <div className="flex flex-col">
                    <ChevronUp size={12} />
                    <ChevronDown size={12} />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {employees.map((row, index) => (
            <tr
              key={index}
              className="border-b border-gray-400 transition hover:bg-red-50/30"
            >

              {/* Sticky Employee Column */}
              <td
  className="
    sticky left-0 z-20
    w-[250px] max-w-[250px]
    bg-white
    px-5 py-5
    border-r border-b border-gray-200
    shadow-[8px_0_12px_-8px_rgba(0,0,0,0.18)]
  "
>
  <div className="flex items-center gap-3">

    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 font-semibold text-[#E12729]">
      {row.employee
        .split(" ")
        .map((n) => n[0])
        .join("")}
    </div>

    <div className="min-w-0">
      <p className="truncate font-semibold text-gray-900">
        {row.employee}
      </p>

      <div className="mt-1 flex items-center gap-1 text-xs text-[#E12729]">
        <span className="truncate text-gray-500">
          {row.designation}
        </span>
         
        <span className="text-gray-300"></span>
        
        <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-[#E12729] ring-1 ring-red-200">
  #{row.empId}
</span>
      </div>
    </div>

  </div>
</td>
              {/* Remaining Columns */}
              {columns.slice(1).map((column) => (
                <td
  key={column.key}
  className="whitespace-nowrap px-5 py-5 text-sm text-gray-700 border-b border-gray-200"
>
  {row[column.key]}
</td>
              ))}

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}