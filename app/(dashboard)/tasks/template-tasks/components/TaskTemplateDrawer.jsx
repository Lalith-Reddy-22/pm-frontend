"use client";

export default function TaskTemplateDrawer({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex overflow-hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-[450px] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Create Task Template</h2>
            <p className="mt-1 text-sm text-gray-500">Save reusable templates for your task workflows.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 transition hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <div className="h-full overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
