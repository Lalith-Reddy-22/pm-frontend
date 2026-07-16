"use client";

import { Users, DollarSign, BarChart2, PieChart as PieIcon, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";
import { SUMMARY, fmtM, fmtPct } from "../data";

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

export default function StatCards() {
  const { totalClients, predictedGP, actualGP, currentGPPct, variance } = SUMMARY;
  const actualPct = predictedGP > 0 ? ((actualGP / predictedGP) * 100).toFixed(2) : "0";
  return (
    <div className="flex gap-4 flex-wrap">
      <StatCard label="Total Clients"        value={totalClients}       sub="Active Clients"              icon={Users} />
      <StatCard label="Predicted GP (Total)"  value={fmtM(predictedGP)}  sub="100%"                        icon={DollarSign}  valueClass="text-red-600" />
      <StatCard label="Actual GP (Total)"     value={fmtM(actualGP)}     sub={`${actualPct}% of Predicted`} icon={BarChart2} />
      <StatCard label="Current GP% (Avg)"     value={fmtPct(currentGPPct)} sub="Overall Average"           icon={PieIcon}     valueClass="text-red-600" />
      <StatCard label="Variance (Total)"      value={fmtM(variance)}     sub="Predicted vs Actual"         icon={TrendingDown} valueClass="text-red-600" />
    </div>
  );
}
