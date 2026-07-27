"use client";

import {
  FolderOpen,
  ArrowRight,
} from "lucide-react";

export default function EmployeeProjects({
  pageRows = [],
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            Your Projects
          </h2>

        </div>

        <button className="text-sm font-semibold text-[#E12729]">
          View All
        </button>

      </div>

      {/* Table Header */}

      <div className="grid grid-cols-12 border-b border-gray-100 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">

        <div className="col-span-5">
          Project
        </div>

        <div className="col-span-3">
          Progress
        </div>

        <div className="col-span-2">
          Tasks
        </div>

        <div className="col-span-2">
          Performance
        </div>

      </div>

      {/* Rows */}

      {pageRows.map(({ proj, visuals }, index) => {

        const progress =
          visuals.tasksTotal === 0
            ? 0
            : Math.round(
                (visuals.tasksCompleted /
                  visuals.tasksTotal) *
                  100
              );

        return (

          <div
            key={index}
            className="grid grid-cols-12 items-center border-b border-gray-100 px-6 py-5 last:border-0 hover:bg-gray-50"
          >

            {/* Project */}

            <div className="col-span-5 flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">

                <FolderOpen
                  size={22}
                  className="text-[#E12729]"
                />

              </div>

              <div>

                <h3 className="font-semibold text-gray-900">
                  {proj.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {visuals.client}
                </p>

              </div>

            </div>

            {/* Progress */}

            <div className="col-span-3">

              <div className="h-2 rounded-full bg-gray-200">

                <div
                  className="h-2 rounded-full bg-[#E12729]"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

              <p className="mt-2 text-sm text-gray-500">
                {progress}%
              </p>

            </div>

            {/* Tasks */}

            <div className="col-span-2 font-semibold text-gray-900">

              {visuals.tasksCompleted} / {visuals.tasksTotal}

            </div>

            {/* Performance */}

            <div className="col-span-2 flex items-center justify-between">

              <span className="font-semibold text-[#E12729]">

                {progress}%

              </span>

              <ArrowRight
                size={16}
                className="text-gray-400"
              />

            </div>

          </div>

        );

      })}

    </div>
  );
}