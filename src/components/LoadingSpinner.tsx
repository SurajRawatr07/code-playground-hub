import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({ text = "Loading...", size = "md" }: LoadingSpinnerProps) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 animate-fade-in">
      <Loader2 className={`${sizes[size]} animate-spin text-accent`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};
