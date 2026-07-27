"use client";

import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Pencil,
} from "lucide-react";

export default function EmployeeInfoCard({
  employee,
  onEdit,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="h-24 bg-gradient-to-r from-red-600 via-red-500 to-red-400" />

      {/* Avatar */}
      <div className="-mt-12 flex flex-col items-center px-6">
        <img
          src={
            employee?.profileImage ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(employee?.name || "Employee")
          }
          alt={employee?.name}
          className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
        />

        <h2 className="mt-4 text-xl font-bold text-gray-900">
          {employee?.name}
        </h2>

        <p className="text-sm text-gray-500">
          {employee?.designation || "Software Engineer"}
        </p>

        <span className="mt-3 rounded-full bg-red-50 px-4 py-1 text-xs font-semibold text-red-600">
          {employee?.department || "IT Department"}
        </span>
      </div>

      {/* Details */}
      <div className="mt-6 space-y-4 px-6 pb-6">

        <InfoRow
          icon={<Mail size={18} />}
          label="Email"
          value={employee?.email || "-"}
        />

        <InfoRow
          icon={<Phone size={18} />}
          label="Phone"
          value={employee?.phone || "-"}
        />

        <InfoRow
          icon={<MapPin size={18} />}
          label="Location"
          value={employee?.location || "-"}
        />

        <InfoRow
          icon={<Briefcase size={18} />}
          label="Employee ID"
          value={employee?.employeeCode || "-"}
        />

        <button
          onClick={onEdit}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <Pencil size={16} />
          Edit Profile
        </button>

      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-red-600">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}