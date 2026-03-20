import { useState } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  output: string;
  errorOutput: string;
  onClear: () => void;
}

export const Terminal = ({ output, errorOutput, onClear }: Props) => {
  const [tab, setTab] = useState<"output" | "error">("output");

  const hasError = errorOutput.length > 0;
  const content = tab === "output" ? output : errorOutput;

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
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary/20 hover:text-foreground active:scale-95"
        >
          <Trash2 className="h-3 w-3" />
          Clear
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed terminal-scrollbar">
        {content ? (
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
