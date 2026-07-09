"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function ProjectListsPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Project Lists</h1>
      <p className={`mt-2 ${t.textMuted}`}>Project lists page placeholder.</p>
    </div>
  );
}
