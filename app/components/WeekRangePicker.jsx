"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function fmt(date) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}

function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function startOfMonth(date) { return new Date(date.getFullYear(), date.getMonth(), 1); }
function endOfMonth(date)   { return new Date(date.getFullYear(), date.getMonth() + 1, 0); }

const PRESETS = [
  { label: "Mon-Fri",      key: "mon-fri"    },
  { label: "Today",        key: "today"      },
  { label: "Yesterday",    key: "yesterday"  },
  { label: "Last 7 Days",  key: "last7"      },
  { label: "Last 30 Days", key: "last30"     },
  { label: "This Month",   key: "this-month" },
  { label: "Last Month",   key: "last-month" },
  { label: "Custom Range", key: "custom"     },
];

function getPresetRange(key) {
  const today = new Date(); today.setHours(0,0,0,0);
  switch (key) {
    case "mon-fri":    { const mon = startOfWeek(today); return { start: mon, end: addDays(mon, 4) }; }
    case "today":        return { start: today, end: today };
    case "yesterday":  { const y = addDays(today, -1); return { start: y, end: y }; }
    case "last7":        return { start: addDays(today, -6), end: today };
    case "last30":       return { start: addDays(today, -29), end: today };
    case "this-month":   return { start: startOfMonth(today), end: endOfMonth(today) };
    case "last-month": { const lm = new Date(today.getFullYear(), today.getMonth() - 1, 1); return { start: startOfMonth(lm), end: endOfMonth(lm) }; }
    default:             return null;
  }
}

function MiniCalendar({ cursor, onCursorChange, start, end, onDayClick, isDark, t }) {
  const year  = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  function inRange(d) {
    if (!start || !end) return false;
    const date = new Date(year, month, d);
    return date > start && date < end;
  }
  function isStart(d) { return start && new Date(year, month, d).getTime() === start.getTime(); }
  function isEnd(d)   { return end   && new Date(year, month, d).getTime() === end.getTime(); }

  const navBtn = isDark
    ? "text-gray-400 hover:text-gray-200 hover:bg-white/10"
    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100";

  return (
    <div className="w-72">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onCursorChange(new Date(year, month - 1, 1))} className={`p-1.5 rounded transition-colors ${navBtn}`}>
          <ChevronLeft size={15} />
        </button>
        <span className={`text-sm font-semibold ${t.textPrimary}`}>{MONTHS[month]} {year}</span>
        <button onClick={() => onCursorChange(new Date(year, month + 1, 1))} className={`p-1.5 rounded transition-colors ${navBtn}`}>
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-red-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const sel   = isStart(d) || isEnd(d);
          const range = inRange(d);
          return (
            <button
              key={i}
              onClick={() => onDayClick(new Date(year, month, d))}
              className={`h-8 w-8 mx-auto rounded-full text-xs font-medium transition-colors
                ${sel   ? "bg-red-500 text-white"
                : range ? isDark ? "bg-red-500/20 text-red-400 rounded-none" : "bg-red-100 text-red-700 rounded-none"
                : isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-red-50 hover:text-red-600"}`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function WeekRangePicker({ start, end, onChange }) {
  const { t, isDark } = useTheme();
  const [open,      setOpen]      = useState(false);
  const [pos,       setPos]       = useState({ top: 0, left: 0 });
  const [activeKey, setActiveKey] = useState("mon-fri");
  const [cursor,    setCursor]    = useState(() => new Date(start.getFullYear(), start.getMonth(), 1));

  useEffect(() => {
    setCursor(new Date(start.getFullYear(), start.getMonth(), 1));
  }, [start]);
  const [selecting, setSelecting] = useState(null);
  const [tempStart, setTempStart] = useState(start);
  const [tempEnd,   setTempEnd]   = useState(end);
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleToggle() {
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const dropdownHeight = 320;
      const top = rect.bottom + 4 + dropdownHeight > window.innerHeight
        ? rect.top - dropdownHeight - 4
        : rect.bottom + 4;
      setPos({ top, left: rect.right });
    }
    setOpen(o => !o);
  }

  function pickPreset(key) {
    setActiveKey(key);
    if (key === "custom") { setTempStart(null); setTempEnd(null); setSelecting("start"); return; }
    setSelecting(null);
    const range = getPresetRange(key);
    if (range) { onChange(range.start, range.end); setOpen(false); }
  }

  function handleDayClick(date) {
    if (selecting === "start") {
      setTempStart(date); setTempEnd(null); setSelecting("end");
    } else {
      const s = tempStart <= date ? tempStart : date;
      const e = tempStart <= date ? date : tempStart;
      setTempStart(s);
      setTempEnd(e);
      setSelecting(null);
    }
  }

  const dropdownBg  = isDark ? "bg-[#1a1a1a] border border-white/10" : "bg-white border border-gray-100";
  const presetBorder = isDark ? "border-white/10" : "border-gray-100";

  return (
    <div ref={ref} className="relative inline-block">
      {/* Trigger */}
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors
          border-red-200 bg-white text-red-600 hover:bg-red-50
          ${isDark ? "bg-transparent border-red-500/40 text-red-400 hover:bg-red-500/10" : ""}
          ${open ? isDark ? "border-red-400 bg-red-500/10" : "border-red-400 bg-red-50" : ""}`}
      >
        <Calendar size={14} className={`flex-shrink-0 ${isDark ? "text-red-400" : "text-red-500"}`} />
        <span>{fmt(start)} – {fmt(end)}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className={`fixed z-50 flex rounded-xl shadow-xl overflow-hidden ${dropdownBg}`} style={{ top: pos.top, left: pos.left, transform: 'translateX(-100%)' }}>
          {/* Preset list */}
          <div className={`w-36 border-r py-1 ${presetBorder}`}>
            {PRESETS.map(p => (
              <button
                key={p.key}
                onClick={() => pickPreset(p.key)}
                className={`w-full text-left px-4 py-2 text-sm transition-colors
                  ${activeKey === p.key
                    ? "bg-red-600 text-white font-medium"
                    : isDark
                      ? "text-gray-400 hover:bg-white/5 hover:text-red-400"
                      : "text-gray-600 hover:bg-red-50 hover:text-red-600"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Custom range calendar */}
          {activeKey === "custom" && (
            <div className="p-4">
              <MiniCalendar
                cursor={cursor}
                onCursorChange={setCursor}
                start={tempStart}
                end={tempEnd}
                onDayClick={handleDayClick}
                isDark={isDark}
                t={t}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { setTempStart(null); setTempEnd(null); setSelecting("start"); }}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors
                    ${isDark
                      ? "border-white/10 text-gray-400 hover:bg-white/5 hover:text-red-400"
                      : "border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600"}`}
                >
                  Reset
                </button>
                <button
                  disabled={!tempStart || !tempEnd}
                  onClick={() => { onChange(tempStart, tempEnd); setOpen(false); }}
                  className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors
                    ${!tempStart || !tempEnd
                      ? isDark ? "border-white/10 text-gray-600 cursor-not-allowed" : "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "bg-red-600 border-red-600 text-white hover:bg-red-700"}`}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
