"use client";

import { X } from "lucide-react";

export default function CloneRateCardModal({
  open,
  onClose,
  cloningName,
  cloneName,
  setCloneName,
  onClone,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white p-10 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-lg p-2 cursor-pointer"
        >
          <X size={22} className="text-gray-500" />
        </button>

        <div className="space-y-8">

          <div>
            <label className="text-lg font-semibold text-gray-700">
              Your Cloning :
            </label>

            <span className="ml-2 text-lg text-gray-600">
              {cloningName}
            </span>
          </div>

          <input
            value={cloneName}
            onChange={(e) => setCloneName(e.target.value)}
            className="w-full rounded-sm border border-gray-300 px-4 py-2 outline-none focus:border-[#E12729]"
          />

          <button
            onClick={onClone}
            className="rounded-sm bg-[#E12729] px-5 py-2 font-semibold text-white shadow-md transition hover:bg-[#E12729] cursor-pointer"
          >
            Clone Rate Card
          </button>

        </div>
      </div>
    </div>
  );
}