"use client";

import { Laptop } from "lucide-react";
import { ICON_MAP } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

const Checkmark = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AssetGridCard({ asset, selected, onToggle }) {
  const { t } = useTheme();
  const Icon = ICON_MAP[asset.category] ?? Laptop;

  return (
    <button
      onClick={() => asset.available && onToggle(asset.id)}
      disabled={!asset.available}
      className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border text-center transition-all duration-150 ${t.cardShadow}
        ${selected
          ? "border-[#E12729]/50 bg-[#E12729]/5 shadow-md"
          : `border-border ${t.cardBg} hover:border-[#E12729]/30 hover:shadow-md`
        }
        ${!asset.available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full
        ${asset.available ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400" : `${t.iconBg} ${t.textSecondary}`}`}>
        {asset.available ? "Available" : "In Use"}
      </span>

      <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-colors
        ${selected ? "bg-[#E12729] text-white" : `${t.iconBg} ${t.textSecondary}`}`}>
        <Icon size={26} />
      </div>

      <div>
        <p className={`text-sm font-semibold leading-tight ${selected ? "text-[#E12729]" : t.textPrimary}`}>
          {asset.name}
        </p>
        <p className={`text-xs mt-0.5 ${t.textSecondary}`}>{asset.category}</p>
      </div>

      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
        ${selected ? "bg-[#E12729] border-[#E12729]" : `border-border ${t.cardBg}`}`}>
        {selected && <Checkmark />}
      </div>
    </button>
  );
}
