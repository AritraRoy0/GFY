"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";

/** Icon button that switches between the light and dark themes. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const nextLabel = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface/60 text-ink-2 transition-colors hover:border-line-strong hover:text-ink ${className}`}
      aria-label={nextLabel}
      title={nextLabel}
    >
      <Sun
        className={`absolute h-4 w-4 transition-all duration-300 ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
        aria-hidden="true"
      />
      <Moon
        className={`absolute h-4 w-4 transition-all duration-300 ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}`}
        aria-hidden="true"
      />
    </button>
  );
}
