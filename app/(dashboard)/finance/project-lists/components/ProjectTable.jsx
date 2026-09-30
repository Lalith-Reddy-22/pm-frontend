"use client";

import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Pencil, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";
import DataPagination from "@/components/DataPagination";
import { buildPageNumbers } from "@/lib/utils";
import { fmt, fmtPct } from "../data";

const HEADERS = [
  { label: "PROJECT NAME",             align: "text-left" },
  { label: "PURCHASE ORDER VALUE ($)", align: "text-right" },
  { label: "OUTSOURCING COST ($)",     align: "text-right" },
  { label: "PREDICTED GP",             align: "text-right" },
  { label: "PREDICTED GP (%)",         align: "text-right" },
  { label: "ACTUAL GP",                align: "text-right" },
  { label: "ACTUAL GP (%)",            align: "text-right" },
];

export default function ProjectTable({
  projects = [], loading = false,
  page, totalPages, totalCount, pageSize,
  onPageChange, search, onSearchChange,
}) {
  const { t } = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState(new Set());

  const toggle = (id) => setExpanded(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  // Reset expanded rows when page changes
  useEffect(() => { setExpanded(new Set()); }, [page]);

  const startIndex = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex   = Math.min(page * pageSize, totalCount);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Project Financial Summary</CardTitle>
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
            <input
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search project or client..."
              className={`pl-8 pr-3 py-1.5 border ${t.clientBorder} rounded-lg text-xs w-52 focus:outline-none focus:ring-1 focus:ring-red-300 ${t.clientInputBg} ${t.clientInputText}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex flex-col flex-1 overflow-hidden p-0">
        <div className="overflow-auto flex-1 border-t border-b border-border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-10">
              <tr className={`border-b ${t.clientBorder} ${t.clientInputBg}`}>
                {HEADERS.map(h => (
                  <th key={h.label} className={`${h.align} py-2 px-3 ${t.textMuted} font-medium whitespace-nowrap text-xs`}>{h.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className={`py-8 text-center text-sm ${t.textMuted}`}><div className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin text-[#E12729]" />Loading...</div></td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan={7} className={`py-8 text-center text-sm ${t.textMuted}`}>No projects found</td></tr>
              ) : projects.map((p, i) => {
                const rowId = p.projecT_ID ?? p.project_ID ?? i;
                const rowKey = `${rowId}-${i}`;
                return (
                  <Fragment key={rowKey}>
                    <tr className={`border-b ${t.clientBorder} ${t.clientRowHover} cursor-pointer`} onClick={() => toggle(rowId)}>
                      <td className="py-2.5 px-3 align-top">
                        {/* <div className="flex items-center gap-1.5">
                          {expanded.has(rowId)
                            ? <ChevronDown className={`w-3.5 h-3.5 shrink-0 ${t.textMuted} transition-transform duration-200`} />
                            : <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${t.textMuted} transition-transform duration-200`} />}
                          <p className={`font-medium ${t.clientInputText}`}>{p.project_Title}</p>
                        </div> */}
                        <div
                          className="overflow-hidden transition-[max-height] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                          style={{ maxHeight: expanded.has(rowId) ? "300px" : "0px" }}
                        >
                          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs pt-3 pl-5">
                            <div>
                              <span className={`${t.textMuted} font-medium`}>Client</span>
                              <p className={`${t.clientInputText} mt-0.5`}>{p.client_Title}</p>
                            </div>
                            <div>
                              <span className={`${t.textMuted} font-medium`}>Start Date</span>
                              <p className={`${t.clientInputText} mt-0.5`}>{p.pstart_date}</p>
                            </div>
                            <div>
                              <span className={`${t.textMuted} font-medium`}>End Date</span>
                              <p className={`${t.clientInputText} mt-0.5`}>{p.end_date}</p>
                            </div>
                            <div>
                              <span className={`${t.textMuted} font-medium`}>Region</span>
                              <p className={`${t.clientInputText} mt-0.5`}>{p.region}</p>
                            </div>
                            <div className="w-full">
                              <span className={`${t.textMuted} font-medium`}>Description</span>
                              <p className={`${t.clientInputText} mt-0.5`}>{p.project_desc ?? "—"}</p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 mt-3 pt-2 pb-2 border-t ${t.clientBorder} pl-5`}>
                            <button
                              onClick={(e) => { e.stopPropagation(); router.push(`/finance/project-lists/${rowId}/edit`); }}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                            >
                              <Pencil className="w-3 h-3" /> Edit
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className={`py-2.5 px-3 ${t.clientInputText} text-right whitespace-nowrap align-middle`}>{fmt(p.total_Value)}</td>
                      <td className={`py-2.5 px-3 ${t.clientInputText} text-right whitespace-nowrap align-middle`}>{fmt(p.outsourcing_Value)}</td>
                      <td className={`py-2.5 px-3 text-right whitespace-nowrap align-middle ${p.predicted_GP < 0 ? "text-red-500" : t.clientInputText}`}>{fmt(p.predicted_GP)}</td>
                      <td className={`py-2.5 px-3 text-right whitespace-nowrap align-middle ${p.predicted_percentage < 0 ? "text-red-500" : t.clientInputText}`}>{fmtPct(p.predicted_percentage ?? 0)}</td>
                      <td className={`py-2.5 px-3 text-right whitespace-nowrap align-middle ${p.actual_GP < 0 ? "text-red-500" : t.clientInputText}`}>{fmt(p.actual_GP)}</td>
                      <td className={`py-2.5 px-3 font-medium text-right whitespace-nowrap align-middle ${
                        (p.actual_percentage ?? 0) >= 60 ? "text-green-600 dark:text-green-400"
                        : (p.actual_percentage ?? 0) >= 30 ? t.clientInputText
                        : "text-red-500"
                      }`}>{fmtPct(p.actual_percentage ?? 0)}</td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        <DataPagination
          page={page}
          totalPages={totalPages}
          totalItems={totalCount}
          startIndex={startIndex}
          endIndex={endIndex}
          hasPrev={page > 1}
          hasNext={page < totalPages}
          prevPage={() => onPageChange(page - 1)}
          nextPage={() => onPageChange(page + 1)}
          goToPage={onPageChange}
          pageNumbers={buildPageNumbers(page, totalPages)}
          className={`border-t ${t.clientBorder} shrink-0`}
        />
      </CardContent>
    </Card>
  );
}
