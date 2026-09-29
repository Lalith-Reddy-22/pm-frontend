"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import MiniCalendar from "./components/MiniCalendar";
import SummaryPanel from "./components/SummaryPanel";
import EventCard    from "./components/EventCard";
import ViewToggle   from "./components/ViewToggle";
import { useTheme } from "../../context/ThemeContext";

// ── Fallback static data (used until real API is connected) ──────────────────
import { EVENTS, SUMMARY } from "./components/calendarData";

const DAY_HEADERS = ["Monday","Tuesday","Wednesday","Thursday","Friday"];

function MonthView({ year, month, events, loading, error }) {
  const { t } = useTheme();
  if (loading) return <div className="flex items-center justify-center h-full"><div className="flex items-center gap-2"><Loader2 size={16} className={`animate-spin text-[#E12729]`} /><p className={`text-sm ${t.textSecondary}`}>Loading events…</p></div></div>;
  if (error)   return <div className="flex items-center justify-center h-full"><p className="text-destructive text-sm">{error}</p></div>;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today       = new Date();

  const eventsByDay = {};
  events.forEach(e => {
    const d = new Date(e.date).getDate();
    (eventsByDay[d] = eventsByDay[d] || []).push(e);
  });

  // Build cells skipping Sunday (0) and Saturday (6)
  const cells = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    if (dow === 0 || dow === 6) continue;
    // Monday=0 offset within the week
    if (cells.length === 0) {
      // pad start of first week (Mon=1..Fri=5 → offset 0..4)
      const offset = dow - 1;
      for (let p = 0; p < offset; p++) cells.push(null);
    }
    cells.push(d);
  }
  while (cells.length % 5 !== 0) cells.push(null);
  const weeks = cells.length / 5;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={`grid grid-cols-5 border-b border-border flex-shrink-0 ${t.cardBg}`}>
        {DAY_HEADERS.map(d => (
          <div key={d} className={`text-center text-xs font-semibold py-2 ${t.textSecondary}`}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-5 flex-1 overflow-hidden" style={{ gridTemplateRows: `repeat(${weeks}, minmax(0, 1fr))` }}>
        {cells.map((day, i) => {
          const isToday = day && today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          return (
            <div key={i} className={`border-r border-b border-border p-1 flex flex-col overflow-hidden ${
              !day ? (t.mainBg) : isToday ? "bg-red-50 dark:bg-red-950/20" : t.cardBg
            }`}>
              {day && (
                <>
                  <span className={`text-xs font-semibold mb-1 flex-shrink-0 w-6 h-6 min-w-[1.5rem] aspect-square flex items-center justify-center rounded-full ${
                    isToday ? "bg-[#E12729] text-white" : t.textSecondary
                  }`}>{day}</span>
                  <div className="space-y-1 overflow-y-auto flex-1 min-h-0">
                    {(eventsByDay[day] || []).map(e => (
                      <div key={e.id} className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded p-1">
                        <p className="text-[11px] font-medium text-[#E12729] leading-tight line-clamp-2">{e.title}</p>
                        <p className="text-[10px] text-[#E12729]/80 mt-0.5">Allocated: {e.allocatedHours}h</p>
                        <p className="text-[10px] text-[#E12729]/80">Logged: {e.loggedHours}h</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// ── API helpers (swap BASE_URL when backend is ready) ────────────────────────
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function fetchEvents(year, month) {
  if (!BASE_URL) {
    // No API yet — filter from static data
    return EVENTS.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }
  // month+1 because API typically expects 1-based month
  const res = await fetch(`${BASE_URL}/api/calendar/events?year=${year}&month=${month + 1}`);
  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  // Normalise API response to match EventCard props:
  // { id, date, day, dayNum, month, title, allocatedHours, loggedHours }
  return data.map(e => ({
    id:             e.id,
    date:           e.date,
    day:            new Date(e.date).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    dayNum:         String(new Date(e.date).getDate()).padStart(2, "0"),
    month:          new Date(e.date).toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    title:          e.title ?? e.taskName ?? e.name,
    allocatedHours: e.allocatedHours ?? e.allocated_hours ?? 0,
    loggedHours:    e.loggedHours    ?? e.logged_hours    ?? 0,
  }));
}

async function fetchSummary(year, month) {
  if (!BASE_URL) return SUMMARY;
  const res = await fetch(`${BASE_URL}/api/calendar/summary?year=${year}&month=${month + 1}`);
  if (!res.ok) throw new Error("Failed to fetch summary");
  const data = await res.json();
  return {
    totalAllocatedHours: data.totalAllocatedHours ?? data.total_allocated_hours ?? "0h",
    totalLoggedHours:    data.totalLoggedHours    ?? data.total_logged_hours    ?? "0h",
    tasksCompleted:      data.tasksCompleted      ?? data.tasks_completed       ?? 0,
  };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const today = new Date();
  const { t } = useTheme();
  const [year,     setYear]     = useState(2026);
  const [month,    setMonth]    = useState(6); // July = 6
  const [selected, setSelected] = useState(null);
  const [view,     setView]     = useState("list");

  const [events,  setEvents]  = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Re-fetch whenever year or month changes
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([fetchEvents(year, month), fetchSummary(year, month)])
      .then(([evts, sum]) => {
        if (cancelled) return;
        setEvents(evts);
        setSummary(sum);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [year, month]);

  function prev() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }
  function next() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1); 
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden p-4 sm:p-6 gap-4">

      {/* ── Left sidebar ── */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
        <div className={`rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>
          <MiniCalendar
            year={year}
            month={month}
            today={today}
            selectedDate={selected}
            onSelect={setSelected}
            onPrev={prev}
            onNext={next}
          />
        </div>
        <SummaryPanel summary={summary} loading={loading} />
      </div>

      {/* ── Main panel ── */}
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={prev} className={`p-1.5 rounded-lg ${t.navRowHover} ${t.textSecondary} transition-colors`}>
              <ChevronLeft size={16} />
            </button>
            <button onClick={next} className={`p-1.5 rounded-lg ${t.navRowHover} ${t.textSecondary} transition-colors`}>
              <ChevronRight size={16} />
            </button>
            <h2 className={`text-base font-bold ml-1 ${t.textPrimary}`}>
              {MONTH_NAMES[month]} {year}
            </h2>
          </div>
          <ViewToggle view={view} setView={setView} />
        </div>

        {/* Event list */}
        <div className={`flex-1 min-h-0 ${view === "month" ? "overflow-hidden" : "overflow-y-auto p-4 space-y-3"}`}>
          {view === "list" && (
            loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-[#E12729]" />
                  <p className={`text-sm ${t.textSecondary}`}>Loading events…</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            ) : events.length > 0 ? (
              (() => {
                const grouped = {};
                events.forEach(e => {
                  if (!grouped[e.date]) grouped[e.date] = { day: e.day, dayNum: e.dayNum, month: e.month, tasks: [] };
                  grouped[e.date].tasks.push(e);
                });
                return Object.entries(grouped).map(([date, g]) => (
                  <EventCard key={date} day={g.day} dayNum={g.dayNum} month={g.month} tasks={g.tasks} />
                ));
              })()
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className={`text-sm ${t.textSecondary}`}>No events for this month.</p>
              </div>
            )
          )}

          {view === "month" && (
            <MonthView year={year} month={month} events={events} loading={loading} error={error} />
          )}

          {view !== "list" && view !== "month" && (
            <div className="flex items-center justify-center h-full">
              <p className={`text-sm capitalize ${t.textSecondary}`}>{view} view coming soon.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
