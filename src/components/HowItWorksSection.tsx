import { Code2, Pencil, Play } from "lucide-react";

const steps = [
  { icon: Code2, title: "Select Language", desc: "Choose from 15+ languages and frameworks." },
  { icon: Pencil, title: "Write Code", desc: "Use our powerful Monaco-based editor." },
  { icon: Play, title: "Run & Get Output", desc: "See results instantly in the terminal." },
];

export const HowItWorksSection = () => (
  <section className="mx-auto max-w-6xl px-4 py-20">
    <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
      📊 How It Works
    </h2>
    <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
      Three simple steps to start coding.
    </p>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {steps.map((s, i) => (
        <div
          key={s.title}
          className="glass-card group flex flex-col items-center gap-4 rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] animate-fade-up"
          style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: "backwards" }}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15">
            <s.icon className="h-7 w-7 text-accent" />
          </div>
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
            {i + 1}
          </span>
          <h3 className="text-base font-bold text-foreground">{s.title}</h3>
          <p className="text-xs text-muted-foreground">{s.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
