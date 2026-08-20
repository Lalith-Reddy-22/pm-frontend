"use client";

import { useQuery } from "@tanstack/react-query";
import { getEmployeeNames } from "@/services/employeeService";

export function useEmployeeNames() {
  return useQuery({
    queryKey: ["employeeNames"],
    queryFn: getEmployeeNames,
    staleTime: 5 * 60 * 1000,
  });
}