/**
 * Report Table Columns Configuration
 *
 * Defines all columns for the task allocation report table
 */

export const REPORT_COLUMNS = [
  {
    key: "project",
    label: "Project",
    sortable: true,
    className: "min-w-[320px]",
  },
  {
    key: "subClient",
    label: "Sub Client",
    sortable: true,
    className: "w-32 min-w-[120px]",
  },
  {
  key: "task",
  label: "Task",
  sortable: true,
  className: "min-w-[320px]",
},
{
  key: "type",
  label: "Type",
  sortable: true,
  className: "w-[140px]",
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
  key: "employee",
  label: "Employee",
  sortable: true,
  className: "min-w-[250px]",
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
    render: (value) => (
      <span className="font-medium">{value}h</span>
    ),
  },
  {
    key: "actualHours",
    label: "Actual Hours",
    sortable: true,
    className: "w-28 min-w-[100px] text-right",
    render: (value) => (
      <span className="font-medium">{value}h</span>
    ),
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
      <span className="font-medium">
        ${Number(value).toLocaleString()}
      </span>
    ),
  },
  {
    key: "actualCost",
    label: "Actual Cost",
    sortable: true,
    className: "w-32 min-w-[110px] text-right",
    render: (value) => (
      <span className="font-medium">
        ${Number(value).toLocaleString()}
      </span>
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
        <span
          className={`font-medium ${
            isPositive ? "text-red-600" : "text-green-600"
          }`}
        >
          {isPositive ? "+" : "-"}$
          {Math.abs(Number(value)).toLocaleString()}
        </span>
      );
    },
  },
];

/**
 * Get column label by key
 */
export function getColumnLabel(key) {
  const column = REPORT_COLUMNS.find((col) => col.key === key);
  return column ? column.label : key;
}

/**
 * Get sortable columns
 */
export function getSortableColumns() {
  return REPORT_COLUMNS.filter((col) => col.sortable).map((col) => col.key);
}