import { Rocket, BookOpen, Zap, Palette } from "lucide-react";

const features = [
  { icon: Rocket, title: "No Installation Needed", desc: "Start coding instantly in your browser. Zero setup, zero downloads." },
  { icon: BookOpen, title: "Beginner Friendly", desc: "Simple interface designed for learners and pros alike." },
  { icon: Zap, title: "Fast Execution", desc: "Run your code in milliseconds with our optimized engine." },
  { icon: Palette, title: "Clean UI", desc: "A beautiful, distraction-free coding environment." },
];

export const WhyChooseUs = () => (
  <section className="mx-auto max-w-6xl px-4 py-20">
    <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
      Why Choose Us
    </h2>
    <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
      Everything you need for a seamless coding experience.
    </p>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((f, i) => (
        <div
          key={f.title}
          className="glass-card group flex flex-col items-start gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] animate-fade-up"
          style={{ animationDelay: `${i * 80 + 200}ms`, animationFillMode: "backwards" }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15">
            <f.icon className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-base font-semibold text-card-foreground">{f.title}</h3>
          <p className="text-xs leading-relaxed text-muted-foreground">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
