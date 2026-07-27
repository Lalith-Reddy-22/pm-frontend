"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RateCardTabs() {
  const pathname = usePathname();

  return (
    <div className="flex border-b border-gray-200 bg-white px-6">
      <Link
        href="/finance/rate-cards"
        className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
          pathname === "/finance/rate-cards"
            ? "border-[#E12729] text-[#E12729]"
            : "border-transparent text-gray-600 hover:text-[#E12729]"
        }`}
      >
        Rate Card List
      </Link>

      <Link
        href="/finance/rate-cards/buying-center"
        className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors ${
          pathname.startsWith("/finance/rate-cards/buying-center")
            ? "border-[#E12729] text-[#E12729]"
            : "border-transparent text-gray-600 hover:text-[#E12729]"
        }`}
      >
        Buying Center List
      </Link>
    </div>
  );
}