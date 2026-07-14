"use client";

import DatePicker from "@/app/components/DatePicker";

export default function AddTaskForm({ form, templates, onChange, onSubmit, onCancel }) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Task Name
        </label>
        <input
          value={form.taskName}
          onChange={(event) => onChange("taskName", event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          placeholder="Enter task name"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Template
        </label>
        <select
          value={form.templateName}
          onChange={(event) => onChange("templateName", event.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
        >
          <option value="">Select task template</option>
          {templates.map((template) => (
            <option key={template.id} value={template.name}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Assigned Employee
          </label>
          <select
            value={form.responsibility}
            onChange={(event) => onChange("responsibility", event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          >
            <option value="">Select employee</option>
            <option value="AMD / MD">AMD / MD</option>
            <option value="Email Team">Email Team</option>
            <option value="Design">Design</option>
            <option value="Web Team">Web Team</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Priority
          </label>
          <select
            value={form.priority}
            onChange={(event) => onChange("priority", event.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          >
            <option value="">Select priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Estimated Hours
          </label>
          <input
            type="number"
            value={form.actualHours}
            onChange={(event) => onChange("actualHours", Number(event.target.value))}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Due Date
          </label>
          <DatePicker
            value={form.dueDate}
            onChange={(value) => onChange("dueDate", value)}
            placeholder="Choose due date"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(event) => onChange("description", event.target.value)}
          className="h-28 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-100"
          placeholder="Add task details"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-900"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
