"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../../../../../context/ThemeContext";
import { CLIENTS } from "../../data";
import DataPagination from "@/components/DataPagination";

const PAGE_SIZE = 10;

function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = [1];
  if (page > 3) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push("…");
  pages.push(totalPages);
  return pages;
}

// Dummy tasks generator scoped to a project
function generateTasks(project, clientName) {
  const p = project.code;
  const pt = project.title;
  const c = clientName;
  const base = [
    { id: 9926,  title: `ME-531 ${c}_Int_${pt} - Bahrain localization_Case 3 Updating globally approved case as per client comments`, employee: "Sagar N V",            team: "Content Team", startDate: "2024-03-14", endDate: "2024-03-14", employeeValue: 96,  plannedHours: 2,   predictedCost: 192, actualHours: 2,   actualCost: 192 },
    { id: 10498, title: `${c}_Int_${pt} - Gulf localization_Case 3 verify SmPC statements in WSB`,                                    employee: "Sushmita Sankeshwari", team: "Content Team", startDate: "2024-03-22", endDate: "2024-03-22", employeeValue: 84,  plannedHours: 1.5, predictedCost: 126, actualHours: 1.5, actualCost: 126 },
    { id: 10506, title: `${c}_Int_${pt} - Bahrain localization_Case 3 medic review of WSB - round 1`,                                 employee: "Rajesh Hariharan",     team: "Content Team", startDate: "2024-03-25", endDate: "2024-03-25", employeeValue: 120, plannedHours: 2,   predictedCost: 240, actualHours: 1,   actualCost: 120 },
    { id: 10512, title: `${c}_Int_${pt} - Gulf localization_Case 3 client feedback incorporation - round 1`,                          employee: "Sagar N V",            team: "Content Team", startDate: "2024-03-28", endDate: "2024-03-29", employeeValue: 96,  plannedHours: 3,   predictedCost: 288, actualHours: 3.5, actualCost: 336 },
    { id: 10519, title: `${c}_Int_${pt} - Bahrain localization_Case 3 localization dialect check`,                                    employee: "Sushmita Sankeshwari", team: "Content Team", startDate: "2024-04-01", endDate: "2024-04-01", employeeValue: 84,  plannedHours: 2,   predictedCost: 168, actualHours: 2,   actualCost: 168 },
    { id: 10527, title: `${c}_Int_${pt} - Gulf localization_Case 3 QA review of localized content`,                                   employee: "Rajesh Hariharan",     team: "Content Team", startDate: "2024-04-03", endDate: "2024-04-04", employeeValue: 120, plannedHours: 2.5, predictedCost: 300, actualHours: 2,   actualCost: 240 },
    { id: 10534, title: `${c}_Int_${pt} - Bahrain localization_Case 3 medic review of WSB - round 2`,                                 employee: "Rajesh Hariharan",     team: "Content Team", startDate: "2024-04-08", endDate: "2024-04-08", employeeValue: 120, plannedHours: 1.5, predictedCost: 180, actualHours: 1.5, actualCost: 180 },
    { id: 10541, title: `${c}_Int_${pt} - Gulf localization_Case 3 final content sign-off`,                                           employee: "Sagar N V",            team: "Content Team", startDate: "2024-04-10", endDate: "2024-04-10", employeeValue: 96,  plannedHours: 1,   predictedCost: 96,  actualHours: 1,   actualCost: 96  },
    { id: 10548, title: `${c}_Int_${pt} - Bahrain localization_Case 3 build integration & testing`,                                   employee: "Sushmita Sankeshwari", team: "Tech Team",     startDate: "2024-04-12", endDate: "2024-04-15", employeeValue: 84,  plannedHours: 4,   predictedCost: 336, actualHours: 4.5, actualCost: 378 },
    { id: 10555, title: `${c}_Int_${pt} - Gulf localization_Case 3 client delivery & handover`,                                       employee: "Rajesh Hariharan",     team: "Content Team", startDate: "2024-04-17", endDate: "2024-04-17", employeeValue: 120, plannedHours: 1,   predictedCost: 120, actualHours: 1,   actualCost: 120 },
    { id: 10562, title: `${c}_Int_${pt} - Bahrain localization_Case 3 post-delivery review & documentation`,                          employee: "Sagar N V",            team: "Content Team", startDate: "2024-04-18", endDate: "2024-04-19", employeeValue: 96,  plannedHours: 2,   predictedCost: 192, actualHours: 2,   actualCost: 192 },
  ];
  return base.map((t) => ({ ...t, client: c, projectCode: p, projectTitle: pt }));
}

