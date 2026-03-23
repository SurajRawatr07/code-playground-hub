import { Language } from "@/lib/languages";
import { LanguageCard } from "./LanguageCard";
import { EmptyState } from "./EmptyState";

interface Props {
  languages: Language[];
  onSelect: (lang: Language) => void;
}

export const LanguageGrid = ({ languages, onSelect }: Props) => {
  if (languages.length === 0) {
    return (
      <EmptyState
        title="No language found"
        description="Try a different search term or browse all categories"
        actionLabel="Browse All"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {languages.map((lang, i) => (
        <LanguageCard
          key={lang.id}
          language={lang}
          index={i}
          onClick={() => onSelect(lang)}
        />
      ))}
    </div>
  );
};
