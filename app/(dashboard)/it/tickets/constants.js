export const trackerColumns = [
  {
    header: "Issue Type",
    accessor: "issueType",
    // render injected in page.jsx to show issueType + #ID below
  },
  {
    header: "Sub Issue Type",
    accessor: "subIssueType",
  },
  {
    header: "Priority",
    accessor: "priority",
  },
  {
    header: "Employee Details",
    accessor: "employee",
    render: (row) => (
      <div className="flex flex-col">
        <span className="text-sm text-gray-700">{row.employeeEmail}</span>
        <span className="text-sm text-gray-900 font-medium">{row.employee}</span>
      </div>
    ),
  },
  {
    header: "Issue Description",
    accessor: "description",
  },
  {
    header: "Status",
    accessor: "status",
  },
  {
    header: "Issue Date",
    accessor: "issueDate",
  },
];

export const raiseColumns = [
  {
    header: "Issue ID",
    accessor: "id",
    // render is injected dynamically in page.jsx via buildColumns(onRowClick)
  },
  {
    header: "Issue Type",
    accessor: "issueType",
  },
  {
    header: "Sub Issue Type",
    accessor: "subIssueType",
  },
  {
    header: "Severity",
    accessor: "priority",
  },
  {
    header: "Issue Description",
    accessor: "description",
  },
  {
    header: "Status",
    accessor: "status",
  },
  {
    header: "Issue Date",
    accessor: "issueDate",
  },
];