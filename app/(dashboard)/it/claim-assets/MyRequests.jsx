"use client";

import { Laptop } from "lucide-react";
import { ICON_MAP, MY_REQUESTS, STATUS_CONFIG } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

export default function MyRequests() {
  const { t, isDark } = useTheme();
  const card = isDark ? "bg-[#111111] border border-white/5" : "bg-white border border-gray-200";

  return (
    <div className={`rounded-2xl overflow-hidden ${card}`}>
      <div className={`px-6 py-4 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
        <h2 className={`text-base font-semibold ${t.textPrimary}`}>My Requests</h2>
        <p className={`text-xs mt-0.5 ${t.textMuted}`}>Track your asset request history</p>
      </div>
      <div className="p-6 space-y-3">
        {MY_REQUESTS.map(req => {
          const cfg  = STATUS_CONFIG[req.status];
          const Icon = cfg.icon;
          const I    = ICON_MAP[req.category] ?? Laptop;
          return (
            <div key={req.id} className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-colors
              ${isDark ? "border-white/8 bg-white/3 hover:bg-white/5" : "border-gray-100 bg-gray-50 hover:bg-gray-100"}`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl
                  ${isDark ? "bg-white/8 text-gray-300" : "bg-white text-gray-600 shadow-sm border border-gray-100"}`}>
                  <I size={18} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${t.textPrimary}`}>{req.name}</p>
                  <p className={`text-xs ${t.textMuted}`}>{req.category} · {req.date}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border
                ${isDark ? cfg.dark : cfg.cls}`}>
                <Icon size={12} />
                {req.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
