"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "../../../../context/ThemeContext";
import DataPagination from "@/components/DataPagination";
import { buildPageNumbers } from "@/lib/utils";

function StatusBadge({ pct, isDark }) {
  const status = pct > 60 ? "High" : pct >= 20 ? "Medium" : "Low";
  const map = isDark
    ? { High: "bg-green-500/20 text-green-400", Medium: "bg-white/10 text-gray-400", Low: "bg-red-500/20 text-red-400" }
    : { High: "bg-green-100 text-green-700",    Medium: "bg-gray-100 text-gray-600", Low: "bg-red-100 text-red-600" };
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>{status}</span>;
}

const HEADERS = ["CLIENT", "PO VALUE", "PREDICTED GP", "PREDICTED GP% (AVG)", "ACTUAL GP", "CURRENT GP% (AVG)", "STATUS"];
const PAGE_SIZE = 10;

export default function ClientTable({ finYrId, allClients = [] }) {
  const { t, isDark } = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Client-side search & pagination — no extra API call needed
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allClients;
    return allClients.filter(c => c.client_Title?.toLowerCase().includes(q));
  }, [allClients, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const clients    = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const startIndex = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const endIndex   = Math.min(safePage * PAGE_SIZE, filtered.length);

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Client Financial Summary</CardTitle>
          <div className="relative">
            <Search className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${t.textMuted}`} />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search client..."
              className={`pl-8 pr-3 py-1.5 border ${t.clientBorder} rounded-lg text-xs w-44 focus:outline-none focus:ring-1 focus:ring-red-300 ${t.clientInputBg} ${t.clientInputText}`}
            />
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
            {clients.length === 0 ? (
              <tr><td colSpan={7} className={`py-8 text-center text-sm ${t.textMuted}`}>No clients found</td></tr>
            ) : clients.map(c => (
              <tr key={c.client_ID} className={`border-b ${t.clientBorder} ${t.clientRowHover}`}>
                <td
                  className="py-2.5 px-3 text-red-500 font-medium cursor-pointer hover:underline whitespace-nowrap"
                  onClick={() => router.push(`/finance/clients/${c.client_ID}?finYrId=${finYrId}`)}
                >{c.client_Title}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{c.poValue}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{c.predicted_Gp}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{c.predicted_percentage}%</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{c.actual_Gp}</td>
                <td className={`py-2.5 px-3 ${t.clientInputText}`}>{c.actual_percentage}%</td>
                <td className="py-2.5 px-3"><StatusBadge pct={c.actual_percentage} isDark={isDark} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <DataPagination
          page={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          startIndex={startIndex}
          endIndex={endIndex}
          hasPrev={safePage > 1}
          hasNext={safePage < totalPages}
          prevPage={() => setPage(p => Math.max(1, p - 1))}
          nextPage={() => setPage(p => Math.min(totalPages, p + 1))}
          goToPage={setPage}
          pageNumbers={buildPageNumbers(safePage, totalPages)}
          className="mt-2"
        />
      </CardContent>
    </Card>
  );
}
