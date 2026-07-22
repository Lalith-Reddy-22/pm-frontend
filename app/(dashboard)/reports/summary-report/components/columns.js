/**
 * Report Table Columns Configuration
 * 
 * Defines all columns for the task allocation report table
 */

export const REPORT_COLUMNS = [
  {
    key: "projectCode",
    label: "Project Code",
    sortable: true,
    className: "w-24 min-w-[100px]",
    render: (value) => <span className="font-medium text-blue-600">{value}</span>,
  },
  {
    key: "projectTitle",
    label: "Project Title",
    sortable: true,
    className: "min-w-[200px]",
  },
  {
    key: "client",
    label: "Client",
    sortable: true,
    className: "w-32 min-w-[120px]",
  },
  {
    key: "subClient",
    label: "Sub Client",
    sortable: true,
    className: "w-32 min-w-[120px]",
  },
  {
    key: "taskId",
    label: "Task ID",
    sortable: true,
    className: "w-24 min-w-[100px]",
    render: (value) => <span className="font-medium">{value}</span>,
  },
  {
    key: "taskTitle",
    label: "Task Title",
    sortable: true,
    className: "min-w-[180px]",
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
    className: "w-28 min-w-[100px]",
    render: (value) => {
      const colorMap = {
        Development: "bg-blue-100 text-blue-800",
        Design: "bg-purple-100 text-purple-800",
        Testing: "bg-orange-100 text-orange-800",
        Analysis: "bg-green-100 text-green-800",
        Documentation: "bg-gray-100 text-gray-800",
        Review: "bg-pink-100 text-pink-800",
        Deployment: "bg-indigo-100 text-indigo-800",
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      );
    },
  },
  {
    key: "startDate",
    label: "Start Date",
    sortable: true,
    className: "w-28 min-w-[100px] text-center",
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: "endDate",
    label: "End Date",
    sortable: true,
    className: "w-28 min-w-[100px] text-center",
    render: (value) => new Date(value).toLocaleDateString(),
  },
  {
    key: "employeeName",
    label: "Employee Name",
    sortable: true,
    className: "min-w-[140px]",
  },
  {
    key: "designation",
    label: "Designation",
    sortable: true,
    className: "min-w-[130px]",
  },
  {
    key: "function",
    label: "Function",
    sortable: true,
    className: "w-32 min-w-[100px]",
  },
  {
    key: "plannedHours",
    label: "Planned Hours",
    sortable: true,
    className: "w-28 min-w-[100px] text-right",
    render: (value) => <span className="font-medium">{value}h</span>,
  },
  {
    key: "actualHours",
    label: "Actual Hours",
    sortable: true,
    className: "w-28 min-w-[100px] text-right",
    render: (value) => <span className="font-medium">{value}h</span>,
  },
  {
    key: "unitCost",
    label: "Unit Cost",
    sortable: true,
    className: "w-28 min-w-[100px] text-right",
    render: (value) => `$${value}`,
  },
  {
    key: "plannedCost",
    label: "Planned Cost",
    sortable: true,
    className: "w-32 min-w-[110px] text-right",
    render: (value) => (
      <span className="font-medium">${value.toLocaleString()}</span>
    ),
  },
  {
    key: "actualCost",
    label: "Actual Cost",
    sortable: true,
    className: "w-32 min-w-[110px] text-right",
    render: (value) => (
      <span className="font-medium">${value.toLocaleString()}</span>
    ),
  },
  {
    key: "difference",
    label: "Difference",
    sortable: true,
    className: "w-28 min-w-[100px] text-right",
    render: (value) => {
      const isPositive = value > 0;
      return (
        <span className={`font-medium ${isPositive ? "text-red-600" : "text-green-600"}`}>
          {isPositive ? "+" : ""}${Math.abs(value).toLocaleString()}
        </span>
      );
    },
  },
];

/**
 * Get column label by key
 * @param {string} key - Column key
 * @returns {string} - Column label
 */
export function getColumnLabel(key) {
  const column = REPORT_COLUMNS.find((col) => col.key === key);
  return column ? column.label : key;
}

/**
 * Get sortable columns
 * @returns {Array} - Array of sortable column keys
 */
export function getSortableColumns() {
  return REPORT_COLUMNS.filter((col) => col.sortable).map((col) => col.key);
}
