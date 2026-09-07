"use client";

import { X } from "lucide-react";
import { faClassToLucide } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

export default function MaxSelectionModal({ selected, assets = [], onRemove, onClose }) {
  const { t } = useTheme();
  const selectedAssets = assets.filter(a => selected.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-md rounded-xl border border-border ${t.cardBg} shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className={`text-base font-semibold ${t.textPrimary}`}>Selection Limit Reached</h2>
            <p className={`text-xs mt-0.5 ${t.textSecondary}`}>You can select up to 5 devices at once. Remove one to add another.</p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${t.textSecondary} ${t.navRowHover}`}
          >
            <X size={16} />
          </button>
        </div>

        {/* Selected list */}
        <div className="px-6 py-4 space-y-2">
          {selectedAssets.map(asset => {
            const Icon = faClassToLucide(asset.product_Icon);
            return (
              <div
                key={asset.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-border ${t.iconBg} transition-colors`}
              >
                <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${t.iconBg} ${t.textSecondary}`}>
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${t.textPrimary}`}>{asset.product_Name}</p>
                  <p className={`text-xs ${t.textSecondary}`}>{asset.brandName}</p>
                </div>
                <button
                  onClick={() => onRemove(asset.id)}
                  className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors bg-[#E12729]/10 text-[#E12729] hover:bg-[#E12729] hover:text-white"
                >
                  <X size={11} />
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-[#E12729] hover:bg-[#c81f21] text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
