"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTheme } from "../../../../context/ThemeContext";
import { BAR_DATA, barConfig } from "../data";

export default function GPBarChart({ topN, onTopNChange }) {
  const { t, isDark } = useTheme();
  const data = BAR_DATA.slice(0, topN);
  const gridColor = isDark ? "#ffffff10" : "#f0f0f0";
  const tickColor = isDark ? "#6b7280" : "#9ca3af";

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Actual GP vs Predicted GP</CardTitle>
          <select
            value={topN}
            onChange={e => onTopNChange(Number(e.target.value))}
            className={`border ${t.clientBorder} rounded px-2 py-1 text-xs ${t.clientInputText} ${t.clientInputBg}`}
          >
            <option value={5}>Top 5</option>
            <option value={10}>Top 10</option>
            <option value={12}>All</option>
          </select>
        </div>
        <div className="flex gap-4 mt-1">
          <span className={`flex items-center gap-1 text-xs ${t.textSecondary}`}><span className="w-3 h-2 rounded-sm bg-red-600 inline-block" /> Actual GP</span>
          <span className={`flex items-center gap-1 text-xs ${t.textSecondary}`}><span className="w-3 h-2 rounded-sm bg-gray-400 inline-block" /> Predicted GP</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ChartContainer config={barConfig} className="h-[320px] w-full">
          <BarChart data={data} barCategoryGap="20%">
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: tickColor }} tickFormatter={v => v.length > 6 ? v.slice(0, 6) + "…" : v} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: tickColor }} tickFormatter={v => `$${(v / 1e6).toFixed(1)}M`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="actual"    fill="#dc2626" radius={[3, 3, 0, 0]} />
            <Bar dataKey="predicted" fill="#9ca3af" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
