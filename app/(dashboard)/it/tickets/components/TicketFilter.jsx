"use client";

import { useState } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import CustomSelect from "@/components/ui/CustomSelect";

export default function TicketFilters({
  role = "User",
  activeTab = "raise",
}) {
  const { t } = useTheme();

  const [filterValues, setFilterValues] = useState({
    type: "",
    priority: "",
    status: "",
    severity: "",
    employee: "",
    project: "",
  });

  // Dropdown Options
  const typeOptions = [
    { id: "bug", name: "Bug" },
    { id: "feature", name: "Feature Request" },
    { id: "support", name: "Support" },
  ];

  const priorityOptions = [
    { id: "high", name: "High" },
    { id: "medium", name: "Medium" },
    { id: "low", name: "Low" },
  ];

  const statusOptions = [
    { id: "open", name: "Open" },
    { id: "inprogress", name: "In Progress" },
    { id: "closed", name: "Closed" },
  ];

  const severityOptions = [
    { id: "critical", name: "Critical" },
    { id: "major", name: "Major" },
    { id: "minor", name: "Minor" },
  ];

  const employeeOptions = [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Smith" },
  ];

  const projectOptions = [
    { id: "1", name: "Project A" },
    { id: "2", name: "Project B" },
  ];

  const sectionHeading =
    role === "Admin" ? "" : "Issues Raised";

  const updateFilter = (key, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  let filters = [];

  if (role === "Admin") {
    if (activeTab === "raise") {
      filters = [
        {
          key: "type",
          placeholder: "Select Type",
          value: filterValues.type,
          options: typeOptions,
        },
        {
          key: "priority",
          placeholder: "Select Priority",
          value: filterValues.priority,
          options: priorityOptions,
        },
        {
          key: "status",
          placeholder: "Select Status",
          value: filterValues.status,
          options: statusOptions,
        },
      ];
    } else {
      filters = [
        {
          key: "employee",
          placeholder: "Select Employee",
          value: filterValues.employee,
          options: employeeOptions,
        },
        {
          key: "project",
          placeholder: "Select Project",
          value: filterValues.project,
          options: projectOptions,
        },
        {
          key: "status",
          placeholder: "Select Status",
          value: filterValues.status,
          options: statusOptions,
        },
      ];
    }
  } else {
    filters = [
      {
        key: "type",
        placeholder: "Select Type",
        value: filterValues.type,
        options: typeOptions,
      },
      {
        key: "severity",
        placeholder: "Select Severity",
        value: filterValues.severity,
        options: severityOptions,
      },
      {
        key: "status",
        placeholder: "Select Status",
        value: filterValues.status,
        options: statusOptions,
      },
    ];
  }

  return (
    <div className="border-0">
      {/* Filters */}
      <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3">
        {filters.map((filter) => (
          <CustomSelect
            key={filter.key}
            value={filter.value}
            onChange={(value) => updateFilter(filter.key, value)}
            options={filter.options}
            placeholder={filter.placeholder}
          />
        ))}
      </div>

      {/* Section Title */}
      {sectionHeading && (
        <div className="px-6 pb-5">
          <h3 className={`text-xl font-semibold ${t.textPrimary}`}>
            {sectionHeading}
          </h3>
        </div>
      )}
    </div>
  );
}