"use client";

import { useTheme } from "../../context/ThemeContext";

export default function CalendarPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Calendar View</h1>
      <p className={`mt-2 ${t.textMuted}`}>Calendar page placeholder.</p>
    </div>
  );
}
