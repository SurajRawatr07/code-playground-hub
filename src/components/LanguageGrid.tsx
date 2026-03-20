import { Language } from "@/lib/languages";
import { LanguageCard } from "./LanguageCard";

interface Props {
  languages: Language[];
  onSelect: (lang: Language) => void;
}

export const LanguageGrid = ({ languages, onSelect }: Props) => {
  if (languages.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-muted-foreground">
        No language found.
      </div>
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
