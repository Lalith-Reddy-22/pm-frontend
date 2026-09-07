"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

export default function BuyingCenterTable({ buyingCenters, onClone }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex w-full items-center justify-between">
  <span>Buying Center Name</span>

  <div className="flex flex-col text-gray-400">
    <ChevronUp size={12} />
    <ChevronDown size={12} className="-mt-1" />
  </div>
</button>
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex w-full items-center justify-between">
  <span>Created Date</span>

  <div className="flex flex-col text-gray-400">
    <ChevronUp size={12} />
    <ChevronDown size={12} className="-mt-1" />
  </div>
</button>
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex w-full items-center justify-between">
  <span>Status</span>

  <div className="flex flex-col text-gray-400">
    <ChevronUp size={12} />
    <ChevronDown size={12} className="-mt-1" />
  </div>
</button>
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex w-full items-center justify-between">
  <span>Created By</span>

  <div className="flex flex-col text-gray-400">
    <ChevronUp size={12} />
    <ChevronDown size={12} className="-mt-1" />
  </div>
</button>
            </th>

            {/* <th className="w-16 px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Actions
            </th> */}
          </tr>
        </thead>

        <tbody>
          {buyingCenters.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-sm text-gray-500"
              >
                No Buying Centers Found
              </td>
            </tr>
          ) : (
            buyingCenters.map((center) => {
              const isActive = center.isActive === 1 || center.isActive === true;
              return (
                <tr
                  key={center.bId}
                  className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                >
                  {/* Buying Center */}
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">
                      {center.bName}
                    </div>

                    <button
                      onClick={() => onClone(center)}
                      className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Clone Rate Card
                    </button>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {center.created_Date}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Created By */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {center.created_By}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}