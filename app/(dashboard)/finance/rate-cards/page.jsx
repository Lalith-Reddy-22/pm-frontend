"use client";

import { useTheme } from "../../../context/ThemeContext";

export default function RateCardsPage() {
  const { t } = useTheme();
  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold ${t.textPrimary}`}>Rate Cards</h1>
      <p className={`mt-2 ${t.textMuted}`}>Rate cards page placeholder.</p>
    </div>
  );
}
