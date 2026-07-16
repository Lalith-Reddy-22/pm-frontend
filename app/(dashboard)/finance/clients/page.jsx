"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Plus } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import StatCards     from "./components/StatCards";
import GPBarChart    from "./components/GPBarChart";
import TopPerformers from "./components/TopPerformers";
import ClientTable   from "./components/ClientTable";

export default function FinanceClientsPage() {
  const { t } = useTheme();
  const router = useRouter();
  const [topN, setTopN] = useState(10);

  return (
    <div className={`${t.mainBg} min-h-screen`}>

      <div className={`sticky top-0 z-10 px-6 py-4 bg-inherit border-b ${t.clientBorder} flex items-end justify-between`}>
        <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>Financial Year</p>
          <select className={`border ${t.clientBorder} rounded-lg px-3 py-1.5 text-sm ${t.clientInputText} ${t.clientInputBg}`}>
            <option>2026 - 2027</option>
            <option>2025 - 2026</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className={`flex items-center gap-1.5 px-3 py-1.5 border ${t.clientBorder} rounded-lg text-sm ${t.clientMutedText} ${t.clientRowHover}`}>
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button
            onClick={() => router.push("/finance/clients/new")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
          >
            <Plus className="w-4 h-4" /> Create Client
          </button>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <StatCards />

        <div className="flex gap-4 w-full">
          <div className="w-[70%] flex"><GPBarChart topN={topN} onTopNChange={setTopN} /></div>
          <div className="w-[30%] flex"><TopPerformers /></div>
        </div>

        <ClientTable />
      </div>
    </div>
  );
}
