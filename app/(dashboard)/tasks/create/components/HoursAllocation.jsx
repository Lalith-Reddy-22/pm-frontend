"use client";

import { Info } from "lucide-react";

const dates = [
  "07/20/2026",
  "07/21/2026",
  "07/22/2026",
  "07/23/2026",
  "07/24/2026",
];

const resources = [
  {
    id: 1,
    name: "Sanjay Devarjankar",
  },
  {
    id: 2,
    name: "Souvik Das",
  },
];

export default function HoursAllocation() {
  return (
    <div className="mt-8 rounded-xl border border-gray-200 bg-white shadow-sm ">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Update The Hours Below:
        </h2>
      </div>

      <div className="overflow-x-auto">

        <table className="min-w-[1400px] w-full border-collapse">

          {/* Header */}

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="sticky left-0 bg-gray-50 px-4 py-3 text-left text-sm font-semibold uppercase text-gray-700">
                Owner
              </th>

              {dates.map((date) => (
                <th
                  key={date}
                  className="min-w-[330px] px-4 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700"
                >
                  {date}
                </th>
              ))}

            </tr>

          </thead>

          {/* Body */}

          <tbody>

            {resources.map((resource) => (

              <tr key={resource.id} className="border-b">

                {/* Owner */}

                <td className="w-[280px] min-w-[280px] sticky left-0 bg-white border-r p-4">

  <div className="flex items-start justify-between gap-3">

    <div>
      <p className="font-semibold text-gray-900">
        {resource.name}
      </p>

      <button
        type="button"
        className="mt-1 text-xs font-medium text-[#E12729] hover:underline"
      >
        Clone hrs to all dates
      </button>
    </div>

  </div>

</td>

                {/* Dates */}

                {dates.map((date) => (

<td
  key={date}
  className="min-w-[330px] px-3 py-4 align-top"
>
                    <div className="flex flex-col gap-4">

  {/* Hours */}
  <div className="flex items-center justify-center gap-2">
    <input
      type="number"
      defaultValue="0"
      className="h-10 w-20 rounded-md border border-gray-300 px-3 outline-none focus:border-red-500"
    />

    <Info
      size={18}
      className="cursor-pointer text-gray-500"
    />
  </div>

  {/* Start & End on same row */}
  <div className="flex items-center justify-between gap-4">

    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">
        Start
      </span>

      <input
        type="time"
        className="h-10 w-28 rounded-md border border-gray-300 px-2"
      />
    </div>

    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 whitespace-nowrap">
        End
      </span>

      <input
        type="time"
        className="h-10 w-28 rounded-md border border-gray-300 px-2"
      />
    </div>

  </div>

</div>

                  </td>

                ))}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}