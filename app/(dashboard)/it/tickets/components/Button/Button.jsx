"use client";

import clsx from "clsx";

const variants = {
  primary:
    "bg-[#E12729] text-white hover:bg-red-700",

  secondary:
    "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200",

  danger:
    "bg-red-600 text-white hover:bg-red-700",

  success:
    "bg-green-600 text-white hover:bg-green-700",

  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}