"use client";

import Pagination from "@/app/components/pagination.jsx";

export default function TicketPagination({
  page,
  setPage,
  totalPages = 1,
  totalEntries = 0,
  pageSize = 50,
}) {
  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      totalEntries={totalEntries}
      pageSize={pageSize}
      onPageChange={setPage}
    />
  );
}