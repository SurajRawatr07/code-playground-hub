import { useNavigate } from "react-router-dom";
import { Play, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const codeLines = [
  'function greet(name) {',
  '  return `Hello, ${name}!`;',
  '}',
  '',
  'const result = greet("OneIDE");',
  'console.log(result);',
  '// → Hello, OneIDE!',
];

const AnimatedCode = () => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines((prev) => (prev < codeLines.length ? prev + 1 : prev));
    }, 400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-card rounded-2xl p-4 text-left font-mono text-xs sm:text-sm leading-relaxed max-w-md w-full">
      <div className="flex items-center gap-1.5 mb-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[10px] text-muted-foreground">main.js</span>
      </div>
      {codeLines.map((line, i) => (
        <div
          key={i}
          className={`transition-all duration-500 ${i < visibleLines ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        >
          <span className="text-muted-foreground mr-3 select-none">{i + 1}</span>
          <span className="text-foreground">{line}</span>
        </div>
      ))}
      {visibleLines >= codeLines.length && (
        <div className="mt-3 border-t border-border pt-2 text-emerald-400 animate-fade-in">
          <span className="text-muted-foreground mr-3 select-none">›</span>
          Hello, OneIDE!
        </div>
      )}
    </div>
  );
};

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-28 animate-fade-up">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between lg:gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            style={{ lineHeight: "1.1" }}
          >
            Code Anytime,{" "}
            <span className="text-accent">Anywhere</span>
          </h1>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg" style={{ textWrap: "pretty" }}>
            Multi-language online IDE. Write, run, and share code instantly — no setup required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <button
              onClick={() => navigate("/editor/javascript")}
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              <Play className="h-4 w-4" /> Start Coding
            </button>
            <button
              onClick={() => {
                document.getElementById("live-demo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-muted hover:scale-105 active:scale-95 hover:shadow-lg"
            >
              Try Demo <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <AnimatedCode />
        </div>
      </div>
    </section>
  );
};
