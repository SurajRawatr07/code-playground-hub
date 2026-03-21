import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type ThemeName = "dark" | "light" | "dracula" | "monokai";

interface ThemeContextType {
  theme: ThemeName;
  isDark: boolean;
  setTheme: (t: ThemeName) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const DARK_THEMES: ThemeName[] = ["dark", "dracula", "monokai"];

export const THEME_OPTIONS: { value: ThemeName; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "dracula", label: "Dracula" },
  { value: "monokai", label: "Monokai" },
];

export function getMonacoTheme(theme: ThemeName): string {
  switch (theme) {
    case "light": return "light";
    case "dracula": return "dracula";
    case "monokai": return "monokai";
    default: return "vs-dark";
  }
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    return (localStorage.getItem("oneide-theme") as ThemeName) || "dark";
  });

  const isDark = DARK_THEMES.includes(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-dracula", "theme-monokai");
    if (isDark) root.classList.add("dark");
    if (theme === "dracula") root.classList.add("theme-dracula");
    if (theme === "monokai") root.classList.add("theme-monokai");
    localStorage.setItem("oneide-theme", theme);
  }, [theme, isDark]);

  const setTheme = (t: ThemeName) => setThemeState(t);
  const toggle = () => setThemeState(t => t === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
