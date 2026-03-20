import { Language } from "@/lib/languages";

interface Props {
  language: Language;
  index: number;
  onClick: () => void;
}

export const LanguageCard = ({ language, index, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="group glass-card flex flex-col items-center gap-4 rounded-xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-accent/40 active:scale-[0.97] animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
        {language.icon}
      </span>
      <span className="text-xs font-semibold text-foreground">{language.name}</span>
      <span
        className="h-1 w-6 rounded-full transition-all duration-300 group-hover:w-10"
        style={{ background: language.color }}
      />
    </button>
  );
};
