"use client";

import { useState, useMemo } from "react";

/**
 * usePagination – reusable pagination hook
 *
 * @param {Object}  options
 * @param {Array}   options.data        – full dataset to paginate
 * @param {number}  [options.pageSize]  – rows per page (default 10)
 * @param {number}  [options.initialPage] – starting page (default 1)
 *
 * @returns {Object}
 *   paginatedData   – slice of data for the current page
 *   page            – current page number
 *   setPage         – setter for page
 *   pageSize        – current page size
 *   setPageSize     – setter for page size (also resets to page 1)
 *   totalPages      – total number of pages
 *   totalItems      – total item count
 *   startIndex      – 1-based index of first item on page
 *   endIndex        – 1-based index of last item on page
 *   hasPrev         – boolean
 *   hasNext         – boolean
 *   prevPage        – go to previous page
 *   nextPage        – go to next page
 *   goToPage        – (n: number) => void
 *   pageNumbers     – array of page numbers / ellipsis strings for rendering
 */
export function usePagination({ data = [], pageSize: initialSize = 10, initialPage = 1 } = {}) {
  const [page, setPageRaw] = useState(initialPage);
  const [pageSize, setPageSizeRaw] = useState(initialSize);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp page when data or pageSize changes
  const safePage = Math.min(page, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, safePage, pageSize]);

  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endIndex = Math.min(safePage * pageSize, totalItems);

  function setPage(n) {
    setPageRaw(Math.max(1, Math.min(n, totalPages)));
  }

  function setPageSize(size) {
    setPageSizeRaw(size);
    setPageRaw(1);
  }

  function prevPage() {
    setPage(safePage - 1);
  }

  function nextPage() {
    setPage(safePage + 1);
  }

  function goToPage(n) {
    setPage(n);
  }

  /**
   * Build smart page-number array with ellipsis, e.g.
   * [1, "…", 4, 5, 6, "…", 20]
   */
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const delta = 1; // pages around current
    const left = safePage - delta;
    const right = safePage + delta;

    pages.push(1);
    if (left > 2) pages.push("…");

    for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) pages.push("…");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }, [safePage, totalPages]);

  return {
    paginatedData,
    page: safePage,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    hasPrev: safePage > 1,
    hasNext: safePage < totalPages,
    prevPage,
    nextPage,
    goToPage,
    pageNumbers,
  };
}
