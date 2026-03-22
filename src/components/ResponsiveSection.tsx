import { Monitor, Tablet, Smartphone } from "lucide-react";

export const ResponsiveSection = () => (
  <section className="mx-auto max-w-5xl px-4 py-16">
    <div className="glass-card flex flex-col items-center gap-8 rounded-2xl p-10 text-center animate-fade-up">
      <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
        📱 Works on Any Device
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Code seamlessly on desktop, tablet, or mobile. Your IDE adapts to your screen.
      </p>
      <div className="flex items-end justify-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="glass-card flex h-28 w-44 items-center justify-center rounded-xl">
            <Monitor className="h-10 w-10 text-accent" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">Desktop</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="glass-card flex h-24 w-20 items-center justify-center rounded-xl">
            <Tablet className="h-8 w-8 text-accent" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">Tablet</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="glass-card flex h-20 w-12 items-center justify-center rounded-xl">
            <Smartphone className="h-6 w-6 text-accent" />
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">Mobile</span>
        </div>
      </div>
    </div>
  </section>
);
