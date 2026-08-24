"use client";

import { useState, useMemo, Fragment } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";
import { fetchProjects, fmt, fmtPct } from "../data";

const HEADERS = [
  { label: "PROJECT NAME",             align: "text-left" },
  { label: "PURCHASE ORDER VALUE ($)", align: "text-right" },
  { label: "OUTSOURCING COST ($)",     align: "text-right" },
  { label: "PREDICTED GP",             align: "text-right" },
  { label: "PREDICTED GP (%)",         align: "text-right" },
  { label: "ACTUAL GP",                align: "text-right" },
  { label: "ACTUAL GP (%)",            align: "text-right" },
];

export default function ProjectTable({ selectedYear }) {
  const { t } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);

  // Re-fetches automatically whenever selectedYear changes
  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ["projects", selectedYear],
    queryFn: () => fetchProjects(selectedYear),
  });

  const toggle = (id) => setExpanded(prev => prev === id ? null : id);

  const filtered = useMemo(
    () => projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase())),
    [projects, search]
  );

  const pagination = usePagination({ data: filtered, pageSize: 10 });
  const { paginatedData, setPage } = pagination;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Project Financial Summary</CardTitle>
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search project or client..."
              className={`pl-8 pr-3 py-1.5 border ${t.clientBorder} rounded-lg text-xs w-52 focus:outline-none focus:ring-1 focus:ring-red-300 ${t.clientInputBg} ${t.clientInputText}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${t.clientBorder}`}>
              {HEADERS.map(h => (
                <th key={h.label} className={`${h.align} py-2 px-3 ${t.textMuted} font-medium whitespace-nowrap text-xs`}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className={`py-10 text-center text-sm ${t.textMuted}`}>
                  Loading projects…
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-sm text-red-500">
                  Failed to load projects. Please try again.
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className={`py-10 text-center text-sm ${t.textMuted}`}>
                  No projects found for this financial year.
                </td>
              </tr>
            ) : (
              paginatedData.map(p => (
                <Fragment key={p.id}>
                  <tr className={`border-b ${t.clientBorder} ${t.clientRowHover} cursor-pointer`} onClick={() => toggle(p.id)}>
                    <td className="py-2.5 px-3 max-w-[320px]">
                      <div className="flex items-center gap-1.5">
                        {expanded === p.id
                          ? <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${t.textMuted}`} />
                          : <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${t.textMuted}`} />}
                        <p className={`font-medium ${t.clientInputText} truncate`}>{p.title}</p>
                      </div>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} text-right whitespace-nowrap`}>{fmt(p.poValue)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} text-right whitespace-nowrap`}>{fmt(p.outsourcingCost)}</td>
                    <td className={`py-2.5 px-3 text-right whitespace-nowrap ${p.predictedGP < 0 ? "text-red-500" : t.clientInputText}`}>{fmt(p.predictedGP)}</td>
                    <td className={`py-2.5 px-3 text-right whitespace-nowrap ${p.predictedGPPct < 0 ? "text-red-500" : t.clientInputText}`}>{fmtPct(p.predictedGPPct)}</td>
                    <td className={`py-2.5 px-3 text-right whitespace-nowrap ${p.actualGP < 0 ? "text-red-500" : t.clientInputText}`}>{fmt(p.actualGP)}</td>
                    <td className={`py-2.5 px-3 font-medium text-right whitespace-nowrap ${p.actualGPPct >= 60 ? "text-green-600 dark:text-green-400" : p.actualGPPct >= 30 ? t.clientInputText : "text-red-500"}`}>{fmtPct(p.actualGPPct)}</td>
                  </tr>
                  {expanded === p.id && (
                    <tr className={`border-b ${t.clientBorder}`}>
                      <td colSpan={7} className={`px-8 py-3 ${t.clientInputBg}`}>
                        <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                          <div>
                            <span className={`${t.textMuted} font-medium`}>Client</span>
                            <p className={`${t.clientInputText} mt-0.5`}>{p.client}</p>
                          </div>
                          <div>
                            <span className={`${t.textMuted} font-medium`}>Start Date</span>
                            <p className={`${t.clientInputText} mt-0.5`}>{p.startDate}</p>
                          </div>
                          <div>
                            <span className={`${t.textMuted} font-medium`}>End Date</span>
                            <p className={`${t.clientInputText} mt-0.5`}>{p.endDate}</p>
                          </div>
                          <div>
                            <span className={`${t.textMuted} font-medium`}>Region</span>
                            <p className={`${t.clientInputText} mt-0.5`}>{p.region}</p>
                          </div>
                          <div className="w-full">
                            <span className={`${t.textMuted} font-medium`}>Description</span>
                            <p className={`${t.clientInputText} mt-0.5`}>{p.description}</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${t.clientBorder}`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); router.push(`/finance/project-lists/${p.id}/edit`); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <Pencil className="w-3 h-3" /> Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <DataPagination {...pagination} className={`border-t ${t.clientBorder}`} />
      </CardContent>
    </Card>
  );
}
