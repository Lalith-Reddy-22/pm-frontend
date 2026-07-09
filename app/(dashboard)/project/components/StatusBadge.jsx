"use client";

const STATUS_CLASSES = {
  COMPLETED: "bg-green-600 text-white",
  ACTIVE: "bg-cyan-100 text-cyan-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  INPROGRESS: "bg-blue-100 text-blue-700",
  HOLD: "bg-orange-100 text-orange-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase
      ${STATUS_CLASSES[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}