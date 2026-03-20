import { X, Settings } from "lucide-react";
import type { EditorSettings } from "@/hooks/useFileSystem";

interface Props {
  open: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdate: (partial: Partial<EditorSettings>) => void;
}

export const SettingsModal = ({ open, onClose, settings, onUpdate }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-0 zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Editor Settings</h2>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Font Size */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Font Size</label>
            <div className="flex gap-2">
              {[12, 14, 16, 18].map(size => (
                <button
                  key={size}
                  onClick={() => onUpdate({ fontSize: size })}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all active:scale-95 ${
                    settings.fontSize === size
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {size}px
                </button>
              ))}
            </div>
          </div>

          {/* Tab Size */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Tab Size</label>
            <div className="flex gap-2">
              {[2, 4].map(size => (
                <button
                  key={size}
                  onClick={() => onUpdate({ tabSize: size })}
                  className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-all active:scale-95 ${
                    settings.tabSize === size
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border text-muted-foreground hover:border-accent/40"
                  }`}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
