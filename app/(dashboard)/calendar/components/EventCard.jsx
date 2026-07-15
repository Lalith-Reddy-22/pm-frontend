"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function EventCard({ day, dayNum, month, tasks }) {
  const { t } = useTheme();
  return (
    <div className={`flex border border-border rounded-xl overflow-hidden ${t.cardBg} ${t.cardShadow}`}>
      {/* Date column */}
      <div className={`flex flex-col items-center justify-center w-20 flex-shrink-0 py-4 border-r border-border ${t.mainBg}`}>
        <span className={`text-[11px] font-semibold uppercase tracking-wide ${t.textSecondary}`}>{day}</span>
        <span className={`text-2xl font-bold leading-tight ${t.textPrimary}`}>{dayNum}</span>
        <span className="text-[11px] font-bold text-[#E12729] uppercase tracking-wide">{month}</span>
      </div>

      {/* Tasks */}
      <div className="flex-1 px-5 py-3 flex flex-col justify-center gap-2 min-w-0">
        {tasks.map((task, i) => (
          <div key={task.id}>
            {i > 0 && <div className={`border-t border-border mb-2`} />}
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E12729] flex-shrink-0" />
              <p className={`text-sm font-medium truncate ${t.textPrimary}`}>{task.title}</p>
            </div>
            <div className="flex items-center gap-2 mt-1 pl-4">
              <span className="text-xs text-[#4CAF50] font-medium">
                Allocated Hours: <span className="font-semibold">{task.allocatedHours}</span>
              </span>
              <span className={`text-xs ${t.textSecondary}`}>•</span>
              <span className="text-xs text-[#4CAF50] font-medium">
                Logged Hours: <span className="font-semibold">{task.loggedHours}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
