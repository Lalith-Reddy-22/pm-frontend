"use client";

import { createContext, useContext, useState } from "react";

/*
  Light palette:
  - Sidebar:  #ffffff  white
  - Navbar:   #ffffff  white, border-bottom separates from content
  - Canvas:   #f7f8fa  very light grey page background
  - Content:  #f7f8fa  same as canvas (content sits on the page)

  Dark palette:
  - Sidebar:  #111827  (gray-900)
  - Navbar:   #111827  same, border-bottom separates
  - Canvas:   #0d1117  near black
  - Content:  #0d1117  same as canvas
*/

const THEMES = {
  light: {
    // Surfaces
    pageBg:       "bg-[#f7f8fa]",
    sidebarBg:    "bg-white",
    navbarBg:     "bg-white",
    mainBg:       "bg-[#f7f8fa]",

    // Borders & shadows
    sidebarBorder: "border-r border-gray-100",
    navbarBorder:  "border-b border-gray-100",
    cardBg:        "bg-white",
    cardShadow:    "shadow-sm",

    // Text
    textPrimary:   "text-gray-900",
    textSecondary: "text-gray-500",
    textMuted:     "text-gray-400",
    brandName:     "text-red-600",
    tagline:       "text-gray-400",

    // Nav rows
    navLabel:     "text-gray-700",
    navRowHover:  "hover:bg-gray-100 hover:text-gray-900",
    navRowActive: "bg-red-50 text-red-600",

    // Nav icons
    iconBg:      "bg-gray-100",
    iconColor:   "text-gray-500",
    iconActive:  "bg-red-600 text-white",

    // Sub-items
    subActive:   "text-red-600 font-medium",
    subInactive: "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
    chevron:     "text-gray-400",

    // Logout
    logoutBase: "text-gray-500 hover:bg-red-50 hover:text-red-600",
    logoutIcon: "bg-gray-100 text-gray-400 group-hover:bg-red-600 group-hover:text-white",

    // Navbar actions
    iconBtn:    "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700",
    divider:    "bg-gray-200",
    userHover:  "hover:bg-gray-50",

    // Section label
    sectionLabel: "text-gray-400",

    // Client page
    clientBorder:   "border-gray-100",
    clientInputBg:  "bg-white",
    clientInputText:"text-gray-700",
    clientMutedBg:  "bg-gray-50",
    clientMutedText:"text-gray-600",
    clientRowHover: "hover:bg-gray-50",
    clientModalBg:  "bg-white",
    clientModalText:"text-gray-900",
    clientIconBg:   "bg-red-50",
  },

  dark: {
    // Surfaces
    pageBg:       "bg-[#0a0a0a]",
    sidebarBg:    "bg-[#111111]",
    navbarBg:     "bg-[#111111]",
    mainBg:       "bg-[#0a0a0a]",

    // Borders & shadows
    sidebarBorder: "border-r border-white/5",
    navbarBorder:  "border-b border-white/5",
    cardBg:        "bg-[#161b22]",
    cardShadow:    "shadow-none",

    // Text
    textPrimary:   "text-gray-100",
    textSecondary: "text-gray-500",
    textMuted:     "text-gray-600",
    brandName:     "text-red-400",
    tagline:       "text-gray-600",

    // Nav rows
    navLabel:     "text-gray-300",
    navRowHover:  "hover:bg-white/8 hover:text-gray-100",
    navRowActive: "bg-red-500/10 text-red-400",

    // Nav icons
    iconBg:      "bg-white/5",
    iconColor:   "text-gray-400",
    iconActive:  "bg-red-500 text-white",

    // Sub-items
    subActive:   "text-red-400 font-medium",
    subInactive: "text-gray-400 hover:text-gray-200 hover:bg-white/5",
    chevron:     "text-gray-600",

    // Logout
    logoutBase: "text-gray-600 hover:bg-white/5 hover:text-red-400",
    logoutIcon: "bg-white/5 text-gray-500 group-hover:bg-red-500/20 group-hover:text-red-400",

    // Navbar actions
    iconBtn:    "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200",
    divider:    "bg-white/10",
    userHover:  "hover:bg-white/5",

    // Section label
    sectionLabel: "text-gray-700",

    // Client page
    clientBorder:   "border-white/10",
    clientInputBg:  "bg-[#1c1c1c]",
    clientInputText:"text-gray-200",
    clientMutedBg:  "bg-white/5",
    clientMutedText:"text-gray-400",
    clientRowHover: "hover:bg-white/5",
    clientModalBg:  "bg-[#1a1a1a]",
    clientModalText:"text-gray-100",
    clientIconBg:   "bg-red-500/10",
  },
};

const ThemeContext = createContext({
  mode:   "light",
  toggle: () => {},
  isDark: false,
  t:      THEMES.light,
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("light");
  const toggle = () => setMode(m => {
    const next = m === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", next === "dark");
    return next;
  });
  return (
    <ThemeContext.Provider value={{ mode, toggle, isDark: mode === "dark", t: THEMES[mode] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
