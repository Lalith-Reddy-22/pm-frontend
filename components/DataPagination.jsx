"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * DataPagination – fully responsive, reusable pagination bar.
 *
 * Props:
 *   page          – current page (1-based)
 *   totalPages    – total number of pages
 *   totalItems    – total number of records
 *   startIndex    – 1-based index of first visible row
 *   endIndex      – 1-based index of last visible row
 *   hasPrev       – boolean
 *   hasNext       – boolean
 *   prevPage      – () => void
 *   nextPage      – () => void
 *   goToPage      – (n: number) => void
 *   pageNumbers   – array of numbers / "…" strings
 *   className     – optional extra classes
 */
export default function DataPagination({
  page,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  hasPrev,
  hasNext,
  prevPage,
  nextPage,
  goToPage,
  pageNumbers = [],
  className,
}) {
  if (totalItems === 0) return null;

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 border-t border-border bg-card px-4 py-3 sm:flex-row sm:justify-between",
        className
      )}
    >
      {/* Info text */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">{startIndex}</span>
        {" – "}
        <span className="font-medium text-foreground">{endIndex}</span>
        {" of "}
        <span className="font-medium text-foreground">{totalItems}</span>{" "}
        entries
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goToPage(1)}
          disabled={!hasPrev}
          aria-label="First page"
          className="hidden sm:inline-flex"
        >
          <ChevronsLeft />
        </Button>

        {/* Prev */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={prevPage}
          disabled={!hasPrev}
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>

        {/* Page numbers */}
<div className="hidden items-center gap-1 sm:flex">
  {(() => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (page > 4) {
        pages.push("…");
      }

      // Pages around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < totalPages - 3) {
        pages.push("…");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      p === "…" ? (
        <span
          key={`ellipsis-${idx}`}
          className="px-1 text-sm text-muted-foreground select-none"
        >
          …
        </span>
      ) : (
        <Button
          key={p}
          variant={p === page ? "default" : "outline"}
          size="icon-sm"
          onClick={() => goToPage(p)}
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
          className={
            p === page
              ? "bg-[#E12729] text-white border-[#E12729] hover:bg-[#c81f21] hover:border-[#c81f21]"
              : ""
          }
        >
          {p}
        </Button>
      )
    );
  })()}
</div>

        {/* Mobile: current / total */}
        <span className="px-2 text-sm font-medium sm:hidden">
          {page} / {totalPages}
        </span>

        {/* Next */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={nextPage}
          disabled={!hasNext}
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>

        {/* Last */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => goToPage(totalPages)}
          disabled={!hasNext}
          aria-label="Last page"
          className="hidden sm:inline-flex"
        >
          <ChevronsRight />
        </Button>
      </div>
    </div>
  );
}
