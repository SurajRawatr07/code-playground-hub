import { FolderOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title = "No projects yet",
  description = "Start by creating your first project",
  actionLabel = "Create Project",
  onAction,
}: EmptyStateProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FolderOpen className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onAction || (() => navigate("/editor/javascript"))}
        className="mt-2 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
      >
        <Plus className="h-4 w-4" />
        {actionLabel}
      </button>
    </div>
  );
};
