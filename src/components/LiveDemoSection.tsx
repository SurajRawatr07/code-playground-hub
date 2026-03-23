import { useState, useCallback } from "react";
import { Play, Loader2, Trash2 } from "lucide-react";

const defaultCode = `// Try it out! Click Run ▶\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nfor (let i = 0; i < 8; i++) {\n  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);\n}`;

export const LiveDemoSection = () => {
  const [code, setCode] = useState(defaultCode);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);

  const handleRun = useCallback(() => {
    setRunning(true);
    setOutput("");
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const mockConsole = { log: (...args: any[]) => logs.push(args.map(String).join(" ")) };
        const fn = new Function("console", code);
        fn(mockConsole);
        setOutput(logs.join("\n") || "✅ No output");
      } catch (e: any) {
        setOutput(`❌ ${e.message}`);
      }
      setRunning(false);
    }, 600);
  }, [code]);

  return (
    <section id="live-demo" className="mx-auto max-w-6xl px-4 py-20">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
        🧑‍💻 Try It Live
      </h2>
      <p className="mx-auto mb-10 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        Write JavaScript and see results instantly.
      </p>
      <div className="glass-card overflow-hidden rounded-2xl animate-fade-up" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-[10px] text-muted-foreground">main.js</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setOutput(""); }} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95 disabled:opacity-60"
            >
              {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              {running ? "Running…" : "Run"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="min-h-[200px] w-full resize-none bg-transparent p-4 font-mono text-xs text-foreground outline-none placeholder:text-muted-foreground"
            placeholder="Write your code here..."
          />
          <div className="min-h-[200px] bg-card/50 p-4 font-mono text-xs">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Output</div>
            <pre className={`whitespace-pre-wrap ${output.startsWith("❌") ? "text-destructive" : "text-emerald-400"}`}>
              {output || <span className="text-muted-foreground italic">Click Run to see output…</span>}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
