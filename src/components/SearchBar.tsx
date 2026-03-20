import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: Props) => {
  return (
    <div
      className="mx-auto max-w-xl px-4 animate-fade-up"
      style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by Language / DB / Template etc."
          className="w-full rounded-xl border border-input bg-secondary/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
    </div>
  );
};
