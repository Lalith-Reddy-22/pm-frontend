"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Briefcase, DollarSign, BarChart2, TrendingDown, PieChart, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";
import DataPagination from "@/components/DataPagination";
import {
  fetchFinancialYears,
  fetchClientProjects,
  fetchClientProjectSummary,
  setSelectedYear,
} from "@/store/slices/financeClientSlice";
import { buildPageNumbers } from "@/lib/utils";

export default function ClientProjectsPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-sm text-muted-foreground">
          Loading client projects...
        </div>
      }
    >
      <ClientProjectsPage />
    </Suspense>
  );
}

function StatusBadge({ status, isDark }) {
  const map = isDark
    ? { Active: "bg-blue-500/20 text-blue-400", Completed: "bg-green-500/20 text-green-400", "On Hold": "bg-yellow-500/20 text-yellow-400" }
    : { Active: "bg-blue-100 text-blue-700",    Completed: "bg-green-100 text-green-700",    "On Hold": "bg-yellow-100 text-yellow-700" };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? (isDark ? "bg-white/10 text-gray-400" : "bg-gray-100 text-gray-600")}`}>
      {status}
    </span>
  );
}

function StatTile({ label, value, icon: Icon, valueClass }) {
  const { t } = useTheme();
  return (
    <Card className="flex-1 min-w-0">
      <CardContent className="p-4 flex items-start justify-between gap-3">
        <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>{label}</p>
          <p className={`text-xl font-bold ${valueClass ?? t.textPrimary}`}>{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-full ${t.clientIconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4 text-red-500" />
        </div>
      </CardContent>
    </Card>
  );
}

const HEADERS = [
  "PROJECT", "RATE CARD", "FIN YEAR", "MANAGER", "STATUS",
  "PO VALUE", "OUTSOURCING COST", "EFFORT EST. COST",
  "PREDICTED HRS", "ACTUAL HRS",
  "PREDICTED COST", "ACTUAL COST",
  "PREDICTED GP", "ACTUAL GP",
  "PREDICTED GP%", "ACTUAL GP%",
];

const PAGE_SIZE = 10;

const STATUS_OPTIONS = [
  { label: "All Status", value: "" },
  { label: "Active",     value: "2" },
  { label: "Completed",  value: "3" },
  { label: "On Hold",    value: "4" },
];

const fmtPct = (n) => `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(2)}%`;

function ClientProjectsPageInner() {
  const { t, isDark } = useTheme();
  const router        = useRouter();
  const { clientId }  = useParams();
  const searchParams  = useSearchParams();
  const dispatch      = useDispatch();

  const {
    financialYears,
    selectedYear,
    projectsCache,
    clientSummaryCache,
    projectsLoading,
    projectsError,
  } = useSelector((s) => s.financeClient);

  const urlYear = searchParams.get("finYrId");
  const [localYear, setLocalYear] = useState(urlYear || selectedYear || "");

  // Sync localYear when Redux selectedYear loads
  useEffect(() => {
    if (!localYear && selectedYear) setLocalYear(String(selectedYear));
  }, [selectedYear]);

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]                 = useState(1);

  const fetchingSumRef = useRef(false);

  const cacheKey   = `${clientId}-${localYear}-${page}-${search}-${statusFilter}`;
  const summaryKey = `${clientId}-${localYear}`;
  const cached     = projectsCache[cacheKey];
  const summary    = clientSummaryCache[summaryKey];

  const { projects = [], totalCount = 0, totalPages = 0 } = cached ?? {};
  const clientTitle = projects?.[0]?.client_Title ?? summary?.clientTitle ?? "";

  // Fetch financial years once
  useEffect(() => {
    if (financialYears.length > 0) return;
    dispatch(fetchFinancialYears());
  }, []);

  // Set localYear from Redux once years load
  useEffect(() => {
    if (localYear || !selectedYear) return;
    setLocalYear(String(selectedYear));
  }, [selectedYear]);

  // Fetch summary once per clientId+year
  useEffect(() => {
    if (!localYear || !clientId || clientSummaryCache[summaryKey] || fetchingSumRef.current) return;
    fetchingSumRef.current = true;
    dispatch(fetchClientProjectSummary({ clientId, finYrId: localYear, summaryKey }))
      .finally(() => { fetchingSumRef.current = false; });
  }, [localYear, clientId, summaryKey]);

  // Fetch paginated/filtered projects
  useEffect(() => {
    if (!localYear || !clientId || cached) return;
    dispatch(fetchClientProjects({
      clientId,
      finYrId:       localYear,
      pageNumber:    page,
      pageSize:      PAGE_SIZE,
      searchText:    search,
      projectStatus: statusFilter,
      cacheKey,
    }));
  }, [clientId, localYear, page, search, statusFilter, cacheKey]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleStatus = (val) => { setStatusFilter(val); setPage(1); };
  const handleYear   = (val) => { setLocalYear(val); dispatch(setSelectedYear(val)); setPage(1); };

  const totalPO         = summary?.totalPO         ?? 0;
  const avgPredictedPct = summary?.avgPredictedPct ?? 0;
  const avgActualPct    = summary?.avgActualPct    ?? 0;
  const variance        = avgActualPct - avgPredictedPct;

  if (projectsError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <p className="text-red-500 font-medium">{projectsError}</p>
      <button onClick={() => dispatch(fetchClientProjects({ clientId, finYrId: localYear, pageNumber: page, pageSize: PAGE_SIZE, searchText: search, projectStatus: statusFilter, cacheKey }))}
        className="text-sm text-red-500 underline">Retry</button>
    </div>
  );

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      <button
        onClick={() => router.push("/finance/clients")}
        className="flex items-center gap-1.5 text-sm mb-6 text-red-500 hover:text-red-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </button>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${t.clientIconBg}`}>
            <Briefcase className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${t.textPrimary}`}>{clientTitle || "Client"}</h1>
            <p className={`text-sm ${t.textSecondary}`}>Project Financial Summary</p>
          </div>
        </div>

        <div>
          <p className={`text-xs ${t.textSecondary} mb-1`}>Financial Year</p>
          <select
            value={localYear}
            onChange={e => handleYear(e.target.value)}
            className={`border ${t.clientBorder} rounded-lg px-3 py-1.5 text-sm ${t.clientInputText} ${t.clientInputBg}`}
          >
            {financialYears.map(y => (
              <option key={y.id} value={y.id}>{y.financial_Year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap mb-6">
        <StatTile label="Total PO Value"    value={`$${totalPO.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} icon={DollarSign}   valueClass="text-red-600" />
        <StatTile label="Avg Predicted GP%" value={fmtPct(avgPredictedPct)}                                              icon={BarChart2}    valueClass="text-red-600" />
        <StatTile label="Avg Actual GP%"    value={fmtPct(avgActualPct)}                                                 icon={PieChart} />
        <StatTile label="GP% Variance"      value={fmtPct(variance)}                                                     icon={TrendingDown} valueClass={variance >= 0 ? "text-green-600" : "text-red-600"} />
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            <div className="relative">
              <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
              <input
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search project..."
                className={`pl-8 pr-3 py-1.5 border ${t.clientBorder} rounded-lg text-xs w-48 focus:outline-none focus:ring-1 focus:ring-red-300 ${t.clientInputBg} ${t.clientInputText}`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => handleStatus(e.target.value)}
              className={`border ${t.clientBorder} rounded-lg px-3 py-1.5 text-xs ${t.clientInputText} ${t.clientInputBg}`}
            >
              {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${t.clientBorder}`}>
                  {HEADERS.map((h, i) => (
                    <th key={h} className={`text-left py-2 px-3 ${t.textMuted} font-medium whitespace-nowrap ${
                      i === 0 ? `sticky left-0 z-20 ${isDark ? "bg-gray-900" : "bg-white"}` : ""
                    }`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projectsLoading && !cached ? (
                  <tr><td colSpan={HEADERS.length} className={`py-8 text-center text-sm ${t.textMuted}`}>Loading...</td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan={HEADERS.length} className={`py-8 text-center text-sm ${t.textMuted}`}>No projects found</td></tr>
                ) : projects.map(p => (
                  <tr key={p.project_ID} className={`border-b ${t.clientBorder} ${t.clientRowHover}`}>
                    <td className={`sticky left-0 z-10 py-2.5 px-3 whitespace-nowrap ${isDark ? "bg-gray-900" : "bg-white"}`}>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">{p.projectCode}</span>
                      <button
                        onClick={() => router.push(`/finance/clients/${clientId}/${p.project_ID}`)}
                        className={`block text-sm ${t.clientInputText} hover:text-red-500 hover:underline text-left`}
                        title={p.project_Title}
                      >{p.project_Title}</button>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.bName}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.financial_Year}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.employee_Name}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap"><StatusBadge status={p.project_Status} isDark={isDark} /></td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.pO_Value}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.outsourcing_Cost}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.effect_EstimateCost}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.predicted_Hours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.actual_Hours?.toFixed(2)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.predicted_Cost}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.actual_Cost}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.predicted_GP}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.actual_GP}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.predicted_percentage}%</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.actual_percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>

        <DataPagination
          page={page}
          totalPages={totalPages}
          totalItems={totalCount}
          startIndex={(page - 1) * PAGE_SIZE + 1}
          endIndex={Math.min(page * PAGE_SIZE, totalCount)}
          hasPrev={page > 1}
          hasNext={page < totalPages}
          prevPage={() => setPage(p => p - 1)}
          nextPage={() => setPage(p => p + 1)}
          goToPage={setPage}
          pageNumbers={buildPageNumbers(page, totalPages)}
        />
      </Card>
    </div>
  );
}

export default function ClientProjectsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading...</div>}>
      <ClientProjectsPageInner />
    </Suspense>
  );
}
