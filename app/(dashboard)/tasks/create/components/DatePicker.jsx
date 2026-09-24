"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import MiniCalendar from "../../../calendar/components/MiniCalendar";

export default function DatePicker({ value, onChange, placeholder = "Select date", error = false }) {
  const { t, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => (value ? new Date(value).getFullYear() : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value ? new Date(value).getMonth() : new Date().getMonth()));
  const ref = useRef(null);

  const selected = value ? new Date(value + "T00:00:00") : null;
  const today = new Date();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (date) => {
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
  };

  const handlePrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const handleNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const display = selected
    ? selected.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-md border text-sm transition-colors
          ${error
            ? "border-red-500 bg-white text-gray-700"
            : isDark
              ? "bg-[#1c1c1c] border-white/10 text-gray-200 hover:border-white/20"
              : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
          }
        `}
      >
        <span className={display ? "" : (isDark ? "text-gray-500" : "text-gray-400")}>
          {display || placeholder}
        </span>
        <CalendarDays size={15} className={isDark ? "text-gray-500" : "text-gray-400"} />
      </button>

      {open && (
        <div className={`absolute z-50 bottom-full mb-1 rounded-xl border shadow-lg w-64
          ${isDark ? "bg-[#161b22] border-white/10" : "bg-white border-gray-200"}
        `}>
          <MiniCalendar
            year={viewYear}
            month={viewMonth}
            today={today}
            selectedDate={selected}
            onSelect={handleSelect}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      )}
    </div>
  );
}
