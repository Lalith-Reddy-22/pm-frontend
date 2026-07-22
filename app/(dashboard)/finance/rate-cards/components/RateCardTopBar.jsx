"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Monitor,
  Palette,
  FileText,
  Users,
} from "lucide-react";

const departments = [
  {
    id: "Tech",
    label: "Tech",
    icon: Monitor,
  },
  {
    id: "Creative",
    label: "Creative",
    icon: Palette,
  },
  {
    id: "Content",
    label: "Content",
    icon: FileText,
  },
  {
    id: "PM",
    label: "PM",
    icon: Users,
  },
];

export default function RateCardTopBar({
  department,
  setDepartment,
  search,
  setSearch,
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Tabs */}

      <div className="flex border-b border-gray-200 px-6">

        <Link
          href="/finance/rate-cards"
          className={`px-5 py-4 text-sm font-medium border-b-2 transition ${
            pathname === "/finance/rate-cards"
              ? "border-[#E12729] text-[#E12729]"
              : "border-transparent text-gray-600 hover:text-[#E12729]"
          }`}
        >
          Rate Card List
        </Link>

        <Link
          href="/finance/buying-center"
          className={`px-5 py-4 text-sm font-medium border-b-2 transition ${
            pathname === "/finance/buying-center"
              ? "border-[#E12729] text-[#E12729]"
              : "border-transparent text-gray-600 hover:text-[#E12729]"
          }`}
        >
          Buying Center List
        </Link>

      </div>

      {/* Toolbar */}

      <div className="flex flex-wrap items-center justify-between gap-5 border-b border-gray-200 px-4 py-2">

        <div className="flex flex-wrap gap-3">

          {departments.map((item) => {
            const Icon = item.icon;
            const active = department === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setDepartment(item.id)}
                className={`flex h-11 min-w-[120px] items-center justify-center gap-2 rounded-md border transition-all

                  ${
                    active
                      ? "border-[#E12729] bg-red-50 text-[#E12729]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#E12729] hover:text-[#E12729]"
                  }

                `}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}

        </div>

        <div className="relative w-full sm:w-80">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee..."
            className="h-11 w-full rounded-xl border border-gray-200 pl-10 pr-4 text-sm outline-none transition focus:border-[#E12729]"
          />
        </div>
      </div>
    </>
  );
}