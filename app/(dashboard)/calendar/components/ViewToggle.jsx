"use client";

import { List, Calendar, LayoutGrid } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";

const VIEWS = [
  { key: "list",  label: "List",  Icon: List },
  { key: "month", label: "Month", Icon: Calendar },
  { key: "week",  label: "Week",  Icon: LayoutGrid },
];

export default function ViewToggle({ view, setView }) {
  const { t } = useTheme();
  return (
    <div className="flex items-center gap-1">
      {VIEWS.map(({ key, label, Icon }) => (
        <button
          key={key}
          onClick={() => setView(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${view === key
              ? "bg-[#E12729] text-white"
              : `${t.textSecondary} ${t.navRowHover} border border-border`
            }`}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  );
}
