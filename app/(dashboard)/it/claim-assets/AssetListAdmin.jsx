"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, Plus, X } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";

const INITIAL_REQUESTS = [
  { id: "MTHA4786", status: "Request",  empName: "Srajan Shetty",       itemList: "One plus R 5G",                          reason: "verification",                                              raiseDate: "2026-05-04", issuedDate: "2026-05-04", takenBackDate: "2026-05-04" },
  { id: "MTHA4785", status: "Active",   empName: "Anushree S Shenoy",   itemList: "Ipad pro 5G (MHC-007), Ipad Chargers",    reason: "AMI Consolidation app review",                               raiseDate: "2026-05-04", issuedDate: "2026-05-04", takenBackDate: null        },
  { id: "MTHA4784", status: "Returned", empName: "Simran Kumari",        itemList: "IPAD PRO (MHC-004)",                      reason: "MedTrix Sandbox review of the MAT-US-ELA-00728-v2.",          raiseDate: "2026-04-30", issuedDate: "2026-05-04", takenBackDate: null        },
  { id: "MTHA4783", status: "Returned", empName: "Shanmuga Priyan",      itemList: "IPAD PRO (MHC-004)",                      reason: "AMI app review",                                             raiseDate: "2026-04-29", issuedDate: "2026-04-29", takenBackDate: "2026-04-29" },
  { id: "MTHA4782", status: "Returned", empName: "Anushree S Shenoy",   itemList: "Ipad Chargers",                           reason: "AMI consolidation app MR",                                   raiseDate: "2026-04-28", issuedDate: "2026-04-28", takenBackDate: "2026-04-29" },
];

const STATUS_STYLES = {
  Request:  { pill: "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",  dot: "bg-blue-500"  },
  Active:   { pill: "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20", dot: "bg-green-500" },
  Returned: { pill: "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10",           dot: "bg-gray-400"  },
};

const STATUS_OPTIONS = ["Request", "Active", "Returned"];

const COLS = ["Request ID", "Status", "Employee Name", "Item List", "Reason", "Raise Date", "Issued Date", "Taken Back Date"];

const PRODUCT_OPTIONS = ["iPad Pro", "iPhone 15", "MacBook Pro", "OnePlus R 5G", "Samsung Galaxy"];
const EMPTY_FORM = { productName: "", productDetail: "", serviceName: "", storage: "", activeState: "No" };

export default function AssetListAdmin() {
  const { t, isDark } = useTheme();
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    setShowModal(false);
    setForm(EMPTY_FORM);
  }

  function updateStatus(id, newStatus) {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  }

  const filtered = requests.filter(r => {
    const matchSearch =
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.empName.toLowerCase().includes(search.toLowerCase()) ||
      r.itemList.toLowerCase().includes(search.toLowerCase()) ||
      r.reason.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
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
          <p className={`text-xs mt-0.5 ${t.textSecondary}`}>{INITIAL_REQUESTS.length} total requests</p>
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
            {[["all", "All"], ["Request", "Request"], ["Active", "Active"], ["Returned", "Returned"]].map(([key, label]) => (
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b border-border ${headerBg}`}>
              {COLS.map(col => (
                <th key={col} className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide whitespace-nowrap ${t.textMuted}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pagination.paginatedData.map(r => (
              <tr key={r.id} className={`border-b border-border transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-gray-50"}`}>
                <td className={`px-5 py-3 font-mono text-xs font-semibold ${t.textPrimary}`}>{r.id}</td>
                <td className="px-5 py-3">
                  <div className="relative inline-flex items-center">
                    <span className={`absolute left-2.5 w-1.5 h-1.5 rounded-full ${STATUS_STYLES[r.status].dot}`} />
                    <select
                      value={r.status}
                      onChange={e => updateStatus(r.id, e.target.value)}
                      style={{ backgroundColor: isDark ? "#161b22" : undefined, colorScheme: isDark ? "dark" : "light" }}
                      className={`appearance-none pl-6 pr-6 py-1 rounded-full text-xs font-semibold cursor-pointer outline-none transition-colors ${STATUS_STYLES[r.status].pill}`}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2 pointer-events-none opacity-60" />
                  </div>
                </td>
                <td className={`px-5 py-3 whitespace-nowrap ${t.textPrimary}`}>{r.empName}</td>
                <td className={`px-5 py-3 max-w-[200px] ${t.textSecondary}`}>{r.itemList}</td>
                <td className={`px-5 py-3 max-w-[220px] ${t.textSecondary}`}>{r.reason}</td>
                <td className={`px-5 py-3 whitespace-nowrap ${t.textSecondary}`}>{r.raiseDate}</td>
                <td className={`px-5 py-3 whitespace-nowrap ${t.textSecondary}`}>{r.issuedDate}</td>
                <td className={`px-5 py-3 whitespace-nowrap ${t.textSecondary}`}>{r.takenBackDate ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className={`px-5 py-12 text-center text-sm ${t.textMuted}`}>No requests found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
            {/* Close X */}
            <button
              onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
              className={`absolute top-4 right-4 p-1.5 rounded-full border ${isDark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-400 hover:bg-gray-100"} transition-colors`}
            >
              <X size={14} />
            </button>

            <h2 className={`text-lg font-semibold mb-6 ${t.textPrimary}`}>Add New Assets</h2>

            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Product Name</label>
                <div className="relative">
                  <select
                    value={form.productName}
                    onChange={e => handleFormChange("productName", e.target.value)}
                    style={{ backgroundColor: isDark ? "#1c2333" : undefined, colorScheme: isDark ? "dark" : "light" }}
                    className={`w-full appearance-none h-11 pl-3 pr-8 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
                  >
                    <option value=""></option>
                    {PRODUCT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} />
                </div>
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Product Detail</label>
                <input
                  value={form.productDetail}
                  onChange={e => handleFormChange("productDetail", e.target.value)}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Service Name</label>
                <input
                  value={form.serviceName}
                  onChange={e => handleFormChange("serviceName", e.target.value)}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
                />
              </div>
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Storage</label>
                <input
                  value={form.storage}
                  onChange={e => handleFormChange("storage", e.target.value)}
                  className={`w-full h-11 px-3 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
                />
              </div>
            </div>

            {/* Row 3 — Active State */}
            <div className="mb-8">
              <label className={`block text-xs font-semibold uppercase tracking-wide mb-1.5 ${t.textMuted}`}>Active State:</label>
              <div className="relative w-60">
                <select
                  value={form.activeState}
                  onChange={e => handleFormChange("activeState", e.target.value)}
                  style={{ backgroundColor: isDark ? "#1c2333" : undefined, colorScheme: isDark ? "dark" : "light" }}
                  className={`w-full appearance-none h-11 pl-3 pr-8 rounded-lg border border-border text-sm ${t.textPrimary} ${isDark ? "bg-[#1c2333]" : "bg-gray-50"} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
                <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textMuted}`} />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg bg-[#E12729] hover:bg-[#c81f21] text-white text-sm font-semibold transition-colors"
              >
                Submit
              </button>
              <button
                onClick={() => { setShowModal(false); setForm(EMPTY_FORM); }}
                className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition-colors ${isDark ? "border-white/10 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
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
