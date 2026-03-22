import { useNavigate } from "react-router-dom";
import { FileCode, Atom, Server, Terminal } from "lucide-react";

const templates = [
  { icon: FileCode, title: "HTML Boilerplate", desc: "Start with a clean HTML5 template", langId: "html", color: "16 85% 57%" },
  { icon: Atom, title: "React App", desc: "Component-based UI starter", langId: "react", color: "193 95% 58%" },
  { icon: Server, title: "Node API", desc: "Express.js REST API template", langId: "nodejs", color: "120 50% 40%" },
  { icon: Terminal, title: "Python Starter", desc: "Basic Python script template", langId: "python", color: "210 60% 50%" },
];

export const TemplatesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
        📂 Popular Templates
      </h2>
      <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        Jump-start your project with ready-made templates.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((t, i) => (
          <button
            key={t.title}
            onClick={() => navigate(`/editor/${t.langId}`)}
            className="glass-card group flex flex-col items-start gap-3 rounded-2xl p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] active:scale-95 cursor-pointer animate-fade-up"
            style={{ animationDelay: `${i * 80 + 200}ms`, animationFillMode: "backwards" }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `hsl(${t.color} / 0.15)` }}>
              <t.icon className="h-5 w-5" style={{ color: `hsl(${t.color})` }} />
            </div>
            <h3 className="text-sm font-bold text-foreground">{t.title}</h3>
            <p className="text-xs text-muted-foreground">{t.desc}</p>
          </button>
        ))}
      </div>
    </section>
  );
};
