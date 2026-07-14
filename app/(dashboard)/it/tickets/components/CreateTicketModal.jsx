"use client";

import { X, ChevronDown } from "lucide-react";

export default function CreateTicketModal({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-[480px] flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            Create Issue
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* Type */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Type
            </label>

            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 outline-none focus:border-red-500">
                <option>Select Type</option>
                <option>Hardware</option>
                <option>Software</option>
                <option>Network</option>
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Severity */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Severity
            </label>

            <div className="relative">
              <select className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 outline-none focus:border-red-500">
                <option>Select Severity</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Issue Description
            </label>

            <textarea
              rows={6}
              placeholder="Describe your issue..."
              className="w-full resize-none rounded-lg border border-gray-300 p-4 outline-none focus:border-red-500"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-white px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            className="rounded-lg bg-red-600 px-6 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Submit
          </button>

        </div>

      </div>
    </>
  );
}