const stats = [
  { value: "10,000+", label: "Users" },
  { value: "1M+", label: "Code Runs" },
  { value: "50+", label: "Languages" },
];

export const StatsSection = () => (
  <section className="mx-auto max-w-3xl px-4 py-12">
    <div className="grid grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="glass-card flex flex-col items-center justify-center gap-1 rounded-2xl py-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_25px_hsl(var(--card-glow)/0.2)] animate-fade-up"
          style={{ animationDelay: `${i * 100 + 200}ms`, animationFillMode: "backwards" }}
        >
          <span className="text-2xl font-extrabold text-accent sm:text-3xl">{s.value}</span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);
