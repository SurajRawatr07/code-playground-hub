import { useState } from "react";
import { Trash2, Copy, Check, Clock } from "lucide-react";

interface HistoryEntry {
  id: number;
  timestamp: Date;
  output: string;
  error: string;
}

interface Props {
  output: string;
  errorOutput: string;
  onClear: () => void;
  history?: HistoryEntry[];
}

export type { HistoryEntry };

export const Terminal = ({ output, errorOutput, onClear, history = [] }: Props) => {
  const [tab, setTab] = useState<"output" | "error" | "history">("output");
  const [copied, setCopied] = useState(false);

  const hasError = errorOutput.length > 0;
  const content = tab === "output" ? output : tab === "error" ? errorOutput : "";

  const handleCopy = () => {
    const text = tab === "output" ? output : errorOutput;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-terminal-bg overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-1.5">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1.5 mr-3">
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-error" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-terminal-text" />
          </div>
          <button
            onClick={() => setTab("output")}
            className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              tab === "output"
                ? "bg-secondary/30 text-terminal-text"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Output
          </button>
          <button
            onClick={() => setTab("error")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              tab === "error"
                ? "bg-secondary/30 text-terminal-error"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Error
            {hasError && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-terminal-error/20 text-[9px] text-terminal-error">
                !
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("history")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
              tab === "history"
                ? "bg-secondary/30 text-accent"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3 w-3" />
            History
            {history.length > 0 && (
              <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent/20 px-1 text-[9px] text-accent">
                {history.length}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-1">
          {tab !== "history" && content && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary/20 hover:text-foreground active:scale-95"
            >
              {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          )}
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary/20 hover:text-foreground active:scale-95"
          >
            <Trash2 className="h-3 w-3" />
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed terminal-scrollbar">
        {tab === "history" ? (
          history.length > 0 ? (
            <div className="space-y-3">
              {history.map((entry) => (
                <div key={entry.id} className="rounded-lg border border-border/30 bg-secondary/10 p-3">
                  <div className="mb-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {entry.timestamp.toLocaleTimeString()}
                    {entry.error && (
                      <span className="rounded bg-terminal-error/20 px-1.5 py-0.5 text-terminal-error">error</span>
                    )}
                  </div>
                  <pre className={`whitespace-pre-wrap text-xs ${entry.error ? "text-terminal-error" : "text-terminal-text"}`}>
                    {entry.error || entry.output || "No output"}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground/50">No execution history yet</span>
          )
        ) : content ? (
          <pre className={`whitespace-pre-wrap ${tab === "error" ? "text-terminal-error" : "text-terminal-text"}`}>
            {content}
          </pre>
        ) : (
          <span className="text-muted-foreground/50">
            {tab === "output" ? "$ Waiting for execution..." : "No errors"}
          </span>
        )}
      </div>
    </div>
  );
};
