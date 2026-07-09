"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function ProjectsInfoPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Projects Info</h1>
      <p className={`mt-2 ${t.textMuted}`}>Projects info page placeholder.</p>
    </div>
  );
}
