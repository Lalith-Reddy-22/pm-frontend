import axiosClient from "./axiosClient";

function normalizeDateInput(dateValue) {
  if (!dateValue) return "";

  const value = String(dateValue).trim();
  if (!value) return "";

  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function validateDateRange(startDate, endDate) {
  const normalizedStart = normalizeDateInput(startDate);
  const normalizedEnd = normalizeDateInput(endDate);

  if (!normalizedStart || !normalizedEnd) {
    throw new Error("Start date and end date are required.");
  }

  const compareStart = new Date(`${normalizedStart}T12:00:00`);
  const compareEnd = new Date(`${normalizedEnd}T12:00:00`);

  if (compareStart > compareEnd) {
    throw new Error("Start date cannot be greater than end date.");
  }

  return { startDate: normalizedStart, endDate: normalizedEnd };
}

export async function getWeekUtilizationTeam({ startDate, endDate }) {
  const { startDate: safeStartDate, endDate: safeEndDate } = validateDateRange(startDate, endDate);

  const params = new URLSearchParams();
  params.append("startDate", safeStartDate);
  params.append("endDate", safeEndDate);
  params.append("fromDate", safeStartDate);
  params.append("toDate", safeEndDate);

  const response = await axiosClient.get(
    `/Reports/week-utilization-team?${params.toString()}`
  );

  console.log("TEAM API RESPONSE:", response.data);

  return response.data;
}

export async function getWeekUtilizationDesignation({ startDate, endDate }) {
  const { startDate: safeStartDate, endDate: safeEndDate } = validateDateRange(startDate, endDate);

  const params = new URLSearchParams();
  params.append("startDate", safeStartDate);
  params.append("endDate", safeEndDate);
  params.append("fromDate", safeStartDate);
  params.append("toDate", safeEndDate);

  const response = await axiosClient.get(
    `/Reports/week-utilization-designation?${params.toString()}`
  );

  console.log("DESIGNATION API RESPONSE:", response.data);

  return response.data;
}

export async function getClientWiseRevenue({ startDate, endDate }) {
  const { startDate: safeStartDate, endDate: safeEndDate } = validateDateRange(startDate, endDate);

  const params = new URLSearchParams();
  params.append("startDate", safeStartDate);
  params.append("endDate", safeEndDate);
  params.append("fromDate", safeStartDate);
  params.append("toDate", safeEndDate);

  const response = await axiosClient.get(
    `/Reports/client-wise-revenue?${params.toString()}`
  );

  console.log("CLIENT REVENUE API RESPONSE:", response.data);

  return response.data;
}