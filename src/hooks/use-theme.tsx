import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    // Permanently enforce dark mode across the entire application
    document.documentElement.classList.add("dark");
    try {
      window.localStorage.setItem("acadin-theme", "dark");
    } catch {
      // ignore
    }
  }, []);

  return { dark: true, toggle: () => {} };
}

export function ThemeToggle() {
  return null;
}
