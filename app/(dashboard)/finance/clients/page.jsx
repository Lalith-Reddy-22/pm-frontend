"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import StatCards     from "./components/StatCards";
import GPBarChart    from "./components/GPBarChart";
import TopPerformers from "./components/TopPerformers";
import ClientTable   from "./components/ClientTable";
import CustomSelect from "@/components/ui/CustomSelect";

export default function FinanceClientsPage() {
  const { t } = useTheme();
  const router = useRouter();
  const [topN, setTopN] = useState(10);
  const [financialYear, setFinancialYear] = useState("2026-2027");

  return (
    <div className={`${t.mainBg} min-h-screen`}>

      <div className={`sticky top-0 z-10 px-6 py-4 bg-inherit border-b ${t.clientBorder} flex items-end justify-between`}>
        <div>
  <p className={`text-xs ${t.textSecondary} mb-1`}>
    Financial Year
  </p>

  <div className="w-40">
    <CustomSelect
      value={financialYear}
      onChange={setFinancialYear}
      placeholder="Select Year"
      options={[
        {
          value: "2026-2027",
          label: "2026 - 2027",
        },
        {
          value: "2025-2026",
          label: "2025 - 2026",
        },
      ]}
    />
  </div>
</div>
        <div className="flex gap-2">
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
