"use client";

import { CircleUserRound } from "lucide-react";

export default function ProjectPageHeader() {
  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between rounded-xl bg-gray-100 px-8 py-5">

        <h1 className="text-4xl font-bold text-gray-700">
          MedTrix Project Management
        </h1>

        <CircleUserRound
          size={42}
          className="text-gray-800"
        />

      </div>

      {/* Title Row */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-semibold text-gray-800">
            Projects List
          </h2>

          <p className="mt-2 text-gray-500">
            ⓘ Click on Project Name To View Tasks.
          </p>

        </div>

        <button
          className="rounded-lg bg-[#2F2F2F] px-6 py-3 font-semibold text-white transition hover:bg-black"
        >
          + Add Project
        </button>

      </div>

    </div>
  );
}