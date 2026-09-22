import { apiClient } from "./apiClient";

export async function getResourceAllocation({
  startDate,
  endDate,
  teamId,
}) {
  const params = new URLSearchParams();

  params.append("startDate", startDate);
  params.append("endDate", endDate);
  params.append("teamId", String(teamId));

  const response = await apiClient(
    `/resource-allocation?${params.toString()}`
  );

  console.log("RESOURCE ALLOCATION RESPONSE:", response);

  return response;
}

export async function getResourceAllocationTaskDetail(empId, dateVal) {
  const params = new URLSearchParams();

  params.append("empId", String(empId));
  params.append("dateVal", dateVal);

  const response = await apiClient(
    `/resource-allocation/task-detail?${params.toString()}`
  );

  console.log("TASK DETAIL API RESPONSE:", response);

  return response;
}