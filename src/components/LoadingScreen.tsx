import { useState, useEffect } from "react";
import { Code2 } from "lucide-react";

export const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1800);
    const t2 = setTimeout(onComplete, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex items-center gap-3 mb-6 animate-fade-up">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent animate-spin-slow">
          <Code2 className="h-6 w-6 text-accent-foreground" />
        </div>
        <span className="text-2xl font-bold text-foreground">OneIDE</span>
      </div>
      <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
        Loading OneIDE…
      </p>
      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-secondary">
        <div className="h-full rounded-full bg-accent animate-loading-bar" />
      </div>
    </div>
  );
};
