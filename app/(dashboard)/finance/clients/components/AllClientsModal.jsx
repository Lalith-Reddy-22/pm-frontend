"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";
import { CLIENTS, fmt, fmtPct } from "../data";

const sorted = [...CLIENTS].sort((a, b) => b.currentGPPct - a.currentGPPct);

function StatusBadge({ status, isDark }) {
  const map = isDark
    ? { High: "bg-green-500/20 text-green-400", Medium: "bg-white/10 text-gray-400", Low: "bg-red-500/20 text-red-400" }
    : { High: "bg-green-100 text-green-700", Medium: "bg-gray-100 text-gray-600", Low: "bg-red-100 text-red-600" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? map.Medium}`}>{status}</span>;
}

export default function AllClientsModal({ onClose }) {
  const { t, isDark } = useTheme();
  const [search, setSearch] = useState("");
  const filtered = sorted.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const max = Math.max(...CLIENTS.map(c => c.currentGPPct));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative ${t.clientModalBg} rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col`}>

        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.clientBorder}`}>
          <div>
            <h2 className={`text-base font-semibold ${t.clientModalText}`}>All Clients</h2>
            <p className={`text-xs ${t.textMuted} mt-0.5`}>Ranked by Current GP%</p>
          </div>
          <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-lg ${t.clientRowHover} ${t.textMuted}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`px-6 py-3 border-b ${t.clientBorder}`}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search client..."
              className={`w-full pl-9 pr-4 py-2 border ${t.clientBorder} rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-300 ${t.clientInputBg} ${t.clientInputText}`}
            />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-3 space-y-2 custom-scrollbar">
          {filtered.map((c, i) => (
            <div key={c.name} className={`flex items-center gap-4 py-2.5 border-b ${t.clientBorder} last:border-0`}>
              <span className={`w-5 text-xs ${t.textMuted} font-medium shrink-0`}>{i + 1}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${t.clientModalText} truncate`}>{c.name}</span>
                  <span className={`text-xs font-semibold ml-2 shrink-0 ${c.currentGPPct >= 60 ? "text-green-500" : c.currentGPPct >= 20 ? t.clientMutedText : "text-red-500"}`}>
                    {fmtPct(c.currentGPPct)}
                  </span>
                </div>
                <div className={`h-1.5 w-full ${isDark ? "bg-white/10" : "bg-gray-100"} rounded-full overflow-hidden`}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.max(0, (c.currentGPPct / max) * 100)}%`,
                      background: c.currentGPPct >= 60 ? "#dc2626" : c.currentGPPct >= 20 ? "#9ca3af" : "#fca5a5",
                    }}
                  />
                </div>
              </div>

              <div className="shrink-0"><StatusBadge status={c.status} isDark={isDark} /></div>
              <span className={`text-xs ${t.textMuted} shrink-0 w-24 text-right`}>{fmt(c.actualGP)}</span>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className={`text-center text-sm ${t.textMuted} py-8`}>No clients found.</p>
          )}
        </div>

        <div className={`px-6 py-3 border-t ${t.clientBorder} flex items-center justify-between`}>
          <span className={`text-xs ${t.textMuted}`}>{filtered.length} client{filtered.length !== 1 ? "s" : ""}</span>
          <button onClick={onClose} className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
