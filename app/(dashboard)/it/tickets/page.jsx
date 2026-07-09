"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function TicketsPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Tickets</h1>
      <p className={`mt-2 ${t.textMuted}`}>IT tickets page placeholder.</p>
    </div>
  );
}
