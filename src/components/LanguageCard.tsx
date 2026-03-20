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
      className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:border-accent/50 active:scale-[0.97] animate-fade-up cursor-pointer"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards",
      }}
    >
      <span className="text-sm font-semibold text-card-foreground truncate">
        {language.name}
      </span>
      <img
        src={language.icon}
        alt={language.name}
        className="h-8 w-8 shrink-0 object-contain transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    </button>
  );
};
