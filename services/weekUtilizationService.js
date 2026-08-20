import axiosClient from "./axiosClient";

export async function getWeekUtilizationTeam({
  startDate,
  endDate,
}) {
  const params = new URLSearchParams();

  params.append("startDate", startDate);
  params.append("endDate", endDate);

  const response = await axiosClient.get(
    `/Reports/week-utilization-team?${params.toString()}`
  );

  console.log("TEAM API RESPONSE:", response.data);

  return response.data;
}

export async function getWeekUtilizationDesignation({
  startDate,
  endDate,
}) {
  const params = new URLSearchParams();

  params.append("startDate", startDate);
  params.append("endDate", endDate);

  const response = await axiosClient.get(
    `/Reports/week-utilization-designation?${params.toString()}`
  );

  console.log(
    "DESIGNATION API RESPONSE:",
    response.data
  );

  return response.data;
}

export async function getClientWiseRevenue({
  startDate,
  endDate,
}) {
  const params = new URLSearchParams();

  params.append("startDate", startDate);
  params.append("endDate", endDate);

  const response = await axiosClient.get(
    `/Reports/client-wise-revenue?${params.toString()}`
  );

  console.log(
    "CLIENT REVENUE API RESPONSE:",
    response.data
  );

  return response.data;
}