/**
 * Employee List Service
 * 
 * Handles fetching and processing employee list data
 */

// Sample employee data
const SAMPLE_EMPLOYEE_DATA = [
  { id: 1, name: "Vinoth Kumar M" },
  { id: 2, name: "Vikram Subraya Shenoy" },
  { id: 3, name: "Bharathkumar Duragappa" },
  { id: 4, name: "Rajesh Hariharan" },
  { id: 5, name: "Maithri Shanbhogue H" },
  { id: 6, name: "Darshan T" },
  { id: 7, name: "Vishwanath BJ" },
  { id: 8, name: "Sushmita Gopalakrish" },
  { id: 9, name: "Abhishek Badiger" },
  { id: 10, name: "Priya Sharma" },
  { id: 11, name: "Sahil Jain" },
  { id: 12, name: "Meera Joshi" },
  { id: 13, name: "Nikhil R" },
  { id: 14, name: "Akshaya K" },
  { id: 15, name: "Rupesh K" },
  { id: 16, name: "Anaya M" },
  { id: 17, name: "Vikram Singh" },
  { id: 18, name: "Isha Patel" },
  { id: 19, name: "Rajesh Kumar" },
  { id: 20, name: "Anita Verma" },
  { id: 21, name: "Karan Sharma" },
  { id: 22, name: "Deepak Nair" },
  { id: 23, name: "Pooja Gupta" },
  { id: 24, name: "Sanjay Desai" },
  { id: 25, name: "Neha Singh" },
  { id: 26, name: "Rohit Patel" },
  { id: 27, name: "Manisha Roy" },
  { id: 28, name: "Arjun Kapoor" },
];

/**
 * Fetch employee list with filtering and pagination
 * @param {Object} filters - Filter parameters
 * @param {string} filters.search - Search query (searches employee names)
 * @param {number} filters.page - Page number (1-indexed)
 * @param {number} filters.pageSize - Number of records per page
 * @returns {Promise<Object>} - Returns { data: [], total: number, page: number, pageSize: number }
 */
export async function getEmployeeList(filters = {}) {
  try {
    const {
      search = "",
      page = 1,
      pageSize = 10,
    } = filters;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    let result = [...SAMPLE_EMPLOYEE_DATA];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q)
      );
    }

    // Get total count before pagination
    const total = result.length;

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = result.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch (error) {
    console.error("Error fetching employee list:", error);
    throw new Error("Failed to fetch employee list");
  }
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
