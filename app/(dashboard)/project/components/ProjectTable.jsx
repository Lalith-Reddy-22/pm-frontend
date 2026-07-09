"use client";

import ProjectRow from "./ProjectRow";

export default function ProjectTable() {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">

        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>

            <th className="w-14 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Status
            </th>

            <th className="w-14 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Edit
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
              Project Name
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Start Date
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              End Date
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
              Outsource Value
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">
              Total PO Value
            </th>

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600">
              Create Date
            </th>

          </tr>
        </thead>

        <tbody>

          <ProjectRow />

          <ProjectRow />

          <ProjectRow />

          <ProjectRow />

          <ProjectRow />

        </tbody>

      </table>
    </div>
  );
}