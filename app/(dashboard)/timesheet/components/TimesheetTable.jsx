"use client";

import TaskRowPair from "./TaskRowPair";
import TimesheetPagination from "./TimesheetPagination";

export default function TimesheetTable({
  pageRows,
  weekDates,
  border,
  headerBg,
  rowLabelColor,
  inputBg,
  t,
  isDark,
  updateActual,
  filtered,
  clampedPage,
  pageSize,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  pageNumbers,
  setPage,
  formatMDY,
}) {
  return (
    <div
      className={`flex flex-1 flex-col overflow-hidden rounded-xl border ${border} ${t.cardBg} ${t.cardShadow}`}
    >
      {/* Scrollable Table */}
      <div className="flex-1 overflow-y-auto overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead className={`sticky top-0 z-10 ${headerBg}`}>
            <tr className={`border-b ${border}`}>
              <th
                className={`w-[260px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}
              >
                Task Title
              </th>

              <th
                className={`w-[130px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}
              >
                Task Owner
              </th>

              <th
                className={`w-[70px] px-2 py-3 text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}
              />

              {weekDates.map((d, i) => (
                <th
                  key={i}
                  className={`px-3 py-3 text-center text-xs font-semibold whitespace-nowrap ${t.textMuted}`}
                >
                  {formatMDY(d)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.map((task) => (
              <TaskRowPair
                key={task.id}
                task={task}
                border={border}
                rowLabelColor={rowLabelColor}
                inputBg={inputBg}
                t={t}
                isDark={isDark}
                onActualChange={updateActual}
              />
            ))}

            {pageRows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className={`px-4 py-10 text-center text-sm ${t.textMuted}`}
                >
                  No tasks match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <TimesheetPagination
  startIndex={startIndex}
  endIndex={endIndex}
  totalItems={totalItems}
  page={clampedPage}
  pageNumbers={pageNumbers}
  totalPages={totalPages}
  hasPrev={hasPrev}
  hasNext={hasNext}
  prevPage={prevPage}
  nextPage={nextPage}
  setPage={setPage}
  border={border}
  t={t}
/>
    </div>
  );
}