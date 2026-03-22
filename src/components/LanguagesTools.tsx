import { useNavigate } from "react-router-dom";

interface ToolCard {
  name: string;
  icon: string;
  color: string;
  langId: string;
  badge?: "Popular" | "New";
}

interface Section {
  title: string;
  emoji: string;
  cards: ToolCard[];
}

const devicon = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}`;

const sections: Section[] = [
  {
    title: "Web Development",
    emoji: "🌐",
    cards: [
      { name: "HTML", icon: devicon("html5/html5-original.svg"), color: "16 85% 57%", langId: "html" },
      { name: "CSS", icon: devicon("css3/css3-original.svg"), color: "204 85% 55%", langId: "css" },
      { name: "JavaScript", icon: devicon("javascript/javascript-original.svg"), color: "50 90% 50%", langId: "javascript", badge: "Popular" },
    ],
  },
  {
    title: "Quick Run",
    emoji: "⚡",
    cards: [
      { name: "JavaScript", icon: devicon("javascript/javascript-original.svg"), color: "50 90% 50%", langId: "javascript", badge: "Popular" },
      { name: "Python", icon: devicon("python/python-original.svg"), color: "210 60% 50%", langId: "python", badge: "Popular" },
    ],
  },
  {
    title: "Programming Languages",
    emoji: "💻",
    cards: [
      { name: "C", icon: devicon("c/c-original.svg"), color: "220 50% 50%", langId: "c" },
      { name: "C++", icon: devicon("cplusplus/cplusplus-original.svg"), color: "210 70% 45%", langId: "cpp" },
      { name: "Java", icon: devicon("java/java-original.svg"), color: "15 80% 50%", langId: "java" },
    ],
  },
  {
    title: "Advanced",
    emoji: "🚀",
    cards: [
      { name: "C#", icon: devicon("csharp/csharp-original.svg"), color: "270 60% 50%", langId: "csharp" },
      { name: "PHP", icon: devicon("php/php-original.svg"), color: "240 40% 55%", langId: "php" },
      { name: "SQL", icon: devicon("mysql/mysql-original.svg"), color: "200 70% 45%", langId: "mysql" },
      { name: "Node.js", icon: devicon("nodejs/nodejs-original.svg"), color: "120 50% 40%", langId: "nodejs", badge: "New" },
      { name: "Go", icon: devicon("go/go-original.svg"), color: "193 100% 43%", langId: "javascript", badge: "New" },
    ],
  },
];

const BadgeLabel = ({ type }: { type: "Popular" | "New" }) => (
  <span
    className={`absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-[10px] font-bold z-10 ${
      type === "Popular"
        ? "bg-yellow-400/90 text-yellow-950"
        : "bg-emerald-400/90 text-emerald-950"
    }`}
  >
    {type}
  </span>
);

export const LanguagesTools = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
        Languages & Tools
      </h2>
      <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        Pick your language and start coding instantly.
      </p>

      <div className="space-y-12">
        {sections.map((section, si) => (
          <div key={section.title} className="animate-fade-up" style={{ animationDelay: `${si * 100 + 200}ms`, animationFillMode: "backwards" }}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <span>{section.emoji}</span> {section.title}
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {section.cards.map((card) => (
                <button
                  key={`${section.title}-${card.name}`}
                  onClick={() => navigate(`/editor/${card.langId}`)}
                  className="glass-card group relative flex flex-col items-start gap-3 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.05] hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] active:scale-95 cursor-pointer"
                >
                  {card.badge && <BadgeLabel type={card.badge} />}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ background: `hsl(${card.color} / 0.15)` }}
                  >
                    <img src={card.icon} alt={card.name} className="h-6 w-6 object-contain" loading="lazy" />
                  </div>
                  <span className="text-sm font-semibold text-card-foreground">{card.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
