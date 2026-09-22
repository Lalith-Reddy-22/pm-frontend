"use client";

import { CalendarDays, Download, Bell } from "lucide-react";

export default function EmployeeHeader({
  employee,
  dateFilter,
  setDateFilter,
}) {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

      {/* Left */}
      <div>
        {/* <p className="text-sm font-medium text-gray-500">
          Employee / Dashboard
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1> */}

        <p className="mt-2 text-gray-500">
          Welcome back,
          <span className="font-semibold text-red-600">
            {" "}
            {employee?.name}
          </span>
          👋
        </p>
      </div>

    </div>
  );
}