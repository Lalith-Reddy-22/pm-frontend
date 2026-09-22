"use client";

import { PRIORITY_STYLES } from "../data";
import { MessageSquare } from "lucide-react";

export default function TaskRowPair({
  task,
  weekDates = [],
  border,
  rowLabelColor,
  inputBg,
  t,
  isDark,
  onPlannedChange,
  onActualChange,
  onComment,
}) {
  const badge =
    PRIORITY_STYLES[String(task.priority || "").toUpperCase()] ??
    "bg-gray-400";

  const formatDateKey = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDateValue = (date, type) => {
    const dateKey = formatDateKey(date);
    if (type === "planned") {
      return task.planned?.[dateKey] ?? "";
    }

    return task.actual?.[dateKey] ?? "";
  };

  const days = weekDates;

  return (
    <>
      {/* Planned row */}
      <tr className={`border-b ${border} border-dashed`}>
        <td
          rowSpan={2}
          className={`align-top px-4 py-3 border-b ${border}`}
        >
          <p
            className={`text-sm font-medium ${t.textPrimary} leading-snug`}
          >
            {task.title}
          </p>

          <p className={`mt-1 text-xs ${t.textMuted}`}>
            #Task: {task.id}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`text-xs ${t.textMuted}`}>
              Priority:
            </span>

            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${badge}`}
            >
              {task.priority}
            </span>
          </div>

          {/* <button
  type="button"
  onClick={() => {
    console.log("================================");
    console.log("RESCHEDULE BUTTON CLICKED");
    console.log("TASK:", task);
    console.log("onReschedule:", onReschedule);
    console.log("================================");

    if (typeof onReschedule === "function") {
      onReschedule(task);
    } else {
      console.error("ERROR: onReschedule is NOT a function");
    }
  }}
  className={`mt-2 rounded-md px-3 py-1.5 text-xs font-medium ${
    isDark
      ? "bg-white/10 text-gray-200 hover:bg-white/20"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  Reschedule
</button> */}

<button
  type="button"
  onClick={() => {
    console.log("COMMENT BUTTON CLICKED:", task);
    onComment(task);
  }}
  className={`mt-2 ml-2 inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
    isDark
      ? "bg-white/10 text-gray-200 hover:bg-white/20"
      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
  }`}
>
  <MessageSquare size={14} />
  Comment
</button>

        </td>

        <td
          rowSpan={2}
          className={`align-middle px-4 py-3 border-b ${border} text-sm ${t.textSecondary}`}
        >
          {task.owner}
        </td>

        <td
          className={`px-2 py-2 text-xs font-medium ${rowLabelColor}`}
        >
          Planned
        </td>

        {days.map((day) => {
          const dateKey = formatDateKey(day);

          return (
            <td
              key={dateKey}
              className="px-3 py-2 text-center"
            >
              <div
                className="mx-auto flex w-full max-w-[56px] items-center justify-center text-center text-sm text-inherit"
                aria-readonly="true"
              >
                {getDateValue(day, "planned") !== "" ? getDateValue(day, "planned") : "–"}
              </div>
            </td>
          );
        })}
      </tr>

      {/* Actual row */}
      <tr className={`border-b ${border}`}>
        <td
          className={`px-2 py-2 text-xs font-medium ${rowLabelColor}`}
        >
          Actual
        </td>

        {days.map((day) => {
          const dateKey = formatDateKey(day);
          const actualValue = getDateValue(day, "actual");

          return (
            <td
              key={dateKey}
              className="px-2 py-2"
            >
              <div className="flex flex-col items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={24}
                  step={0.5}
                  value={actualValue}
                  onChange={(e) =>
                    onActualChange(
                      task.id,
                      dateKey,
                      e.target.value
                    )
                  }
                  placeholder="–"
                  className={`w-14 rounded-md border ${border} ${inputBg} px-1.5 py-1 text-center text-sm ${t.textPrimary}
                    focus:outline-none focus:ring-2
                    ${
                      isDark
                        ? "focus:ring-red-500/40"
                        : "focus:ring-red-500/30"
                    }
                    focus:border-transparent
                    [appearance:textfield]
                    [&::-webkit-outer-spin-button]:appearance-none
                    [&::-webkit-inner-spin-button]:appearance-none`}
                />
              </div>
            </td>
          );
        })}
      </tr>
    </>
  );
}