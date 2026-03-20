import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageCard } from "@/components/LanguageCard";
import { languages } from "@/lib/languages";
import { Code2, LogOut } from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 border-b border-navbar-border bg-navbar-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold text-foreground">CodeCraft</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:block">
              Hey, {user?.name} 👋
            </span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-12 text-center animate-fade-up">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl" style={{ lineHeight: "1.1" }}>
            Choose a language
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Pick a language and start coding instantly
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {languages.map((lang, i) => (
            <LanguageCard
              key={lang.id}
              language={lang}
              index={i}
              onClick={() => navigate(`/editor/${lang.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage;
