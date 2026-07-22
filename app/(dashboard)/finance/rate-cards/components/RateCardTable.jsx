"use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import { columns } from "../data";

export default function RateCardTable({ employees, department, search, }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[1500px] w-full border-separate border-spacing-0">

        {/* Header */}
        <thead>
          <tr className="border-b bg-[#FCFCFD]">

            {/* Sticky Employee Header */}
            <th
              className="sticky left-0 z-30 min-w-[250px] bg-[#FCFCFD] shadow-r px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
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
              className="border-b transition hover:bg-red-50/30"
            >

              {/* Sticky Employee Column */}
              <td className="sticky left-0 z-20 min-w-[320px] bg-white px-5 py-5">
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

      <div className="mt-1 flex items-center gap-2 text-xs text-[#E12729]">
        <span>#{row.empId}</span>

        <span className="text-gray-300"></span>

        <span className="truncate text-gray-500">
          {row.designation}
        </span>
      </div>
    </div>

  </div>
</td>
              {/* Remaining Columns */}
              {columns.slice(1).map((column) => (
                <td
                  key={column.key}
                  className="whitespace-nowrap px-5 py-5 text-sm text-gray-700"
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