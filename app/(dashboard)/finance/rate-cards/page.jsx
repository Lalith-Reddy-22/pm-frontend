"use client";

import { useMemo, useState } from "react";

import RateCardTopBar from "./components/RateCardTopBar";
import RateCardTable from "./components/RateCardTable";
import Pagination from "../../../components/pagination";
import { usePagination } from "../../../../hooks/usePagination";
import { employees } from "./data";

export default function Page() {
  const [department, setDepartment] = useState("Tech");
  const [search, setSearch] = useState("");

  // Filter data
  const filteredEmployees = useMemo(() => {
  const q = search.toLowerCase();

  return employees.filter((emp) => {
    const matchesDepartment =
      department === "All" || department === "Tech";

    return (
      (emp.employee ?? "").toLowerCase().includes(q) ||
      (emp.designation ?? "").toLowerCase().includes(q) ||
      String(emp.empId ?? "").includes(q)
    );
  });
}, [department, search]);

  // Reusable Pagination Hook
  const {
    paginatedData: paginatedEmployees,
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
  } = usePagination({
    data: filteredEmployees,
    pageSize: 10,
  });

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

        <RateCardTopBar
          department={department}
          setDepartment={setDepartment}
          search={search}
          setSearch={setSearch}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />

        <RateCardTable
          employees={paginatedEmployees}
          department={department}
          search={search}
        />

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

      </div>
    </div>
  );
}