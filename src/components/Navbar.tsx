import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Code2, LogOut, Search } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const navLinks = ["Pricing", "Learn", "Code", "Deploy"];

  return (
    <nav className="sticky top-0 z-30 border-b border-navbar-border bg-navbar-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Left */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 active:scale-[0.97]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
            <Code2 className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-sm font-bold text-foreground">CodeCompiler</span>
        </button>

        {/* Center links — hidden on mobile */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <button
              key={link}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
            <Search className="h-4 w-4" />
          </button>
          <ThemeToggle />
          {user && (
            <>
              <span className="hidden text-xs text-muted-foreground lg:block">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
          {!user && (
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
