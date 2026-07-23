"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AddBuyingCenterModal({
  open,
  onClose,
  onSave,
}) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("Active");
  const [description, setDescription] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;

    onSave?.({
      name,
      status,
      description,
    });

    setName("");
    setStatus("Active");
    setDescription("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-semibold">
            Add Buying Center
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          <div>
            <label className="mb-2 block text-sm font-medium">
              Buying Center Name
              <span className="text-red-500"> *</span>
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter buying center name"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 outline-none focus:border-[#E12729] focus:ring-2 focus:ring-red-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status
            </label>

            <div className="flex gap-8">

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={status === "Active"}
                  onChange={() => setStatus("Active")}
                />
                Active
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={status === "Inactive"}
                  onChange={() => setStatus("Inactive")}
                />
                Inactive
              </label>

            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
              className="w-full rounded-lg border border-gray-300 p-4 outline-none focus:border-[#E12729] focus:ring-2 focus:ring-red-100"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-5">

          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 font-medium hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-lg bg-[#E12729] px-5 py-2.5 font-medium text-white hover:bg-red-700"
          >
            Save Buying Center
          </button>

        </div>

      </div>
    </div>
  );
}