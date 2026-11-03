"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "gfy.theme";

/**
 * Runs inline in <head> before first paint so the stored theme applies without a flash.
 * Light is the default when nothing is stored or storage is unavailable.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");}catch(e){document.documentElement.setAttribute("data-theme","light");}})();`;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Matches the server render; the real value is read from <html> after mount (set by themeBootScript).
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    setThemeState(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const setTheme = useCallback((next: Theme) => {
    const root = document.documentElement;
    // Suppress per-element color transitions so the whole page switches in one frame.
    root.setAttribute("data-theme-switching", "");
    root.setAttribute("data-theme", next);
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [setTheme, theme]);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [setTheme, theme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
