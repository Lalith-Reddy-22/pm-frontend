"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, CheckCircle, LayoutGrid, List, Loader2, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAllAssets } from "@/hooks/useAssets";
import { raiseAssetRequest } from "@/services/itAssetService";
import AssetGridCard from "./AssetGridCard";
import AssetListRow  from "./AssetListRow";
import MyRequests    from "./MyRequests";
import MaxSelectionModal from "./MaxSelectionModal";
import AssetListAdmin from "./AssetListAdmin";
import { useTheme } from "../../../context/ThemeContext";

const MAX = 5;

export default function ClaimAssetsPage() {
  const { t } = useTheme();
  const queryClient = useQueryClient();
  const [activeTab,  setActiveTab]  = useState("assets");
  const [isSysAdmin, setIsSysAdmin] = useState(false);
  const [empId,      setEmpId]      = useState(null);

  useEffect(() => {
    setIsSysAdmin(sessionStorage.getItem("role") === "sys_admin");
    setEmpId(sessionStorage.getItem("empId"));
    const savedTab = sessionStorage.getItem("claimAssetsTab");
    if (savedTab) setActiveTab(savedTab);
  }, []);

  function handleTabChange(key) {
    setActiveTab(key);
    sessionStorage.setItem("claimAssetsTab", key);
  }

  const [viewMode,     setViewMode]     = useState("grid");
  const [selected,     setSelected]     = useState([]);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "available" | "inuse"
  const [submitted,  setSubmitted]  = useState(false);
  const [showLimit,  setShowLimit]  = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [reason,     setReason]     = useState("");
  const [submitting,  setSubmitting]  = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ── API ──────────────────────────────────────────────────────────────────
  const { data: assets = [], isFetching, isError } = useAllAssets();

  // ── Selection ─────────────────────────────────────────────────────────────
  function toggleAsset(id) {
    setSelected(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= MAX) { setShowLimit(true); return prev; }
      return [...prev, id];
    });
  }

  function removeAsset(id) {
    setSelected(prev => prev.filter(x => x !== id));
  }

  // ── Filter — search + availability status ────────────────────────────────
  const filtered = assets
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch =
        a.product_Name?.toLowerCase().includes(q) ||
        a.brandName?.toLowerCase().includes(q);
      const available = a.p_Status === "A";
      const matchStatus =
        statusFilter === "all" ? true :
        statusFilter === "available" ? available : !available;
      return matchSearch && matchStatus;
    })
    // Available items always on top, unavailable at the bottom
    .sort((a, b) => {
      const aAvail = a.p_Status === "A" ? 0 : 1;
      const bAvail = b.p_Status === "A" ? 0 : 1;
      return aAvail - bAvail;
    });

  const availableCount = assets.filter(a => a.p_Status === "A").length;

  const viewBtn = (mode) =>
    `p-2 rounded-lg transition-colors ${
      viewMode === mode
        ? `${t.iconBg} ${t.textPrimary}`
        : `${t.textSecondary} ${t.navRowHover}`
    }`;

  return (
    <div className="space-y-4 p-4 sm:p-6">

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${t.iconBg}`}>
          {[
            { key: "assets",     label: "Assets Management" },
            { key: "requests",   label: "My Request"        },
            ...(isSysAdmin ? [{ key: "asset-list", label: "Asset List" }] : []),
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? `${t.cardBg} ${t.textPrimary} shadow-sm`
                  : `${t.textSecondary} ${t.navRowHover}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Assets tab ───────────────────────────────────────────────────────── */}
      {activeTab === "assets" && (
        <div className={`overflow-hidden rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>

          {/* Header */}
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-border">
            <div>
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>Available Assets</h2>
              <p className={`text-xs mt-0.5 ${t.textSecondary}`}>
                {selected.length > 0
                  ? `${selected.length} / ${MAX} devices selected`
                  : "Select up to 5 assets to raise a request"
                }
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">

              {/* ── Availability filter pills ── */}
              <div className={`flex items-center gap-1 p-1 rounded-lg ${t.iconBg}`}>
                {[
                  { key: "all",       label: "All",       count: assets.length                               },
                  { key: "available", label: "Available",  count: assets.filter(a => a.p_Status === "A").length },
                  { key: "inuse",     label: "In Use",     count: assets.filter(a => a.p_Status !== "A").length },
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      statusFilter === key
                        ? "bg-[#E12729] text-white"
                        : `${t.textSecondary} ${t.navRowHover}`
                    }`}
                  >
                    {label}
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                      statusFilter === key
                        ? "bg-white/20 text-white"
                        : `${t.iconBg} ${t.textMuted}`
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${t.textSecondary}`} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search assets..."
                  className={`h-8 pl-9 pr-3 w-52 rounded-md border border-border ${t.cardBg} text-sm ${t.textPrimary} placeholder:${t.textMuted} outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors`}
                />
              </div>
              <div className={`flex items-center gap-1 p-1 rounded-lg ${t.iconBg}`}>
                <button onClick={() => setViewMode("grid")} className={viewBtn("grid")} title="Grid view"><LayoutGrid size={15} /></button>
                <button onClick={() => setViewMode("list")} className={viewBtn("list")} title="List view"><List size={15} /></button>
              </div>
              {selected.length > 0 && (
                <button
                  onClick={() => setShowReason(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#E12729] hover:bg-[#c81f21] text-white text-sm font-medium transition-colors"
                >
                  <ShoppingCart size={14} />
                  Request ({selected.length})
                </button>
              )}
            </div>
          </div>

          {/* Success banner */}
          {submitted && (
            <div className="mx-5 mt-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium">
              <CheckCircle size={15} />
              Request submitted successfully!
            </div>
          )}

          {/* Loading state */}
          {isFetching && assets.length === 0 && (
            <div className="flex items-center justify-center gap-2 py-16">
              <Loader2 size={20} className="animate-spin text-[#E12729]" />
              <span className={`text-sm ${t.textSecondary}`}>Loading assets…</span>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="mx-5 my-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle size={15} />
              Failed to load assets. Please try again later.
            </div>
          )}

          {/* Grid view */}
          {!isFetching && !isError && viewMode === "grid" && (
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(asset => (
                <AssetGridCard
                  key={asset.id}
                  asset={asset}
                  selected={selected.includes(asset.id)}
                  onToggle={toggleAsset}
                />
              ))}
              {filtered.length === 0 && (
                <p className={`col-span-full text-center py-12 ${t.textSecondary}`}>No assets found.</p>
              )}
            </div>
          )}

          {/* List view */}
          {!isFetching && !isError && viewMode === "list" && (
            <div className="p-5 flex flex-col gap-2">
              {filtered.map(asset => (
                <AssetListRow
                  key={asset.id}
                  asset={asset}
                  selected={selected.includes(asset.id)}
                  onToggle={toggleAsset}
                />
              ))}
              {filtered.length === 0 && (
                <p className={`text-center py-12 ${t.textSecondary}`}>No assets found.</p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className={`px-5 py-3 border-t border-border text-xs ${t.textSecondary}`}>
            {selected.length > 0
              ? `${selected.length} asset${selected.length > 1 ? "s" : ""} selected`
              : `${availableCount} of ${assets.length} assets available`
            }
          </div>
        </div>
      )}

      {/* Requests tab */}
      {activeTab === "requests" && <MyRequests />}

      {/* Asset List tab — sys_admin only */}
      {activeTab === "asset-list" && <AssetListAdmin />}

      {/* Reason modal */}
      {showReason && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${t.cardBg}`}>
            <h3 className={`text-base font-semibold mb-1 ${t.textPrimary}`}>Reason for Request</h3>
            <p className={`text-xs mb-4 ${t.textSecondary}`}>
              Please provide a reason for requesting {selected.length} asset{selected.length > 1 ? "s" : ""}.
            </p>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setSubmitError(""); }}
              placeholder="Enter your reason..."
              rows={4}
              disabled={submitting}
              className={`w-full rounded-lg border border-border px-3 py-2 text-sm resize-none outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20 transition-colors ${t.cardBg} ${t.textPrimary} disabled:opacity-60`}
            />
            {/* Inline API error */}
            {submitError && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                <AlertCircle size={13} />
                {submitError}
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                disabled={submitting}
                onClick={() => { if (!submitting) { setShowReason(false); setReason(""); setSubmitError(""); } }}
                className={`px-4 py-2 rounded-lg text-sm border border-border ${t.textSecondary} ${t.navRowHover} disabled:opacity-50`}
              >Cancel</button>
              <button
                disabled={!reason.trim() || submitting}
                onClick={async () => {
                  setSubmitting(true);
                  setSubmitError("");
                  try {
                    await raiseAssetRequest({
                      empId,
                      reason: reason.trim(),
                      productIds: selected,
                    });
                    // Refetch assets (availability changes) + both request lists
                    queryClient.invalidateQueries({ queryKey: ["allAssets"] });
                    queryClient.invalidateQueries({ queryKey: ["myAssetRequests"] });
                    queryClient.invalidateQueries({ queryKey: ["allAssetRequests"] });
                    setShowReason(false);
                    setReason("");
                    setSelected([]);
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 4000);
                  } catch {
                    setSubmitError("Failed to submit request. Please try again.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-[#E12729] hover:bg-[#c81f21] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting && <Loader2 size={13} className="animate-spin" />}
                {submitting ? "Submitting…" : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Max selection modal */}
      {showLimit && (
        <MaxSelectionModal
          selected={selected}
          assets={assets}
          onRemove={removeAsset}
          onClose={() => setShowLimit(false)}
        />
      )}

    </div>
  );
}
