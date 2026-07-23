"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, DollarSign, BarChart2, TrendingDown, PieChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";
import { CLIENTS, fmt, fmtPct } from "../data";
import DataPagination from "@/components/DataPagination";

function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = [1];
  if (page > 3) pages.push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
  if (page < totalPages - 2) pages.push("…");
  pages.push(totalPages);
  return pages;
}

function StatusBadge({ status, isDark }) {
  const map = isDark
    ? { High: "bg-green-500/20 text-green-400", Medium: "bg-white/10 text-gray-400", Low: "bg-red-500/20 text-red-400", Active: "bg-blue-500/20 text-blue-400" }
    : { High: "bg-green-100 text-green-700",    Medium: "bg-gray-100 text-gray-600",  Low: "bg-red-100 text-red-600",   Active: "bg-blue-100 text-blue-700" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? map.Medium}`}>{status}</span>;
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

const HEADERS = ["PROJECT", "RATE CARD", "FIN YEAR", "MANAGER", "STATUS", "PO VALUE", "OUTSOURCING COST", "EFFORT EST. COST", "PREDICTED HRS", "ACTUAL HRS", "PREDICTED COST", "ACTUAL COST", "PREDICTED GP", "ACTUAL GP", "PREDICTED GP%", "ACTUAL GP%"];
const PAGE_SIZE = 10;

export default function ClientProjectsPage() {
  const { t, isDark } = useTheme();
  const router = useRouter();
  const { clientId } = useParams();
  const [page, setPage] = useState(1);

  const client = CLIENTS.find((c) => c.id === clientId);
  if (!client) return <div className={`p-6 ${t.textPrimary}`}>Client not found.</div>;

  const projects   = client.projects ?? [];
  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const paged      = projects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalPO        = projects.reduce((s, p) => s + p.poValue, 0);
  const totalPredicted = projects.reduce((s, p) => s + p.predictedGP, 0);
  const totalActual    = projects.reduce((s, p) => s + p.actualGP, 0);
  const totalVariance  = totalActual - totalPredicted;
  const avgActualGPPct = projects.length ? projects.reduce((s, p) => s + p.actualGPPct, 0) / projects.length : 0;

  return (
    <div className={`${t.mainBg} min-h-screen px-6 py-6`}>
      <button
        onClick={() => router.push("/finance/clients")}
        className="flex items-center gap-1.5 text-sm mb-6 text-red-500 hover:text-red-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clients
      </button>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${t.clientIconBg}`}>
            <Briefcase className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${t.textPrimary}`}>{client.name}</h1>
            <p className={`text-sm ${t.textSecondary}`}>Project Financial Summary</p>
          </div>
        </div>


      </div>

      {/* Stat tiles */}
      <div className="flex gap-4 flex-wrap mb-6">
        <StatTile label="Total PO Value" value={fmt(totalPO)}                 icon={DollarSign}   valueClass="text-red-600" />
        <StatTile label="Predicted GP"   value={fmt(totalPredicted)}          icon={BarChart2}    valueClass="text-red-600" />
        <StatTile label="Actual GP"      value={fmt(totalActual)}             icon={PieChart} />
        <StatTile label="Avg Actual GP%" value={fmtPct(avgActualGPPct)}       icon={PieChart}     valueClass="text-red-600" />
        <StatTile label="Total Variance" value={fmt(Math.abs(totalVariance))} icon={TrendingDown} valueClass={totalVariance >= 0 ? "text-green-600" : "text-red-600"} />
      </div>

      {
        <Card>
          <CardContent className="pt-4 overflow-x-auto">
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
                {paged.map((p, i) => (
                  <tr key={i} className={`border-b ${t.clientBorder} ${t.clientRowHover}`}>
                    <td className={`sticky left-0 z-10 py-2.5 px-3 whitespace-nowrap ${isDark ? "bg-gray-900" : "bg-white"}`}>
                      <span className="inline-block px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold mb-1">{p.code}</span>
                      <button
                        onClick={() => router.push(`/finance/clients/${clientId}/${(page - 1) * PAGE_SIZE + i}`)}
                        className={`text-sm ${t.clientInputText} hover:text-red-500 hover:underline text-left`}
                        title={p.title}
                      >{p.title}</button>
                    </td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.rateCard}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.finYear}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.manager}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap"><StatusBadge status={p.status} isDark={isDark} /></td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.poValue)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.outsourcingCost)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.effortEstimateCost)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.predictedHours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.actualHours}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.predictedCost)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.actualCost)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.predictedGP)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{fmt(p.actualGP)}</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.predictedGPPct}%</td>
                    <td className={`py-2.5 px-3 ${t.clientInputText} whitespace-nowrap`}>{p.actualGPPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
          <DataPagination
            page={page}
            totalPages={totalPages}
            totalItems={projects.length}
            startIndex={(page - 1) * PAGE_SIZE + 1}
            endIndex={Math.min(page * PAGE_SIZE, projects.length)}
            hasPrev={page > 1}
            hasNext={page < totalPages}
            prevPage={() => setPage(p => p - 1)}
            nextPage={() => setPage(p => p + 1)}
            goToPage={setPage}
            pageNumbers={buildPageNumbers(page, totalPages)}
          />
        </Card>
      }
    </div>
  );
}