const HEADERS = ["TASK", "CLIENT", "PROJECT", "EMPLOYEE", "START DATE", "END DATE", "EMP. VALUE", "PLANNED HRS", "PREDICTED COST", "ACTUAL HRS", "ACTUAL COST"];

export default function ProjectTasksPage() {
  const { t, isDark } = useTheme();
  const router = useRouter();
  const { clientId, projectIndex } = useParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const client  = CLIENTS.find((c) => c.id === clientId);
  const project = client?.projects?.[Number(projectIndex)];

  if (!client || !project) return <div className={`p-6 ${t.textPrimary}`}>Project not found.</div>;

  const allTasks = useMemo(() => generateTasks(project, client.name), [project, client.name]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allTasks;
    return allTasks.filter((tk) =>
      [String(tk.id), tk.title, tk.client, tk.projectTitle, tk.projectCode, tk.employee, tk.team, tk.startDate, tk.endDate]
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [search, allTasks]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      <div className={`sticky top-0 z-30 ${isDark ? "bg-[#0a0a0a]" : "bg-white"} pb-4 -mx-6 px-6 pt-2`}>
        <button
          onClick={() => router.push(`/finance/clients/${clientId}`)}
          className="flex items-center gap-1.5 text-sm mb-4 text-red-500 hover:text-red-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {client.name}
        </button>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${t.clientIconBg}`}>
              <Briefcase className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">{project.code}</span>
              <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{project.title}</h1>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{client.name} · {project.finYear} · {project.manager}</p>
            </div>
          </div>
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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
                  {HEADERS.map((h) => (
                    <th key={h} className={`text-left py-2 px-3 ${t.textMuted} font-medium whitespace-nowrap`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={11} className={`py-8 text-center ${t.textMuted}`}>No tasks found.</td></tr>
                ) : paged.map((tk) => (
                  <tr key={tk.id} className={`border-b ${t.clientBorder} ${t.clientRowHover}`}>
                    <td className="py-2.5 px-3" style={{ minWidth: "280px" }}>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">{tk.id}</span>
                      <p className={`text-sm ${t.clientInputText}`}>{tk.title}</p>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.client}</td>
                    <td className="py-2.5 px-3" style={{ minWidth: "200px" }}>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">{tk.projectCode}</span>
                      <p className={`text-sm ${t.clientInputText}`}>{tk.projectTitle}</p>
                    </td>
                    <td className={`py-2.5 px-3 whitespace-nowrap`}>
                      <p className={`text-sm ${t.clientInputText}`}>{tk.employee}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${isDark ? "bg-white/10 text-gray-400 border-white/20" : "bg-gray-100 text-gray-600 border-gray-300"}`}>{tk.team}</span>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.startDate}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.endDate}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.employeeValue}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.plannedHours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>${tk.predictedCost.toLocaleString()}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{tk.actualHours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>${tk.actualCost.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
        <DataPagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          startIndex={(page - 1) * PAGE_SIZE + 1}
          endIndex={Math.min(page * PAGE_SIZE, filtered.length)}
          hasPrev={page > 1}
          hasNext={page < totalPages}
          prevPage={() => setPage((p) => p - 1)}
          nextPage={() => setPage((p) => p + 1)}
          goToPage={setPage}
          pageNumbers={buildPageNumbers(page, totalPages)}
        />
      </Card>
    </div>
  );
}
