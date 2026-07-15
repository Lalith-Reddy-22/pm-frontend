"use client";

import { Briefcase, Clock, BarChart2 } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const ITEMS = [
  { icon: Briefcase, label: "Total Allocated Hours", key: "totalAllocatedHours", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400" },
  { icon: Clock,     label: "Total Logged Hours",    key: "totalLoggedHours",    iconBg: "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400" },
  { icon: BarChart2, label: "Tasks Completed",       key: "tasksCompleted",      iconBg: "bg-purple-100 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400" },
];

export default function SummaryPanel({ summary, loading }) {
  const { t } = useTheme();
  return (
    <div className={`rounded-xl border border-border ${t.cardBg} ${t.cardShadow} p-4`}>
      <h3 className={`text-sm font-bold mb-3 ${t.textPrimary}`}>Summary</h3>
      <div className="space-y-3">
        {ITEMS.map(({ icon: Icon, label, key, iconBg }) => (
          <div key={key} className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${iconBg}`}>
              <Icon size={15} />
            </div>
            <span className={`flex-1 text-xs ${t.textSecondary}`}>{label}</span>
            <span className={`text-xs font-bold ${t.textPrimary}`}>
              {loading || !summary ? "—" : summary[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
