 "use client";

import { ChevronUp, ChevronDown } from "lucide-react";
import EmployeeRow from "./EmployeeRow";
import EmployeePagination from "./EmployeePagination";

export default function EmployeeTable({
  pageRows,
  border,
  headerBg,
  t,
  isDark,
  avatar,
  filtered,
  clampedPage,
  pageSize,
  totalPages,
  setPage,

  COLUMNS,
  sort,
  toggleSort,
}) {
  return (
    <div className="space-y-3">
      <div className="overflow-auto max-h-[65vh] m-0">
        <table className="w-full min-w-225 border-collapse text-sm">
          <thead className="sticky top-0 z-10">
            <tr className={`${headerBg} border-b ${border}`}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted} ${col.sortable ? "cursor-pointer select-none" : ""}`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="inline-flex flex-col -space-y-1">
                        <ChevronUp
                          size={11}
                          className={sort.key === col.key && sort.dir === "asc" ? (isDark ? "text-red-400" : "text-red-600") : "opacity-40"}
                        />
                        <ChevronDown
                          size={11}
                          className={sort.key === col.key && sort.dir === "desc" ? (isDark ? "text-red-400" : "text-red-600") : "opacity-40"}
                        />
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((emp) => (
              <EmployeeRow
                key={emp.id}
                emp={emp}
                border={border}
                avatar={avatar}
                t={t}
                isDark={isDark}
              />
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className={`px-6 py-10 text-center text-sm ${t.textMuted}`}>
                  No employees match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <EmployeePagination
        filtered={filtered}
        clampedPage={clampedPage}
        pageSize={pageSize}
        totalPages={totalPages}
        setPage={setPage}
        border={border}
        t={t}
      />
    </div>
  );
}