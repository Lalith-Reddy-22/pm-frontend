"use client";

import ProjectRow from "./ProjectRow";

export default function EmployeeProjectsTable({
  pageRows,
  border,
  isDark,
  t,
}) {
  return (
    <>
      {pageRows.length > 0 ? (
        <div className="overflow-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className={isDark ? "bg-white/[0.04]" : "bg-gray-50"}>
                <th className={`px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}>
                  Project
                </th>

                <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}>
                  Total Task
                </th>

                <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}>
                  Progress
                </th>

                <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}>
                  Actual Hours
                </th>
              </tr>
            </thead>

            <tbody>
  {pageRows.map(({ proj, visuals }) => (
    <ProjectRow
      key={proj.id}
      proj={proj}
      visuals={visuals}
      border={border}
      isDark={isDark}
      t={t}
    />
  ))}
</tbody>
          </table>
        </div>
      ) : (
        <p className={`px-6 py-8 text-center text-sm ${t.textMuted}`}>
          Not currently assigned to any projects.
        </p>
      )}
    </>
  );
}