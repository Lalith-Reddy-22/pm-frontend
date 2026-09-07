"use client";

export const REPORT_COLUMNS = [
  {
    key: "projectCode",
    label: "Project Code",
    sortable: true,
    className: "w-[140px] min-w-[120px]",
  },

  {
    key: "projectTitle",
    label: "Project Title",
    sortable: true,
    className: "min-w-[320px]",
  },

  {
    key: "client",
    label: "Client",
    sortable: true,
    className: "min-w-[180px]",
  },

  {
    key: "subClient",
    label: "Sub Client",
    sortable: true,
    className: "min-w-[180px]",
  },

  {
    key: "taskId",
    label: "Task ID",
    sortable: true,
    className: "w-[120px] min-w-[100px]",
  },

  {
    key: "taskTitle",
    label: "Task Title",
    sortable: true,
    className: "min-w-[320px]",
  },

  {
    key: "type",
    label: "Type",
    sortable: true,
    className: "w-[140px] min-w-[120px]",
  },

  {
    key: "startDate",
    label: "Start Date",
    sortable: true,
    className: "w-[140px] min-w-[120px]",
  },

  {
    key: "endDate",
    label: "End Date",
    sortable: true,
    className: "w-[140px] min-w-[120px]",
  },

  {
    key: "employeeName",
    label: "Employee",
    sortable: true,
    className: "min-w-[250px]",
  },

  {
    key: "designation",
    label: "Designation",
    sortable: true,
    className: "min-w-[160px]",
  },

  {
    key: "function",
    label: "Function",
    sortable: true,
    className: "min-w-[150px]",
  },

  {
    key: "plannedHours",
    label: "Planned Hours",
    sortable: true,
    className: "w-[140px] min-w-[120px] text-right",
    render: (value) => (
      <span className="font-medium">
        {value ?? 0}h
      </span>
    ),
  },

  {
    key: "actualHours",
    label: "Actual Hours",
    sortable: true,
    className: "w-[140px] min-w-[120px] text-right",
    render: (value) => (
      <span className="font-medium">
        {value ?? 0}h
      </span>
    ),
  },

  {
    key: "unitCost",
    label: "Unit Cost",
    sortable: true,
    className: "w-[140px] min-w-[120px] text-right",
    render: (value) => (
      <span className="font-medium">
        ${Number(value ?? 0).toLocaleString()}
      </span>
    ),
  },

  {
    key: "plannedCost",
    label: "Planned Cost",
    sortable: true,
    className: "w-[150px] min-w-[130px] text-right",
    render: (value) => (
      <span className="font-medium">
        ${Number(value ?? 0).toLocaleString()}
      </span>
    ),
  },

  {
    key: "actualCost",
    label: "Actual Cost",
    sortable: true,
    className: "w-[150px] min-w-[130px] text-right",
    render: (value) => (
      <span className="font-medium">
        ${Number(value ?? 0).toLocaleString()}
      </span>
    ),
  },

  {
    key: "difference",
    label: "Difference",
    sortable: true,
    className: "w-[150px] min-w-[130px] text-right",
    render: (value) => {
      const numberValue = Number(value ?? 0);
      const isPositive = numberValue > 0;

      return (
        <span
          className={`font-medium ${
            isPositive ? "text-red-600" : "text-green-600"
          }`}
        >
          {isPositive ? "+" : "-"}$
          {Math.abs(numberValue).toLocaleString()}
        </span>
      );
    },
  },
];

export function getColumnLabel(key) {
  const column = REPORT_COLUMNS.find(
    (col) => col.key === key
  );

  return column ? column.label : key;
}

export function getSortableColumns() {
  return REPORT_COLUMNS
    .filter((col) => col.sortable)
    .map((col) => col.key);
}