"use client";

import { ArrowUpRight, Building2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ClientTile({ name, onClick }) {
  const { t, isDark } = useTheme();

  const getInitials = (value = "") => {
    const words = value.trim().split(/\s+/);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[1].charAt(0)
    ).toUpperCase();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full overflow-hidden rounded-2xl
        text-left transition-all duration-200
        ${t.cardBg}
        ${
          isDark
            ? "border border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
            : "border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg"
        }
      `}
    >
      <div className="p-5">
        {/* Top section */}
        <div className="flex items-start justify-between">
          {/* Client avatar */}
          <div
            className={`
              flex h-12 w-12 items-center justify-center
              rounded-xl text-sm font-bold
              transition-transform duration-200
              group-hover:scale-105
              ${
                isDark
                  ? "bg-white/10 text-white"
                  : "bg-gray-100 text-gray-700"
              }
            `}
          >
            {getInitials(name)}
          </div>

          {/* Arrow */}
          <div
            className={`
              flex h-8 w-8 items-center justify-center rounded-full
              opacity-50 transition-all duration-200
              group-hover:translate-x-0.5 group-hover:-translate-y-0.5
              group-hover:opacity-100
              ${
                isDark
                  ? "bg-white/5 text-gray-300"
                  : "bg-gray-50 text-gray-500"
              }
            `}
          >
            <ArrowUpRight size={16} />
          </div>
        </div>

        {/* Client information */}
        <div className="mt-5">
          <h3
            className={`
              truncate text-[15px] font-semibold
              ${t.textPrimary}
            `}
            title={name}
          >
            {name}
          </h3>

          <div
            className={`
              mt-2 flex items-center gap-1.5 text-xs
              ${t.textSecondary}
            `}
          >
            <Building2 size={13} />
            <span>Client</span>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className={`
          h-1 w-full origin-left scale-x-0
          transition-transform duration-200
          group-hover:scale-x-100
          ${isDark ? "bg-white/30" : "bg-gray-900"}
        `}
      />
    </button>
  );
}