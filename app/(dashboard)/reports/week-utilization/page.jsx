"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function SummaryReportPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Weekly Utilization</h1>
      <p className={`mt-2 ${t.textMuted}`}>Weekly utilization report page placeholder.</p>
    </div>
  );
}
 