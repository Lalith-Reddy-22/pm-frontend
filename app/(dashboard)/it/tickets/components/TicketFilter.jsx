"use client";

import { ChevronDown } from "lucide-react";
import { useTheme } from "../../../../context/ThemeContext";

export default function TicketFilters({
  role = "User",
  activeTab = "raise",
}) {
  const { t, isDark } = useTheme();

  const border = isDark ? "border-white/10" : "border-gray-200";

  const inputBg = isDark
    ? "bg-white/5 text-white"
    : "bg-white text-gray-700";

  const sectionHeading =
    role === "Admin"
      ? ""
      : "Issues Raised";

  let filters = [];

  if (role === "Admin") {
    if (activeTab === "raise") {
      filters = [
        {
          key: "type",
          placeholder: "Select Type",
        },
        {
          key: "priority",
          placeholder: "Select Priority",
        },
        {
          key: "status",
          placeholder: "Select Status",
        },
      ];
    } else {
      filters = [
        {
          key: "employee",
          placeholder: "Select Type",
        },
        {
          key: "project",
          placeholder: "Select Priority",
        },
        {
          key: "status",
          placeholder: "Select Status",
        },
      ];
    }
  } else {
    filters = [
      {
        key: "type",
        placeholder: "Select Type",
      },
      {
        key: "severity",
        placeholder: "Select Severity",
      },
      {
        key: "status",
        placeholder: "Select Status",
      },
    ];
  }

  return (
    <div className="border-0">

      <div className="grid grid-cols-1 gap-6 px-6 py-8 md:grid-cols-3">

        {filters.map((filter) => (

          <div key={filter.key} className="relative">

            <select
              className={`w-full appearance-none rounded-xl border ${border} ${inputBg} px-4 py-3 pr-10 outline-none transition focus:border-[#E12729]`}
            >
              <option>{filter.placeholder}</option>
            </select>

            <ChevronDown
              size={18}
              className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${t.textMuted}`}
            />

          </div>

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