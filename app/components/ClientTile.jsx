"use client";

import { useTheme } from "../context/ThemeContext";

export default function ClientTile({ name, onClick }) {
  const { t, isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`w-full flex flex-col items-center rounded-2xl overflow-hidden transition-all duration-150
        ${t.cardBg} ${t.cardShadow}
        ${isDark
          ? "border border-white/8 hover:border-white/20"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-md"
        }`}
    >
      {/* Logo area */}
      <div className={`w-full flex items-center justify-center py-6 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
        <img src="/pfiser_logo.png" alt={name} className="h-10 object-contain" />
      </div>

      {/* Name */}
      <div className={`w-full px-3 py-3 text-sm font-semibold text-center border-t shadow-md ${isDark ? "border-white/8" : "border-gray-100"} ${t.textPrimary}`}>
        {name}
      </div>
    </button>
  );
}