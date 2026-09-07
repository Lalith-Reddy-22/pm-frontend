"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import StatCards     from "./components/StatCards";
import GPBarChart    from "./components/GPBarChart";
import TopPerformers from "./components/TopPerformers";
import ClientTable   from "./components/ClientTable";
import CustomSelect from "@/components/ui/CustomSelect";
import { api } from "@/lib/api";
import { setFinancialYears, setSelectedYear, setClientsCache } from "@/lib/store/financeSlice";
import { getCurrentFinYearId } from "@/lib/getCurrentFinYear";

export default function FinanceClientsPage() {
  const { t } = useTheme();
  const router   = useRouter();
  const dispatch = useDispatch();
  const [topN, setTopN] = useState(10);
  const [error, setError] = useState("");

  const { financialYears, selectedYear, clientsCache } = useSelector(s => s.finance);

  useEffect(() => {
    // Fetch financial years only once
    if (financialYears.length > 0) return;

    api.get("/api/v1/finance/financial-years")
      .then(data => {
        dispatch(setFinancialYears(data));
        if (!selectedYear && data.length > 0)
          dispatch(setSelectedYear(getCurrentFinYearId(data)));
      })
      .catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    if (!selectedYear || clientsCache[selectedYear]) return;

    api.get(`/api/v1/finance-client/client-gp?finYrId=${selectedYear}&pageNumber=1&pageSize=1000`)
      .then(data => dispatch(setClientsCache({ key: selectedYear, data: data.clients ?? [] })))
      .catch(e => setError(e.message));
  }, [selectedYear]);

  const clients = clientsCache[selectedYear] ?? [];

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <p className="text-red-500 font-medium">{error}</p>
      <button onClick={() => setError("")} className="text-sm text-red-500 underline">Retry</button>
    </div>
  );

  return (
    <div className={`${t.mainBg} min-h-screen`}>

      <div className={`sticky top-0 z-10 px-6 py-4 bg-inherit border-b ${t.clientBorder} flex items-end justify-between`}>
        <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>Financial Year</p>
          <select
            value={selectedYear}
            onChange={e => dispatch(setSelectedYear(e.target.value))}
            className={`border ${t.clientBorder} rounded-lg px-3 py-1.5 text-sm ${t.clientInputText} ${t.clientInputBg}`}
          >
            {financialYears.map(y => (
              <option key={y.id} value={y.id}>{y.financial_Year}</option>
            ))}
          </select>
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
        <StatCards clients={clients} />

        <div className="flex gap-4 w-full">
          <div className="w-[70%] flex"><GPBarChart clients={clients} topN={topN} onTopNChange={setTopN} /></div>
          <div className="w-[30%] flex"><TopPerformers clients={clients} /></div>
        </div>

        <ClientTable finYrId={selectedYear} allClients={clients} />
      </div>
    </div>
  );
}
