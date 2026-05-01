import { Instagram, Linkedin, Github } from "lucide-react";

export const FooterCredit = () => (
  <div className="w-full border-t border-border/50 bg-background/40 backdrop-blur-sm">
    <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-3 px-4 py-6 sm:flex-row sm:gap-6">
      <p className="text-sm text-muted-foreground text-center">
        Built with <span className="text-destructive">❤️</span> by{" "}
        <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-semibold text-transparent">
          Suraj Rawat
        </span>
      </p>
      <div className="flex items-center gap-5 sm:gap-4">
        <a
          href="https://instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="text-muted-foreground transition-all duration-200 hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))]"
        >
          <Instagram className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
        </a>
        <a
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className="text-muted-foreground transition-all duration-200 hover:text-primary hover:drop-shadow-[0_0_6px_hsl(var(--primary))]"
        >
          <Linkedin className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
        </a>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="text-muted-foreground transition-all duration-200 hover:text-accent hover:drop-shadow-[0_0_6px_hsl(var(--accent))]"
        >
          <Github className="h-5 w-5 sm:h-[18px] sm:w-[18px]" />
        </a>
      </div>
    </div>
  </div>
);
