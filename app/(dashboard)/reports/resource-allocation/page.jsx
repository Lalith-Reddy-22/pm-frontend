"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function ResourceAllocationPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Resource Allocation</h1>
      <p className={`mt-2 ${t.textMuted}`}>Resource allocation report placeholder.</p>
    </div>
  );
}
