"use client";

import { useState } from "react";
import { useTheme } from "../../../../context/ThemeContext";

export default function TicketTabs({
  activeTab,
  setActiveTab,
}) {
  const { theme } = useTheme();

  return (
    <div className="flex justify-center px-6 pt-6 pb-2">

      <div className="flex overflow-hidden rounded-lg border border-red-300">

        <button
          onClick={() => setActiveTab("raise")}
          className={`w-50 py-2 text-md font-semibold border-[#E12729] transition-all duration-200 cursor-pointer
            ${
              activeTab === "raise"
                ? "bg-[#E12729] text-white"
                : "bg-[#ffffff] text-gray-700 hover:bg-red-200 hover:text-[#E12729]"
            }`}
        >
          Raise Issue
        </button>

        <button
          onClick={() => setActiveTab("tracker")}
          className={`w-50 py-2 text-md font-semibold transition-all duration-200 cursor-pointer
            ${
              activeTab === "tracker"
                ? "bg-[#E12729] text-white"
                : "bg-[#ffffff] text-gray-700 hover:bg-red-200 hover:text-[#E12729]"
            }`}
        >
          Issue Tracker
        </button>

      </div>

    </div>
  );
}