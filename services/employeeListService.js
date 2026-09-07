import axiosClient from "./axiosClient";

/**
 * Fetch employee list with filtering and pagination
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Search query (searches employee names)
 * @param {number} filters.page - Page number (1-indexed)
 * @param {number} filters.pageSize - Number of records per page
 * @returns {Promise<Object>} - Returns { data: [], total: number, page: number, pageSize: number }
 */
export async function getEmployeeList(filters = {}) {
  const {
    search = "",
    startDate = "",
    endDate = "",
    page = 1,
    pageSize = 10,
  } = filters;
  let payload;

  try {
    const response = await axiosClient.get("/Reports/employee-list", {
      params: {
        search,
        searchText: search,
        startDate,
        endDate,
        pageNumber: page,
        pageSize,
      },
    });
    payload = response.data;
  } catch (error) {
    if (![401, 503].includes(error.response?.status)) throw error;

    const response = await axiosClient.get("/employee");
    const employees = Array.isArray(response.data) ? response.data : [];
    const query = search.trim().toLowerCase();
    const filtered = query
      ? employees.filter((employee) =>
          String(
            employee.employee_Name ??
            employee.employeeName ??
            employee.name ??
            ""
          ).toLowerCase().includes(query)
        )
      : employees;
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;

    payload = {
      data: filtered.slice(startIndex, startIndex + pageSize),
      totalRecords: total,
      pageNumber: page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  const records = Array.isArray(payload)
    ? payload
    : payload?.data ?? payload?.employees ?? payload?.items ?? [];
  const data = records.map((employee, index) => ({
    ...employee,
    id:
      employee.id ??
      employee.empId ??
      employee.employeeId ??
      employee.employee_ID ??
      employee.emp_ID ??
      index,
    name:
      employee.name ??
      employee.employee_Name ??
      employee.employeeName ??
      employee.emp_Name ??
      "",
  }));
  const total = payload?.totalCount ?? payload?.totalRecords ?? data.length;

  return {
    data,
    total,
    page: payload?.pageNumber ?? page,
    pageSize: payload?.pageSize ?? pageSize,
    totalPages: payload?.totalPages ?? Math.ceil(total / pageSize),
  };
}

/**
 * Export employee data to CSV format
 * @param {Array} data - Employee data to export
 * @returns {string} - CSV formatted string
 */
export function generateEmployeeCSV(data) {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = ["Employee Name"];
  const rows = data.map((item) => [item.name]);

  const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

  return csv;
}
