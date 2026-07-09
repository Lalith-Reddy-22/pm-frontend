"use client";

import StatusBadge from "./StatusBadge";

export default function ProjectRow() {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">

      <td className="px-4 py-4 text-center">
  <StatusBadge status="COMPLETED" />
</td>

      <td className="px-4 py-4 text-center">
        ✏️
      </td>

      <td className="px-4 py-4">

        <p className="font-medium text-gray-800">
          0737_AMI LATAM 3D Face Ageing Module
        </p>

        <p className="text-sm text-gray-500">
          Client: Allergan
        </p>

      </td>

      <td className="px-4 py-4 text-center">
        03/07/23
      </td>

      <td className="px-4 py-4 text-center">
        04/14/23
      </td>

      <td className="px-4 py-4 text-right">
        $0.00
      </td>

      <td className="px-4 py-4 text-right">
        $42,840.00
      </td>

      <td className="px-4 py-4 text-center">
        03/10/23
      </td>

    </tr>
  );
}