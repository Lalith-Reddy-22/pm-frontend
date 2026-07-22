"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import ProjectTable from "./components/ProjectTable";
import AddProjectPanel from "./components/AddProjectPanel";
import AddRateCardPanel from "./components/AddRateCardPanel";

const YEARS = ["2026 - 2027", "2025 - 2026", "2024 - 2025"];

export default function ProjectListsPage() {
  const { t } = useTheme();
  const [selectedYear, setSelectedYear] = useState(YEARS[0]);
  const [open, setOpen] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showRateCard, setShowRateCard] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${t.mainBg} min-h-screen`}>
      <div className={`sticky top-0 z-10 px-6 py-4 bg-inherit border-b ${t.clientBorder} flex items-end justify-between`}>
        <div>
          <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>Financial Year</p>

          <div ref={wrapperRef} className="relative">
            <button
              onClick={() => setOpen(prev => !prev)}
              className={`flex items-center gap-2 border ${t.clientBorder} rounded-lg px-3 py-1.5 text-sm ${t.clientInputText} ${t.clientInputBg} hover:border-red-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-red-300 min-w-[140px]`}
            >
              <span className="flex-1 text-left">{selectedYear}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 shrink-0 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : ""} ${t.textMuted}`}
              />
            </button>

            {open && (
              <div className={`dropdown-open absolute left-0 top-full mt-1 w-full rounded-lg border ${t.clientBorder} ${t.clientInputBg} shadow-lg overflow-hidden z-20`}>
                {YEARS.map(year => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 ${
                      year === selectedYear ? "bg-red-600 text-white" : `${t.clientInputText} hover:bg-red-50 dark:hover:bg-red-500/10`
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowProject(true)} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150">
            <span className="text-base leading-none">+</span> Project
          </button>
          <button onClick={() => setShowRateCard(true)} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150">
            <span className="text-base leading-none">+</span> Rate Card
          </button>
        </div>
      </div>

      <div className="p-6">
        <ProjectTable />
      </div>

      {showProject && <AddProjectPanel onClose={() => setShowProject(false)} />}
      {showRateCard && <AddRateCardPanel onClose={() => setShowRateCard(false)} />}
    </div>
  );
}
