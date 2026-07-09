"use client";

import { useTheme } from "../context/ThemeContext";

export default function ClientTile({ name, onClick }) {
  const { t, isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center px-6 py-8 rounded-2xl text-base font-medium transition-all duration-150
        ${t.cardBg} ${t.cardShadow} ${t.textPrimary}
        ${isDark
          ? "border border-white/8 hover:border-white/20 hover:bg-white/5"
          : "border border-gray-200 hover:border-gray-300 hover:shadow-md"
        }`}
    >
      {name}
    </button>
  );
}
