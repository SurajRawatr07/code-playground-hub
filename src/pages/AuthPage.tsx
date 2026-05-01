import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Code2, ArrowRight, Loader2, Check, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getPasswordStrength = (pwd: string): 0 | 1 | 2 | 3 => {
  if (!pwd) return 0;
  const hasLower = /[a-z]/.test(pwd);
  const hasUpper = /[A-Z]/.test(pwd);
  const hasNumber = /\d/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
  const hasLetter = hasLower || hasUpper;
  if (pwd.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecial) return 3;
  if (pwd.length >= 6 && hasLetter && hasNumber) return 2;
  return 1;
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const emailValid = useMemo(() => EMAIL_RE.test(email.trim()), [email]);
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordValid = strength === 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    login(isLogin ? "User" : name, email);
    setLoading(false);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      <div className="glass-card w-full max-w-md rounded-2xl p-8 animate-scale-up">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
            <Code2 className="h-6 w-6 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">OneIDE</h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="rounded-lg border border-input bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
          )}
          <div className="flex flex-col gap-1.5">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-input bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />
            {email.length > 0 && (
              <p
                className={`flex items-center gap-1 px-1 text-xs animate-fade-in break-words ${
                  emailValid ? "text-primary" : "text-destructive"
                }`}
              >
                {emailValid ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                <span>{emailValid ? "Valid email" : "Invalid email format"}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-input bg-secondary/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
            />

            {!isLogin && password.length > 0 && (
              <div className="flex flex-col gap-1 px-1 animate-fade-in">
                <div className="h-1 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ease-out ${
                      strength === 1
                        ? "w-1/3 bg-destructive"
                        : strength === 2
                        ? "w-2/3 bg-amber-500"
                        : strength === 3
                        ? "w-full bg-primary"
                        : "w-0"
                    }`}
                  />
                </div>
                <p
                  className={`text-xs ${
                    strength === 3
                      ? "text-primary"
                      : strength === 2
                      ? "text-amber-500"
                      : "text-destructive"
                  }`}
                >
                  {strength === 3 ? "Strong" : strength === 2 ? "Medium" : "Weak"}
                </p>
              </div>
            )}

            {password.length > 0 && (
              <p
                className={`flex items-center gap-1 px-1 text-xs animate-fade-in break-words ${
                  passwordValid ? "text-primary" : "text-destructive"
                }`}
              >
                {passwordValid ? <Check className="h-3 w-3 shrink-0" /> : <X className="h-3 w-3 shrink-0" />}
                <span>
                  {passwordValid ? "Strong password" : "Password requirements not met"}
                </span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin-slow" />
            ) : (
              <>
                {isLogin ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-accent transition-colors hover:underline"
          >
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
