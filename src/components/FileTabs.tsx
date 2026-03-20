import { X, File } from "lucide-react";

interface Props {
  openFiles: string[];
  activeFile: string;
  onSelect: (name: string) => void;
  onClose: (name: string) => void;
}

export const FileTabs = ({ openFiles, activeFile, onSelect, onClose }: Props) => {
  const getFileColor = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const colors: Record<string, string> = {
      html: "text-orange-400", css: "text-blue-400", js: "text-yellow-400",
      jsx: "text-cyan-400", py: "text-green-400", java: "text-red-400",
      sql: "text-amber-400",
    };
    return colors[ext || ""] || "text-muted-foreground";
  };

  if (openFiles.length === 0) return null;

  return (
    <div className="flex h-9 shrink-0 items-end gap-px overflow-x-auto border-b border-border bg-card terminal-scrollbar">
      {openFiles.map(name => (
        <div
          key={name}
          className={`group flex shrink-0 cursor-pointer items-center gap-1.5 border-t-2 px-3 py-1.5 text-xs transition-colors ${
            activeFile === name
              ? "border-t-accent bg-background text-foreground"
              : "border-t-transparent bg-card text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
          }`}
          onClick={() => onSelect(name)}
        >
          <File className={`h-3 w-3 ${getFileColor(name)}`} />
          <span className="max-w-[120px] truncate">{name}</span>
          <button
            onClick={e => { e.stopPropagation(); onClose(name); }}
            className="ml-1 rounded p-0.5 opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
