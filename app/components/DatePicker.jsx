"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const DAYS   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function fmt(date) {
  if (!date) return "";
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
}

export default function DatePicker({ value, onChange, placeholder = "Select date" }) {
  const { t } = useTheme();
  const [open, setOpen]     = useState(false);
  const [pos, setPos]       = useState({ top: 0, left: 0 });
  const [cursor, setCursor] = useState(() => value ? new Date(value.getFullYear(), value.getMonth(), 1) : new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const ref = useRef(null);

  useEffect(() => {
    function onDown(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    if (value) setCursor(new Date(value.getFullYear(), value.getMonth(), 1));
  }, [value]);

  function handleToggle() {
    setOpen(o => !o);
  }

  useEffect(() => {
    if (!open || !ref.current) return;
    function updatePos() {
      const rect = ref.current.getBoundingClientRect();
      const popH = 280;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow >= popH ? rect.bottom + 4 : rect.top - popH - 4;
      setPos({ top, left: rect.left });
    }
    updatePos();
  }, [open]);

  const year        = cursor.getFullYear();
  const month       = cursor.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function select(d) { onChange?.(new Date(year, month, d)); setOpen(false); }

  const isSelected = d => value && value.getDate() === d && value.getMonth() === month && value.getFullYear() === year;
  const isToday    = d => { const n = new Date(); return n.getDate() === d && n.getMonth() === month && n.getFullYear() === year; };

  return (  
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={() => handleToggle()}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer
          border border-red-200 bg-white text-red-600 hover:bg-red-50
          ${open ? "bg-red-50 border-red-400" : ""}`}
      >
        <Calendar size={14} className="flex-shrink-0 text-red-500" />
        <span className={value ? "text-red-600" : "text-red-300"}>{value ? fmt(value) : placeholder}</span>
      </button>

      {open && (
        <div className="fixed z-50 w-64 rounded-xl shadow-xl p-3 bg-white border border-red-100"
          style={{ top: pos.top, left: pos.left }}
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-2 bg-red-500 rounded-lg px-2 py-1.5">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-semibold text-white">{MONTHS[month]} {year}</span>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold py-1 text-red-400">{d}</div>)}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((d, i) => (
              <div key={i} className="flex items-center justify-center">
                {d && (
                  <button
                    onClick={() => select(d)}
                    className={`h-7 w-7 rounded-full text-xs font-medium transition-colors cursor-pointer
                      ${isSelected(d)
                        ? "bg-red-500 text-white shadow-sm"
                        : isToday(d)
                          ? "text-red-500 font-bold ring-1 ring-red-300"
                          : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                  >
                    {d}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
