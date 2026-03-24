import { GitBranch, AlertCircle, CheckCircle2 } from "lucide-react";

interface Props {
  language: string;
  lineCount: number;
  fontSize: number;
  tabSize: number;
  hasError: boolean;
  encoding?: string;
}

export const StatusBar = ({ language, lineCount, fontSize, tabSize, hasError, encoding = "UTF-8" }: Props) => {
  return (
    <div className="flex h-6 shrink-0 items-center justify-between border-t border-border bg-primary px-3 text-[11px] text-primary-foreground">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <GitBranch className="h-3 w-3" />
          main
        </span>
        <span className="flex items-center gap-1">
          {hasError ? (
            <AlertCircle className="h-3 w-3 text-destructive-foreground" />
          ) : (
            <CheckCircle2 className="h-3 w-3" />
          )}
          {hasError ? "Errors" : "Ready"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span>Ln {lineCount}</span>
        <span>Spaces: {tabSize}</span>
        <span>{encoding}</span>
        <span>{fontSize}px</span>
        <span className="font-medium">{language}</span>
      </div>
    </div>
  );
};
