import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Code2, LogOut, Search, User, ChevronDown } from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Navbar = ({ searchQuery, onSearchChange }: NavbarProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate("/auth");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80 active:scale-[0.97]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Code2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="hidden text-sm font-bold text-foreground sm:block">OneIDE</span>
        </button>

        {/* Center Search */}
        <div className="relative mx-auto w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search languages, databases, templates…"
            className="w-full rounded-lg border border-input bg-secondary/50 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-muted active:scale-[0.97]"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="hidden text-xs font-medium lg:block">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                  <div className="px-3 py-2.5 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/auth")}
              className="rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.97]"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
