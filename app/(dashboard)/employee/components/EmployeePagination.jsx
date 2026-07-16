"use client";

import DataPagination from "@/components/DataPagination";

export default function EmployeePagination({
  filtered,
  clampedPage,
  pageSize,
  totalPages,
  setPage,
}) {
  const totalItems = filtered.length;
  const startIndex = totalItems === 0 ? 0 : (clampedPage - 1) * pageSize + 1;
  const endIndex = Math.min(clampedPage * pageSize, totalItems);

  const pageNumbers = totalPages <= 7 ? Array.from({ length: totalPages }, (_, i) => i + 1) : [];

  return (
    <DataPagination
      page={clampedPage}
      totalPages={totalPages}
      totalItems={totalItems}
      startIndex={startIndex}
      endIndex={endIndex}
      hasPrev={clampedPage > 1}
      hasNext={clampedPage < totalPages}
      prevPage={() => setPage((p) => Math.max(1, p - 1))}
      nextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
      goToPage={setPage}
      pageNumbers={pageNumbers}
    />
  );
}