"use client";

export default function EmptyState({
  columns,
  message,
}) {
  return (
    <tbody>

      <tr>

        <td
          colSpan={columns}
          className="py-16 text-center text-gray-500"
        >
          {message}
        </td>

      </tr>

    </tbody>
  );
}