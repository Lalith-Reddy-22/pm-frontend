"use client";

import { ArrowUpDown, MoreVertical } from "lucide-react";

export default function BuyingCenterTable({ buyingCenters, onClone }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-50">
          <tr className="border-b border-gray-200 text-left">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex items-center gap-2">
                Buying Center Name
                <ArrowUpDown size={14} className="text-gray-400" />
              </button>
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex items-center gap-2">
                Created Date
                <ArrowUpDown size={14} className="text-gray-400" />
              </button>
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex items-center gap-2">
                Status
                <ArrowUpDown size={14} className="text-gray-400" />
              </button>
            </th>

            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <button className="flex items-center gap-2">
                Created By
                <ArrowUpDown size={14} className="text-gray-400" />
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
            buyingCenters.map((center) => (
              <tr
                key={center.id}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50"
              >
                {/* Buying Center */}
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">
                    {center.name}
                  </div>

                  <button
                   onClick={() => onClone(center)}
                   className="mt-1 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline cursor-pointer">
                    Clone Rate Card
                  </button>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {center.createdDate}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      center.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {center.status}
                  </span>
                </td>

                {/* Created By */}
                <td className="px-6 py-4 text-sm text-gray-700">
                  {center.createdBy}
                </td>

                {/* Actions */}
                {/* <td className="px-6 py-4 text-center">
                  <button className="rounded-lg p-2 transition hover:bg-gray-100">
                    <MoreVertical
                      size={18}
                      className="text-gray-500"
                    />
                  </button>
                </td> */}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}