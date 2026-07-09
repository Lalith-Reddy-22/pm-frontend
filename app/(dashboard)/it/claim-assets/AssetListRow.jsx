"use client";

import { Laptop } from "lucide-react";
import { ICON_MAP } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

const Checkmark = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AssetListRow({ asset, selected, onToggle }) {
  const { t, isDark } = useTheme();
  const Icon = ICON_MAP[asset.category] ?? Laptop;

  return (
    <button
      onClick={() => asset.available && onToggle(asset.id)}
      disabled={!asset.available}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border transition-all duration-150 text-left
        ${selected
          ? isDark ? "border-red-500/50 bg-red-500/10" : "border-red-300 bg-red-50"
          : isDark ? "border-white/8 bg-[#1a1a1a] hover:border-white/20 hover:bg-white/5"
                   : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm shadow-sm"
        }
        ${!asset.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <div className={`flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl transition-colors
        ${selected ? "bg-red-500 text-white"
          : isDark ? "bg-white/8 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
        <Icon size={20} />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate
          ${selected ? "text-red-500" : isDark ? "text-blue-400" : "text-blue-600"}`}>
          {asset.name}
        </p>
        <p className={`text-xs mt-0.5 ${t.textMuted}`}>{asset.category}</p>
      </div>

      <span className={`flex-shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full
        ${asset.available
          ? isDark ? "bg-green-500/15 text-green-400" : "bg-green-100 text-green-600"
          : isDark ? "bg-gray-500/15 text-gray-500"   : "bg-gray-100 text-gray-400"}`}>
        {asset.available ? "Available" : "In Use"}
      </span>

      <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
        ${selected ? "bg-red-500 border-red-500"
          : isDark ? "border-white/20 bg-transparent" : "border-gray-300 bg-white"}`}>
        {selected && <Checkmark />}
      </div>
    </button>
  );
}
