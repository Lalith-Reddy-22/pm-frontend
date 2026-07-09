"use client";

import { useState } from "react";
import { Search, ShoppingCart, CheckCircle, LayoutGrid, List } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { ASSETS } from "./assetData";
import AssetGridCard from "./AssetGridCard";
import AssetListRow  from "./AssetListRow";
import MyRequests    from "./MyRequests";
import MaxSelectionModal from "./MaxSelectionModal";

export default function ClaimAssetsPage() {
  const { t, isDark } = useTheme();
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

  const card  = isDark ? "bg-[#111111] border border-white/5" : "bg-white border border-gray-200";
  const input = isDark
    ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-red-500/50"
    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-red-400";
  const viewBtn = (mode) =>
    `p-2 rounded-lg transition-colors ${viewMode === mode
      ? isDark ? "bg-white/15 text-white" : "bg-gray-200 text-gray-900"
      : isDark ? "text-gray-500 hover:text-gray-300 hover:bg-white/8" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="p-6 space-y-5">

      {/* Tabs */}
      <div className={`flex items-center gap-1 p-1 rounded-xl w-fit ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
        {[{ key: "assets", label: "Assets Management" }, { key: "requests", label: "My Request" }].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors
              ${activeTab === tab.key
                ? isDark ? "bg-white text-gray-900 shadow-sm" : "bg-white text-gray-900 shadow-sm"
                : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Assets tab */}
      {activeTab === "assets" && (
        <div className={`rounded-2xl overflow-hidden ${card}`}>

          {/* Header */}
          <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
            <div>
              <h2 className={`text-base font-semibold ${t.textPrimary}`}>Available Assets</h2>
              <p className={`text-xs mt-0.5 ${t.textMuted}`}>
                {selected.length > 0
                  ? `${selected.length} / ${MAX} devices selected`
                  : "Select up to 5 assets to raise a request"
                }
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 ${t.textMuted}`} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search assets..."
                  className={`pl-8 pr-3 py-2 rounded-lg text-sm border outline-none transition-colors w-44 ${input}`}
                />
              </div>
              <div className={`flex items-center gap-1 p-1 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <button onClick={() => setViewMode("grid")} className={viewBtn("grid")} title="Grid view"><LayoutGrid size={15} /></button>
                <button onClick={() => setViewMode("list")} className={viewBtn("list")} title="List view"><List size={15} /></button>
              </div>
              {selected.length > 0 && (
                <button
                  onClick={() => { setSubmitted(true); setSelected([]); setTimeout(() => setSubmitted(false), 3000); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
                >
                  <ShoppingCart size={14} />
                  Request ({selected.length})
                </button>
              )}
            </div>
          </div>

          {/* Success banner */}
          {submitted && (
            <div className="mx-6 mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
              <CheckCircle size={15} />
              Request submitted successfully!
            </div>
          )}

          {/* Grid view */}
          {viewMode === "grid" && (
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(asset => (
                <AssetGridCard key={asset.id} asset={asset} selected={selected.includes(asset.id)} onToggle={toggleAsset} />
              ))}
              {filtered.length === 0 && <p className={`col-span-full text-center py-12 ${t.textMuted}`}>No assets found.</p>}
            </div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <div className="p-6 flex flex-col gap-2">
              {filtered.map(asset => (
                <AssetListRow key={asset.id} asset={asset} selected={selected.includes(asset.id)} onToggle={toggleAsset} />
              ))}
              {filtered.length === 0 && <p className={`text-center py-12 ${t.textMuted}`}>No assets found.</p>}
            </div>
          )}

          {/* Footer */}
          <div className={`px-6 py-3 border-t text-xs ${isDark ? "border-white/5 text-gray-500" : "border-gray-100 text-gray-400"}`}>
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
