"use client";

import { X } from "lucide-react";
import { useState } from "react";
import DataPagination from "@/components/DataPagination";

export default function ProjectDetailsModal({
  open,
  onOpenChange,
  project,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  if (!open || !project) return null;

  // Temporary data
  const tasks = [
    {
      taskId: 10586,
      taskTitle: "Learning and Upskilling Frontend Team",
      employee: "Bharathkumar",
      startDate: "21/03/24",
      endDate: "31/12/26",
      planned: 8,
      actual: 6,
      status: "In Progress",
    },
    {
      taskId: 10587,
      taskTitle: "Backend API Development",
      employee: "Stalin Blazy",
      startDate: "22/03/24",
      endDate: "05/04/24",
      planned: 6,
      actual: 4,
      status: "Pending",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <div className="flex h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5">

          <div>
            {/* <h2 className="text-2xl font-semibold">
              {project.projectTitle}
            </h2> */}

            <div className="mt-2 flex gap-8 text-sm text-muted-foreground">
              <span>
                <strong>Project Code:</strong> {project.projectCode}
              </span>

              <span>
                <strong>Total Tasks:</strong> {tasks.length}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg border p-2 hover:bg-muted"
          >
            <X size={18} />
          </button>

        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b px-6 py-4">

          <div className="flex items-center gap-2">

            <label className="text-sm">
              Search:
            </label>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-72 rounded-md border px-3 outline-none"
              placeholder="Task title..."
            />

          </div>

          <div className="flex items-center gap-5">

            <div className="flex items-center gap-2">

              <span className="text-sm">
                Show
              </span>

              <select
                value={pageSize}
                onChange={(e) =>
                  setPageSize(Number(e.target.value))
                }
                className="h-10 rounded-md border px-3"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>

              <span className="text-sm">
                entries
              </span>

            </div>

            <button className="rounded-md border px-4 py-2 hover:bg-muted">
              Export
            </button>

          </div>

        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">

          <table className="w-full border-collapse">

            <thead className="sticky top-0 bg-white z-10">

              <tr className="border-b bg-muted/40 text-left">

                <th className="px-4 py-3">Task ID</th>

                <th className="px-4 py-3 min-w-[320px]">
                  Task Title
                </th>

                <th className="px-4 py-3">
                  Employee
                </th>

                <th className="px-4 py-3">
                  Start Date
                </th>

                <th className="px-4 py-3">
                  End Date
                </th>

                <th className="px-4 py-3 text-center">
                  Planned
                </th>

                <th className="px-4 py-3 text-center">
                  Actual
                </th>

                <th className="px-4 py-3">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {tasks.map((task) => (

                <tr
                  key={task.taskId}
                  className="border-b hover:bg-muted/20"
                >

                  <td className="px-4 py-3">
                    {task.taskId}
                  </td>

                  <td className="px-4 py-3">
                    {task.taskTitle}
                  </td>

                  <td className="px-4 py-3">
                    {task.employee}
                  </td>

                  <td className="px-4 py-3">
                    {task.startDate}
                  </td>

                  <td className="px-4 py-3">
                    {task.endDate}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {task.planned}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {task.actual}
                  </td>

                  <td className="px-4 py-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        task.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "In Progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {task.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">

          <DataPagination
            page={page}
            setPage={setPage}
            pageSize={pageSize}
            total={tasks.length}
            totalPages={1}
          />

        </div>

      </div>

    </div>
  );
}