"use client";

import { useQuery } from "@tanstack/react-query";
import { getDailyReports } from "@/services/reportService";

export function useDailyReports({
  selectedDate,
  employeeFilter,
  pageNumber,
  pageSize,
}) {
  const todayDate = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  return useQuery({
    queryKey: [
      "dailyReports",
      todayDate,
      employeeFilter,
      pageNumber,
      pageSize,
    ],

    queryFn: () =>
      getDailyReports({
        todayDate,
        resourceName: employeeFilter,
        pageNumber,
        pageSize,
      }),

    enabled: !!selectedDate,

    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,
  });
}