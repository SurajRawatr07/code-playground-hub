import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Editor, { OnMount } from "@monaco-editor/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { SettingsModal } from "@/components/SettingsModal";
import { useAuth } from "@/contexts/AuthContext";
import { buildHtmlPreview } from "@/lib/executor";
import { useFileSystem, useEditorSettings, generateProjectId, saveProject } from "@/hooks/useFileSystem";
import { useTheme, getMonacoTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft, Code2, Settings, Share2, Check, Download,
  ZoomIn, ZoomOut, Save, User, LogOut, ChevronDown,
} from "lucide-react";

type WebFile = "index.html" | "style.css" | "script.js";
const WEB_LANGS = new Set(["html", "css", "javascript"]);

const EditorPage = () => {
  const { langId } = useParams<{ langId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  // Force web-only editor: redirect any non-web language to html.
  useEffect(() => {
    if (langId && !WEB_LANGS.has(langId)) {
      navigate(`/editor/html`, { replace: true });
    }
  }, [langId, navigate]);

  const effectiveLang = langId && WEB_LANGS.has(langId) ? langId : "html";

  const { files, updateFile, saveNow } = useFileSystem(effectiveLang);
  const { settings, updateSettings } = useEditorSettings();

  const [activeTab, setActiveTab] = useState<WebFile>(() => {
    if (effectiveLang === "css") return "style.css";
    if (effectiveLang === "javascript") return "script.js";
    return "index.html";
  });

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");

  const monacoRef = useRef<any>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Ensure required web files exist
  useEffect(() => {
    const needed: WebFile[] = ["index.html", "style.css", "script.js"];
    needed.forEach(name => {
      if (files[name] === undefined) updateFile(name, "");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEditorMount: OnMount = (_editor, monaco) => {
    monacoRef.current = monaco;
    monaco.editor.defineTheme("dracula", {
      base: "vs-dark", inherit: true,
      rules: [
        { token: "comment", foreground: "6272a4", fontStyle: "italic" },
        { token: "keyword", foreground: "ff79c6" },
        { token: "string", foreground: "f1fa8c" },
        { token: "number", foreground: "bd93f9" },
        { token: "type", foreground: "8be9fd", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#282a36", "editor.foreground": "#f8f8f2",
        "editorLineNumber.foreground": "#6272a4", "editor.selectionBackground": "#44475a",
        "editor.lineHighlightBackground": "#44475a50",
      },
    });
    monaco.editor.defineTheme("monokai", {
      base: "vs-dark", inherit: true,
      rules: [
        { token: "comment", foreground: "75715E", fontStyle: "italic" },
        { token: "keyword", foreground: "F92672" },
        { token: "string", foreground: "E6DB74" },
        { token: "number", foreground: "AE81FF" },
        { token: "type", foreground: "66D9EF", fontStyle: "italic" },
      ],
      colors: {
        "editor.background": "#272822", "editor.foreground": "#F8F8F2",
        "editorLineNumber.foreground": "#75715E", "editor.selectionBackground": "#49483E",
        "editor.lineHighlightBackground": "#3E3D3250",
      },
    });
    monaco.editor.setTheme(getMonacoTheme(theme));
  };

  useEffect(() => {
    if (monacoRef.current) monacoRef.current.editor.setTheme(getMonacoTheme(theme));
  }, [theme]);

  // Debounced live preview
  useEffect(() => {
    const t = setTimeout(() => {
      setPreviewSrc(buildHtmlPreview(files, "html"));
    }, 350);
    return () => clearTimeout(t);
  }, [files]);

  const handleSave = useCallback(() => {
    saveNow();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [saveNow]);

  const handleShare = useCallback(() => {
    const id = generateProjectId();
    saveProject(id, files, effectiveLang);
    const url = `${window.location.origin}/editor/${effectiveLang}?project=${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [files, effectiveLang]);

  const handleExport = useCallback(async () => {
    const zip = new JSZip();
    (["index.html", "style.css", "script.js"] as WebFile[]).forEach(name => {
      zip.file(name, files[name] ?? "");
    });
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `web-project.zip`);
  }, [files]);

  const zoomIn = useCallback(() => updateSettings({ fontSize: Math.min(settings.fontSize + 2, 32) }), [settings.fontSize, updateSettings]);
  const zoomOut = useCallback(() => updateSettings({ fontSize: Math.max(settings.fontSize - 2, 10) }), [settings.fontSize, updateSettings]);
  const zoomReset = useCallback(() => updateSettings({ fontSize: 14 }), [updateSettings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.key === "s") { e.preventDefault(); handleSave(); }
      else if (ctrl && (e.key === "=" || e.key === "+")) { e.preventDefault(); zoomIn(); }
      else if (ctrl && e.key === "-") { e.preventDefault(); zoomOut(); }
      else if (ctrl && e.key === "0") { e.preventDefault(); zoomReset(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave, zoomIn, zoomOut, zoomReset]);

  const tabs = useMemo(() => ([
    { id: "index.html" as WebFile, label: "HTML", lang: "html" },
    { id: "style.css" as WebFile, label: "CSS", lang: "css" },
    { id: "script.js" as WebFile, label: "JS", lang: "javascript" },
  ]), []);

  const monacoLang = activeTab.endsWith(".html") ? "html"
    : activeTab.endsWith(".css") ? "css"
    : "javascript";

  const editorOptions = {
    fontSize: settings.fontSize,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    minimap: { enabled: false },
    padding: { top: 12, bottom: 12 },
    lineNumbers: "on" as const,
    scrollBeyondLastLine: false,
    wordWrap: "on" as const,
    tabSize: settings.tabSize,
    smoothScrolling: true,
  };

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <nav className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card/90 backdrop-blur-xl px-3">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate("/")} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold text-foreground">OneIDE</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {saved && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-primary animate-fade-in mr-2">
              <Save className="h-3 w-3" /> Saved
            </span>
          )}

          <button onClick={zoomOut} className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="hidden sm:inline text-[10px] text-muted-foreground w-7 text-center">{settings.fontSize}px</span>
          <button onClick={zoomIn} className="hidden sm:flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <div className="hidden sm:block mx-1 h-4 w-px bg-border" />

          <button onClick={handleExport} className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.97]" title="Download as ZIP">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.97]">
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Share2 className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
          </button>
          <button onClick={() => setSettingsOpen(true)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
            <Settings className="h-3.5 w-3.5" />
          </button>
          <ThemeSwitcher />

          {user && (
            <div className="relative ml-1" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2 py-1 text-[11px] text-foreground transition-colors hover:bg-secondary active:scale-[0.97]"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <User className="h-3 w-3" />
                </div>
                <span className="hidden lg:inline max-w-[100px] truncate">{user.name}</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1.5 z-50 w-52 rounded-lg border border-border bg-popover p-1 shadow-xl animate-in fade-in-0 zoom-in-95">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-medium text-foreground">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">Logged in as: {user.email}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setProfileOpen(false); navigate("/auth"); }}
                    className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Tabs (HTML | CSS | JS) — shown on all sizes */}
      <div className="flex shrink-0 border-b border-border bg-card">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 md:flex-none md:px-6 min-h-[44px] px-3 text-xs font-medium transition-colors ${
              activeTab === t.id
                ? "bg-background text-accent border-b-2 border-accent"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main: Desktop = editor | preview ; Mobile = editor / preview stacked */}
      <div className="flex flex-1 min-h-0 flex-col md:flex-row overflow-hidden">
        {/* Editor */}
        <div className="flex-1 min-h-0 md:w-1/2 md:border-r border-border overflow-hidden">
          <Editor
            height="100%"
            language={monacoLang}
            value={files[activeTab] ?? ""}
            onChange={v => updateFile(activeTab, v ?? "")}
            theme={getMonacoTheme(theme)}
            onMount={handleEditorMount}
            options={editorOptions}
          />
        </div>

        {/* Preview */}
        <div className="flex h-[280px] md:h-auto md:flex-1 shrink-0 md:w-1/2 flex-col border-t md:border-t-0 border-border">
          <div className="flex h-8 shrink-0 items-center border-b border-border bg-card px-3">
            <span className="text-[11px] font-medium text-muted-foreground">Live Preview</span>
          </div>
          <iframe
            title="preview"
            className="flex-1 bg-white w-full"
            sandbox="allow-scripts"
            srcDoc={previewSrc}
          />
        </div>
      </div>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onUpdate={updateSettings} />
    </div>
  );
};

export default EditorPage;
