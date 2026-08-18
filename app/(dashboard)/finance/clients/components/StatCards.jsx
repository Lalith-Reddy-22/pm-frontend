"use client";

import { Users, DollarSign, BarChart2, PieChart as PieIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";

function fmtM(n) {
  return `${n < 0 ? "-" : ""}$${(Math.abs(n) / 1e6).toFixed(2)}M`;
}

function StatCard({ label, value, sub, icon: Icon, valueClass }) {
  const { t } = useTheme();
  return (
    <Card className="flex-1 min-w-0">
      <CardContent className="p-4 flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>{label}</p>
          <p className={`text-xl font-bold ${valueClass ?? t.textPrimary}`}>{value}</p>
          {sub && <p className={`text-xs ${t.textMuted} mt-0.5`}>{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-full ${t.clientIconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4 text-red-500" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function StatCards({ clients = [] }) {
  const totalPredicted = clients.reduce((s, c) => s + (c.total_PO_Value ?? 0), 0);
  const avgActualPct   = clients.length
    ? (clients.reduce((s, c) => s + c.actual_percentage, 0) / clients.length).toFixed(2)
    : "0";

  return (
    <div className="flex gap-4 flex-wrap">
      <StatCard label="Total Clients"        value={clients.length}        sub="Active Clients"    icon={Users} />
      <StatCard label="Predicted GP (Total)"  value={fmtM(totalPredicted)}  sub="100%"             icon={DollarSign}  valueClass="text-red-600" />
      <StatCard label="Actual GP% (Avg)"      value={`${avgActualPct}%`}    sub="vs Predicted"     icon={BarChart2} />
      <StatCard label="Current GP% (Avg)"     value={`${avgActualPct}%`}    sub="Overall Average"  icon={PieIcon}     valueClass="text-red-600" />
    </div>
  );
}
