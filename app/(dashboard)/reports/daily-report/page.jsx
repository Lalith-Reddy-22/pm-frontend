"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function DailyReportPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Daily Report</h1>
      <p className={`mt-2 ${t.textMuted}`}>Daily report page placeholder.</p>
    </div>
  );
}
