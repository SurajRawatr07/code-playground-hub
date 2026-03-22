import { Code2, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="h-5 w-5 text-accent" />
            <span className="text-sm font-bold text-foreground">OneIDE</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Code. Run. Build. Anywhere.<br />No setup required.
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Languages</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Company</h4>
          <ul className="space-y-2 text-xs text-muted-foreground">
            <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Connect</h4>
          <div className="flex gap-3">
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Github className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
        © {new Date().getFullYear()} OneIDE. All rights reserved.
      </div>
    </div>
  </footer>
);
