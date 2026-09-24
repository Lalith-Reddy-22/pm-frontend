"use client";

import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function HoursAllocation({
  formData,
  taskId,
  setFormData,
  isUpdate = false,
  taskDetails,
}) {
  const [hoursData, setHoursData] = useState({});
  const [timeData, setTimeData] = useState({});
  const [saving, setSaving] = useState(false);

  // =====================================================
  // SELECTED RESOURCES
  // =====================================================

  const resources = useMemo(() => {
    return (formData?.resources || []).map((resource) => ({
      id: Number(resource.employeeId),
      name: resource.employeeName || "",
    }));
  }, [formData?.resources]);

  // =====================================================
  // DATES
  // =====================================================

  const dates = useMemo(() => {
    if (!formData?.startDate || !formData?.endDate) {
      return [];
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start > end
    ) {
      return [];
    }

    const result = [];
    const current = new Date(start);

    while (current <= end) {
      const year = current.getFullYear();

      const month = String(
        current.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        current.getDate()
      ).padStart(2, "0");

      result.push(
        `${month}/${day}/${year}`
      );

      current.setDate(
        current.getDate() + 1
      );
    }

    return result;
  }, [
    formData?.startDate,
    formData?.endDate,
  ]);

  // =====================================================
// LOAD EXISTING HOURS - UPDATE MODE
// =====================================================

useEffect(() => {
  if (!isUpdate || !taskDetails) {
    return;
  }

  const allocations =
    taskDetails?.employeeAllocations || [];

  const existingHours = {};
  const existingTimes = {};

  allocations.forEach((employee) => {
    const employeeId = Number(
      employee.employeeId
    );

    if (!employeeId) {
      return;
    }

    const dailyAllocations =
      employee.dailyAllocations || [];

    dailyAllocations.forEach((allocation) => {
      if (!allocation?.allocationDate) {
        return;
      }

      const dateObj = new Date(
        allocation.allocationDate
      );

      if (Number.isNaN(dateObj.getTime())) {
        return;
      }

      const month = String(
        dateObj.getMonth() + 1
      ).padStart(2, "0");

      const day = String(
        dateObj.getDate()
      ).padStart(2, "0");

      const year =
        dateObj.getFullYear();

      const date =
        `${month}/${day}/${year}`;

      const key =
        `${employeeId}_${date}`;

      // Existing saved hours
      existingHours[key] =
        allocation.hours ??
        allocation.logHours ??
        "";

      // Existing start/end time
      existingTimes[key] = {
        start:
          allocation.startTime ||
          allocation.start ||
          "",

        end:
          allocation.endTime ||
          allocation.end ||
          "",
      };
    });
  });

  setHoursData(existingHours);
  setTimeData(existingTimes);

}, [isUpdate, taskDetails]);

  // =====================================================
  // CREATE TASK
  // =====================================================

  const createTask = async () => {
    try {
      const createdBy = Number(
        sessionStorage.getItem("empId") || 0
      );

      const payload = {
        taskTitle:
          formData?.taskName || "",

        projectId: Number(
          formData?.projectId || 0
        ),

        clientId: Number(
          formData?.clientId || 0
        ),

        templateId: Number(
          formData?.templateId || 0
        ),

        startDate:
          formData?.startDate || "",

        endDate:
          formData?.endDate || "",

        statusId: Number(
          formData?.statusId || 0
        ),

        priority:
          formData?.priority || "",

        taskDescription:
          formData?.taskDescription || "",

        createdBy,

        // Hours are saved separately
        // through /api/Timesheet/log
        employeeAllocations: [],
      };

      const response = await api.post(
        "/api/v1/Task",
        payload
      );

      const createdTaskId =
        Number(response?.taskId) ||
        Number(response?.data?.taskId) ||
        Number(response?.data?.TaskId) ||
        Number(response?.TaskId) ||
        0;

      if (!createdTaskId) {
        throw new Error(
          "Task was created but Task ID was not returned."
        );
      }

      setFormData((prev) => ({
        ...prev,
        taskId: createdTaskId,
      }));

      return createdTaskId;
    } catch (error) {
      throw error;
    }
  };

  // =====================================================
  // UPDATE TASK
  // =====================================================

  const updateTask = async () => {
    const finalTaskId = Number(
      taskId ||
        formData?.taskId ||
        0
    );

    if (!finalTaskId) {
      throw new Error(
        "Task ID is missing."
      );
    }

    const updatedBy = Number(
      sessionStorage.getItem("empId") || 0
    );

    // ===================================================
    // ORIGINAL EMPLOYEE IDS
    // ===================================================

    const originalEmpIds = (
      taskDetails?.employeeAllocations || []
    )
      .map((employee) =>
        Number(employee.employeeId)
      )
      .filter(Boolean)
      .join(",");

    // ===================================================
    // EMPLOYEE ALLOCATIONS
    // ===================================================

    const employeeAllocations =
      resources.map((resource) => {
        const dailyAllocations =
          dates.map((date) => {
            const key =
              `${resource.id}_${date}`;

            return {
              allocationDate:
                formatDateForApi(date),

              hours: Number(
                hoursData[key] || 0
              ),

              startTime:
                timeData[key]?.start || "",

              endTime:
                timeData[key]?.end || "",
            };
          });

        return {
          employeeId: Number(
            resource.id
          ),

          dailyAllocations,
        };
      });

    // ===================================================
    // UPDATE PAYLOAD
    // ===================================================

    const payload = {
      taskTitle:
        formData?.taskName || "",

      projectId: Number(
        formData?.projectId || 0
      ),

      clientId: Number(
        formData?.clientId || 0
      ),

      startDate:
        formData?.startDate || "",

      endDate:
        formData?.endDate || "",

      statusId: Number(
        formData?.statusId || 0
      ),

      priority:
        formData?.priority || "",

      taskDescription:
        formData?.taskDescription || "",

      updatedBy,

      originalEmpIds,

      employeeAllocations,
    };

    const response = await api.put(
      `/api/v1/Task/${finalTaskId}`,
      payload
    );

    return response;
  };

  // =====================================================
  // HOURS CHANGE
  // =====================================================

  const handleHoursChange = (
    employeeId,
    date,
    value
  ) => {
    const key =
      `${employeeId}_${date}`;

    setHoursData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================================================
  // TIME CHANGE
  // =====================================================

  const handleTimeChange = (
    employeeId,
    date,
    field,
    value
  ) => {
    const key =
      `${employeeId}_${date}`;

    setTimeData((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [field]: value,
      },
    }));
  };

  // =====================================================
  // CLONE HOURS
  // =====================================================

  const cloneHoursToAllDates = (
    employeeId
  ) => {
    if (!dates.length) {
      return;
    }

    const firstKey =
      `${employeeId}_${dates[0]}`;

    const firstHours =
      hoursData[firstKey] ?? "";

    const updated = {};

    dates.forEach((date) => {
      updated[
        `${employeeId}_${date}`
      ] = firstHours;
    });

    setHoursData((prev) => ({
      ...prev,
      ...updated,
    }));
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDateForApi = (date) => {
    const [
      month,
      day,
      year,
    ] = date.split("/");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // SAVE HOURS
  // =====================================================

  const handleSaveHours = async () => {
    try {
      setSaving(true);

      // =================================================
      // UPDATE MODE
      // =================================================

      if (isUpdate) {
        await updateTask();

        toast.success("Task updated successfully.");

        return;
      }

      // =================================================
      // CREATE MODE
      // =================================================

      let finalTaskId = Number(
        taskId ||
          formData?.taskId ||
          0
      );

      // =================================================
      // CREATE TASK
      // =================================================

      if (!finalTaskId) {
        finalTaskId =
          await createTask();
      }

      // =================================================
      // BUILD TIME LOGS
      // =================================================

      const logs = [];

      resources.forEach(
        (resource) => {
          dates.forEach(
            (date) => {
              const key =
                `${resource.id}_${date}`;

              const value =
                hoursData[key];

              if (
                value !== undefined &&
                value !== "" &&
                Number(value) > 0
              ) {
                logs.push({
                  timeLogId: 0,

                  taskId:
                    finalTaskId,

                  empId: Number(
                    resource.id
                  ),

                  logDate:
                    formatDateForApi(
                      date
                    ),

                  logHours:
                    Number(value),

                  notes: "",
                });
              }
            }
          );
        }
      );

      // =================================================
      // NO HOURS
      // =================================================

      if (logs.length === 0) {
        toast.success("Task created successfully, but no hours were entered.");

        return;
      }

      // =================================================
      // SAVE HOURS
      // =================================================

      for (const log of logs) {
        const response =
          await api.post(
            "/api/Timesheet/log",
            log
          );

        void response; // response used only for side effect
      }

      toast.success("Task and hours saved successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          "Failed to save task."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // NO RESOURCES
  // =====================================================

  if (!resources.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Update The Hours Below:
          </h2>
        </div>

        <div className="px-6 py-10 text-center text-sm text-gray-500">
          Please select at least one resource.
        </div>

      </div>
    );
  }

  // =====================================================
  // NO DATES
  // =====================================================

  if (!dates.length) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b px-4 py-3">
          <h2 className="text-lg font-semibold text-gray-800">
            Update The Hours Below:
          </h2>
        </div>

        <div className="px-6 py-10 text-center text-sm text-gray-500">
          Please select a valid start date and end date.
        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="border-b px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Update The Hours Below:
        </h2>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-x-auto">

        <table className="w-full min-w-max border-collapse">

          <thead>
            <tr className="border-b bg-gray-50">

              {/* OWNER */}

              <th
                className="
                  sticky left-0 z-10
                  w-[240px]
                  min-w-[240px]
                  bg-gray-50
                  px-4 py-3
                  text-left
                  text-sm
                  font-semibold
                  uppercase
                  text-gray-700
                "
              >
                Owner
              </th>

              {/* DATES */}

              {dates.map((date) => (
                <th
                  key={date}
                  className="
                    min-w-[320px]
                    px-4 py-4
                    text-center
                    text-sm
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-700
                  "
                >
                  {date}
                </th>
              ))}

            </tr>
          </thead>

          <tbody>

            {resources.map(
              (resource) => (
                <tr
                  key={resource.id}
                  className="border-b"
                >

                  {/* =================================================
                      OWNER
                  ================================================= */}

                  <td
                    className="
                      sticky left-0 z-10
                      w-[240px]
                      min-w-[240px]
                      border-r
                      bg-white
                      p-4
                    "
                  >

                    <p className="font-semibold text-gray-900">
                      {resource.name}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        cloneHoursToAllDates(
                          resource.id
                        )
                      }
                      className="
                        mt-1
                        text-xs
                        font-medium
                        text-[#E12729]
                        hover:underline
                      "
                    >
                      Clone hrs to all dates
                    </button>

                  </td>

                  {/* =================================================
                      DATES
                  ================================================= */}

                  {dates.map(
                    (date) => {
                      const key =
                        `${resource.id}_${date}`;

                      return (
                        <td
                          key={date}
                          className="
                            min-w-[320px]
                            px-3
                            py-4
                            align-top
                          "
                        >

                          <div className="flex flex-col gap-4">

                            {/* =========================================
                                HOURS
                            ========================================= */}

                            <div className="flex items-center justify-center gap-2">

                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={
                                  hoursData[key] ??
                                  ""
                                }
                                onChange={(e) =>
                                  handleHoursChange(
                                    resource.id,
                                    date,
                                    e.target.value
                                  )
                                }
                                placeholder="0"
                                className="
                                  h-10
                                  w-20
                                  rounded-md
                                  border
                                  border-gray-300
                                  px-3
                                  outline-none
                                  focus:border-red-500
                                "
                              />

                              <Info
                                size={18}
                                className="text-gray-500"
                              />

                            </div>

                            {/* =========================================
                                START / END
                            ========================================= */}

                            <div className="flex items-center justify-center gap-4">

                              {/* START */}

                              <div className="flex items-center gap-2">

                                <span className="text-sm text-gray-600">
                                  Start
                                </span>

                                <input
                                  type="time"
                                  value={
                                    timeData[key]
                                      ?.start ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleTimeChange(
                                      resource.id,
                                      date,
                                      "start",
                                      e.target.value
                                    )
                                  }
                                  className="
                                    h-10
                                    w-28
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-2
                                  "
                                />

                              </div>

                              {/* END */}

                              <div className="flex items-center gap-2">

                                <span className="text-sm text-gray-600">
                                  End
                                </span>

                                <input
                                  type="time"
                                  value={
                                    timeData[key]
                                      ?.end ||
                                    ""
                                  }
                                  onChange={(e) =>
                                    handleTimeChange(
                                      resource.id,
                                      date,
                                      "end",
                                      e.target.value
                                    )
                                  }
                                  className="
                                    h-10
                                    w-28
                                    rounded-md
                                    border
                                    border-gray-300
                                    px-2
                                  "
                                />

                              </div>

                            </div>

                          </div>

                        </td>
                      );
                    }
                  )}

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* =================================================
          SAVE / UPDATE
      ================================================= */}

      <div className="flex justify-end border-t px-4 py-4">

        <button
          type="button"
          onClick={handleSaveHours}
          disabled={saving}
          className="
            rounded-lg
            bg-[#E12729]
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            hover:bg-red-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {saving
            ? isUpdate
              ? "Updating..."
              : "Saving..."
            : isUpdate
              ? "Update Task"
              : "Save Hours"}
        </button>

      </div>

    </div>
  );
}