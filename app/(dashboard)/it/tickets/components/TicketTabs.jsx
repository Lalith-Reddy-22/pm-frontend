"use client";

import { useState } from "react";

export default function TicketTabs({
  activeTab,
  setActiveTab,
}) {
  return (
    <div className="flex justify-center px-6 pt-6 pb-2">

      <div className="flex overflow-hidden rounded-lg border border-gray-300">

        <button
          onClick={() => setActiveTab("raise")}
          className={`w-80 py-3 text-sm font-semibold transition-all duration-200
            ${
              activeTab === "raise"
                ? "bg-[#333333] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Raise Issue
        </button>

        <button
          onClick={() => setActiveTab("tracker")}
          className={`w-80 py-3 text-sm font-semibold transition-all duration-200
            ${
              activeTab === "tracker"
                ? "bg-[#333333] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Issue Tracker
        </button>

      </div>

    </div>
  );
}