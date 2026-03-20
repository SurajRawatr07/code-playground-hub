import { Trash2 } from "lucide-react";

interface Props {
  output: string;
  isError: boolean;
  onClear: () => void;
}

export const Terminal = ({ output, isError, onClear }: Props) => {
  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-terminal-bg overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-error" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-terminal-text" />
          <span className="ml-3 text-xs font-medium text-muted-foreground">Terminal</span>
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
        {output ? (
          <pre className={`whitespace-pre-wrap ${isError ? "text-terminal-error" : "text-terminal-text"}`}>
            {output}
          </pre>
        ) : (
          <span className="text-muted-foreground/50">$ Waiting for execution...</span>
        )}
      </div>
    </div>
  );
};
