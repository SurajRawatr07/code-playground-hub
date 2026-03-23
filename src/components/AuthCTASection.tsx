import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const AuthCTASection = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="glass-card flex flex-col items-center gap-6 rounded-2xl p-10 text-center animate-fade-up">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          🔐 Login to Save Your Projects
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Create an account to save, share, and manage your coding projects across devices.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-95"
          >
            <LogIn className="h-4 w-4" /> Login
          </button>
          <button
            onClick={() => navigate("/auth")}
            className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-muted active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Sign Up
          </button>
        </div>
      </div>
    </section>
  );
};
