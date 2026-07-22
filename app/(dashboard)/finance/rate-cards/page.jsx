"use client";

import { useState } from "react";
import RateCardTopBar from "./components/RateCardTopBar";
import RateCardTable from "./components/RateCardTable";
import Pagination from "../../../components/pagination";
import { employees } from "./data";

export default function Page() {
  const [department, setDepartment] = useState("Tech");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
const pageSize = 10;

const totalEntries = employees.length;
const totalPages = Math.ceil(totalEntries / pageSize);

const paginatedEmployees = employees.slice(
  (page - 1) * pageSize,
  page * pageSize
);

  return (
  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

    <RateCardTopBar
      department={department}
      setDepartment={setDepartment}
      search={search}
      setSearch={setSearch}
    />

    <RateCardTable
      employees={paginatedEmployees}
      department={department}
      search={search}
    />

    <Pagination
  page={page}
  totalPages={totalPages}
  totalEntries={totalEntries}
  pageSize={pageSize}
  onPageChange={setPage}
/>

  </div>
);
}