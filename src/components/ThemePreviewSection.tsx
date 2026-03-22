import { useTheme, THEME_OPTIONS, ThemeName } from "@/contexts/ThemeContext";
import { Check } from "lucide-react";

const themeColors: Record<ThemeName, { bg: string; fg: string; accent: string }> = {
  dark: { bg: "#1a1a2e", fg: "#e2e8f0", accent: "#60a5fa" },
  light: { bg: "#f8fafc", fg: "#1e293b", accent: "#3b82f6" },
  dracula: { bg: "#282a36", fg: "#f8f8f2", accent: "#bd93f9" },
  monokai: { bg: "#272822", fg: "#f8f8f2", accent: "#f92672" },
};

export const ThemePreviewSection = () => {
  const { theme, setTheme } = useTheme();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
        🌙 Theme Showcase
      </h2>
      <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        Choose the look that suits you best.
      </p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {THEME_OPTIONS.map((t, i) => {
          const c = themeColors[t.value];
          const active = theme === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`glass-card group relative flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] active:scale-95 animate-fade-up ${active ? "ring-2 ring-accent" : ""}`}
              style={{ animationDelay: `${i * 80 + 200}ms`, animationFillMode: "backwards" }}
            >
              {active && (
                <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                  <Check className="h-3 w-3 text-accent-foreground" />
                </span>
              )}
              <div className="flex w-full gap-1 rounded-lg overflow-hidden h-16">
                <div className="flex-1" style={{ background: c.bg }} />
                <div className="w-8" style={{ background: c.accent }} />
                <div className="w-4" style={{ background: c.fg, opacity: 0.3 }} />
              </div>
              <span className="text-sm font-semibold text-foreground capitalize">{t.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
