"use client";

import {
  ClipboardList,
  Clock3,
  CircleCheckBig,
  FolderKanban,
} from "lucide-react";

const stats = [
  {
    title: "Total Tasks",
    value: 128,
    subtitle: "+12% this month",
    icon: ClipboardList,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "In Progress",
    value: 24,
    subtitle: "18.7% Active",
    icon: Clock3,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Completed",
    value: 98,
    subtitle: "76.5% Completed",
    icon: CircleCheckBig,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Projects",
    value: 12,
    subtitle: "5 Active",
    icon: FolderKanban,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
];

export default function EmployeeStatsCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.iconBg}`}
            >
              <Icon className={`h-6 w-6 ${item.iconColor}`} />
            </div>

            <h2 className="mt-5 text-3xl font-bold text-gray-900">
              {item.value}
            </h2>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {item.title}
            </p>

            <p className="mt-3 text-xs text-gray-500">
              {item.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}