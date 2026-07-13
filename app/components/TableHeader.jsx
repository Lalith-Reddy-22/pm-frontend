"use client";

import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function TableHeader({ columns }) {
  return (
    <thead className="bg-gray-50 border-y">

      <tr>

        {columns.map((column) => (

          <th
            key={column.accessor}
            className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-700"
          >
            <div className="flex items-center gap-2">

              {column.header}

              <span className="flex items-center gap-0.5 text-[11px] text-gray-500">
                <ArrowUp size={10} />
                <ArrowDown size={10} />
              </span>

            </div>
          </th>

        ))}

      </tr>

    </thead>
  );
}