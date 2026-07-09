"use client";

import { TONE_STYLES } from "../constants";

export default function UtilizationCard({ percent, isDark }) {
  const s = TONE_STYLES.amber;
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(percent, 100) / 100) * c;

  return (
    <div
      className={`rounded-2xl border ${isDark ? "border-white/10" : "border-gray-100"} p-4 flex items-center gap-3
        bg-gradient-to-br ${isDark ? s.bgDark : s.bgLight} to-transparent shadow-sm`}
    >
      <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center">
        <svg width="44" height="44" viewBox="0 0 40 40" className="-rotate-90">
          <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" className={isDark ? "stroke-white/10" : "stroke-amber-100"} />
          <circle
            cx="20" cy="20" r={r} fill="none" strokeWidth="4" strokeLinecap="round"
            className={isDark ? "stroke-amber-400" : "stroke-amber-500"}
            strokeDasharray={c} strokeDashoffset={offset}
          />
        </svg>
        <span className={`absolute text-[10px] font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}>{percent}%</span>
      </div>
      <div className="min-w-0">
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Utilization</p>
        <p className={`text-lg font-bold leading-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}>{percent}%</p>
        <p className={`text-xs font-medium ${isDark ? s.captionDark : s.captionLight}`}>This Week</p>
      </div>
    </div>
  );
}