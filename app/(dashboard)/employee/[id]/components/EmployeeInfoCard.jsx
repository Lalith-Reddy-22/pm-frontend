import Link from "next/link";
import {
  ArrowLeft,
  UserRound,
  ClipboardList,
  FolderKanban,
} from "lucide-react";
import { STATUS_STYLES } from "../../data";

// Stat Box Component
function StatBox({ icon: Icon, value, label, isDark }) {
  return (
    <div
      className={`flex flex-1 items-center gap-3 rounded-xl border px-4 py-3
        ${
          isDark
            ? "border-white/10 bg-white/[0.03]"
            : "border-gray-200 bg-gray-50"
        }`}
    >
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg
          ${
            isDark
              ? "bg-rose-500/10 text-rose-400"
              : "bg-rose-100 text-rose-500"
          }`}
      >
        <Icon size={16} />
      </div>

      <div className="min-w-0">
        <p
          className={`text-lg font-bold leading-none ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {value}
        </p>

        <p
          className={`mt-1 text-xs ${
            isDark ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// Detail Line Component
function DetailLine({ label, children, border, t }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 py-2.5 ${
        border ? `border-b ${border}` : ""
      }`}
    >
      <span className={`text-sm ${t.textMuted}`}>{label}</span>

      <span className={`text-sm font-medium text-right ${t.textPrimary}`}>
        {children}
      </span>
    </div>
  );
}

export default function EmployeeInfoCard({
  employee,
  totalTasks,
  totalProjects,
  t,
  isDark,
  border,
  onEdit,
}) {
  return (
    <div
      className={`rounded-2xl border ${border} ${t.cardBg} ${t.cardShadow} p-6`}
    >
      <div className="flex flex-col items-center text-center">
        <div
          className={`flex h-20 w-20 items-center justify-center overflow-hidden rounded-full
            ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-gray-200 bg-gray-50"
            }`}
        >
          {employee.avatarUrl ? (
            <img
              src={employee.avatarUrl}
              alt={employee.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserRound
              size={110}
              className={isDark ? "text-gray-500" : "text-gray-400"}
              strokeWidth={1.5}
            />
          )}
        </div>

        <h1 className={`mt-3 text-lg font-semibold ${t.textPrimary}`}>
          {employee.name}
        </h1>

        <span
          className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide
            ${
              isDark
                ? "bg-white/10 text-gray-200"
                : "bg-gray-900 text-white"
            }`}
        >
          {employee.designation}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-5 flex gap-3">
        <StatBox
          icon={ClipboardList}
          value={totalTasks}
          label="Total Tasks"
          isDark={isDark}
        />

        <StatBox
          icon={FolderKanban}
          value={totalProjects}
          label="Total Projects"
          isDark={isDark}
        />
      </div>

      {/* Details */}
      <div className="mt-5">
        <h2
          className={`mb-1 text-xs font-semibold uppercase tracking-wide ${t.textMuted}`}
        >
          Details
        </h2>

        <DetailLine label="Name" t={t}>
          {employee.name}
        </DetailLine>

        <DetailLine label="Email" t={t}>
          <span className="break-all">{employee.email}</span>
        </DetailLine>

        <DetailLine label="Status" t={t}>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              STATUS_STYLES[employee.status]
            }`}
          >
            {employee.status}
          </span>
        </DetailLine>

        <DetailLine label="Designation" t={t}>
          {employee.designation}
        </DetailLine>

        <DetailLine label="Team" t={t}>
          {employee.team}
        </DetailLine>

        <DetailLine label="Type" t={t}>
          {employee.type}
        </DetailLine>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 rounded-xl bg-[#E12729] py-3 font-semibold text-white shadow-md hover:bg-red-700"
        >
          Modify
        </button>

        <button
          type="button"
          className="flex-1 rounded-lg bg-gradient-to-b from-red-600 to-red-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:from-red-700 hover:to-red-900"
        >
          Rate Card
        </button>
      </div>

      <Link
        href="/employee"
        className={`mt-4 inline-flex items-center gap-1.5 text-sm font-medium ${t.textSecondary}`}
      >
        <ArrowLeft size={14} />
        Back To List
      </Link>
    </div>
  );
}