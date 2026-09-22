"use client";

export default function ProjectRow({
  proj,
  visuals,
  border,
  isDark,
  t,
}) {
  return (
    <tr
      className={`border-t ${border} ${
        isDark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"
      } transition-colors`}
    >
      <td className="px-6 py-3">
        <p className={`text-sm font-medium ${t.textPrimary}`}>
          {proj.name}
        </p>

        <p className={`text-xs ${t.textMuted}`}>
          {visuals.client}
        </p>
      </td>

      <td className={`px-4 py-3 text-sm ${t.textSecondary}`}>
        {visuals.tasksDone} / {visuals.tasksTotal}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className={`h-1.5 w-24 rounded-full ${
              isDark ? "bg-white/10" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-1.5 rounded-full ${
                visuals.progress === 100
                  ? "bg-green-500"
                  : "bg-blue-500"
              }`}
              style={{ width: `${visuals.progress}%` }}
            />
          </div>

          <span className={`text-xs font-medium ${t.textSecondary}`}>
            {visuals.progress}%
          </span>
        </div>
      </td>

      <td className={`px-4 py-3 text-sm ${t.textSecondary}`}>
        {visuals.actualHours}
      </td>
    </tr>
  );
}