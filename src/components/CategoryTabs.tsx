import { categories } from "@/lib/languages";

interface Props {
  active: string;
  onChange: (cat: string) => void;
}

export const CategoryTabs = ({ active, onChange }: Props) => {
  return (
    <div
      className="mx-auto flex max-w-xl flex-wrap justify-center gap-2 px-4 py-6 animate-fade-up"
      style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
    >
      <button
        onClick={() => onChange("All")}
        className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
          active === "All"
            ? "bg-accent text-accent-foreground shadow-md"
            : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
            active === cat
              ? "bg-accent text-accent-foreground shadow-md"
              : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
