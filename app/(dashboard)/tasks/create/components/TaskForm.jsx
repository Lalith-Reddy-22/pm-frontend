"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomSelect from "@/components/ui/CustomSelect";
import { Input } from "@/components/ui/input";
import DatePicker from "./DatePicker";

import { fetchEmployeeNames } from "@/store/slices/taskSlice";

export default function TaskForm({
  formData,
  setFormData,
  isUpdate = false,
}) {
  const dispatch = useDispatch();

  const {
    employeeNames = [],
    employeeNamesLoading,
  } = useSelector((state) => state.task);

  const [resourceSearch, setResourceSearch] =
    useState("");

  const [showEmployeeList, setShowEmployeeList] =
    useState(false);

  const resourceRef = useRef(null);

  // =====================================================
  // FETCH EMPLOYEES
  // =====================================================

  useEffect(() => {
    dispatch(fetchEmployeeNames());
  }, [dispatch]);

  // =====================================================
  // CLOSE EMPLOYEE DROPDOWN ON OUTSIDE CLICK
  // =====================================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        resourceRef.current &&
        !resourceRef.current.contains(
          event.target
        )
      ) {
        setShowEmployeeList(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =====================================================
  // NORMALIZE PRIORITY
  // =====================================================

  const normalizePriority = (value) => {
    if (!value) {
      return "";
    }

    const normalized =
      value.toString().trim().toLowerCase();

    if (normalized === "low") {
      return "low";
    }

    if (normalized === "medium") {
      return "medium";
    }

    if (normalized === "high") {
      return "high";
    }

    if (normalized === "tentative") {
      return "tentative";
    }

    return "";
  };

  // =====================================================
  // NORMALIZE STATUS
  // =====================================================

  const normalizeStatus = (value) => {
    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    const normalized =
      value.toString().trim().toLowerCase();

    if (
      normalized === "open" ||
      normalized === "1"
    ) {
      return "open";
    }

    if (
      normalized === "closed" ||
      normalized === "2"
    ) {
      return "closed";
    }

    if (
      normalized === "in progress" ||
      normalized === "inprogress" ||
      normalized === "3"
    ) {
      return "inprogress";
    }

    return "";
  };

  // =====================================================
  // DROPDOWN DISPLAY VALUES
  // =====================================================

  const priorityValue =
    normalizePriority(
      formData.priority
    );

  const statusValue =
    normalizeStatus(
      formData.status
    );

  // =====================================================
  // FILTER EMPLOYEES
  // =====================================================

  const filteredEmployees =
    employeeNames.filter((employee) =>
      employee.employeeName
        ?.toLowerCase()
        .includes(
          resourceSearch
            .toLowerCase()
        )
    );

  // =====================================================
  // SELECT / REMOVE RESOURCE
  // =====================================================

  const handleResourceSelect = (
    employee
  ) => {
    const employeeId = Number(
      employee.employeeId
    );

    const employeeName =
      employee.employeeName || "";

    if (!employeeId) {
      return;
    }

    const currentResources =
      formData.resources || [];

    const alreadySelected =
      currentResources.some(
        (resource) =>
          Number(
            resource.employeeId
          ) === employeeId
      );

    // ---------------------------------------------------
    // REMOVE IF ALREADY SELECTED
    // ---------------------------------------------------

    if (alreadySelected) {
      const updatedResources =
        currentResources.filter(
          (resource) =>
            Number(
              resource.employeeId
            ) !== employeeId
        );

      setFormData((prev) => ({
        ...prev,
        resources:
          updatedResources,
      }));

      return;
    }

    // ---------------------------------------------------
    // ADD EMPLOYEE
    // ---------------------------------------------------

    const updatedResources = [
      ...currentResources,
      {
        employeeId,
        employeeName,
      },
    ];

    setFormData((prev) => ({
      ...prev,
      resources:
        updatedResources,
    }));

    // Clear search after selecting
    setResourceSearch("");

    // Keep dropdown open so multiple employees
    // can be selected
    setShowEmployeeList(true);
  };

  // =====================================================
  // REMOVE SELECTED RESOURCE
  // =====================================================

  const handleRemoveResource = (
    employeeId
  ) => {
    const updatedResources =
      (formData.resources || []).filter(
        (resource) =>
          Number(
            resource.employeeId
          ) !== Number(employeeId)
      );

    setFormData((prev) => ({
      ...prev,
      resources:
        updatedResources,
    }));
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="mt-8 w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* =================================================
          TITLE
      ================================================= */}

      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        {isUpdate
          ? "Update Task"
          : "Add Task"}
      </h2>

      <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">

        {/* =================================================
            TASK NAME
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Task Name{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <Input
            placeholder="Enter Task Name"
            value={
              formData.taskName || ""
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                taskName:
                  e.target.value,
              }))
            }
          />
        </div>

        {/* =================================================
            TASK PRIORITY
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Task Priority{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <CustomSelect
            placeholder="Select Priority"
            value={priorityValue}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                priority: value,
              }))
            }
            options={[
              {
                label: "Select Priority",
                value: "",
              },
              {
                label: "Low",
                value: "low",
              },
              {
                label: "Medium",
                value: "medium",
              },
              {
                label: "High",
                value: "high",
              },
              {
                label: "Tentative",
                value: "tentative",
              },
            ]}
          />
        </div>

        {/* =================================================
            CLIENT NAME
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Client Name
          </label>

          <Input
            placeholder="Select Client"
            value={
              formData.client || ""
            }
            readOnly
          />
        </div>

        {/* =================================================
            PROJECT NAME
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Project Name
          </label>

          <Input
            placeholder="Select Project"
            value={
              formData.project || ""
            }
            readOnly
          />
        </div>

        {/* =================================================
            START DATE
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Start Date{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <DatePicker
            value={
              formData.startDate || ""
            }
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                startDate: value,
              }))
            }
            placeholder="Select Start Date"
          />
        </div>

        {/* =================================================
            END DATE
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            End Date{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <DatePicker
            value={
              formData.endDate || ""
            }
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                endDate: value,
              }))
            }
            placeholder="Select End Date"
          />
        </div>

        {/* =================================================
            RESOURCE NAME
        ================================================= */}

        <div
          ref={resourceRef}
          className="relative"
        >
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Resource Name
          </label>

          {/* =================================================
              SEARCH INPUT
          ================================================= */}

          <Input
            placeholder="Search and select resources..."
            value={resourceSearch}
            onChange={(e) => {
              const value =
                e.target.value;

              setResourceSearch(
                value
              );

              setShowEmployeeList(
                true
              );
            }}
            onFocus={() => {
              setShowEmployeeList(
                true
              );
            }}
          />

          {/* =================================================
              SELECTED RESOURCES
          ================================================= */}

          {formData.resources?.length >
            0 && (
            <div className="mt-3 flex flex-wrap gap-2">

              {formData.resources.map(
                (
                  resource,
                  index
                ) => (
                  <div
                    key={`${resource.employeeId}-${index}`}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-red-200
                      bg-red-50
                      px-3
                      py-1.5
                      text-sm
                      text-gray-800
                    "
                  >
                    <span>
                      {
                        resource.employeeName
                      }
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveResource(
                          resource.employeeId
                        )
                      }
                      className="
                        font-bold
                        text-red-500
                        hover:text-red-700
                      "
                    >
                      ×
                    </button>
                  </div>
                )
              )}

            </div>
          )}

          {/* =================================================
              EMPLOYEE DROPDOWN
          ================================================= */}

          {showEmployeeList && (
            <div
              className="
                absolute
                z-50
                mt-1
                max-h-60
                w-full
                overflow-y-auto
                rounded-md
                border
                bg-white
                shadow-lg
              "
            >
              {employeeNamesLoading ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Loading employees...
                </div>
              ) : filteredEmployees.length ===
                0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No employees found
                </div>
              ) : (
                filteredEmployees.map(
                  (
                    employee,
                    index
                  ) => {
                    const selected =
                      (
                        formData.resources ||
                        []
                      ).some(
                        (resource) =>
                          Number(
                            resource.employeeId
                          ) ===
                          Number(
                            employee.employeeId
                          )
                      );

                    return (
                      <button
                        key={`${employee.employeeId}-${index}`}
                        type="button"
                        className={`
                          flex
                          w-full
                          items-center
                          justify-between
                          px-4
                          py-2
                          text-left
                          text-sm
                          hover:bg-gray-100
                          ${
                            selected
                              ? "bg-red-50 text-red-600"
                              : "text-gray-800"
                          }
                        `}
                        onClick={() =>
                          handleResourceSelect(
                            employee
                          )
                        }
                      >
                        <span>
                          {
                            employee.employeeName
                          }
                        </span>

                        {selected && (
                          <span className="font-semibold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  }
                )
              )}
            </div>
          )}
        </div>

        {/* =================================================
            TASK STATUS
        ================================================= */}

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-600">
            Task Status{" "}
            <span className="text-red-500">
              *
            </span>
          </label>

          <CustomSelect
            placeholder="Select Status"
            value={statusValue}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                status: value,
              }))
            }
            options={[
              {
                label: "Select Status",
                value: "",
              },
              {
                label: "Open",
                value: "open",
              },
              {
                label: "Closed",
                value: "closed",
              },
              {
                label: "In Progress",
                value: "inprogress",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}