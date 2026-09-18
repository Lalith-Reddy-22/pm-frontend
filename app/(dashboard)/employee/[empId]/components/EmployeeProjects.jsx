"use client";

import { useState } from "react";

import {
  FolderKanban,
  Calendar,
  ArrowRight,
  X,
} from "lucide-react";

export default function EmployeeProjects({ pageRows = [] }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Active Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current assigned projects
          </p>
        </div>

        <button
  onClick={() => setShowModal(true)}
  className="text-sm font-semibold text-red-600 hover:underline"
>
  View All
</button>
      </div>

      {/* Project List */}
      <div className="divide-y divide-gray-100">

        {pageRows.map(({ proj, visuals }) => (
          <div
            key={proj.id}
            className="p-5 transition hover:bg-gray-50"
          >
            <div className="flex items-start justify-between">

              {/* Left */}
              <div className="flex gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
                  <FolderKanban
                    className="text-red-600"
                    size={22}
                  />
                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">
                    {proj.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {visuals.client}
                  </p>

                  <div className="mt-3 flex items-center gap-2">

                    <Calendar size={14} />

                    <span className="text-xs text-gray-500">
                      Due :
                      {" "}
                      {visuals.dueDate || "Not Assigned"}
                    </span>

                  </div>

                </div>

              </div>

              {/* Right */}

              <div className="text-right">

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {visuals.status}
                </span>

                <div className="mt-4 text-2xl font-bold text-gray-900">
                  {visuals.progress}%
                </div>

              </div>

            </div>

            {/* Progress */}

            <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">

              <div
                className="h-full rounded-full bg-red-600 transition-all"
                style={{
                  width: `${visuals.progress}%`,
                }}
              />

            </div>

            <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600 hover:underline">
              View Details

              <ArrowRight size={15} />

            </button>

          </div>
        ))}

      </div>

      {showModal && (
  <>
    {/* Overlay */}
    <div
      className="fixed inset-0 z-40 bg-black/40"
      onClick={() => setShowModal(false)}
    />

    {/* Modal */}
    <div className="fixed left-1/2 top-1/2 z-50 w-[900px] max-w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b p-6">

        <div>
          <h2 className="text-xl font-bold">
            All Assigned Projects
          </h2>

          <p className="text-sm text-gray-500">
            Total Projects : {pageRows.length}
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="rounded-lg p-2 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

      </div>

      {/* Projects */}
      <div className="max-h-[600px] overflow-y-auto p-6">

        <div className="grid gap-4">

          {pageRows.map(({ proj, visuals }) => (
            <div
              key={proj.id}
              className="rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-center justify-between">

                <div>
                  <h3 className="font-semibold text-lg">
                    {proj.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {visuals.client}
                  </p>

                  <p className="mt-2 text-sm">
                    Due :
                    {" "}
                    {visuals.dueDate || "Not Assigned"}
                  </p>
                </div>

                <div className="text-right">

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {visuals.status}
                  </span>

                  <div className="mt-3 text-xl font-bold">
                    {visuals.progress}%
                  </div>

                </div>

              </div>

              <div className="mt-4 h-2 rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-red-600"
                  style={{
                    width: `${visuals.progress}%`,
                  }}
                />
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  </>
)}

    </div>
  );
}