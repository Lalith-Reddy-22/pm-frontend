"use client";

import EmptyState from "./EmptyState";

export default function TableBody({
  columns,
  data,
  emptyMessage,
}) {
  if (data.length === 0) {
    return (
      <EmptyState
        columns={columns.length}
        message={emptyMessage}
      />
    );
  }

  return (
    <tbody>

      {data.map((row, index) => (

        <tr
          key={index}
          className="border-b hover:bg-gray-50"
        >
          {columns.map((column) => (

            <td
              key={column.accessor}
              className="px-6 py-4 text-sm"
            >
              {column.render
                ? column.render(row)
                : row[column.accessor]}
            </td>

          ))}
        </tr>

      ))}

    </tbody>
  );
}