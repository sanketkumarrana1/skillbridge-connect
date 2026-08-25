import { useEffect } from "react";

export function useTheme() {
  useEffect(() => {
    // Permanently enforce light mode
    document.documentElement.classList.remove("dark");
    try {
      window.localStorage.removeItem("skillbridge-theme");
      window.localStorage.removeItem("acadin-theme");
    } catch {
      // ignore
    }
  }, []);

  return { dark: false, toggle: () => {} };
}

export function ThemeToggle() {
  return null;
}
