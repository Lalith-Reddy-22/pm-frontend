"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProjectDetailsModal({
  open,
  onClose,
  project,
  tasks = [],
  loading = false,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const projectTitle =
    project?.projectTitle ??
    project?.project_Title ??
    project?.projectName ??
    project?.project_Name ??
    "Project";

  const formatDisplayNumber = (value) => {
    if (value === null || value === undefined || value === "") return "—";
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric.toFixed(1) : value;
  };

  const filteredTasks = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return tasks;

    return tasks.filter((task) => {
      const haystack = [task.taskId, task.taskTitle, task.clientTitle, task.employee]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(searchText);
    });
  }, [tasks, search]);

  const total = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + pageSize);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="flex h-[85vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-[18px] font-semibold text-foreground">
            Project Title : {projectTitle}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg border border-border p-2 text-gray-600 hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Search:</label>
            <input
              value={search}
              onChange={handleSearchChange}
              className="h-10 w-72 rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20"
              placeholder="Search by task..."
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="h-10 rounded-md border border-border bg-white px-3 text-sm outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
            <span className="text-sm text-muted-foreground">entries</span>

            <button
              type="button"
              className="ml-4 inline-flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Export ▾
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-[#f2f2f2]">
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Task ID
                </th>
                <th className="min-w-[320px] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Task Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Planned Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Actual Hours
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Difference
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Client Title
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedTasks.length > 0 ? (
                paginatedTasks.map((task, index) => {
                  const planned = Number(task.planned ?? 0);
                  const actual = Number(task.actual ?? 0);
                  const difference = actual - planned;

                  return (
                    <tr key={task.taskId ?? `${task.taskTitle}-${index}`} className="border-b border-border hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{task.taskId ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{task.taskTitle || "—"}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-center">{formatDisplayNumber(task.planned)}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-center">{formatDisplayNumber(task.actual)}</td>
                      <td className="px-4 py-3 text-sm text-foreground text-center">{formatDisplayNumber(difference)}</td>
                      <td className="px-4 py-3 text-sm text-foreground">{task.clientTitle || "—"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    {search ? "No tasks found for your search." : "No tasks found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-white px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Showing {total === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + pageSize, total)} of {total} entries
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-8 min-w-[32px] rounded-md border px-2 text-sm ${
                  pageNumber === currentPage
                    ? "border-[#E12729] bg-[#E12729] text-white"
                    : "border-border bg-white text-foreground"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="rounded-md border border-border bg-white px-3 py-1.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
