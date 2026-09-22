"use client";

import { useState } from "react";
import { Pie, PieChart, Cell, Label } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTheme } from "../../../../context/ThemeContext";
import AllClientsModal from "./AllClientsModal";

const COLORS = ["#dc2626", "#ef4444", "#f87171", "#fca5a5", "#fee2e2"];

function fmtM(n) {
  return `${n < 0 ? "-" : ""}$${(Math.abs(n) / 1e6).toFixed(2)}M`;
}

export default function TopPerformers({ clients = [] }) {
  const { t, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const labelFill = isDark ? "#f3f4f6" : "#111";

  const top5 = [...clients]
    .sort((a, b) => b.total_PO_Value - a.total_PO_Value)
    .slice(0, 5);

  const pieData = top5.map((c, i) => ({
    name:  c.client_Title,
    value: Math.max(0, c.total_PO_Value),
    fill:  COLORS[i],
  }));

  const pieConfig = Object.fromEntries(
    top5.map((c, i) => [c.client_Title, { label: c.client_Title, color: COLORS[i] }])
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Top Performers</CardTitle>
            <span className={`text-xs ${t.textMuted}`}>by PO Value</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex flex-col items-center">
          <ChartContainer config={pieConfig} className="h-[200px] w-full">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} strokeWidth={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                <Label content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} fontSize={13} fontWeight={700} fill={labelFill}>Top 5</tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} fontSize={10} fill="#9ca3af">Clients</tspan>
                      </text>
                    );
                  }
                }} />
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="w-full space-y-1.5 mt-1">
            {top5.map((c, i) => (
              <div key={c.client_ID} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                  <span className={t.textPrimary}>{c.client_Title}</span>
                </div>
                <span className={`font-medium ${t.clientMutedText}`}>{fmtM(c.total_PO_Value)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setOpen(true)}
            className="w-full mt-3 border border-red-500 text-red-500 rounded-lg py-1.5 text-xs hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            View All Clients
          </button>
        </CardContent>
      </Card>

      {open && <AllClientsModal clients={clients} onClose={() => setOpen(false)} />}
    </>
  );
}
