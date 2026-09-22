"use client";

import { Building2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ClientTile({ name }) {
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
    <div
      className={`
        flex w-full overflow-hidden rounded-2xl
        ${t.cardBg}
        ${
          isDark
            ? "border border-white/10"
            : "border border-gray-200 bg-white"
        }
      `}
    >
      <div className="flex w-full flex-col items-center justify-center p-5 text-center">
        {/* Client avatar */}
        <div
          className={`
            flex h-10 w-10 items-center justify-center
            rounded-xl text-sm font-bold
            ${
              isDark
                ? "bg-white/10 text-white"
                : "bg-red-400 text-white"
            }
          `}
        >
          {getInitials(name)}
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
    </div>
  );
}