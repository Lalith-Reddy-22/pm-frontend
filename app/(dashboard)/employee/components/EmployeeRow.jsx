"use client";

import Link from "next/link";
import { initials, STATUS_STYLES } from "../data";

export default function EmployeeRow({
  emp,
  border,
  avatar,
  t,
  isDark,
}) {
  const isInactive = emp.status === "Inactive";

  return (
    <tr className={`group border-b border-border transition-colors ${isInactive ? "bg-slate-100 text-slate-500 dark:bg-slate-950/60 dark:text-slate-400" : "bg-card hover:bg-accent/30"}`}>
      <td className="px-6 py-3">
        <Link
          href={`/employee/${emp.id}`}
          className="group flex w-fit items-center gap-3"
        >
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatar}`}
          >
            {initials(emp.name)}
          </div>

          <div className="min-w-0">
            <p className={`truncate text-sm font-semibold transition-colors ${isInactive ? "text-slate-600 dark:text-slate-400" : t.textPrimary}`}>
              {emp.name}
            </p>
            <p className={`truncate text-xs ${isInactive ? "text-slate-500 dark:text-slate-500" : t.textMuted}`}>
              {emp.email}
            </p>
          </div>
        </Link>
      </td>

      {/* Designation */}

      <td className={`px-6 py-3 text-sm ${t.textSecondary}`}>
        {emp.designation}
      </td>

      {/* Team */}

      <td className={`px-6 py-3 text-sm ${t.textSecondary}`}>
        {emp.team}
      </td>

      {/* Type */}

      <td className={`px-6 py-3 text-sm ${t.textSecondary}`}>
        {emp.type}
      </td>

      {/* Date */}

      <td className={`px-6 py-3 whitespace-nowrap text-sm ${t.textSecondary}`}>
        {emp.createdDate}
      </td>

      {/* Status */}

      <td className="px-6 py-3">
        <span
          className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide whitespace-nowrap w-[130px] ${
            emp.status === "Active"
              ? "bg-[#E3ECFC] text-[#1A3A6B] dark:bg-[#1E293B] dark:text-[#38BDF8]"
              : "bg-[#F1F2F4] text-[#3B3F4A] dark:bg-[#27272A] dark:text-[#D4D4D8]"
          }`}
        >
          {emp.status}
        </span>
      </td>
    </tr>
  );
}