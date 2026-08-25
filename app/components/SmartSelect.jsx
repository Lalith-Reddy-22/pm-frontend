"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useTheme } from "@/app/context/ThemeContext";

/**
 * SmartSelect — a custom select that opens up or down based on available space.
 *
 * Props:
 *   value        – current value (string)
 *   onChange     – (value: string) => void
 *   options      – [{ value: string, label: string }]
 *   placeholder  – string shown when nothing is selected
 *   className    – extra classes on the trigger button
 */
export default function SmartSelect({ value, onChange, options = [], placeholder = "— Select —", className = "" }) {
  const { t } = useTheme();
  const [open, setOpen]       = useState(false);
  const [openUp, setOpenUp]   = useState(false);
  const triggerRef            = useRef(null);
  const listRef               = useRef(null);

  const DROPDOWN_MAX_H = 200; // px — max height of the list

  const calcDirection = useCallback(() => {
    if (!triggerRef.current) return;
    const rect       = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenUp(spaceBelow < DROPDOWN_MAX_H && spaceAbove > spaceBelow);
  }, []);

  const toggle = () => {
    if (!open) calcDirection();
    setOpen((o) => !o);
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        listRef.current    && !listRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Recalculate on scroll/resize while open
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", calcDirection, true);
    window.addEventListener("resize", calcDirection);
    return () => {
      window.removeEventListener("scroll", calcDirection, true);
      window.removeEventListener("resize", calcDirection);
    };
  }, [open, calcDirection]);

  const selected = options.find((o) => String(o.value) === String(value));

  return (
    <div className={`relative w-full ${className}`}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        className={`flex w-full items-center justify-between gap-1 bg-transparent outline-none text-xs ${t.clientInputText}`}
      >
        <span className={selected ? t.clientInputText : t.textMuted}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-3 h-3 shrink-0 ${t.textMuted} transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          ref={listRef}
          style={{ maxHeight: DROPDOWN_MAX_H }}
          className={`
            absolute z-50 w-full overflow-y-auto rounded-lg border border-red-500 py-1 shadow-lg
            ${t.cardBg}
            ${openUp ? "bottom-full mb-1" : "top-full mt-1"}
          `}
        >
          {/* Blank / placeholder option */}
          <li>
            <button
              type="button"
              onClick={() => { onChange(""); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-xs ${t.textMuted} hover:bg-red-50 dark:hover:bg-red-500/10`}
            >
              {placeholder}
            </button>
          </li>

          {options.map((opt) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs transition-colors
                  ${String(opt.value) === String(value)
                    ? "text-red-600 dark:text-red-400 font-medium"
                    : `${t.clientInputText} hover:bg-red-50 dark:hover:bg-red-500/10`
                  }`}
              >
                {opt.label}
                {String(opt.value) === String(value) && (
                  <Check className="w-3 h-3 text-red-500 shrink-0" />
                )}
              </button>
            </li>
          ))}

          {options.length === 0 && (
            <li className={`px-3 py-2 text-xs ${t.textMuted}`}>No options</li>
          )}
        </ul>
      )}
    </div>
  );
}
