"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../../context/ThemeContext";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";
import { useAllAssetRequests } from "@/hooks/useAssets";
import { updateAssetRequestStatus, addAsset } from "@/services/itAssetService";

// ── Status map ────────────────────────────────────────────────────────────────
// API may return numeric `status` (1/2/3) OR string `statusName` ("Request"/"Issued"/"Returned")
const STATUS_LABEL = { 1: "Request", 2: "Issued", 3: "Returned" };

// Reverse lookup: statusName string → numeric key
const STATUS_NAME_TO_NUM = { Request: 1, Issued: 2, Returned: 3 };

const STATUS_STYLES = {
  1: { label: "Request",  pill: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",  dot: "bg-blue-500"  },
  2: { label: "Issued",   pill: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20", dot: "bg-green-500" },
  3: { label: "Returned", pill: "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10",           dot: "bg-gray-400"  },
};
const FALLBACK_STYLE = STATUS_STYLES[1];

/** Resolve the API record's status to a numeric key (1 | 2 | 3). */
function resolveStatus(r) {
  if (r.status != null && STATUS_STYLES[Number(r.status)]) return Number(r.status);
  if (r.statusName)                                          return STATUS_NAME_TO_NUM[r.statusName] ?? 1;
  return 1;
}

const STATUS_OPTIONS = [
  { value: 1, label: "Request"  },
  { value: 2, label: "Issued"   },
  { value: 3, label: "Returned" },
];

const COLS = ["Request ID", "Status", "Employee Name", "Item List", "Reason", "Raise Date", "Issued Date", "Taken Back Date"];

const EMPTY_FORM = { p_Id: "", product_Name: "", service_Number: "", storage: "", isActive: "1" };

/** "2026-07-20T00:00:00" → "20 Jul 2026" */
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AssetListAdmin() {
  const { t, isDark } = useTheme();
  const queryClient = useQueryClient();

  // ── API ───────────────────────────────────────────────────────────────────
  const { data: apiRequests = [], isFetching, isError } = useAllAssetRequests();

  // Optimistic status overrides: { [id]: number } — applied immediately, rolled back on error
  const [statusOverrides, setStatusOverrides] = useState({});
  // Per-row updating flag: { [id]: boolean }
  const [updatingRows, setUpdatingRows] = useState({});
  // Per-row error: { [id]: string }
  const [rowErrors, setRowErrors] = useState({});

  // ── Filters ───────────────────────────────────────────────────────────────
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | 1 | 2 | 3

  // ── Add New Device modal ──────────────────────────────────────────────────
  const [showModal, setShowModal] = useState(false);
  const [form,           setForm]           = useState(EMPTY_FORM);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [modalError,      setModalError]     = useState("");
  const [modalSuccess,    setModalSuccess]   = useState(false);

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setModalError("");
  }

  async function handleModalSubmit() {
    setModalSubmitting(true);
    setModalError("");
    try {
      await addAsset({
        p_Id:           form.p_Id.trim(),
        product_Name:   form.product_Name.trim(),
        service_Number: form.service_Number.trim(),
        storage:        form.storage.trim(),
        isActive:       String(form.isActive === "1" ? "1" : "0"),
      });
      setModalSuccess(true);
      setForm(EMPTY_FORM);
      queryClient.invalidateQueries({ queryKey: ["allAssets"] });
      setTimeout(() => { setModalSuccess(false); setShowModal(false); }, 1500);
    } catch (err) {
      console.error("addAsset failed:", err?.response?.status, err?.response?.data);
      setModalError(err?.response?.data?.message ?? "Failed to add asset. Please try again.");
    } finally {
      setModalSubmitting(false);
    }
  }

  function handleCloseModal() {
    if (modalSubmitting) return;
    setShowModal(false);
    setForm(EMPTY_FORM);
    setModalError("");
    setModalSuccess(false);
  }

  async function updateStatus(requestId, newStatus) {
    const numStatus = Number(newStatus);
    const prevStatus = statusOverrides[requestId] ?? resolveStatus(apiRequests.find(r => r.request_Id === requestId) ?? {});

    // Optimistic update — keyed by request_Id (always present and unique)
    setStatusOverrides(prev => ({ ...prev, [requestId]: numStatus }));
    setUpdatingRows(prev => ({ ...prev, [requestId]: true }));
    setRowErrors(prev => ({ ...prev, [requestId]: "" }));

    try {
      await updateAssetRequestStatus({ reqId: requestId, status: numStatus });
      // Invalidate all three so Assets Management, My Request, and Asset List all update
      queryClient.invalidateQueries({ queryKey: ["allAssetRequests"] });
      queryClient.invalidateQueries({ queryKey: ["allAssets"] });
      queryClient.invalidateQueries({ queryKey: ["myAssetRequests"] });
    } catch (err) {
      console.error("updateAssetRequestStatus failed:", err?.response?.status, err?.response?.data, err?.message);
      // Roll back on failure
      setStatusOverrides(prev => ({ ...prev, [requestId]: prevStatus }));
      setRowErrors(prev => ({ ...prev, [requestId]: "Update failed" }));
      // Auto-clear error after 3 s
      setTimeout(() => setRowErrors(prev => ({ ...prev, [requestId]: "" })), 3000);
    } finally {
      setUpdatingRows(prev => ({ ...prev, [requestId]: false }));
    }
  }

  // ── Derived list (apply local overrides, then filter) ────────────────────
  // Keyed by request_Id (always present) to avoid collisions when r.id is null/undefined
  const requests = apiRequests.map(r => ({
    ...r,
    effectiveStatus: statusOverrides[r.request_Id] ?? resolveStatus(r),
  }));

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch =
      r.request_Id?.toLowerCase().includes(q) ||
      r.empName?.toLowerCase().includes(q) ||
      r.itemList?.toLowerCase().includes(q) ||
      r.reason?.trim().toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.effectiveStatus === Number(statusFilter);
    return matchSearch && matchStatus;
  });

  const headerBg = isDark ? "bg-white/[0.04]" : "bg-gray-50";
  const pagination = usePagination({ data: filtered, pageSize: 10 });

  useEffect(() => { pagination.goToPage(1); }, [search, statusFilter]);

  return (
    <div className={`overflow-hidden rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>

      {/* Header */}
      <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border">
        <div>
          <h2 className={`text-base font-semibold ${t.textPrimary}`}>Asset Requests</h2>
          <p className={`text-xs mt-0.5 ${t.textSecondary}`}>
            {isFetching ? "Loading…" : `${requests.length} total requests`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Add New Device */}
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E12729] hover:bg-[#c81f21] text-white text-xs font-semibold transition-colors"
          >
            <Plus size={13} />
            Add New Device
          </button>

          {/* Status filter pills */}
          <div className={`flex items-center gap-1 p-1 rounded-lg ${t.iconBg}`}>
            {[["all", "All"], [1, "Request"], [2, "Issued"], [3, "Returned"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === key ? "bg-[#E12729] text-white" : `${t.textSecondary} ${t.navRowHover}`
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textSecondary}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search requests..."
              className={`h-8 pl-9 pr-3 w-52 rounded-md border border-border ${t.cardBg} text-sm ${t.textPrimary} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {isFetching && apiRequests.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-16">
          <Loader2 size={20} className="animate-spin text-[#E12729]" />
          <span className={`text-sm ${t.textSecondary}`}>Loading requests…</span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mx-5 my-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={15} />
          Failed to load requests. Please try again later.
        </div>
      )}

      {/* Table */}
      {!isFetching && !isError && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b border-border ${headerBg}`}>
                {COLS.map(col => (
                  <th key={col} className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${t.textMuted}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagination.paginatedData.map((r, idx) => {
                const style = STATUS_STYLES[r.effectiveStatus] ?? FALLBACK_STYLE;
                const rowKey = r.request_Id ?? idx;
                return (
                  <tr key={rowKey} className={`border-b border-border transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-gray-50"}`}>

                    {/* Request ID */}
                    <td className={`px-5 py-3 font-mono text-xs font-semibold whitespace-nowrap ${t.textPrimary}`}>
                      {r.request_Id}
                    </td>

                    {/* Status dropdown */}
                    <td className="px-5 py-3">
                      <div className="relative inline-flex items-center">
                        <span className={`absolute left-2.5 w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <select
                          value={r.effectiveStatus}
                          onChange={e => updateStatus(r.request_Id, e.target.value)}
                          disabled={!!updatingRows[r.request_Id]}
                          style={{ backgroundColor: isDark ? "#161b22" : undefined, colorScheme: isDark ? "dark" : "light" }}
                          className={`appearance-none pl-6 pr-6 py-1 rounded-full text-xs font-semibold outline-none transition-colors ${style.pill} ${updatingRows[r.request_Id] ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                        {updatingRows[r.request_Id]
                          ? <Loader2 size={11} className="absolute right-2 animate-spin opacity-60" />
                          : <ChevronDown size={11} className="absolute right-2 pointer-events-none opacity-60" />
                        }
                      </div>
                      {rowErrors[r.request_Id] && (
                        <p className="text-[10px] text-red-500 mt-1 whitespace-nowrap">{rowErrors[r.request_Id]}</p>
                      )}
                    </td>

                    {/* Employee Name */}
                    <td className={`px-5 py-3 whitespace-nowrap ${t.textPrimary}`}>
                      {r.empName ?? "—"}
                    </td>

                    {/* Item List */}
                    <td className={`px-5 py-3 max-w-[200px] truncate ${t.textSecondary}`} title={r.itemList}>
                      {r.itemList?.trim() || "—"}
                    </td>

                    {/* Reason */}
                    <td className={`px-5 py-3 max-w-[220px] truncate ${t.textSecondary}`} title={r.reason?.trim()}>
                      {r.reason?.trim() || "—"}
                    </td>

                    {/* Dates */}
                    <td className={`px-5 py-3 whitespace-nowrap ${t.textSecondary}`}>{fmtDate(r.request_RaisedDate)}</td>
                    <td className={`px-5 py-3 whitespace-nowrap ${t.textSecondary}`}>{fmtDate(r.item_IssueDate)}</td>
                    <td className={`px-5 py-3 whitespace-nowrap ${t.textSecondary}`}>{fmtDate(r.item_TakeBackDate)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={`px-5 py-12 text-center text-sm ${t.textMuted}`}>No requests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <DataPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        hasPrev={pagination.hasPrev}
        hasNext={pagination.hasNext}
        prevPage={pagination.prevPage}
        nextPage={pagination.nextPage}
        goToPage={pagination.goToPage}
        pageNumbers={pagination.pageNumbers}
      />

      {/* Add New Device Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className={`relative w-full max-w-2xl rounded-2xl p-8 ${isDark ? "bg-[#161b22]" : "bg-white"}`}>
            <button
              onClick={handleCloseModal}
              className={`absolute top-4 right-4 p-1.5 rounded-full border ${isDark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-400 hover:bg-gray-100"} transition-colors`}
            >
              <X size={14} />
            </button>

            <h2 className={`text-lg font-semibold mb-6 ${t.textPrimary}`}>Add New Assets</h2>

            {/* Success banner */}
            {modalSuccess && (
              <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
                Asset added successfully!
              </div>
            )}

            {/* Row 1 — Product ID & Product Name */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Product ID</label>
                <input
                  value={form.p_Id}
                  onChange={e => handleFormChange("p_Id", e.target.value)}
                  placeholder="Enter a number"
                  disabled={modalSubmitting}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors disabled:opacity-60`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Product Name</label>
                <input
                  value={form.product_Name}
                  onChange={e => handleFormChange("product_Name", e.target.value)}
                  placeholder="e.g. iPad Pro"
                  disabled={modalSubmitting}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors disabled:opacity-60`}
                />
              </div>
            </div>

            {/* Row 2 — Service Number & Storage */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Service Number</label>
                <input
                  value={form.service_Number}
                  onChange={e => handleFormChange("service_Number", e.target.value)}
                  placeholder="e.g. SVC-001"
                  disabled={modalSubmitting}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors disabled:opacity-60`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Storage</label>
                <input
                  value={form.storage}
                  onChange={e => handleFormChange("storage", e.target.value)}
                  placeholder="e.g. 256GB"
                  disabled={modalSubmitting}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors disabled:opacity-60`}
                />
              </div>
            </div>

            {/* Row 3 — Is Active */}
            <div className="mb-6">
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Is Active</label>
              <div className="relative w-60">
                <select
                  value={form.isActive}
                  onChange={e => handleFormChange("isActive", e.target.value)}
                  disabled={modalSubmitting}
                  style={{ backgroundColor: isDark ? "#1c2333" : undefined, colorScheme: isDark ? "dark" : "light" }}
                  className={`w-full appearance-none h-11 pl-3 pr-8 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors disabled:opacity-60`}
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
                <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} />
              </div>
            </div>

            {/* Inline error */}
            {modalError && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={14} />
                {modalError}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleModalSubmit}
                disabled={modalSubmitting || !form.p_Id.trim() || !form.product_Name.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#E12729] hover:bg-[#c81f21] text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modalSubmitting && <Loader2 size={14} className="animate-spin" />}
                {modalSubmitting ? "Submitting…" : "Submit"}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={modalSubmitting}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-50 ${isDark ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
