"use client";

import { PRIORITY_STYLES, DAY_KEYS, } from "../data";

export default function TaskRowPair({ task, border, rowLabelColor, inputBg, t, isDark, onActualChange }) {
  const badge = PRIORITY_STYLES[task.priority] ?? "bg-gray-400";

  return (
    <>
      {/* Planned row */}
      <tr className={`border-b ${border} border-dashed`}>
        <td rowSpan={2} className={`align-top px-4 py-3 border-b ${border} align-middle`}>
          <p className={`text-sm font-medium ${t.textPrimary} leading-snug`}>{task.title}</p>
          <p className={`mt-1 text-xs ${t.textMuted}`}>#Task: {task.id}</p>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className={`text-xs ${t.textMuted}`}>Priority:</span>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold text-white ${badge}`}>
              {task.priority}
            </span>
          </div>
        </td>
        <td rowSpan={2} className={`align-middle px-4 py-3 border-b ${border} text-sm ${t.textSecondary}`}>
          {task.owner}
        </td>
        <td className={`px-2 py-2 text-xs font-medium ${rowLabelColor}`}>Planned</td>
        {DAY_KEYS.map((key) => (
          <td key={key} className="px-3 py-2 text-center">
            <span className={`text-sm ${t.textSecondary}`}>
              {task.planned[key] !== undefined ? task.planned[key] : ""}
            </span>
          </td>
        ))}
      </tr>

      {/* Actual row */}
      <tr className={`border-b ${border}`}>
        <td className={`px-2 py-2 text-xs font-medium ${rowLabelColor}`}>Actual</td>
        {DAY_KEYS.map((key) => (
          <td key={key} className="px-2 py-2">
            <div className="flex flex-col items-center gap-1">
              <input
                type="number"
                min={0}
                max={24}
                step={0.5}
                value={task.actual[key] ?? ""}
                onChange={(e) => onActualChange(task.id, key, e.target.value)}
                placeholder="–"
                className={`w-14 rounded-md border ${border} ${inputBg} px-1.5 py-1 text-center text-sm ${t.textPrimary}
                  focus:outline-none focus:ring-2 ${isDark ? "focus:ring-red-500/40" : "focus:ring-red-500/30"} focus:border-transparent
                  [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
          </td>
        ))}
      </tr>
    </>
  );
}