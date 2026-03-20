import { useState } from "react";
import { File, FilePlus, Trash2, Pencil, ChevronRight, ChevronDown, Folder } from "lucide-react";

interface Props {
  files: Record<string, string>;
  activeFile: string;
  onSelect: (name: string) => void;
  onCreate: (name: string) => boolean;
  onDelete: (name: string) => void;
  onRename: (oldName: string, newName: string) => boolean;
}

export const FileExplorer = ({ files, activeFile, onSelect, onCreate, onDelete, onRename }: Props) => {
  const [expanded, setExpanded] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleCreate = () => {
    if (newName.trim() && onCreate(newName.trim())) {
      setNewName("");
      setCreating(false);
    }
  };

  const handleRename = (oldName: string) => {
    if (renameValue.trim() && renameValue !== oldName) {
      onRename(oldName, renameValue.trim());
    }
    setRenamingFile(null);
  };

  const fileNames = Object.keys(files);

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const colors: Record<string, string> = {
      html: "text-orange-400", css: "text-blue-400", js: "text-yellow-400",
      jsx: "text-cyan-400", ts: "text-blue-500", tsx: "text-cyan-500",
      py: "text-green-400", java: "text-red-400", cpp: "text-purple-400",
      c: "text-blue-300", cs: "text-violet-400", php: "text-indigo-400",
      rb: "text-red-500", sql: "text-amber-400", lua: "text-blue-400",
    };
    return colors[ext || ""] || "text-muted-foreground";
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Explorer</span>
        <button
          onClick={() => setCreating(true)}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
          title="New file"
        >
          <FilePlus className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-1 terminal-scrollbar">
        {/* Project root */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-foreground hover:bg-secondary/50"
        >
          {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          <Folder className="h-3.5 w-3.5 text-accent" />
          <span>project</span>
        </button>

        {expanded && (
          <div className="ml-3 mt-0.5 space-y-px border-l border-border/50 pl-2">
            {fileNames.map(name => (
              <div
                key={name}
                className={`group flex items-center gap-1.5 rounded px-2 py-1 text-xs cursor-pointer transition-colors ${
                  activeFile === name
                    ? "bg-accent/15 text-accent font-medium"
                    : "text-foreground/80 hover:bg-secondary/50"
                }`}
              >
                {renamingFile === name ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    onBlur={() => handleRename(name)}
                    onKeyDown={e => { if (e.key === "Enter") handleRename(name); if (e.key === "Escape") setRenamingFile(null); }}
                    className="w-full rounded bg-secondary px-1 py-0.5 text-xs text-foreground outline-none ring-1 ring-accent/40"
                  />
                ) : (
                  <>
                    <File className={`h-3.5 w-3.5 shrink-0 ${getFileIcon(name)}`} />
                    <span className="flex-1 truncate" onClick={() => onSelect(name)}>{name}</span>
                    <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={e => { e.stopPropagation(); setRenamingFile(name); setRenameValue(name); }}
                        className="rounded p-0.5 hover:bg-secondary"
                        title="Rename"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onDelete(name); }}
                        className="rounded p-0.5 hover:bg-destructive/20 text-destructive"
                        title="Delete"
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {creating && (
              <div className="flex items-center gap-1.5 px-2 py-1">
                <FilePlus className="h-3.5 w-3.5 text-accent" />
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onBlur={() => { if (newName.trim()) handleCreate(); else setCreating(false); }}
                  onKeyDown={e => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false); }}
                  placeholder="filename.ext"
                  className="w-full rounded bg-secondary px-1 py-0.5 text-xs text-foreground outline-none ring-1 ring-accent/40 placeholder:text-muted-foreground/50"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
