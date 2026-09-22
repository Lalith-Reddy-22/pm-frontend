"use client";

import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  FolderKanban,
  TrendingUp,
} from "lucide-react";

const cards = [
  {
    title: "Total Tasks",
    value: 128,
    change: "+12%",
    subtitle: "vs last month",
    icon: ClipboardList,
    color: "blue",
  },
  {
    title: "In Progress",
    value: 24,
    change: "+4%",
    subtitle: "Active tasks",
    icon: Clock3,
    color: "amber",
  },
  {
    title: "Completed",
    value: 98,
    change: "+18%",
    subtitle: "Completion rate",
    icon: CheckCircle2,
    color: "green",
  },
  {
    title: "Projects",
    value: 12,
    change: "+2",
    subtitle: "Active projects",
    icon: FolderKanban,
    color: "red",
  },
];

const colors = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
  },
  amber: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-700",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700",
  },
};

export default function EmployeeStatsCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const c = colors[card.color];

        return (
          <div
            key={card.title}
            className="group rounded-md border border-gray-200 bg-white p-3 w-full shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl "
          >
            {/* Top */}
            <div className="flex items-start justify-between">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${c.bg}`}
              >
                <Icon className={`h-7 w-7 ${c.icon}`} />
              </div>

              <div
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${c.badge}`}
              >
                <TrendingUp size={12} />
                {card.change}
              </div>
            </div>

            {/* Number */}
            <h2 className="mt-4 text-2xl font-bold text-gray-900 text-center">
              {card.value}
            </h2>

            {/* Title */}
            <p className="mt-2 text-sm font-semibold text-gray-800 text-center">
              {card.title}
            </p>

            {/* Subtitle */}
            <p className="mt-1 text-xs text-gray-500 text-center">
              {card.subtitle}
            </p>
          </div>
        );
      })}
    </div>
  );
}