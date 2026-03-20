import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Terminal } from "@/components/Terminal";
import { languages } from "@/lib/languages";
import { executeCode, buildHtmlPreview } from "@/lib/executor";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowLeft, Code2, Play, Loader2 } from "lucide-react";

const EditorPage = () => {
  const { langId } = useParams<{ langId: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const lang = languages.find((l) => l.id === langId);

  const [code, setCode] = useState(lang?.placeholder ?? "");
  const [output, setOutput] = useState("");
  const [isError, setIsError] = useState(false);
  const [running, setRunning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isWebLang = langId === "html" || langId === "css";

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput("");
    setShowPreview(false);

    if (isWebLang) {
      setShowPreview(true);
      setTimeout(() => {
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            doc.open();
            doc.write(buildHtmlPreview(code, langId!));
            doc.close();
          }
        }
        setOutput("✅ Preview rendered successfully");
        setIsError(false);
        setRunning(false);
      }, 500);
      return;
    }

    const result = await executeCode(langId!, code);
    setOutput(result.output);
    setIsError(result.isError);
    setRunning(false);
  }, [code, langId, isWebLang]);

  if (!lang) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Navbar */}
      <nav className="flex h-12 shrink-0 items-center justify-between border-b border-navbar-border bg-navbar-bg/90 backdrop-blur-xl px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">{lang.name}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-xs font-semibold text-accent-foreground transition-all duration-200 hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin-slow" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {running ? "Running..." : "Run"}
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Editor + Terminal */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col border-r border-border">
          <Editor
            height="100%"
            language={lang.monacoLang}
            value={code}
            onChange={(v) => setCode(v ?? "")}
            theme={isDark ? "vs-dark" : "light"}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              minimap: { enabled: false },
              padding: { top: 16, bottom: 16 },
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              tabSize: 2,
              renderWhitespace: "none",
              smoothScrolling: true,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              bracketPairColorization: { enabled: true },
            }}
          />
        </div>

        <div className="flex w-1/2 flex-col p-3">
          {showPreview && isWebLang ? (
            <div className="flex h-full flex-col gap-3">
              <div className="flex-1 overflow-hidden rounded-xl border border-border">
                <iframe
                  ref={iframeRef}
                  title="preview"
                  className="h-full w-full bg-white"
                  sandbox="allow-scripts"
                />
              </div>
              <div className="h-32 shrink-0">
                <Terminal output={output} isError={isError} onClear={() => { setOutput(""); setShowPreview(false); }} />
              </div>
            </div>
          ) : (
            <Terminal output={output} isError={isError} onClear={() => setOutput("")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
