"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { format } from "date-fns";
import { CalendarDays, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * DateRangePicker
 *
 * Props:
 *   dateRange  – { from: Date|undefined, to: Date|undefined }
 *   onChange   – (range) => void  – called every time user picks
 *   onClear    – () => void       – called when user clears
 *   className  – optional extra classes on the trigger button
 */
export default function DateRangePicker({
  dateRange,
  onChange,
  onClear,
  className,
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  /* close on outside click */
  useEffect(() => {
    function handleOutside(e) {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function updatePos() {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
  }

  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  const hasRange = dateRange?.from || dateRange?.to;

  const label = hasRange
    ? [
      dateRange.from ? format(dateRange.from, "MMM d, yyyy") : "Start",
      dateRange.to ? format(dateRange.to, "MMM d, yyyy") : "End",
    ].join(" – ")
    : "Date Range";

  function handleSelect(range) {
    onChange(range ?? { from: undefined, to: undefined });
  }

  function handleClear(e) {
    e.stopPropagation();
    onClear?.();
    onChange({ from: undefined, to: undefined });
  }

  return (
    <div ref={containerRef} className="relative">
      {/* ── Trigger ── */}
      <Button
        variant="outline"
        onClick={() => { updatePos(); setOpen((o) => !o); }}
        className={cn(
          "h-8 gap-1.5 text-sm border-border text-muted-foreground hover:border-[#E12729] hover:text-foreground transition-colors",
          hasRange && "border-[#E12729] text-foreground",
          className
        )}
      >
        <CalendarDays size={14} className={cn(hasRange && "text-[#E12729]")} />
        <span className="max-w-xs truncate">{label}</span>
        {hasRange && (
          <span
            onClick={handleClear}
            className="ml-0.5 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full hover:bg-muted"
            aria-label="Clear date filter"
          >
            <X size={11} />
          </span>
        )}
      </Button>

      {/* ── Dropdown calendar (portal) ── */}
      {mounted && open && createPortal(
        <div
          ref={dropdownRef}
          style={{ position: "absolute", top: pos.top, left: pos.left, zIndex: 999999 }}
          className="rounded-xl border border-border bg-card shadow-lg"
        >
          <DayPicker
            mode="range"
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            showOutsideDays
            className="p-3"
            style={{ "--rdp-accent-color": "#E12729" }}
            classNames={{
              months: "flex flex-col sm:flex-row gap-4",
              month: "flex flex-col gap-2",
              month_caption: "flex justify-center items-center h-7",
              caption_label: "text-sm font-semibold text-foreground",
              nav: "flex items-center justify-between w-full absolute top-3 left-0 px-3",
              button_previous: "h-7 w-7 flex items-center justify-center rounded-md border border-[#E12729] text-[#E12729] fill-current stroke-current hover:bg-[#fce4e4] transition-colors",
              button_next: "h-7 w-7 flex items-center justify-center rounded-md border border-[#E12729] text-[#E12729] fill-current stroke-current hover:bg-[#fce4e4] transition-colors",
              month_grid: "w-full border-collapse",
              weekdays: "flex",
              weekday: "w-9 text-[0.75rem] font-medium text-muted-foreground",
              week: "flex mt-1",
              day: "relative p-0 text-center text-sm",
              day_button: cn(
                "h-9 w-9 rounded-md font-normal text-foreground transition-all",
                "hover:bg-[#fce4e4] hover:text-[#E12729]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E12729]/40"
              ),
              selected: "bg-[#E12729] text-white rounded-md hover:bg-[#c81f21] hover:text-white",
              range_start: "bg-[#E12729] text-white rounded-l-md",
              range_end: "bg-[#E12729] text-white rounded-r-md",
              range_middle: "bg-[#fce4e4] text-[#E12729] rounded-none",
              today: "font-bold text-[#E12729]",
              outside: "text-muted-foreground opacity-40",
              disabled: "text-muted-foreground opacity-30 cursor-not-allowed",
            }}
          />
          {/* Footer */}
          {hasRange && (
            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <span className="text-xs text-muted-foreground">{label}</span>
              <button
                onClick={handleClear}
                className="text-xs font-medium text-[#E12729] hover:underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
