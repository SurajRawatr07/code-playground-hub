import { useTheme, THEME_OPTIONS, ThemeName } from "@/contexts/ThemeContext";
import { Moon, Sun, Palette } from "lucide-react";

export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary transition-all duration-200 hover:bg-muted active:scale-95"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-4 w-4 text-foreground" /> : <Moon className="h-4 w-4 text-foreground" />}
    </button>
  );
};
