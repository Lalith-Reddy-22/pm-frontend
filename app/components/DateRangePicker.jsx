"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import {
  format,
  startOfWeek,
  endOfWeek,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";

const PRESETS = [
  "Mon-Fri",
  "Today",
  "Yesterday",
  "Last 7 Days",
  "Last 30 Days",
  "This Month",
  "Last Month",
  "Custom Range",
];

export default function DateRangePicker() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [preset, setPreset] = useState("Mon-Fri");
  const [showCalendar, setShowCalendar] = useState(false);

  const [range, setRange] = useState(() => {
    const today = new Date();

    return {
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: endOfWeek(today, { weekStartsOn: 1 }),
    };
  });

  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  const [pos, setPos] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function close(e) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  // Keep popup attached to button while page scrolls
  useEffect(() => {
    function updatePopupPosition() {
      if (!open || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();

      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }

    window.addEventListener("scroll", updatePopupPosition, true);
    window.addEventListener("resize", updatePopupPosition);

    return () => {
      window.removeEventListener("scroll", updatePopupPosition, true);
      window.removeEventListener("resize", updatePopupPosition);
    };
  }, [open]);

  function applyPreset(name) {
    setPreset(name);

    if (name === "Custom Range") {
      setShowCalendar(true);
      return;
    }

    setShowCalendar(false);

    const today = new Date();

    switch (name) {
      case "Today":
        setRange({
          from: today,
          to: today,
        });
        break;

      case "Yesterday":
        const yesterday = subDays(today, 1);

        setRange({
          from: yesterday,
          to: yesterday,
        });

        break;

      case "Last 7 Days":
        setRange({
          from: subDays(today, 6),
          to: today,
        });

        break;

      case "Last 30 Days":
        setRange({
          from: subDays(today, 29),
          to: today,
        });

        break;

      case "This Month":
        setRange({
          from: startOfMonth(today),
          to: today,
        });

        break;

      case "Last Month":
        const lastMonth = subMonths(today, 1);

        setRange({
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth),
        });

        break;

      default:
        setRange({
          from: startOfWeek(today, {
            weekStartsOn: 1,
          }),
          to: endOfWeek(today, {
            weekStartsOn: 1,
          }),
        });
    }

    setOpen(false);
  }

  const label =
    range?.from && range?.to
      ? `${format(range.from, "MMM d, yyyy")} - ${format(
          range.to,
          "MMM d, yyyy"
        )}`
      : "Select Range";

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {
          if (!buttonRef.current) return;

          const rect = buttonRef.current.getBoundingClientRect();

          setPos({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
          });

          setOpen((prev) => !prev);
        }}
        className="flex items-center gap-2 rounded-lg bg-[#E12729] px-3 py-2 text-white shadow"
      >
        <Calendar size={18} />

        <span>{label}</span>

        <ChevronDown size={18} />
      </button>

            {mounted &&
        open &&
        createPortal(
          <div
            ref={popupRef}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              zIndex: 999999,
            }}
            className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl ${
              showCalendar ? "flex w-[800px]" : "w-[220px]"
            }`}
          >
            {/* Left Preset Menu */}

            <div
              className={`${
                showCalendar
                  ? "w-40 border-r bg-gray-50"
                  : "w-full"
              }`}
            >
              {PRESETS.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === "Custom Range") {
                      setPreset(item);
                      setShowCalendar(true);
                    } else {
                      applyPreset(item);
                    }
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm transition
                  ${
                    preset === item
                      ? "bg-[#E12729] text-white"
                      : "hover:bg-red-50 hover:text-[#E12729]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>


            {showCalendar && (
              <div className="flex flex-col p-4">

                <DayPicker
  mode="range"
  numberOfMonths={2}
  pagedNavigation
  defaultMonth={range?.from || new Date()}
  selected={range}
  onSelect={setRange}
  classNames={{
  months: "flex gap-6",
}}
/>


                <div className="mt-2 flex items-center justify-between pt-2">

                  <span className="text-sm text-gray-500">
                    {range?.from && range?.to
                      ? `${format(
                          range.from,
                          "dd/MM/yyyy"
                        )} - ${format(
                          range.to,
                          "dd/MM/yyyy"
                        )}`
                      : "Select Range"}
                  </span>

                  <div className="flex gap-2">

                    <button
                      onClick={() => {
                        setShowCalendar(false);
                        setOpen(false);
                      }}
                      className="rounded-lg border px-2 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        setShowCalendar(false);
                        setOpen(false);
                      }}
                      className="rounded-lg bg-[#E12729] px-2 py-1 text-white hover:bg-red-700"
                    >
                      Apply
                    </button>

                  </div>
                </div>

              </div>
            )}
          </div>,
          document.body
        )}
    </>
  );
}