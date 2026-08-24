"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "../../../context/ThemeContext";
import { useRouter } from "next/navigation";
import ProjectTable from "./components/ProjectTable";
import AddRateCardPanel from "./components/AddRateCardPanel";
import { api } from "@/lib/api";

const PAGE_SIZE = 10;

export default function ProjectListsPage() {
  const { t } = useTheme();
  const router = useRouter();
  const [showRateCard, setShowRateCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [empId, setEmpId] = useState(null);
  const fetchingRef = useRef(false);

  useEffect(() => { setEmpId(sessionStorage.getItem("empId")); }, []);

  const fetchProjects = useCallback((empId, page, search) => {
    if (!empId || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);
    const params = new URLSearchParams({ EmpId: empId, pageNumber: page, pageSize: PAGE_SIZE });
    if (search) params.set("searchText", search);
    api.get(`/api/v1/finance-projects?${params}`)
      .then(data => {
        setProjects(data.projects ?? data ?? []);
        setTotalCount(data.totalCount ?? (data.projects ?? data ?? []).length);
        setTotalPages(data.totalPages ?? 1);
      })
      .catch(console.error)
      .finally(() => { setLoading(false); fetchingRef.current = false; });
  }, []);

  useEffect(() => {
    if (empId) fetchProjects(empId, page, search);
  }, [empId, page, search]);

  const handleSearch = (val) => { setSearch(val); setPage(1); };

  return (
    <div className={`${t.mainBg} h-full flex flex-col overflow-hidden`}>
      <div className={`shrink-0 px-6 py-4 border-b ${t.clientBorder} flex items-center justify-end`}>
        <div />
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/project/add-project")} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150">
            <span className="text-base leading-none">+</span> Project
          </button>
          <button onClick={() => setShowRateCard(true)} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors duration-150">
            <span className="text-base leading-none">+</span> Rate Card
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-hidden">
        <ProjectTable
          projects={projects}
          loading={loading}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          search={search}
          onSearchChange={handleSearch}
        />
      </div>

      {showRateCard && <AddRateCardPanel onClose={() => setShowRateCard(false)} />}
    </div>
  );
}
