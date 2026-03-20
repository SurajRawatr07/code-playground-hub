import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Terminal } from "@/components/Terminal";
import { FileExplorer } from "@/components/FileExplorer";
import { FileTabs } from "@/components/FileTabs";
import { SettingsModal } from "@/components/SettingsModal";
import { languages } from "@/lib/languages";
import { executeCode, buildHtmlPreview } from "@/lib/executor";
import { useFileSystem, useEditorSettings, generateProjectId, saveProject } from "@/hooks/useFileSystem";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft, Code2, Play, Loader2, Settings, Share2, Check,
  PanelLeftClose, PanelLeft, PanelBottomClose, PanelBottom,
} from "lucide-react";

const EditorPage = () => {
  const { langId } = useParams<{ langId: string }>();
  const navigate = useNavigate();
  const { isDark } = useTheme();
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isWebLang = langId === "html" || langId === "css" || langId === "react";
  const monacoLang = activeFile.endsWith(".html") ? "html"
    : activeFile.endsWith(".css") ? "css"
    : activeFile.endsWith(".js") || activeFile.endsWith(".jsx") ? "javascript"
    : activeFile.endsWith(".py") ? "python"
    : activeFile.endsWith(".java") ? "java"
    : activeFile.endsWith(".sql") ? "sql"
    : lang?.monacoLang || "plaintext";

  const handleRun = useCallback(async () => {
    setRunning(true);
    setOutput("");
    setErrorOutput("");
    setShowPreview(false);
    setTerminalOpen(true);
    saveNow();

    if (isWebLang) {
      setShowPreview(true);
      setTimeout(() => {
        if (iframeRef.current) {
          const doc = iframeRef.current.contentDocument;
          if (doc) {
            doc.open();
            doc.write(buildHtmlPreview(files, langId!));
            doc.close();
          }
        }
        setOutput("✅ Preview rendered successfully");
        setRunning(false);
      }, 500);
      return;
    }

    const result = await executeCode(langId!, files[activeFile] || "", files);
    setOutput(result.output);
    setErrorOutput(result.error);
    setRunning(false);
  }, [files, activeFile, langId, isWebLang, saveNow]);

  const handleShare = useCallback(() => {
    const id = generateProjectId();
    saveProject(id, files, langId!);
    const url = `${window.location.origin}/editor/${langId}?project=${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [files, langId]);

  const handleClear = useCallback(() => {
    setOutput("");
    setErrorOutput("");
    setShowPreview(false);
  }, []);

  if (!lang) {
    navigate("/");
    return null;
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top Bar */}
      <nav className="flex h-11 shrink-0 items-center justify-between border-b border-border bg-card/90 backdrop-blur-xl px-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/")}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeft className="h-3.5 w-3.5" />}
          </button>
          <div className="mx-1 h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <Code2 className="h-3.5 w-3.5 text-accent" />
            <span className="text-xs font-semibold text-foreground">{lang.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-[0.97]"
          >
            {copied ? <Check className="h-3 w-3 text-primary" /> : <Share2 className="h-3 w-3" />}
            {copied ? "Copied!" : "Share"}
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-1 text-[11px] font-semibold text-primary-foreground transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
            {running ? "Running..." : "Run"}
          </button>
          <button
            onClick={() => setTerminalOpen(o => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
            title={terminalOpen ? "Hide terminal" : "Show terminal"}
          >
            {terminalOpen ? <PanelBottomClose className="h-3.5 w-3.5" /> : <PanelBottom className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
          >
            <Settings className="h-3.5 w-3.5" />
          </button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-52 shrink-0">
            <FileExplorer
              files={files}
              activeFile={activeFile}
              onSelect={openFile}
              onCreate={createFile}
              onDelete={deleteFile}
              onRename={renameFile}
            />
          </div>
        )}

        {/* Editor + Terminal/Preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* File Tabs */}
          <FileTabs
            openFiles={openFiles}
            activeFile={activeFile}
            onSelect={openFile}
            onClose={closeFile}
          />

          {/* Content Area */}
          <div className="flex flex-1 overflow-hidden">
            {/* Editor */}
            <div className={`flex flex-col overflow-hidden ${showPreview && isWebLang ? "w-1/2 border-r border-border" : "flex-1"}`}>
              <Editor
                height="100%"
                language={monacoLang}
                value={files[activeFile] || ""}
                onChange={v => updateFile(activeFile, v ?? "")}
                theme={isDark ? "vs-dark" : "light"}
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

            {/* Live Preview */}
            {showPreview && isWebLang && (
              <div className="flex w-1/2 flex-col">
                <div className="flex h-8 shrink-0 items-center border-b border-border bg-card px-3">
                  <span className="text-[11px] font-medium text-muted-foreground">Preview</span>
                </div>
                <iframe
                  ref={iframeRef}
                  title="preview"
                  className="flex-1 bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            )}
          </div>

          {/* Terminal */}
          {terminalOpen && (
            <div className={`shrink-0 border-t border-border p-2 ${showPreview && isWebLang ? "h-36" : "h-56"}`}>
              <Terminal output={output} errorOutput={errorOutput} onClear={handleClear} />
            </div>
          )}
        </div>
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onUpdate={updateSettings}
      />
    </div>
  );
};

export default EditorPage;
