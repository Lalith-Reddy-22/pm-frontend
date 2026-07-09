"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function TemplateTasksPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Template Tasks</h1>
      <p className={`mt-2 ${t.textMuted}`}>Template tasks page placeholder.</p>
    </div>
  );
}
