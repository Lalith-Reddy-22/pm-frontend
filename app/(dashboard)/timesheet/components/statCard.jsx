"use client";

import { TONE_STYLES } from "../constants";

export default function StatCard({ icon: Icon, tone, label, value, caption, isDark }) {
  const s = TONE_STYLES[tone];
  return (
    <div
      className={`rounded-2xl border ${isDark ? "border-white/10" : "border-gray-100"} p-4 flex items-center gap-3
        bg-gradient-to-br ${isDark ? s.bgDark : s.bgLight} to-transparent shadow-sm`}
    >
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${isDark ? s.iconBoxDark : s.iconBoxLight}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
        <p className={`text-lg font-bold leading-tight ${isDark ? "text-gray-100" : "text-gray-900"}`}>{value}</p>
        <p className={`text-xs font-medium ${isDark ? s.captionDark : s.captionLight}`}>{caption}</p>
      </div>
    </div>
  );
}