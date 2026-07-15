"use client";

import { useState } from "react";
import { Search, ShoppingCart, CheckCircle, LayoutGrid, List } from "lucide-react";
import { ASSETS } from "./assetData";
import AssetGridCard from "./AssetGridCard";
import AssetListRow  from "./AssetListRow";
import MyRequests    from "./MyRequests";
import MaxSelectionModal from "./MaxSelectionModal";
import { useTheme } from "../../../context/ThemeContext";

export default function ClaimAssetsPage() {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState("assets");
  const [viewMode,  setViewMode]  = useState("grid");
  const [selected,  setSelected]  = useState([]);
  const [search,    setSearch]    = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showLimit, setShowLimit] = useState(false);

  const MAX = 5;

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

  const filtered = ASSETS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  const viewBtn = (mode) =>
    `p-2 rounded-lg transition-colors ${
      viewMode === mode
        ? `${t.iconBg} ${t.textPrimary}`
        : `${t.textSecondary} ${t.navRowHover}`
    }`;

  return (
    <div className="space-y-4 p-4 sm:p-6">

      {/* Tabs */}
      <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${t.iconBg}`}>
        {[{ key: "assets", label: "Assets Management" }, { key: "requests", label: "My Request" }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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

      {/* Assets tab */}
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
            <div className="flex items-center gap-3">
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
                  onClick={() => { setSubmitted(true); setSelected([]); setTimeout(() => setSubmitted(false), 3000); }}
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

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(asset => (
                <AssetGridCard key={asset.id} asset={asset} selected={selected.includes(asset.id)} onToggle={toggleAsset} />
              ))}
              {filtered.length === 0 && <p className={`col-span-full text-center py-12 ${t.textSecondary}`}>No assets found.</p>}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="p-5 flex flex-col gap-2">
              {filtered.map(asset => (
                <AssetListRow key={asset.id} asset={asset} selected={selected.includes(asset.id)} onToggle={toggleAsset} />
              ))}
              {filtered.length === 0 && <p className={`text-center py-12 ${t.textSecondary}`}>No assets found.</p>}
            </div>
          )}

          {/* Footer */}
          <div className={`px-5 py-3 border-t border-border text-xs ${t.textSecondary}`}>
            {selected.length > 0
              ? `${selected.length} asset${selected.length > 1 ? "s" : ""} selected`
              : `${ASSETS.filter(a => a.available).length} of ${ASSETS.length} assets available`
            }
          </div>
        </div>
      )}

      {/* Requests tab */}
      {activeTab === "requests" && <MyRequests />}

      {/* Max selection modal */}
      {showLimit && (
        <MaxSelectionModal
          selected={selected}
          onRemove={removeAsset}
          onClose={() => setShowLimit(false)}
        />
      )}

    </div>
  );
}
