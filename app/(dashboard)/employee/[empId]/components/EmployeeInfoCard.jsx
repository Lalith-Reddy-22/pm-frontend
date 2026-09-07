"use client";

import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Users,
  UserCog,
  BadgeCheck,
  ArrowLeft,
  Pencil,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmployeeInfoCard({
  employee,
  onEdit,
}) {
  const router = useRouter();
  return (
    <div className="sticky top-6 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-lg">
      <div className="relative h-44 bg-gradient-to-br from-red-600 via-red-500 to-pink-500">

        <div className="absolute inset-x-0 bottom-0 translate-y-1/2 flex justify-center">

          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white text-4xl font-bold text-red-600 shadow-xl">
            {employee?.name?.charAt(0)}
          </div>

        </div>

      </div>

      <div className="px-8 pt-16 pb-8 text-center">

        <h2 className="text-2xl font-bold text-gray-900">
          {employee?.name}
        </h2>

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
          {employee?.designation}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">

          <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
            {employee?.team}
          </span>

          <span
            className={`rounded-full px-4 py-2 text-xs font-semibold ${
              employee?.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {employee?.status}
          </span>

        </div>

      </div>


      <div className="border-t border-gray-100 px-8 py-7">

        <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.25em] text-gray-400">
          Employee Information
        </h3>

        <div className="space-y-5">

          <InfoRow
            icon={<Mail size={18} />}
            label="Email"
            value={employee?.email}
          />

          <InfoRow
            icon={<Phone size={18} />}
            label="Phone"
            value={employee?.phone}
          />

          <InfoRow
            icon={<Briefcase size={18} />}
            label="Employee Code"
            value={employee?.employeeCode}
          />

          <InfoRow
            icon={<Users size={18} />}
            label="Team"
            value={employee?.team}
          />

          <InfoRow
            icon={<UserCog size={18} />}
            label="Reporting Manager"
            value={employee?.reportingManager}
          />

          <InfoRow
            icon={<MapPin size={18} />}
            label="Location"
            value={employee?.location}
          />

          <div className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <BadgeCheck size={18} />
              </div>

              <div>

                <p className="text-xs text-gray-500">
                  Employee Type
                </p>

                <p className="font-medium text-gray-900">
                  {employee?.type}
                </p>

              </div>

            </div>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                employee?.status === "Active"
                  ? "bg-green-500 text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {employee?.status}
            </span>

          </div>

        </div>

      </div>

      {/* ================= Actions ================= */}

      <div className="grid grid-cols-2 gap-3 px-8 pb-6">

        <button
          onClick={onEdit}
          className="flex items-center justify-center gap-2 rounded-sm border border-red-600 py-3 font-semibold text-[#E12729] transition hover:bg-red-50"
        >
          <Pencil size={16} />
          Modify
        </button>

        <button
  onClick={() => router.push(`/employee/${employee.id}/rate-card`)}
  className="flex items-center justify-center gap-2 rounded-sm bg-[#E12729] font-semibold text-white transition hover:bg-[#E12729]"
>
  <CreditCard size={16} />
  Rate Card
</button>

      </div>

      {/* ================= Footer ================= */}

      <div className="border-t border-gray-100 px-8 py-5">
  <button
    onClick={() => router.push("/employee")}
    className="flex items-center gap-3 text-sm font-medium text-gray-600 transition hover:text-red-600"
  >
    <ArrowLeft size={18} />
    Back To Employees
  </button>
</div>

    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 p-4 transition-all duration-200 hover:border-red-200 hover:bg-red-50/40">

      {/* Icon */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
        {icon}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">

        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-gray-900">
          {value || "-"}
        </p>

      </div>

    </div>
  );
}