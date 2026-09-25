import { normalizeApiError, requestJson } from "@/lib/http";

const API_URL = "http://localhost:5234/api/v1";

export async function getDailyReports({
  todayDate,
  taskId = null,
  resourceName = "",
  pageNumber = 1,
  pageSize = 10,
}) {
  try {
    const params = new URLSearchParams();

    if (todayDate) params.append("todayDate", todayDate);
    if (taskId !== null && taskId !== undefined && taskId !== "") params.append("taskId", taskId);
    if (resourceName) params.append("resourceName", resourceName);

    params.append("pageNumber", String(pageNumber));
    params.append("pageSize", String(pageSize));

    const url = `${API_URL}/Reports/daily-reports?${params.toString()}`;
    return await requestJson(url);
  } catch (error) {
    throw new Error(normalizeApiError(error, "Daily Reports API failed."));
  }
}