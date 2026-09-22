"use client";

const severityStyles = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-orange-100 text-orange-700",
  Low: "bg-green-100 text-green-700",
};

export default function SeverityBadge({ severity }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        severityStyles[severity] || "bg-gray-100 text-gray-700"
      }`}
    >
      {severity}
    </span>
  );
}