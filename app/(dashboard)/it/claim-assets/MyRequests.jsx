"use client";

import { Laptop } from "lucide-react";
import { ICON_MAP, MY_REQUESTS, STATUS_CONFIG } from "./assetData";
import { useTheme } from "../../../context/ThemeContext";

export default function MyRequests() {
  const { t } = useTheme();
  return (
    <div className={`overflow-hidden rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>
      <div className="px-5 py-4 border-b border-border">
        <h2 className={`text-base font-semibold ${t.textPrimary}`}>My Requests</h2>
        <p className={`text-xs mt-0.5 ${t.textSecondary}`}>Track your asset request history</p>
      </div>
      <div className="p-5 space-y-3">
        {MY_REQUESTS.map(req => {
          const cfg  = STATUS_CONFIG[req.status];
          const Icon = cfg.icon;
          const I    = ICON_MAP[req.category] ?? Laptop;
          return (
            <div key={req.id} className={`flex items-center justify-between px-5 py-4 rounded-xl border border-border ${t.iconBg} hover:opacity-80 transition-colors`}>
              <div className="flex items-center gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${t.iconBg} ${t.textSecondary}`}>
                  <I size={18} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${t.textPrimary}`}>{req.name}</p>
                  <p className={`text-xs ${t.textSecondary}`}>{req.category} · {req.date}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
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
