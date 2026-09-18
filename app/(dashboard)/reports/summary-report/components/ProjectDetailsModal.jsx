"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import DataPagination from "@/components/DataPagination";

export default function ProjectDetailsModal({
  open,
  onClose,
  project,
  tasks = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ---------------------------------------------
  // SEARCH
  // ---------------------------------------------
 const filteredTasks = useMemo(() => {
  const searchText = search.trim().toLowerCase();

  if (!searchText) {
    return tasks;
  }

  return tasks.filter((task) => {
    return (
      String(task.taskId ?? "")
        .toLowerCase()
        .includes(searchText) ||

      String(task.taskTitle ?? "")
        .toLowerCase()
        .includes(searchText) ||

      String(task.employee ?? "")
        .toLowerCase()
        .includes(searchText) ||

      String(task.startDate ?? "")
        .toLowerCase()
        .includes(searchText) ||

      String(task.endDate ?? "")
        .toLowerCase()
        .includes(searchText) ||

      String(task.status ?? "")
        .toLowerCase()
        .includes(searchText)
    );
  });
}, [tasks, search]);

  // ---------------------------------------------
  // PAGINATION
  // ---------------------------------------------
  const total = filteredTasks.length;

  const totalPages = Math.max(
    1,
    Math.ceil(total / pageSize)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * pageSize;

  const paginatedTasks = filteredTasks.slice(
    startIndex,
    startIndex + pageSize
  );

  // ---------------------------------------------
  // SEARCH CHANGE
  // ---------------------------------------------
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // ---------------------------------------------
  // PAGE SIZE CHANGE
  // ---------------------------------------------
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  // ---------------------------------------------
  // EARLY RETURN MUST BE AFTER ALL HOOKS
  // ---------------------------------------------
  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="flex h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b px-6 py-5">
          <div>
            <div className="mt-2 flex gap-8 text-sm text-muted-foreground">
              <span>
                <strong>Project Code:</strong>{" "}
                {project.projectCode || "—"}
              </span>

              <span>
                <strong>Total Tasks:</strong>{" "}
                {tasks.length}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
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
              onChange={handleSearchChange}
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
                onChange={handlePageSizeChange}
                className="h-10 rounded-md border px-3"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>

              <span className="text-sm">
                entries
              </span>
            </div>

            {/* <button className="rounded-md border px-4 py-2 hover:bg-muted">
              Export
            </button> */}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr className="border-b bg-muted/40 text-left">
                <th className="px-4 py-3">Task ID</th>

                <th className="min-w-[320px] px-4 py-3">
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
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task, index) => (
                  <tr
                    key={
                      task.taskId ??
                      `${task.taskTitle}-${index}`
                    }
                    className="border-b hover:bg-muted/20"
                  >
                    <td className="px-4 py-3">
                      {task.taskId ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      {task.taskTitle || "—"}
                    </td>

                    <td className="px-4 py-3">
                      {task.employee || "—"}
                    </td>

                    <td className="px-4 py-3">
                      {task.startDate || "—"}
                    </td>

                    <td className="px-4 py-3">
                      {task.endDate || "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {task.planned ?? "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {task.actual ?? "—"}
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
                        {task.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    {search
                      ? "No tasks found for your search."
                      : "No tasks found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t px-6 py-4">
          <DataPagination
            page={currentPage}
            setPage={setPage}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
          />
        </div>

      </div>
    </div>
  );
}