"use client";

/**
 * ProjectPagination – thin wrapper that passes pagination state from
 * the parent page into the shared <DataPagination> UI component.
 *
 * All pagination logic lives in the usePagination hook (hooks/usePagination.js).
 * All rendering lives in the shared DataPagination component (components/DataPagination.jsx).
 */
import DataPagination from "@/components/DataPagination";

export default function ProjectPagination(props) {
  // props are spread from the usePagination() return value in the parent
  return <DataPagination {...props} />;
}