"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../../../context/ThemeContext";
import CustomSelect from "@/components/ui/CustomSelect";
import { api } from "@/lib/api";

export default function TicketFilters({
  role = "User",
  activeTab = "raise",
  // filter values owned by parent
  issueTypeId,
  severityId,
  statusId,
  onIssueTypeChange,
  onSeverityChange,
  onStatusChange,
}) {
  const { t } = useTheme();

  // Dropdown options fetched from form-data API
  const [issueTypes, setIssueTypes] = useState([]);
  const [severities, setSeverities] = useState([]);
  const [statuses,   setStatuses]   = useState([]);

  useEffect(() => {
    api
      .get("/api/v1/ticket/form-data")
      .then((data) => {
        setIssueTypes(
          (data?.issueTypes ?? []).map((t) => ({ id: t.id, name: t.issue_Type }))
        );
        setSeverities(
          (data?.severities ?? []).map((s) => ({ id: s.id, name: s.severity }))
        );
        setStatuses(
          (data?.statuses ?? []).map((s) => ({ id: s.id, name: s.status }))
        );
      })
      .catch(() => {});
  }, []);

  // Prepend a clear option so users can reset each filter
  const ALL_TYPES      = [{ id: "", name: "Select Type"      }, ...issueTypes];
  const ALL_SEVERITIES = [{ id: "", name: "Select Priority" }, ...severities];
  const ALL_STATUSES   = [{ id: "", name: "Select Status"   }, ...statuses];

  return (
    <div className="border-0">
      <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-3">

        {/* Issue Type */}
        <CustomSelect
          value={issueTypeId}
          onChange={onIssueTypeChange}
          options={ALL_TYPES}
          placeholder="Select Type"
        />

        {/* Severity */}
        <CustomSelect
          value={severityId}
          onChange={onSeverityChange}
          options={ALL_SEVERITIES}
          placeholder="Select Severity"
        />

        {/* Status */}
        <CustomSelect
          value={statusId}
          onChange={onStatusChange}
          options={ALL_STATUSES}
          placeholder="Select Status"
        />

      </div>
    </div>
  );
}
