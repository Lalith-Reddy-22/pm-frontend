"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

function statusFromPct(pct) {
  if (pct > 60) return "High";
  if (pct >= 20) return "Medium";
  return "Low";
}

function StatusBadge({ pct, isDark }) {
  const status = statusFromPct(pct);
  const map = isDark
    ? { High: "bg-green-500/20 text-green-400", Medium: "bg-white/10 text-gray-400", Low: "bg-red-500/20 text-red-400" }
    : { High: "bg-green-100 text-green-700",    Medium: "bg-gray-100 text-gray-600", Low: "bg-red-100 text-red-600" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

export default function AllClientsModal({ clients = [], onClose }) {
  const { t, isDark } = useTheme();
  const [search, setSearch] = useState("");

  const sorted   = [...clients].sort((a, b) => b.total_PO_Value - a.total_PO_Value);
  const filtered = sorted.filter(c => c.client_Title.toLowerCase().includes(search.toLowerCase()));
  const max      = Math.max(...clients.map(c => c.total_PO_Value), 1);

  const fmtM = (n) => `${n < 0 ? "-" : ""}$${(Math.abs(n) / 1e6).toFixed(2)}M`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className={`relative ${t.clientModalBg} rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col`}>

        <div className={`flex items-center justify-between px-6 py-4 border-b ${t.clientBorder}`}>
          <div>
            <h2 className={`text-base font-semibold ${t.clientModalText}`}>All Clients</h2>
            <p className={`text-xs ${t.textMuted} mt-0.5`}>Ranked by PO Value</p>
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
            <div key={c.client_ID} className={`flex items-center gap-4 py-2.5 border-b ${t.clientBorder} last:border-0`}>
              <span className={`w-5 text-xs ${t.textMuted} font-medium shrink-0`}>{i + 1}</span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${t.clientModalText} truncate`}>{c.client_Title}</span>
                  <span className="text-xs font-semibold ml-2 shrink-0 text-red-500">
                    {fmtM(c.total_PO_Value)}
                  </span>
                </div>
                <div className={`h-1.5 w-full ${isDark ? "bg-white/10" : "bg-gray-100"} rounded-full overflow-hidden`}>
                  <div
                    className="h-full rounded-full transition-all bg-red-600"
                    style={{ width: `${Math.max(0, (c.total_PO_Value / max) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0"><StatusBadge pct={c.actual_percentage} isDark={isDark} /></div>
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
