import { apiClient } from "./apiClient";

export async function getTaskAllocationReport(filters = {}) {
  const {
    empId = null,
    projectId = "all",
    startDate = null,
    endDate = null,
    search = "",
    page = 1,
    pageSize = 10,
  } = filters;

  const params = new URLSearchParams();

  if (empId) {
  params.append("empId", String(empId));
}

  if (projectId && projectId !== "all") {
    params.append("projectId", projectId);
  }

  if (startDate) {
    params.append("startDate", startDate);
  }

  if (endDate) {
    params.append("endDate", endDate);
  }

  if (search) {
    params.append("search", search);
  }

  params.append("pageNumber", String(page));
  params.append("pageSize", String(pageSize));

  const response = await apiClient(
    `/Reports/task-list?${params.toString()}`
  );

  console.log(
    "TASK LIST API PARAMS:",
    params.toString()
  );

  console.log(
    "TASK LIST API RESPONSE:",
    response
  );

  return {
    data: response?.data || [],
    total: response?.totalRecords || 0,
    page: response?.pageNumber || page,
    pageSize: response?.pageSize || pageSize,
    totalPages: response?.totalPages || 0,
  };
}

export async function getProjects() {
  const response = await apiClient(
    "/Reports/projects-dropdown"
  );

  console.log(
    "PROJECT DROPDOWN API RESPONSE:",
    response
  );

  return (response || []).map((item) => ({
    code: String(item.project_ID),
    title: item.project_Title,
  }));
}

export function generateCSV(data) {
  if (!data || data.length === 0) {
    return;
  }

  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header] ?? "";

          return `"${String(value).replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];

  const csvContent = csvRows.join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "task-allocation-report.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}