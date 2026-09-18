"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function MiniCalendar({ year, month, today, selectedDate, onSelect, onPrev, onNext }) {
  const { t } = useTheme();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInPrev = getDaysInMonth(year, month - 1);

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, current: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  const isToday = (day) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const isSelected = (day) =>
    selectedDate &&
    selectedDate.getFullYear() === year &&
    selectedDate.getMonth() === month &&
    selectedDate.getDate() === day;

  return (
    <div className="p-4">
      {/* Month header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-base font-bold ${t.textPrimary}`}>
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} className={`p-1.5 rounded-lg ${t.navRowHover} ${t.textSecondary} transition-colors`}>
            <ChevronLeft size={15} />
          </button>
          <button onClick={onNext} className={`p-1.5 rounded-lg ${t.navRowHover} ${t.textSecondary} transition-colors`}>
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className={`text-center text-[10px] font-semibold py-1 ${t.textSecondary}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => (
          <button
            key={i}
            onClick={() => cell.current && onSelect(new Date(year, month, cell.day))}
            className={`
              h-7 w-7 mx-auto flex items-center justify-center text-xs rounded-full transition-colors
              ${!cell.current ? `${t.textMuted} cursor-default` : "cursor-pointer"}
              ${cell.current && isToday(cell.day)
                ? "bg-[#E12729] text-white font-bold"
                : cell.current && isSelected(cell.day)
                ? "bg-red-100 text-[#E12729] font-semibold"
                : cell.current
                ? `${t.textPrimary} ${t.navRowHover}`
                : ""}
            `}
          >
            {cell.day}
          </button>
        ))}
      </div>
    </div>
  );
}
