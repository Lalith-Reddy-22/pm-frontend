"use client";

import { useState, useMemo, useRef } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import WeekRangePicker from "./WeekRangePicker";
import { useTheme } from "../context/ThemeContext";

const SEED_START = new Date("2026-06-29");
const SEED_END   = new Date("2026-07-03");

// ── Mock data ─────────────────────────────────────────────────────────────────
function getMockData() {
  const names = [
    { id: 1,  name: "Kartik M V",          dept: "Content"  },
    { id: 2,  name: "Jayasree R",           dept: "Content"  },
    { id: 3,  name: "Yashee Khandelwal",    dept: "Content"  },
    { id: 4,  name: "Harshitha P N",        dept: "Content"  },
    { id: 5,  name: "Utkarsha Nagarkar",    dept: "Content"  },
    { id: 6,  name: "Priyanka Dwivedi",     dept: "Content"  },
    { id: 7,  name: "Anushree S Shenoy",    dept: "Content"  },
    { id: 8,  name: "Balamurugan Gopalan",  dept: "Tech"     },
    { id: 9,  name: "Ravi Shankar",         dept: "Tech"     },
    { id: 10, name: "Meera Pillai",         dept: "Creative" },
    { id: 11, name: "Arjun Das",            dept: "Creative" },
    { id: 12, name: "Sneha Rao",            dept: "PM's"     },
    { id: 13, name: "Kiran Nair",           dept: "PM's"     },
    { id: 14, name: "Divya Menon",          dept: "AM's"     },
    { id: 15, name: "Pooja Iyer",           dept: "AM's"     },
  ];

  // seed 60 days of data so any range has coverage
  const days = getDatesInRange(new Date("2026-06-01"), new Date("2026-07-31"));

  // deterministic pseudo-random using index as seed
  function seededRand(seed) {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  }

  return names.map(({ id, name, dept }) => {
    const dailyData = {};
    days.forEach((day, di) => {
      const key  = day.toISOString().slice(0, 10);
      const seed = id * 1000 + di;
      const rand = seededRand(seed);
      if (rand < 0.3) {
        dailyData[key] = { type: "available" };
      } else if (rand < 0.5) {
        dailyData[key] = { type: "dot" };
      } else {
        const p = +(seededRand(seed + 0.1) * 8).toFixed(2);
        const a = +(9 - p).toFixed(2);
        const l = seededRand(seed + 0.2) < 0.15 ? 1 : 0;
        dailyData[key] = { type: "data", p, a, l };
      }
    });
    return { id, name, dept, dailyData };
  });
}

function getDatesInRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function fmtColDate(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DayCell({ entry, isDark, t }) {
  if (!entry) return <td className={`px-4 py-3 text-center ${t.textMuted}`}>—</td>;

  if (entry.type === "dot" || entry.type === "available") {
    return (
      <td className="px-4 py-3 text-center">
        <span className="text-blue-500 font-semibold text-sm">A</span>
      </td>
    );
  }

  const { p, a, l } = entry;
  const pPct = Math.min((p / 9) * 100, 100);

  return (
    <td className="px-4 py-3">
      <div className="flex items-center gap-1 text-xs justify-center mb-1">
        <span className={`font-medium ${t.textPrimary}`}>P:{p}</span>
        <span className={t.textMuted}>|</span>
        <span className="text-blue-500 font-medium">A:{a}</span>
        <span className={t.textMuted}>|</span>
        <span className={l > 0 ? "text-red-500 font-medium" : t.textMuted}>L:{l}</span>
      </div>
      <div className={`relative h-1 w-full rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
        <div className="absolute left-0 top-0 h-full rounded-full bg-green-500" style={{ width: `${pPct}%` }} />
        {l > 0 && <div className="absolute top-0 h-full w-1 rounded-full bg-red-400" style={{ left: `${pPct}%` }} />}
      </div>
    </td>
  );
}

function SortIcon({ col, sortCol, sortDir }) {
  return (
    <span className="inline-flex flex-col ml-1 opacity-50">
      <ChevronUp   size={10} className={sortCol === col && sortDir === "asc"  ? "opacity-100 text-red-500" : ""} />
      <ChevronDown size={10} className={sortCol === col && sortDir === "desc" ? "opacity-100 text-red-500" : ""} style={{ marginTop: -4 }} />
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TABS  = ["Content", "Creative", "Tech", "PM's", "AM's"];
const PAGE_SIZE = 10;

export default function WeekUtilizationTable() {
  const { t, isDark } = useTheme();

  const [startDate,  setStartDate]  = useState(SEED_START);
  const [endDate,    setEndDate]    = useState(SEED_END);
  const [activeTab,  setActiveTab]  = useState("Content");
  const [search,     setSearch]     = useState("");
  const [sortCol,    setSortCol]    = useState("name");
  const [sortDir,    setSortDir]    = useState("asc");
  const [page,       setPage]       = useState(1);


  const allData  = useRef(getMockData()).current;
  const weekDays = useMemo(() => getDatesInRange(startDate, endDate), [startDate, endDate]);

  function handleRangeChange(s, e) { setStartDate(s); setEndDate(e); setPage(1); }

  const utilization = useMemo(() => {
    const rows = allData.filter(r => r.dept === activeTab);
    let totalP = 0, totalSlots = 0;
    rows.forEach(row => {
      weekDays.forEach(day => {
        const key = day.toISOString().slice(0, 10);
        const e = row.dailyData[key];
        if (e?.type === "data") { totalP += e.p; totalSlots += 9; }
        else if (e?.type === "available") { totalSlots += 9; }
      });
    });
    return totalSlots > 0 ? Math.round((totalP / totalSlots) * 100) : 0;
  }, [allData, activeTab, weekDays]);

  const filtered = useMemo(() => {
    let rows = allData.filter(r => r.dept === activeTab);
    if (search.trim()) rows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));
    rows = [...rows].sort((a, b) => {
      const av = a.name.toLowerCase(), bv = b.name.toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
    return rows;
  }, [allData, activeTab, search, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageRows   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(col) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  }

  function handleTabChange(tab) { setActiveTab(tab); setPage(1); }
  function handleSearch(e)      { setSearch(e.target.value); setPage(1); }

  const card   = isDark ? "bg-[#111111] border border-white/5" : "bg-white border border-gray-200";
  const thCls  = `px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap
    ${isDark ? "text-gray-400 bg-[#1a1a1a]" : "text-gray-500 bg-gray-50"}`;
  const trCls  = `border-t transition-colors ${isDark ? "border-white/5 hover:bg-white/3" : "border-gray-100 hover:bg-gray-50"}`;

  return (
    <div className={`rounded-xl overflow-hidden ${card}`}>

      {/* ── Top bar ── */}
      <div className={`px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>

        {/* Left: date range + utilization */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${t.textSecondary}`}>Tasks Availability</span>
            <WeekRangePicker start={startDate} end={endDate} onChange={handleRangeChange} />
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${t.textSecondary}`}>Utilization:</span>
            <div className="w-24 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div className="h-full rounded-full bg-red-500 transition-all" style={{ width: `${utilization}%` }} />
            </div>
            <span className={`text-sm font-semibold ${t.textPrimary}`}>{utilization}%</span>
            <div className="relative group">
              <Info size={13} className={`${t.textMuted} cursor-pointer`} />
              <div className={`pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                opacity-0 group-hover:opacity-100 transition-opacity duration-150
                rounded-lg px-3 py-2 text-xs shadow-lg whitespace-nowrap
                ${isDark ? "bg-[#2a2a2a] border border-white/10 text-gray-200" : "bg-gray-900 text-white"}`}
              >
                (Logged Hours / Planned Hours) * 100
                <div className={`absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent
                  ${isDark ? "border-t-[#2a2a2a]" : "border-t-gray-900"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: tabs */}
        <div className={`flex items-center rounded-full p-1 gap-1 ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab
                  ? isDark ? "bg-white text-gray-900 shadow-sm" : "bg-gray-900 text-white shadow-sm"
                  : isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ── */}
      <div className={`px-6 py-3 flex justify-end border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
        <div className="flex items-center gap-2">
          <span className={`text-sm ${t.textSecondary}`}>Search:</span>
          <input
            value={search}
            onChange={handleSearch}
            className={`w-44 px-3 py-1.5 rounded-lg text-sm border outline-none transition-colors
              ${isDark
                ? "bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-red-500/50"
                : "bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-red-400"
              }`}
          />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className={`${thCls} w-52`} onClick={() => toggleSort("name")}>
                NAME <SortIcon col="name" sortCol={sortCol} sortDir={sortDir} />
              </th>
              {weekDays.map(day => (
                <th key={day.toISOString()} className={`${thCls} min-w-[160px]`}>
                  {fmtColDate(day)} <SortIcon col={day.toISOString()} sortCol={sortCol} sortDir={sortDir} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              // compute weekly P/L totals for name cell
              let totalP = 0, totalL = 0;
              weekDays.forEach(day => {
                const e = row.dailyData[day.toISOString().slice(0, 10)];
                if (e?.type === "data") { totalP += e.p; totalL += e.l; }
              });

              return ( 
                <tr key={row.id} className={trCls}>
                  {/* Name cell */}
                  <td className={`px-4 py-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}> 
                    <div className="font-medium">{row.name}</div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs">
                      <span className={t.textSecondary}>P : {+totalP.toFixed(2)}</span>
                      <span className={t.textMuted}>|</span>
                      <span className={totalL > 0 ? "text-red-500" : t.textMuted}>L : {totalL}</span>
                    </div>
                  </td>
                  {/* Day cells */}
                  {weekDays.map(day => {
                    const key = day.toISOString().slice(0, 10);
                    return <DayCell key={key} entry={row.dailyData[key]} isDark={isDark} t={t} />;
                  })}
                </tr>
              );
            })}

            {pageRows.length === 0 && (
              <tr>
                <td colSpan={weekDays.length + 1} className={`px-4 py-10 text-center ${t.textMuted}`}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Footer ── */}
      <div className={`px-6 py-3 flex items-center justify-between text-sm border-t ${isDark ? "border-white/5 text-gray-400" : "border-gray-100 text-gray-500"}`}>
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} entries
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded-lg transition-colors disabled:opacity-40
              ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors
                ${p === page ? "bg-red-500 text-white" : isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded-lg transition-colors disabled:opacity-40
              ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
}
