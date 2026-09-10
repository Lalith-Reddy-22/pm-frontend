"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { useTheme } from "@/app/context/ThemeContext";
import { format, parseISO } from "date-fns";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

function formatDateTime(iso) {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "M/d/yyyy h:mm:ss aa");
  } catch {
    return iso;
  }
}

export default function IssueLoggedDetailsModal({ issueId, onClose }) {
  const { t } = useTheme();

  const [logs,    setLogs]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // ── search / pagination ───────────────────────────────────────────────────
  const [search,   setSearch]   = useState("");
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ── sort ──────────────────────────────────────────────────────────────────
  const [sortBy,  setSortBy]  = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // ── fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!issueId) return;
    setLoading(true);
    setError(null);
    api
      .get(`/api/v1/ticket/issue-logged-details?issueId=${issueId}`)
      .then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch((err) => setError(err.message ?? "Failed to load details."))
      .finally(() => setLoading(false));
  }, [issueId]);

  // ── filter + sort ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = q
      ? logs.filter(
          (l) =>
            l.employeeName?.toLowerCase().includes(q) ||
            l.status?.toLowerCase().includes(q) ||
            l.description?.toLowerCase().includes(q)
        )
      : logs;

    if (sortBy) {
      rows = [...rows].sort((a, b) => {
        const av = a[sortBy] ?? "";
        const bv = b[sortBy] ?? "";
        return sortDir === "asc"
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }
    return rows;
  }, [logs, search, sortBy, sortDir]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated   = filtered.slice((page - 1) * pageSize, page * pageSize);
  const startIndex  = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex    = Math.min(page * pageSize, filtered.length);

  function handleSort(col) {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  const columns = [
    { header: "Employee Name", key: "employeeName" },
    { header: "Status",        key: "status"        },
    { header: "Description",   key: "description"   },
    { header: "Date",          key: "loggedDateTime" },
  ];

  if (!issueId) return null;

  const modal = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`relative w-full max-w-4xl rounded-2xl ${t.cardBg} shadow-2xl border ${t.clientBorder} max-h-[90vh] flex flex-col`}>

          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-lg p-1.5 transition hover:bg-red-50 dark:hover:bg-red-500/10 ${t.textMuted}`}
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-4 shrink-0">
            <h2 className={`text-xl font-semibold ${t.textPrimary}`}>
              Issue Logged Details
            </h2>
          </div>

          {/* Toolbar */}
          <div className="px-8 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Show entries */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-8 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 focus:outline-none"
              >
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <span>entries</span>
            </div>

            {/* Search */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Search:</span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="h-8 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 focus:outline-none focus:border-[#E12729]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto px-8 flex-1">
            {error && (
              <p className="py-4 text-sm text-red-500">{error}</p>
            )}

            {loading ? (
              <p className="py-8 text-center text-sm text-gray-400">Loading…</p>
            ) : (
              <table className="min-w-full border-collapse">
                <thead className="border-y bg-gray-50">
                  <tr>
                    {columns.map((col) => {
                      const isActive = sortBy === col.key;
                      return (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 whitespace-nowrap"
                        >
                          <button
                            type="button"
                            onClick={() => handleSort(col.key)}
                            className="flex items-center gap-1.5"
                          >
                            {col.header}
                            <span className="flex flex-col text-[10px] text-gray-400">
                              <ChevronUp
                                size={11}
                                className={isActive && sortDir === "asc" ? "text-[#E12729]" : ""}
                              />
                              <ChevronDown
                                size={11}
                                className={isActive && sortDir === "desc" ? "text-[#E12729]" : ""}
                              />
                            </span>
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">
                        No records found
                      </td>
                    </tr>
                  ) : (
                    paginated.map((log, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-800">{log.employeeName ?? "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{log.status ?? "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-800">{log.description ?? "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">{formatDateTime(log.loggedDateTime)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Footer — showing X to Y of Z + pagination */}
          <div className="px-8 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              {filtered.length === 0
                ? "No entries"
                : `Showing ${startIndex} to ${endIndex} of ${filtered.length} entries`}
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition
                    ${n === page
                      ? "bg-[#E12729] text-white"
                      : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
}
