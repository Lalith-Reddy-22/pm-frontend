"use client";

import { useEffect } from "react";
import { CalendarDays } from "lucide-react";

function normalizeDate(dateValue) {
  if (!dateValue) return "";

  const value = String(dateValue);

  // YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  if (value.includes("-")) {
    return value.substring(0, 10);
  }

  // MM/DD/YYYY
  if (value.includes("/")) {
    const [month, day, year] =
      value.split("/");

    return `${year}-${String(month).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  }

  return "";
}

export default function RescheduleModal({
  open,
  task,
  originalDate,
  setOriginalDate,
  rescheduleDate,
  setRescheduleDate,
  rescheduleType,
  setRescheduleType,
  rescheduleReason,
  setRescheduleReason,
  onClose,
  onSubmit,
  isDark,
  loading,
}) {
  console.log("MODAL TASK:", task);

const selectedEmployeeId = task?.empIds
  ? Number(
      String(task.empIds)
        .split(",")[0]
        .trim()
    )
  : 0;

const selectedEmployeeAllocation =
  task?.employeeAllocations?.find(
    (employee) =>
      Number(employee.employeeId) ===
      selectedEmployeeId
  );

const taskDates =
  selectedEmployeeAllocation?.dailyAllocations || [];

console.log(
  "EMPLOYEE ALLOCATIONS:",
  task?.employeeAllocations
);

console.log(
  "SELECTED EMPLOYEE ID:",
  selectedEmployeeId
);

console.log(
  "SELECTED EMPLOYEE ALLOCATION:",
  selectedEmployeeAllocation
);

console.log(
  "RESCHEDULE AVAILABLE DATES:",
  taskDates
);

 useEffect(() => {
  if (!open || !task) return;

  setOriginalDate("");
  setRescheduleDate("");
  setRescheduleType("FULL_TASK");
  setRescheduleReason("");
}, [
  open,
  task,
  setOriginalDate,
  setRescheduleDate,
  setRescheduleType,
  setRescheduleReason,
]);

  if (!open || !task) {
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!originalDate) {
      alert("Please select original date.");
      return;
    }

    if (!rescheduleDate) {
      alert("Please select reschedule date.");
      return;
    }

    if (rescheduleDate <= originalDate) {
      alert("Reschedule date must be after original date.");
      return;
    }

    onSubmit({
  task,
  originalDate,
  rescheduleDate,
  rescheduleType,
  reason: rescheduleReason,
});
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-background shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">

          <div>
            <h2 className="text-lg font-semibold">
              Reschedule Task
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              #{task.id}
            </p>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ×
          </button>

        </div>

        {/* Task information */}
        <div className="px-5 pt-4">

          <div className="rounded-lg border bg-muted/30 p-3">

            <p className="text-sm font-medium">
              {task.title}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Owner: {task.owner || "-"}
            </p>

          </div>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-5"
        >

          {/* Original Date */}
<div>
  <label className="mb-1.5 block text-sm font-medium">
    Original Date
  </label>

  <div className="relative">
    <CalendarDays
      size={16}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
    />

    <select
  value={originalDate}
  onChange={(e) =>
    setOriginalDate(e.target.value)
  }
  className="w-full appearance-none rounded-lg border bg-background py-2.5 pl-9 pr-8 text-sm"
>
  <option value="">
    Select original date
  </option>

  {taskDates.map((date, index) => {
    const apiDate = normalizeDate(
      date.allocationDate
    );

    if (!apiDate) return null;

    return (
      <option
        key={`${apiDate}-${index}`}
        value={apiDate}
      >
        {date.allocationDate}
        {" - "}
        {Number(date.hours) || 0}h
      </option>
    );
  })}
</select>
  </div>
</div>

          {/* Reschedule To */}
<div>
  <label className="mb-1.5 block text-sm font-medium">
    Reschedule To
  </label>

  <input
    type="date"
    value={rescheduleDate}
    min={
  originalDate
    ? (() => {
        const date = new Date(
          `${originalDate}T00:00:00`
        );

        date.setDate(date.getDate() + 1);

        return date.toISOString().split("T")[0];
      })()
    : undefined
}
    onChange={(e) => setRescheduleDate(e.target.value)}
    className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm"
  />
</div>

          {/* Reschedule Type */}
          <div>

            <label className="mb-2 block text-sm font-medium">
              Reschedule Type
            </label>

            <div className="space-y-2">

              <button
                type="button"
                onClick={() =>
                  setRescheduleType("FULL_TASK")
                }
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${
                  rescheduleType === "FULL_TASK"
                    ? "border-primary"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  checked={rescheduleType === "FULL_TASK"}
                  onChange={() =>
                    setRescheduleType("FULL_TASK")
                  }
                  className="mt-1"
                />

                <div>
                  <p className="text-sm font-medium">
                    Full Task
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Move the complete task allocation.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setRescheduleType("REMAINING_HOURS")
                }
                className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left ${
                  rescheduleType === "REMAINING_HOURS"
                    ? "border-primary"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  checked={
                    rescheduleType === "REMAINING_HOURS"
                  }
                  onChange={() =>
                    setRescheduleType("REMAINING_HOURS")
                  }
                  className="mt-1"
                />

                <div>
                  <p className="text-sm font-medium">
                    Remaining Hours
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Move only the remaining allocated hours.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Reason */}
          <div>

            <label className="mb-1.5 block text-sm font-medium">
              Reason
            </label>

            <textarea
  value={rescheduleReason}
  onChange={(e) =>
    setRescheduleReason(e.target.value)
  }
  rows={3}
  placeholder="Enter reason..."
  className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm"
/>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">

            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {loading
                ? "Rescheduling..."
                : "Reschedule"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}