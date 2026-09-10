"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../../context/ThemeContext";
import ProjectTable from "./components/ProjectTable";
import AddRateCardPanel from "./components/AddRateCardPanel";
import { useFinanceProjects } from "@/hooks/useFinanceProjects";

const PAGE_SIZE = 10;

export default function ProjectListsPage() {
  const { t } = useTheme();
  const router = useRouter();
  const [showRateCard, setShowRateCard] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [empId, setEmpId] = useState(null);

  useEffect(() => {
    setEmpId(sessionStorage.getItem("empId"));
  }, []);

  const { data, isFetching, isError } = useFinanceProjects({
    empId,
    pageNumber: page,
    pageSize: PAGE_SIZE,
    searchText: search,
  });

  const projects   = data?.projects   ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className={`${t.mainBg} h-full flex flex-col overflow-hidden`}>
      <div className={`shrink-0 px-6 py-4 border-b ${t.clientBorder} flex items-center justify-end`}>
        <div />
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/project/add-project")}
            className="flex items-center gap-1.5 bg-white  text-red-400 text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150 border border-red-400 hover:bg-red-50"
          >
            <span className="text-base leading-none">+</span> Project
          </button>
          <button
            onClick={() => setShowRateCard(true)}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150"
          >
            <span className="text-base leading-none">+</span> Rate Card
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-hidden">
        {isError ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-red-500">Failed to load projects. Please try again.</p>
          </div>
        ) : (
          <ProjectTable
            projects={projects}
            loading={isFetching}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            search={search}
            onSearchChange={handleSearch}
          />
        )}
      </div>

      {showRateCard && <AddRateCardPanel onClose={() => setShowRateCard(false)} />}
    </div>
  );
}
