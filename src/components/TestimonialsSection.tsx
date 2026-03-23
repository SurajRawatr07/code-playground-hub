import { Star } from "lucide-react";

const testimonials = [
  { name: "Aarav S.", role: "CS Student", text: "OneIDE is my go-to for quick coding. The multi-language support is amazing!" },
  { name: "Priya M.", role: "Web Developer", text: "Clean UI, fast execution, and the live preview feature is a game changer." },
  { name: "Rahul K.", role: "Competitive Programmer", text: "I love the VS Code-like experience right in my browser. No setup needed!" },
];

export const TestimonialsSection = () => (
  <section className="mx-auto max-w-6xl px-4 py-20">
    <h2 className="mb-2 text-center text-2xl font-bold text-foreground sm:text-3xl animate-fade-up">
      🌟 Loved by Developers
    </h2>
    <p className="mx-auto mb-12 max-w-md text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
      Used by 1000+ developers worldwide.
    </p>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {testimonials.map((t, i) => (
        <div
          key={t.name}
          className="glass-card flex flex-col gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] animate-fade-up"
          style={{ animationDelay: `${i * 80 + 200}ms`, animationFillMode: "backwards" }}
        >
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed italic">"{t.text}"</p>
          <div className="mt-auto">
            <p className="text-sm font-bold text-foreground">{t.name}</p>
            <p className="text-[11px] text-muted-foreground">{t.role}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);
