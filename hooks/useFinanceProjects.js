"use client";

import { useQuery } from "@tanstack/react-query";
import { getFinanceProjects } from "@/services/financeClientService";

export function useFinanceProjects({ empId, pageNumber, pageSize, searchText }) {
  return useQuery({
    queryKey: ["financeProjects", empId, pageNumber, pageSize, searchText],

    queryFn: () => getFinanceProjects({ empId, pageNumber, pageSize, searchText }),

    enabled: !!empId,

    // Keep previous page data visible while the next page loads
    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,
  });
}
