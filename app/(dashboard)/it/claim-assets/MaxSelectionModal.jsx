"use client";

import { X, Laptop } from "lucide-react";
import { ICON_MAP, ASSETS } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

export default function MaxSelectionModal({ selected, onRemove, onClose }) {
  const { t, isDark } = useTheme();

  const selectedAssets = ASSETS.filter(a => selected.includes(a.id));

  const overlay = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm";
  const panel   = isDark
    ? "bg-[#1a1a1a] border border-white/10"
    : "bg-white border border-gray-200";

  return (
    <div className={overlay} onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl ${panel}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/8" : "border-gray-100"}`}>
          <div>
            <h2 className={`text-base font-semibold ${t.textPrimary}`}>Selection Limit Reached</h2>
            <p className={`text-xs mt-0.5 ${t.textMuted}`}>You can select up to 5 devices at once. Remove one to add another.</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${isDark ? "hover:bg-white/10 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Selected list */}
        <div className="px-6 py-4 space-y-2">
          {selectedAssets.map(asset => {
            const Icon = ICON_MAP[asset.category] ?? Laptop;
            return (
              <div
                key={asset.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
                  ${isDark ? "border-white/8 bg-white/3" : "border-gray-100 bg-gray-50"}`}
              >
                <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl
                  ${isDark ? "bg-white/8 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isDark ? "text-blue-400" : "text-blue-600"}`}>{asset.name}</p>
                  <p className={`text-xs ${t.textMuted}`}>{asset.category}</p>
                </div>
                <button
                  onClick={() => onRemove(asset.id)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                    bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <X size={11} />
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex justify-end ${isDark ? "border-white/8" : "border-gray-100"}`}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
