"use client";

import { cn } from "@/lib/utils";

/**
 * STATUS_CONFIG
 *
 * Each entry has:
 *   label     – human-readable text
 *   pill      – pill background + text color (supporting dark mode)
 *   dot       – class for the colored bullet dot (supporting dark mode)
 */
const STATUS_CONFIG = {
  // Active — light blue bg, navy text/dot
  ACTIVE: {
    label: "Active",
    pill: "bg-[#E3ECFC] text-[#1A3A6B] dark:bg-[#1E293B] dark:text-[#38BDF8]",
    dot: "bg-[#1A3A6B] dark:bg-[#38BDF8]",
  },

  // In Progress — light gray bg, dark gray text/dot
  INPROGRESS: {
    label: "In Progress",
    pill: "bg-[#F1F2F4] text-[#3B3F4A] dark:bg-[#27272A] dark:text-[#D4D4D8]",
    dot: "bg-[#3B3F4A] dark:bg-[#D4D4D8]",
  },

  // On Hold — light pink/red bg, red text/dot
  HOLD: {
    label: "On Hold",
    pill: "bg-[#FCE4E4] text-[#C0282A] dark:bg-[#3F1B1B] dark:text-[#F87171]",
    dot: "bg-[#C0282A] dark:bg-[#F87171]",
  },

  // Completed — light green bg, green text/dot
  COMPLETED: {
    label: "Completed",
    pill: "bg-[#E3F5EB] text-[#1A6B3A] dark:bg-[#14532D]/30 dark:text-[#4ADE80]",
    dot: "bg-[#1A6B3A] dark:bg-[#4ADE80]",
  },

  // Pending — light amber bg, amber text/dot
  PENDING: {
    label: "Pending",
    pill: "bg-[#FEF3C7] text-[#92400E] dark:bg-[#78350F]/30 dark:text-[#FBBF24]",
    dot: "bg-[#B45309] dark:bg-[#FBBF24]",
  },

  // Cancelled — light red bg, red text/dot
  CANCELLED: {
    label: "Cancelled",
    pill: "bg-[#FCE4E4] text-[#9B1C1C] dark:bg-[#450A0A] dark:text-[#F87171]",
    dot: "bg-[#9B1C1C] dark:bg-[#F87171]",
  },

  // Completed Approval — same as Active (light blue, navy)
  COMPLETEDAPPROVAL: {
    label: "Completed Approval",
    pill: "bg-[#E3ECFC] text-[#1A3A6B] dark:bg-[#1E293B] dark:text-[#38BDF8]",
    dot: "bg-[#1A3A6B] dark:bg-[#38BDF8]",
  },
};

export default function StatusBadge({ status }) {
  const key = (status ?? "").toUpperCase().replace(/[\s_-]/g, "");
  const config = STATUS_CONFIG[key] ?? {
    label: status ?? "Unknown",
    pill: "bg-[#F1F2F4] text-[#3B3F4A] dark:bg-[#27272A] dark:text-[#D4D4D8]",
    dot: "bg-[#3B3F4A] dark:bg-[#D4D4D8]",
  };

  return (
    <span
      className={cn(
        // pill shape — small radius, no border
        "inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-semibold whitespace-nowrap w-[130px] rounded-md",
        config.pill
      )}
    >
      {/* colored dot bullet */}
      <span
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}