"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import StatCards     from "./components/StatCards";
import GPBarChart    from "./components/GPBarChart";
import TopPerformers from "./components/TopPerformers";
import ClientTable   from "./components/ClientTable";
import CustomSelect from "@/components/ui/CustomSelect";
import { fetchFinancialYears, fetchClientGP, setSelectedYear } from "@/store/slices/financeClientSlice";

export default function FinanceClientsPage() {
  const { t } = useTheme();
  const router   = useRouter();
  const dispatch = useDispatch();
  const [topN, setTopN] = useState(10);
  const {
    financialYears,
    selectedYear,
    clientsCache,
    yearsLoading,
    yearsError,
    clientsLoading,
    clientsError,
  } = useSelector((state) => state.financeClient);

  // Fetch financial years once
  useEffect(() => {
    if (financialYears.length > 0) return;
    dispatch(fetchFinancialYears());
  }, [dispatch, financialYears.length]);

  // Fetch clients whenever selected year changes (cached per year)
  useEffect(() => {
    if (!selectedYear || clientsCache[selectedYear]) return;
    dispatch(fetchClientGP({ finYrId: selectedYear }));
  }, [dispatch, selectedYear, clientsCache]);

  const clients = clientsCache[selectedYear] ?? [];

  const yearOptions = financialYears.map((y) => ({
    value: String(y.id),
    label: y.financial_Year,
  }));

  if (yearsLoading) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (yearsError || clientsError) {
    return (
      <div className="flex h-full min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-red-500">
            {yearsError || clientsError}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${t.mainBg} min-h-screen`}>

      <div className={`sticky top-0 z-10 px-6 py-4 bg-inherit border-b ${t.clientBorder} flex items-end justify-between`}>
        <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>Financial Year</p>
          <div className="w-40">
            <CustomSelect
              value={selectedYear ? String(selectedYear) : ""}
              onChange={(val) => dispatch(setSelectedYear(val))}
              placeholder="Select Year"
              options={yearOptions}
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
        {clientsLoading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-muted-foreground">Loading clients...</p>
          </div>
        ) : (
          <>
            <StatCards clients={clients} />

            <div className="flex gap-4 w-full">
              <div className="w-[70%] flex"><GPBarChart clients={clients} topN={topN} onTopNChange={setTopN} /></div>
              <div className="w-[30%] flex"><TopPerformers clients={clients} /></div>
            </div>

            <ClientTable finYrId={selectedYear} allClients={clients} />
          </>
        )}
      </div>
    </div>
  );
}
