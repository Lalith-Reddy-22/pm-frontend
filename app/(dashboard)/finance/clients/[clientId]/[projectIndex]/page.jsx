"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../../../../../context/ThemeContext";
import DataPagination from "@/components/DataPagination";
import { fetchProjectTasks } from "@/store/slices/financeClientSlice";
import { buildPageNumbers } from "@/lib/utils";

const PAGE_SIZE = 10;

const HEADERS = [
  "TASK", "EMPLOYEE", "TEAM",
  "START DATE", "END DATE",
  "EMP. VALUE", "PLANNED HRS", "PLANNED VALUE",
  "ACTUAL HRS", "ACTUAL VALUE",
];

export default function ProjectTasksPage() {
  const { t, isDark } = useTheme();
  const router = useRouter();
  const { clientId, projectIndex: projId } = useParams();
  const dispatch   = useDispatch();

  const { tasksCache, tasksLoading, tasksError } = useSelector((s) => s.financeClient);

  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  const cacheKey     = `${projId}-${page}-${search}`;
  const cached       = tasksCache[cacheKey];
  const tasks        = cached?.tasks      ?? [];
  const totalCount   = cached?.totalCount ?? 0;
  const totalPages   = cached?.totalPages ?? 0;
  const projectTitle = cached?.tasks?.[0]?.project_Title ?? "";
  const projectCode  = cached?.tasks?.[0]?.projectCode   ?? "";
  const clientTitle  = cached?.tasks?.[0]?.client_Title  ?? "";

  useEffect(() => {
    if (!projId || cached) return;
    dispatch(fetchProjectTasks({ projId, pageNumber: page, pageSize: PAGE_SIZE, searchText: search, cacheKey }));
  }, [projId, page, search, cacheKey]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  if (tasksError) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-3">
      <p className="text-red-500 font-medium">{tasksError}</p>
      <button
        onClick={() => dispatch(fetchProjectTasks({ projId, pageNumber: page, pageSize: PAGE_SIZE, searchText: search, cacheKey }))}
        className="text-sm text-red-500 underline"
      >Retry</button>
    </div>
  );

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      <div className={`sticky top-0 z-30 ${isDark ? "bg-[#0a0a0a]" : "bg-white"} pb-4 -mx-6 px-6 pt-2`}>
        <button
          onClick={() => router.push(`/finance/clients/${clientId}`)}
          className="flex items-center gap-1.5 text-sm mb-4 text-red-500 hover:text-red-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {clientTitle || "Client"}
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${t.clientIconBg}`}>
              <Briefcase className="w-7 h-7 text-red-500" />
            </div>
            <div>
              {projectCode && (
                <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">
                  {projectCode}
                </span>
              )}
              <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {projectTitle || "Project"}
              </h1>
              {clientTitle && (
                <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{clientTitle}</p>
              )}
            </div>
          </div>

          <input
            value={search}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search tasks…"
            className={`w-64 text-sm px-3 py-1.5 rounded-lg border-2 border-red-500 ${t.clientInputBg} ${t.clientInputText} outline-none focus:ring-1 focus:ring-red-500`}
          />
        </div>
      </div>

      <Card className="mt-4">
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b-2 ${t.clientBorder}`}>
                  {HEADERS.map(h => (
                    <th key={h} className={`text-left py-2 px-3 ${t.textMuted} font-medium whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tasksLoading && !cached ? (
                  <tr><td colSpan={HEADERS.length} className={`py-8 text-center ${t.textMuted}`}>Loading...</td></tr>
                ) : tasks.length === 0 ? (
                  <tr><td colSpan={HEADERS.length} className={`py-8 text-center ${t.textMuted}`}>No tasks found.</td></tr>
                ) : tasks.map((tk, i) => (
                  <tr key={`${tk.task_ID}-${tk.emp_ID}-${i}`} className={`border-b ${t.clientBorder} ${t.clientRowHover}`}>
                    <td className="py-2.5 px-3" style={{ minWidth: "280px" }}>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">
                        #{tk.task_ID}
                      </span>
                      <p className={`text-sm ${t.clientInputText}`}>{tk.task_Title}</p>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.employee_Name}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${isDark ? "bg-white/10 text-gray-400 border-white/20" : "bg-gray-100 text-gray-600 border-gray-300"}`}>
                        {tk.teams_Name}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.start_Date_Formatted}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.end_Date_Formatted}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.empValue}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.plannedHours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>${tk.plannedValue.toLocaleString()}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.actualHours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>${tk.actualValue.toLocaleString()}</td>
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
