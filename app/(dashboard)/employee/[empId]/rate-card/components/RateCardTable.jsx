"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function RateCardTable({
  data,
  setData,
  onSave,
}) {
  const handleHoursChange = (id, value) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              hours: value,
            }
          : item
      )
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

      {/* Table */}

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">

            <tr>

              <th className="w-24 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                ID
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Buying Center
              </th>

              <th className="w-60 px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                Employee Hours
              </th>

            </tr>

          </thead>

          <tbody>

            {data.map((item) => (

              <tr
                key={item.id}
                className="border-t border-gray-100 hover:bg-gray-50"
              >

                <td className="px-6 py-4 text-sm">
                  {item.id}
                </td>

                <td className="px-6 py-4 font-medium text-gray-800">
                  {item.code}
                </td>

                <td className="px-6 py-4">

                  <Input
                    type="number"
                    value={item.hours}
                    onChange={(e) =>
                      handleHoursChange(item.id, e.target.value)
                    }
                    className="w-28"
                  />

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-center border-t border-gray-200 px-6 py-4">

        <Button
          onClick={onSave}
          className="bg-[#E12729] px-8 py-4 text-md rounded-sm"
        >
          Save
        </Button>

      </div>

    </div>
  );
}