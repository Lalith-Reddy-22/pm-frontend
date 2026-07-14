"use client";

export default function TaskRow({ task, onAddTask, isStriped }) {
  return (
    <tr className={isStriped ? "bg-gray-50" : "bg-white"}>
      <td className="px-4 py-4 text-sm text-gray-700">{task.taskName}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{task.templateName}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{task.responsibility}</td>
      <td className="px-4 py-4 text-sm text-gray-700">{task.actualHours}</td>
      <td className="px-4 py-4 text-sm text-right">
        <button
          type="button"
          onClick={() => onAddTask?.(task)}
          className="inline-flex rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
        >
          Add Task
        </button>
      </td>
    </tr>
  );
}
