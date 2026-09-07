"use client";

import { faClassToLucide } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

const Checkmark = () => (
  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/**
 * asset shape from GET /api/v1/asset/all:
 *   { id, product_Name, brandName, product_Icon, p_Status, chkOption }
 *   p_Status "A" = available
 */
export default function AssetGridCard({ asset, selected, onToggle }) {
  const { t } = useTheme();
  const available = asset.p_Status === "A";
  const Icon = faClassToLucide(asset.product_Icon);

  return (
    <button
      onClick={() => available && onToggle(asset.id)}
      disabled={!available}
      className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border text-center transition-all duration-150 ${t.cardShadow}
        ${selected
          ? "border-[#E12729]/50 bg-[#E12729]/5 shadow-md"
          : `border-border ${t.cardBg} hover:border-[#E12729]/30 hover:shadow-md`
        }
        ${!available ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {/* Availability badge */}
      <span className={`absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full
        ${available
          ? "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400"
          : `${t.iconBg} ${t.textSecondary}`}`}>
        {available ? "Available" : "In Use"}
      </span>

      {/* Lucide icon resolved from FA class */}
      <div className={`flex items-center justify-center w-14 h-14 rounded-xl transition-colors
        ${selected ? "bg-[#E12729] text-white" : `${t.iconBg} ${t.textSecondary}`}`}>
        <Icon size={26} />
      </div>

      <div>
        <p className={`text-sm font-semibold leading-tight ${selected ? "text-[#E12729]" : t.textPrimary}`}>
          {asset.product_Name}
        </p>
        <p className={`text-xs mt-0.5 ${t.textSecondary}`}>{asset.brandName}</p>
      </div>

      {/* Checkbox */}
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
        ${selected ? "bg-[#E12729] border-[#E12729]" : `border-border ${t.cardBg}`}`}>
        {selected && <Checkmark />}
      </div>
    </button>
  );
}
