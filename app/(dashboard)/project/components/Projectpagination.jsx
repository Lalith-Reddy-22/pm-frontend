"use client";

import DataPagination from "@/components/DataPagination";

export default function ProjectPagination({
  pageNumber = 1,
  pageSize = 10,
  totalCount = 0,
  totalPages = 0,
  onPageChange,
}) {
  // =====================================================
  // START / END RECORD NUMBER
  // =====================================================

  const startIndex =
    totalCount === 0
      ? 0
      : (pageNumber - 1) * pageSize + 1;

  const endIndex =
    totalCount === 0
      ? 0
      : Math.min(pageNumber * pageSize, totalCount);

  // =====================================================
  // PREVIOUS / NEXT
  // =====================================================

  const hasPrev = pageNumber > 1;
  const hasNext = pageNumber < totalPages;

  // =====================================================
  // PAGE NUMBER LIST
  // =====================================================

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (pageNumber <= 4) {
      return [1, 2, 3, 4, 5, "…", totalPages];
    }

    if (pageNumber >= totalPages - 3) {
      return [
        1,
        "…",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "…",
      pageNumber - 1,
      pageNumber,
      pageNumber + 1,
      "…",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  // =====================================================
  // HANDLERS
  // =====================================================

  const prevPage = () => {
    if (hasPrev) {
      onPageChange(pageNumber - 1);
    }
  };

  const nextPage = () => {
    if (hasNext) {
      onPageChange(pageNumber + 1);
    }
  };

  const goToPage = (page) => {
    if (
      page !== "…" &&
      page >= 1 &&
      page <= totalPages &&
      page !== pageNumber
    ) {
      onPageChange(page);
    }
  };

  // =====================================================
  // NO DATA
  // =====================================================

  if (totalCount === 0) {
    return null;
  }

  // =====================================================
  // DATA PAGINATION
  // =====================================================

  return (
    <DataPagination
      page={pageNumber}
      totalPages={totalPages}
      totalItems={totalCount}
      startIndex={startIndex}
      endIndex={endIndex}
      hasPrev={hasPrev}
      hasNext={hasNext}
      prevPage={prevPage}
      nextPage={nextPage}
      goToPage={goToPage}
      pageNumbers={pageNumbers}
    />
  );
}