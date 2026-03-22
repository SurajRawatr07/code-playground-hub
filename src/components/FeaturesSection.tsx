import { Zap, Globe, Save, Shield, Monitor } from "lucide-react";

const features = [
  { icon: Zap, title: "Fast Execution", desc: "Run code instantly with optimized execution engine." },
  { icon: Globe, title: "Multi-language Support", desc: "HTML, CSS, JS, Python, C++, Java, and more." },
  { icon: Save, title: "Save Projects", desc: "Auto-save your work and access it anytime." },
  { icon: Shield, title: "Secure Environment", desc: "Sandboxed execution keeps your code safe." },
  { icon: Monitor, title: "VS Code-like UI", desc: "Professional editor with syntax highlighting and autocomplete." },
];

export const FeaturesSection = () => (
  <section className="mx-auto max-w-5xl px-4 py-16">
    <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
      ⚡ Powerful Features
    </h2>
    <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
      Everything you need to code like a pro, right in your browser.
    </p>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((f, i) => (
        <div
          key={f.title}
          className="glass-card group flex flex-col gap-3 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] animate-fade-up"
          style={{ animationDelay: `${i * 80 + 200}ms`, animationFillMode: "backwards" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
            <f.icon className="h-5 w-5 text-accent" />
          </div>
          <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);
