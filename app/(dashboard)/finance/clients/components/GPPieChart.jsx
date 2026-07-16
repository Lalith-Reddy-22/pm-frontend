"use client";

import { Pie, PieChart, Label, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTheme } from "../../../../context/ThemeContext";
import { PIE_DATA, pieConfig, SUMMARY } from "../data";

export default function GPPieChart() {
  const { t, isDark } = useTheme();
  const total = SUMMARY.totalClients;
  const labelFill = isDark ? "#f3f4f6" : "#111";

  return (
    <Card className="col-span-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Clients by Current GP%</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex items-center gap-4">
        <ChartContainer config={pieConfig} className="h-[200px] w-[200px] shrink-0">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={PIE_DATA} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={4}>
              {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              <Label content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} fontSize={22} fontWeight={700} fill={labelFill}>{total}</tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} fontSize={11} fill="#9ca3af">Total</tspan>
                    </text>
                  );
                }
              }} />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="space-y-2 text-xs">
          {PIE_DATA.map(d => (
            <div key={d.name} className="flex items-start gap-2">
              <span className="w-2.5 h-2.5 rounded-full mt-0.5 shrink-0" style={{ background: d.fill }} />
              <span className={`${t.clientMutedText} leading-tight`}>{d.name}<br />{d.value} ({((d.value / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
