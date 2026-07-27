"use client";

import { CalendarDays, Download } from "lucide-react";

export default function EmployeeHeader({
  employee,
  dateFilter,
  setDateFilter,
}) {
  return (
    <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Left */}
      <div>
        <p className="text-sm text-gray-500">
          Employee / Dashboard
        </p>

        <h1 className="mt-1 text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-base text-gray-500">
          Welcome back,
          <span className="ml-1 font-semibold text-red-600">
            {employee?.name}
          </span>
          👋
        </p>
      </div>

      {/* Right */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 shadow-sm">
          <CalendarDays
            size={18}
            className="text-red-600"
          />

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-sm font-medium outline-none"
          >
            <option value="7">Last 7 Days</option>
            <option value="15">Last 15 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 3 Months</option>
          </select>
        </div>
      </div>
    </div>
  );
}