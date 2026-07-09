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
  return (
    <tr
      className={`border-b ${border} ${
        isDark
          ? "hover:bg-white/[0.03]"
          : "hover:bg-gray-50"
      } transition-colors`}
    >
      {/* Employee */}

      <td className="px-4 py-3">
        <Link
          href={`/employee/${emp.id}`}
          className="group flex w-fit items-center gap-3"
        >
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatar}`}
          >
            {initials(emp.name)}
          </div>

          <div className="min-w-0">
            <p
              className={`truncate text-sm font-medium ${t.textPrimary}
              ${
                isDark
                  ? "group-hover:text-red-400"
                  : "group-hover:text-red-600"
              }`}
            >
              {emp.name}
            </p>

            <p className={`truncate text-xs ${t.textMuted}`}>
              {emp.email}
            </p>
          </div>
        </Link>
      </td>

      {/* Designation */}

      <td className={`px-4 py-3 text-sm ${t.textSecondary}`}>
        {emp.designation}
      </td>

      {/* Team */}

      <td className={`px-4 py-3 text-sm ${t.textSecondary}`}>
        {emp.team}
      </td>

      {/* Type */}

      <td className={`px-4 py-3 text-sm ${t.textSecondary}`}>
        {emp.type}
      </td>

      {/* Date */}

      <td
        className={`px-4 py-3 whitespace-nowrap text-sm ${t.textSecondary}`}
      >
        {emp.createdDate}
      </td>

      {/* Status */}

      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
            STATUS_STYLES[emp.status]
          }`}
        >
          {emp.status}
        </span>
      </td>
    </tr>
  );
}