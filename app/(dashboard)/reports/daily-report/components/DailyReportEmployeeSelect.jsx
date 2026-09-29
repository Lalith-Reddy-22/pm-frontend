"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

export default function DailyReportEmployeeSelect({
  employees = [],
  value,
  onChange,
  placeholder = "All Employees",
}) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const containerRef = useRef(null);
  const searchRef = useRef(null);

  // ---------------------------------------------------------
  // 1. ACTIVE EMPLOYEES + REMOVE DUPLICATES
  // ---------------------------------------------------------
  const activeEmployees = useMemo(() => {
    const active = employees.filter(
      (employee) =>
        employee.employeeName &&
        employee.status?.trim().toLowerCase() === "active"
    );

    const uniqueEmployees = new Map();

    active.forEach((employee) => {
      const employeeName = employee.employeeName.trim();

      const key = `${employee.employeeId}-${employeeName.toLowerCase()}`;

      if (!uniqueEmployees.has(key)) {
        uniqueEmployees.set(key, employee);
      }
    });

    return Array.from(uniqueEmployees.values());
  }, [employees]);

  // ---------------------------------------------------------
  // 2. GROUP EMPLOYEES BY TEAM
  // ---------------------------------------------------------
  const groupedEmployees = useMemo(() => {
    const groups = {};

    activeEmployees.forEach((employee) => {
      const teamName = employee.teamName?.trim() || "Other";

      if (!groups[teamName]) {
        groups[teamName] = [];
      }

      groups[teamName].push(employee);
    });

    Object.keys(groups).forEach((teamName) => {
      groups[teamName].sort((a, b) =>
        a.employeeName.trim().localeCompare(
          b.employeeName.trim()
        )
      );
    });

    return groups;
  }, [activeEmployees]);

  // ---------------------------------------------------------
  // 3. SEARCH
  // ---------------------------------------------------------
  const searchResults = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return [];
    }

    return activeEmployees
      .filter((employee) =>
        employee.employeeName
          .trim()
          .toLowerCase()
          .includes(search)
      )
      .sort((a, b) =>
        a.employeeName
          .trim()
          .localeCompare(b.employeeName.trim())
      );
  }, [activeEmployees, searchTerm]);

  // ---------------------------------------------------------
  // 4. SELECTED VALUE
  // ---------------------------------------------------------
  const selectedLabel =
    value && value !== "All Employees"
      ? value
      : "All Employees";

  // ---------------------------------------------------------
  // 5. CLOSE WHEN CLICKING OUTSIDE
  // ---------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        setSelectedTeam(null);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ---------------------------------------------------------
  // 6. FOCUS SEARCH WHEN OPENED
  // ---------------------------------------------------------
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 0);
    } else {
      setSearchTerm("");
      setSelectedTeam(null);
    }
  }, [open]);

  // ---------------------------------------------------------
  // 7. SELECT EMPLOYEE
  // ---------------------------------------------------------
  const handleEmployeeSelect = (employeeName) => {
    onChange(employeeName);
    setOpen(false);
    setSelectedTeam(null);
    setSearchTerm("");
  };

  // ---------------------------------------------------------
  // 8. SELECT ALL EMPLOYEES
  // ---------------------------------------------------------
  const handleAllEmployees = () => {
    onChange("All Employees");
    setOpen(false);
    setSelectedTeam(null);
    setSearchTerm("");
  };

  // ---------------------------------------------------------
  // 9. GO BACK TO TEAM LIST
  // ---------------------------------------------------------
  const handleBackToTeams = () => {
    setSelectedTeam(null);
    setSearchTerm("");

    setTimeout(() => {
      searchRef.current?.focus();
    }, 0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
    >
      {/* ================================================= */}
      {/* SELECT BUTTON */}
      {/* ================================================= */}

      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className="flex h-8 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 text-sm transition hover:border-[#E12729] focus:outline-none focus:ring-2 focus:ring-[#E12729]/20"
      >
        <span
          className={
            selectedLabel === "All Employees"
              ? "text-gray-400"
              : "text-gray-900"
          }
        >
          {selectedLabel || placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ================================================= */}
      {/* DROPDOWN */}
      {/* ================================================= */}

      {open && (
        <div className="absolute left-0 right-0 top-full z-[9999] mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl">

          {/* SEARCH */}
          <div className="border-b border-gray-200 p-2">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);

                  // Searching should show search results,
                  // not a specific team.
                  if (e.target.value.trim()) {
                    setSelectedTeam(null);
                  }
                }}
                placeholder="Search employee..."
                className="h-8 w-full rounded-md border border-gray-300 bg-white pl-8 pr-2 text-sm outline-none focus:border-[#E12729] focus:ring-2 focus:ring-[#E12729]/20"
              />
            </div>
          </div>

          {/* ================================================= */}
          {/* SEARCH RESULTS */}
          {/* ================================================= */}

          {searchTerm.trim() ? (
            <div className="max-h-60 overflow-y-auto">

              {searchResults.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No employees found
                </div>
              ) : (
                searchResults.map((employee, index) => {
                  const employeeName =
                    employee.employeeName.trim();

                  return (
                    <button
                      key={`search-${employee.employeeId}-${index}`}
                      type="button"
                      onClick={() =>
                        handleEmployeeSelect(employeeName)
                      }
                      className={`block w-full px-4 py-2 text-left text-sm transition ${
                        employeeName === selectedLabel
                          ? "bg-red-50 font-medium text-[#E12729]"
                          : "hover:bg-red-50 hover:text-[#E12729]"
                      }`}
                    >
                      <div>{employeeName}</div>

                      <div className="mt-0.5 text-xs text-gray-400">
                        {employee.teamName?.trim() || "Other"}
                      </div>
                    </button>
                  );
                })
              )}

            </div>
          ) : selectedTeam ? (

            /* ================================================= */
            /* SELECTED TEAM → SHOW ONLY TEAM MEMBERS */
            /* ================================================= */

            <div className="max-h-60 overflow-y-auto">

              {/* BACK TO TEAMS */}
              <button
                type="button"
                onClick={handleBackToTeams}
                className="flex w-full items-center gap-2 border-b border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#E12729]"
              >
                <ChevronLeft size={16} />

                <span>{selectedTeam}</span>
              </button>

              {/* TEAM MEMBERS */}
              {groupedEmployees[selectedTeam]?.map(
                (employee, index) => {
                  const employeeName =
                    employee.employeeName.trim();

                  const selected =
                    employeeName === selectedLabel;

                  return (
                    <button
                      key={`member-${employee.employeeId}-${index}`}
                      type="button"
                      onClick={() =>
                        handleEmployeeSelect(employeeName)
                      }
                      className={`block w-full px-6 py-2 text-left text-sm transition ${
                        selected
                          ? "bg-red-50 font-medium text-[#E12729]"
                          : "hover:bg-red-50 hover:text-[#E12729]"
                      }`}
                    >
                      {employeeName}
                    </button>
                  );
                }
              )}

            </div>

          ) : (

            /* ================================================= */
            /* TEAM LIST */
            /* ================================================= */

            <div className="max-h-60 overflow-y-auto">

              {/* ALL EMPLOYEES */}
              <button
                type="button"
                onClick={handleAllEmployees}
                className={`block w-full px-4 py-2 text-left text-sm transition ${
                  selectedLabel === "All Employees"
                    ? "bg-red-50 font-medium text-[#E12729]"
                    : "hover:bg-red-50 hover:text-[#E12729]"
                }`}
              >
                All Employees
              </button>

              {/* TEAM LIST */}
              {Object.keys(groupedEmployees)
                .sort((a, b) => a.localeCompare(b))
                .map((teamName) => (
                  <button
                    key={`team-${teamName}`}
                    type="button"
                    onClick={() =>
                      setSelectedTeam(teamName)
                    }
                    className="flex w-full items-center justify-between border-t border-gray-100 px-4 py-2.5 text-left text-sm transition hover:bg-red-50 hover:text-[#E12729]"
                  >
                    <span>{teamName}</span>

                    <ChevronRight
                      size={16}
                      className="text-gray-400"
                    />
                  </button>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}