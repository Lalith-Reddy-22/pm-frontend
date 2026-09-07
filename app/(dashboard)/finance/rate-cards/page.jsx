"use client";

import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import RateCardTopBar from "./components/RateCardTopBar";
import RateCardTable from "./components/RateCardTable";
import Pagination from "../../../components/pagination";
import { usePagination } from "../../../../hooks/usePagination";
import {
  fetchFinanceRateCard,
  setSelectedTeamId,
} from "@/store/slices/financeRateCardSlice";

// Matches the department buttons in RateCardTopBar and the existing TAB_IDS convention
const TEAM_IDS = {
  Tech:      1,
  Creative:  2,
  Content:   3,
  PM:        4,
  Editorial: null, // no teamId assigned yet
};

export default function Page() {
  const dispatch = useDispatch();
  const { cache, loading, error, selectedTeamId } = useSelector(
    (state) => state.financeRateCard
  );

  // department label that drives the top-bar buttons
  const [department, setDepartment] = useState("Tech");
  const [search, setSearch] = useState("");

  // Sync department label → teamId in Redux, then fetch if not cached
  useEffect(() => {
    const teamId = TEAM_IDS[department];
    if (!teamId) return; // department has no mapped teamId yet

    dispatch(setSelectedTeamId(teamId));

    if (!cache[teamId]) {
      dispatch(fetchFinanceRateCard({ teamId }));
    }
  }, [department, dispatch, cache]);

  // Resolve the rows for the currently selected team
  const allRows = cache[selectedTeamId]?.rows ?? [];

  // Client-side search across Employee_Name, Designation, EmpId
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allRows;
    return allRows.filter(
      (row) =>
        (row.Employee_Name ?? "").toLowerCase().includes(q) ||
        (row.Designation   ?? "").toLowerCase().includes(q) ||
        String(row.EmpId   ?? "").includes(q)
    );
  }, [allRows, search]);

  const {
    paginatedData,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasPrev,
    hasNext,
    prevPage,
    nextPage,
    pageNumbers,
  } = usePagination({ data: filteredRows, pageSize: 10 });

  // Reset to page 1 when search or department changes
  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleDepartment = (val) => { setDepartment(val); setSearch(""); setPage(1); };

  const teamId = TEAM_IDS[department];

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <RateCardTopBar
          department={department}
          setDepartment={handleDepartment}
          search={search}
          setSearch={handleSearch}
        />

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400">Loading rate card data…</p>
          </div>
        )}

        {/* No teamId mapped */}
        {!loading && !teamId && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-gray-400">
              Rate card data is not available for the <strong>{department}</strong> team yet.
            </p>
          </div>
        )}

        {/* Error state */}
        {!loading && teamId && error && (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && teamId && !error && (
          <>
            <RateCardTable rows={paginatedData} />

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={totalItems}
              startIndex={startIndex}
              endIndex={endIndex}
              hasPrev={hasPrev}
              hasNext={hasNext}
              prevPage={prevPage}
              nextPage={nextPage}
              pageNumbers={pageNumbers}
              setPage={setPage}
            />
          </>
        )}

      </div>
    </div>
  );
}
