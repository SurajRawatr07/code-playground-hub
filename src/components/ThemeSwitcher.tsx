import { useTheme, THEME_OPTIONS, ThemeName } from "@/contexts/ThemeContext";
import { Palette } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
        title="Change theme"
      >
        <Palette className="h-3.5 w-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 z-50">
          {THEME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setTheme(opt.value as ThemeName); setOpen(false); }}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                theme === opt.value
                  ? "bg-accent/15 text-accent font-medium"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span className="h-2.5 w-2.5 rounded-full border border-border" style={{
                background: opt.value === "dark" ? "#1e1e2e" : opt.value === "light" ? "#f5f5f5" : opt.value === "dracula" ? "#282a36" : "#272822"
              }} />
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
