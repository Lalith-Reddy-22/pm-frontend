"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle, Package } from "lucide-react";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { faClassToLucide } from "./assetData";
import { useMyAssetRequests } from "@/hooks/useAssets";
import { usePagination } from "@/hooks/usePagination";
import DataPagination from "@/components/DataPagination";
import { useTheme } from "../../../context/ThemeContext";

// ── Status config keyed on exact API statusName values ───────────────────────
const STATUS_CONFIG = {
  Request:  { icon: Clock,        cls: "text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-500/10 dark:border-amber-500/20" },
  Issued:   { icon: CheckCircle,  cls: "text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-500/10 dark:border-green-500/20" },
  Returned: { icon: XCircle,      cls: "text-gray-600 bg-gray-100 border-gray-200 dark:text-gray-400 dark:bg-white/5 dark:border-white/10" },
};

const FALLBACK_STATUS = STATUS_CONFIG.Request;

// ── Helpers ──────────────────────────────────────────────────────────────────

/** "2026-01-05T00:00:00" → "05 Jan 2026" */
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/**
 * Pick a Lucide icon by scanning the itemList string for device keywords.
 * itemList can be comma-separated (e.g. "Samsung Tab S7, Ipad pro 5G, One plus R 5G").
 * We check the first item for the primary icon.
 */
function iconFromItemList(itemList) {
  const raw = Array.isArray(itemList)
    ? itemList.join(",")
    : String(itemList ?? "");

  const first = raw.split(",")[0]?.trim().toLowerCase() || "";

  return faClassToLucide(
    first.includes("ipad") || first.includes("tab")
      ? "fa-tablet"
      : first.includes("iphone") || first.includes("phone")
        ? "fa-mobile"
        : first.includes("laptop") || first.includes("macbook")
          ? "fa-laptop"
          : first.includes("monitor") || first.includes("desktop")
            ? "fa-desktop"
            : "fa-laptop"
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MyRequests() {
  const { t } = useTheme();
  const [empId] = useState(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("empId") : null
  );

  const { data: requests = [], isFetching, isError } = useMyAssetRequests({ empId });

  const pagination = usePagination({ data: requests, pageSize: 10 });

  // Reset to page 1 when fresh data arrives
  useEffect(() => {
    pagination.goToPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests.length]);

  return (
    <div className={`overflow-hidden rounded-xl border border-border ${t.cardBg} ${t.cardShadow}`}>

      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className={`text-base font-semibold ${t.textPrimary}`}>My Requests</h2>
          <p className={`text-xs mt-0.5 ${t.textSecondary}`}>Track your asset request history</p>
        </div>
        {!isFetching && requests.length > 0 && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${t.iconBg} ${t.textSecondary}`}>
            {requests.length} total
          </span>
        )}
      </div>

      {/* Loading */}
      {isFetching && requests.length === 0 && (
        <div className="flex items-center justify-center gap-2 py-16">
          <Loader2 size={18} className="animate-spin text-[#E12729]" />
          <span className={`text-sm ${t.textSecondary}`}>Loading requests…</span>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mx-5 my-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle size={15} />
          Failed to load requests. Please try again later.
        </div>
      )}

      {/* Empty */}
      {!isFetching && !isError && requests.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 py-16">
          <Package size={32} className={t.textMuted} />
          <p className={`text-sm ${t.textSecondary}`}>No requests found.</p>
        </div>
      )}

      {/* Request rows */}
      {pagination.paginatedData.length > 0 && (
        <div className="p-5 space-y-3">
          {pagination.paginatedData.map(req => {
            const cfg        = STATUS_CONFIG[req.statusName] ?? FALLBACK_STATUS;
            const StatusIcon = cfg.icon;
            const AssetIcon  = iconFromItemList(req.itemList);
            // itemList can be a long comma-separated string — show it in full as a subtle subtitle
            const items = req.itemList?.trim() ?? "—";
            const reason = req.reason?.trim() ?? "";

            return (
              <div
                key={req.request_Id}
                className={`flex items-start gap-4 px-5 py-4 rounded-xl border border-border ${t.iconBg} transition-colors`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${t.cardBg} ${t.textSecondary} mt-0.5`}>
                  <AssetIcon size={18} />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  {/* Request ID */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`font-mono text-xs font-semibold ${t.textPrimary}`}>
                      {req.request_Id}
                    </span>
                    <span className={`text-xs ${t.textMuted}`}>·</span>
                    <span className={`text-xs ${t.textSecondary}`}>{fmtDate(req.request_RaisedDate)}</span>
                  </div>

                  {/* Item list */}
                  <p className={`text-sm font-medium mt-0.5 ${t.textPrimary}`}>{items}</p>

                  {/* Reason */}
                  {reason && (
                    <p className={`text-xs mt-0.5 truncate ${t.textSecondary}`} title={reason}>
                      {reason}
                    </p>
                  )}

                  {/* Dates row */}
                  <div className={`flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-xs ${t.textMuted}`}>
                    {req.item_IssueDate && (
                      <span>Issued: <span className={t.textSecondary}>{fmtDate(req.item_IssueDate)}</span></span>
                    )}
                    {req.item_TakeBackDate && (
                      <span>Returned: <span className={t.textSecondary}>{fmtDate(req.item_TakeBackDate)}</span></span>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <span className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${cfg.cls}`}>
                  <StatusIcon size={12} />
                  {req.statusName}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <DataPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        hasPrev={pagination.hasPrev}
        hasNext={pagination.hasNext}
        prevPage={pagination.prevPage}
        nextPage={pagination.nextPage}
        goToPage={pagination.goToPage}
        pageNumbers={pagination.pageNumbers}
      />
    </div>
  );
}
