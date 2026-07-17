"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    ? { High: "bg-green-500/20 text-green-400", Medium: "bg-white/10 text-gray-400", Low: "bg-red-500/20 text-red-400" }
    : { High: "bg-green-100 text-green-700", Medium: "bg-gray-100 text-gray-600", Low: "bg-red-100 text-red-600" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? map.Medium}`}>{status}</span>;
}

const HEADERS = ["CLIENT", "PO VALUE", "PREDICTED GP", "PREDICTED GP% (AVG)", "ACTUAL GP", "CURRENT GP% (AVG)", "STATUS"];

export default function ClientTable() {
  const { t, isDark } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const perPage = 10;

  const filtered   = CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged      = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Client Financial Summary</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search client..."
                className={`pl-8 pr-3 py-1.5 border ${t.clientBorder} rounded-lg text-xs w-44 focus:outline-none focus:ring-1 focus:ring-red-300 ${t.clientInputBg} ${t.clientInputText}`}
              />
            </div>

          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`border-b ${t.clientBorder}`}>
              {HEADERS.map(h => <th key={h} className={`text-left py-2 px-3 ${t.textMuted} font-medium whitespace-nowrap`}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paged.map((c, i) => (
              <tr key={i} className={`border-b ${t.clientBorder} ${t.clientRowHover}`}>
                <td
                  className="py-2.5 px-3 text-red-500 font-medium cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() => router.push(`/finance/clients/${c.id}`)}
                >{c.name}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{fmt(c.poValue)}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{fmt(c.predictedGP)}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{c.predictedGPPct}%</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{fmt(c.actualGP)}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{fmtPct(c.actualGPPct)}</td>
                <td className="py-2.5 px-3"><StatusBadge status={c.status} isDark={isDark} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <DataPagination
          page={page}
          totalPages={totalPages}
          totalItems={filtered.length}
          startIndex={(page - 1) * perPage + 1}
          endIndex={Math.min(page * perPage, filtered.length)}
          hasPrev={page > 1}
          hasNext={page < totalPages}
          prevPage={() => setPage(p => Math.max(1, p - 1))}
          nextPage={() => setPage(p => Math.min(totalPages, p + 1))}
          goToPage={setPage}
          pageNumbers={buildPageNumbers(page, totalPages)}
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
}
