import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Editor, { OnMount } from "@monaco-editor/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Terminal, HistoryEntry } from "@/components/Terminal";
import { FileExplorer } from "@/components/FileExplorer";
import { FileTabs } from "@/components/FileTabs";
import { StatusBar } from "@/components/StatusBar";
import { SettingsModal } from "@/components/SettingsModal";
import { CommandPalette, Command } from "@/components/CommandPalette";
import { useAuth } from "@/contexts/AuthContext";
import { languages } from "@/lib/languages";
import { executeCode, buildHtmlPreview, isExecutable, UNSUPPORTED_MESSAGE } from "@/lib/executor";
import { useFileSystem, useEditorSettings, generateProjectId, saveProject } from "@/hooks/useFileSystem";
import { useTheme, getMonacoTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft, Code2, Play, Square, Loader2, Settings, Share2, Check,
  PanelLeftClose, PanelLeft, PanelBottomClose, PanelBottom, Download,
  ZoomIn, ZoomOut, Save, User, LogOut, ChevronDown,
} from "lucide-react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

const EditorPage = () => {
  const { langId } = useParams<{ langId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const lang = languages.find(l => l.id === langId);

  const {
    files, activeFile, openFiles,
    createFile, deleteFile, renameFile, updateFile,
    openFile, closeFile, saveNow,
  } = useFileSystem(langId || "javascript");

  const { settings, updateSettings } = useEditorSettings();

  const [output, setOutput] = useState("");
  const [errorOutput, setErrorOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [previewSrc, setPreviewSrc] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const runIdRef = useRef(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const isWebLang = langId === "html" || langId === "css" || langId === "javascript";
  const canExecute = isExecutable(langId || "");
  const monacoLang = activeFile.endsWith(".html") ? "html"
    : activeFile.endsWith(".css") ? "css"
    : activeFile.endsWith(".js") || activeFile.endsWith(".jsx") ? "javascript"
    : activeFile.endsWith(".py") ? "python"
    : activeFile.endsWith(".java") ? "java"
    : activeFile.endsWith(".sql") ? "sql"
    : lang?.monacoLang || "plaintext";

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) setLangDropdownOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
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

  // Live preview auto-update for HTML/CSS/JS only
  useEffect(() => {
    if (!isWebLang) {
      setShowPreview(false);
      return;
    }
    const t = setTimeout(() => {
      const html = buildHtmlPreview(files, langId!);
      setPreviewSrc(html);
      setPreviewKey(k => k + 1);
      setShowPreview(true);
    }, 300);
    return () => clearTimeout(t);
  }, [files, isWebLang, langId]);

  const handleRun = useCallback(async () => {
    const myRunId = ++runIdRef.current;
    setRunning(true);
    setOutput("");
    setErrorOutput("");
    setShowPreview(false);
    setTerminalOpen(true);
    saveNow();

    if (!canExecute) {
      const msg = `⚠️ ${UNSUPPORTED_MESSAGE}`;
      if (myRunId !== runIdRef.current) return;
      setErrorOutput(msg);
      setHistory(prev => [{ id: Date.now(), timestamp: new Date(), output: "", error: msg }, ...prev].slice(0, 50));
      setRunning(false);
      return;
    }

    if (isWebLang) {
      const html = buildHtmlPreview(files, langId!);
      if (myRunId !== runIdRef.current) return;
      setPreviewSrc(html);
      setPreviewKey(k => k + 1);
      setShowPreview(true);
      setOutput("");
      return;
    }

    const result = await executeCode(langId!, files[activeFile] || "", files);
    if (myRunId !== runIdRef.current) return;
    setOutput(result.output);
    setErrorOutput(result.error);
    setHistory(prev => [{ id: Date.now(), timestamp: new Date(), output: result.output, error: result.error }, ...prev].slice(0, 50));

    if (result.error && editorRef.current && monacoRef.current) {
      const lineMatch = result.error.match(/line (\d+)/i);
      if (lineMatch) {
        const lineNum = parseInt(lineMatch[1]);
        editorRef.current.deltaDecorations([], [{
          range: new monacoRef.current.Range(lineNum, 1, lineNum, 1),
          options: { isWholeLine: true, className: "bg-destructive/20", glyphMarginClassName: "bg-destructive" },
        }]);
      }
    }
    setRunning(false);
  }, [files, activeFile, langId, isWebLang, canExecute, saveNow]);

  const handleSave = useCallback(() => {
    saveNow();
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }, [saveNow]);

  const handleStop = useCallback(() => {
    // Invalidate any in-flight run so its results are discarded.
    runIdRef.current++;
    setRunning(false);
    setShowPreview(false);
    setPreviewSrc("");
    setOutput("⏹ Run cancelled");
    setErrorOutput("");
  }, []);

  const handleShare = useCallback(() => {
    const id = generateProjectId();
    saveProject(id, files, langId!);
    const url = `${window.location.origin}/editor/${langId}?project=${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [files, langId]);

  const handleExport = useCallback(async () => {
    const zip = new JSZip();
    Object.entries(files).forEach(([name, content]) => zip.file(name, content));
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `${langId}-project.zip`);
  }, [files, langId]);

  const handleClear = useCallback(() => {
    setOutput("");
    setErrorOutput("");
    setShowPreview(false);
  }, []);

  const zoomIn = useCallback(() => updateSettings({ fontSize: Math.min(settings.fontSize + 2, 32) }), [settings.fontSize, updateSettings]);
  const zoomOut = useCallback(() => updateSettings({ fontSize: Math.max(settings.fontSize - 2, 10) }), [settings.fontSize, updateSettings]);
  const zoomReset = useCallback(() => updateSettings({ fontSize: 14 }), [updateSettings]);

  const commands: Command[] = useMemo(() => [
    { id: "run", label: "Run Code", shortcut: "Ctrl+Enter", action: handleRun },
    { id: "save", label: "Save Code", shortcut: "Ctrl+S", action: handleSave },
    { id: "clear", label: "Clear Terminal", action: handleClear },
    { id: "newfile", label: "Create New File", action: () => { const name = prompt("File name:"); if (name) createFile(name); } },
    { id: "settings", label: "Open Settings", action: () => setSettingsOpen(true) },
    { id: "sidebar", label: "Toggle Sidebar", shortcut: "Ctrl+B", action: () => setSidebarOpen(o => !o) },
    { id: "terminal", label: "Toggle Terminal", shortcut: "Ctrl+`", action: () => setTerminalOpen(o => !o) },
    { id: "export", label: "Export as ZIP", action: handleExport },
    { id: "share", label: "Share Project", action: handleShare },
    { id: "zoomin", label: "Zoom In", shortcut: "Ctrl++", action: zoomIn },
    { id: "zoomout", label: "Zoom Out", shortcut: "Ctrl+-", action: zoomOut },
    { id: "zoomreset", label: "Reset Zoom", shortcut: "Ctrl+0", action: zoomReset },
  ], [handleRun, handleSave, handleClear, createFile, handleExport, handleShare, zoomIn, zoomOut, zoomReset]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (ctrl && e.shiftKey && e.key === "P") { e.preventDefault(); setPaletteOpen(o => !o); return; }
      if (ctrl && e.key === "Enter") { e.preventDefault(); handleRun(); return; }
      if (ctrl && e.key === "s") { e.preventDefault(); handleSave(); return; }
      if (ctrl && e.key === "b") { e.preventDefault(); setSidebarOpen(o => !o); return; }
      if (ctrl && e.key === "`") { e.preventDefault(); setTerminalOpen(o => !o); return; }
      if (ctrl && (e.key === "=" || e.key === "+")) { e.preventDefault(); zoomIn(); return; }
      if (ctrl && e.key === "-") { e.preventDefault(); zoomOut(); return; }
      if (ctrl && e.key === "0") { e.preventDefault(); zoomReset(); return; }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRun, handleSave, zoomIn, zoomOut, zoomReset]);

  if (!lang) { navigate("/"); return null; }

  const lineCount = (files[activeFile] || "").split("\n").length;

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <nav className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card/90 backdrop-blur-xl px-3">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button onClick={() => setSidebarOpen(o => !o)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95" title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}>
            {sidebarOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeft className="h-3.5 w-3.5" />}
          </button>
          <div className="mx-1 h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-bold text-foreground">OneIDE</span>
          </div>

          {/* Language Selector */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(o => !o)}
              className="flex items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1 text-[11px] font-medium text-foreground transition-all hover:bg-secondary active:scale-[0.97]"
            >
              <img src={lang.icon} alt="" className="h-3.5 w-3.5" />
              {lang.name}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </button>
            {langDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 z-50 w-48 max-h-64 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-xl animate-in fade-in-0 zoom-in-95 terminal-scrollbar">
                {languages.map(l => (
                  <button
                    key={l.id}
                    onClick={() => { setLangDropdownOpen(false); navigate(`/editor/${l.id}`); }}
                    className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs transition-colors ${
                      l.id === langId ? "bg-accent/15 text-accent font-medium" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <img src={l.icon} alt="" className="h-4 w-4" />
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {saved && (
            <span className="flex items-center gap-1 text-[10px] text-primary animate-fade-in mr-2">
              <Save className="h-3 w-3" /> Saved
            </span>
          )}

          <button onClick={zoomOut} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-[10px] text-muted-foreground w-7 text-center">{settings.fontSize}px</span>
          <button onClick={zoomIn} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-border" />

          <button onClick={handleExport} className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.97]" title="Download as ZIP">
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.97]">
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Share2 className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1 text-[11px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
            title={running ? "A run is in progress" : "Run code (Ctrl+Enter)"}
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            {running ? "Running..." : "Run"}
          </button>
          {running && (
            <button
              onClick={handleStop}
              className="flex items-center gap-1.5 rounded-md bg-destructive px-2.5 py-1 text-[11px] font-semibold text-destructive-foreground transition-all hover:brightness-110 active:scale-[0.97] animate-fade-in"
              title="Stop run"
            >
              <Square className="h-3 w-3 fill-current" />
              Stop
            </button>
          )}
          <button onClick={() => setTerminalOpen(o => !o)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95" title={terminalOpen ? "Hide terminal" : "Show terminal"}>
            {terminalOpen ? <PanelBottomClose className="h-3.5 w-3.5" /> : <PanelBottom className="h-3.5 w-3.5" />}
          </button>
          <button onClick={() => setSettingsOpen(true)} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95">
            <Settings className="h-3.5 w-3.5" />
          </button>
          <ThemeSwitcher />

          {/* User Profile */}
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

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-52 shrink-0">
            <FileExplorer files={files} activeFile={activeFile} onSelect={openFile} onCreate={createFile} onDelete={deleteFile} onRename={renameFile} />
          </div>
        )}

        <div className="flex flex-1 flex-col overflow-hidden">
          <FileTabs openFiles={openFiles} activeFile={activeFile} onSelect={openFile} onClose={closeFile} />

          <ResizablePanelGroup direction="vertical" className="flex-1">
            <ResizablePanel defaultSize={terminalOpen ? 65 : 100} minSize={30}>
              <div className="flex h-full overflow-hidden">
                <div className={`flex flex-col overflow-hidden ${showPreview && isWebLang ? "w-1/2 border-r border-border" : "flex-1"}`}>
                  <Editor
                    height="100%"
                    language={monacoLang}
                    value={files[activeFile] || ""}
                    onChange={v => updateFile(activeFile, v ?? "")}
                    theme={getMonacoTheme(theme)}
                    onMount={handleEditorMount}
                    options={{
                      fontSize: settings.fontSize,
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                      minimap: { enabled: false },
                      padding: { top: 12, bottom: 12 },
                      lineNumbers: "on",
                      scrollBeyondLastLine: false,
                      wordWrap: "on",
                      tabSize: settings.tabSize,
                      renderWhitespace: "none",
                      smoothScrolling: true,
                      cursorBlinking: "smooth",
                      cursorSmoothCaretAnimation: "on",
                      bracketPairColorization: { enabled: true },
                      suggest: { showKeywords: true, showSnippets: true },
                    }}
                  />
                </div>

                {showPreview && isWebLang && (
                  <div className="flex w-1/2 flex-col">
                    <div className="flex h-8 shrink-0 items-center border-b border-border bg-card px-3">
                      <span className="text-[11px] font-medium text-muted-foreground">Preview</span>
                    </div>
                    <iframe
                      key={previewKey}
                      ref={iframeRef}
                      title="preview"
                      className="flex-1 bg-white"
                      sandbox="allow-scripts"
                      srcDoc={previewSrc}
                      onLoad={() => {
                        setRunning(false);
                        setHistory(prev => [{ id: Date.now(), timestamp: new Date(), output: "Preview updated", error: "" }, ...prev].slice(0, 50));
                      }}
                    />
                  </div>
                )}
              </div>
            </ResizablePanel>

            {terminalOpen && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={35} minSize={15} maxSize={60}>
                  <div className="h-full p-2">
                    <Terminal output={output} errorOutput={errorOutput} onClear={handleClear} history={history} />
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        language={lang.name}
        lineCount={lineCount}
        fontSize={settings.fontSize}
        tabSize={settings.tabSize}
        hasError={!!errorOutput}
      />

      <CommandPalette commands={commands} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} settings={settings} onUpdate={updateSettings} />
    </div>
  );
};

export default EditorPage;
