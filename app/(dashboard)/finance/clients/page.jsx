"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function FinanceClientsPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Finance — Clients</h1>
      <p className={`mt-2 ${t.textMuted}`}>Finance clients page placeholder.</p>
    </div>
  );
}
