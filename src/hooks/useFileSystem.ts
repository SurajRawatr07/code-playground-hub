import { useState, useCallback, useEffect, useRef } from "react";

export interface ProjectFiles {
  [filename: string]: string;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: "dark" | "light";
}

const DEFAULT_SETTINGS: EditorSettings = { fontSize: 14, tabSize: 2, theme: "dark" };

function getDefaultFiles(langId: string): ProjectFiles {
  const defaults: Record<string, ProjectFiles> = {
    html: {
      "index.html": '<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello World</h1>\n  <script src="script.js"></script>\n</body>\n</html>',
      "style.css": "body {\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n  background: #1a1a2e;\n  color: #e0e0e0;\n}\n\nh1 {\n  font-size: 3rem;\n}",
      "script.js": 'console.log("Hello from script.js!");',
    },
    css: {
      "style.css": "body {\n  margin: 0;\n  background: linear-gradient(135deg, #667eea, #764ba2);\n  min-height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.card {\n  background: white;\n  padding: 2rem 3rem;\n  border-radius: 16px;\n  box-shadow: 0 20px 60px rgba(0,0,0,0.3);\n  font-family: sans-serif;\n  font-size: 1.5rem;\n  color: #333;\n}",
      "index.html": '<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div class="card">CSS Preview ✨</div>\n</body>\n</html>',
    },
    react: {
      "App.jsx": 'function App() {\n  const [count, setCount] = React.useState(0);\n  return (\n    <div style={{textAlign:"center", padding:"2rem"}}>\n      <h1>React Counter</h1>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c+1)}>Increment</button>\n    </div>\n  );\n}\n\nReactDOM.render(<App />, document.getElementById("root"));',
    },
  };
  return defaults[langId] || { ["main." + getExtension(langId)]: "" };
}

function getExtension(langId: string): string {
  const map: Record<string, string> = {
    javascript: "js", nodejs: "js", python: "py", cpp: "cpp", java: "java",
    c: "c", php: "php", mongodb: "js", sql: "sql",
    html: "html", css: "css", react: "jsx",
  };
  return map[langId] || "txt";
}

function storageKey(langId: string, projectId?: string) {
  return projectId ? `project-${projectId}` : `ide-files-${langId}`;
}

export function useFileSystem(langId: string, projectId?: string) {
  const [files, setFiles] = useState<ProjectFiles>(() => {
    const saved = localStorage.getItem(storageKey(langId, projectId));
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return getDefaultFiles(langId);
  });

  const [activeFile, setActiveFile] = useState<string>(() => Object.keys(files)[0] || "");
  const [openFiles, setOpenFiles] = useState<string[]>(() => {
    const keys = Object.keys(files);
    return keys.slice(0, 4);
  });

  const autoSaveTimer = useRef<ReturnType<typeof setInterval>>();

  // Auto-save every 3 seconds
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      localStorage.setItem(storageKey(langId, projectId), JSON.stringify(files));
    }, 3000);
    return () => clearInterval(autoSaveTimer.current);
  }, [files, langId, projectId]);

  const saveNow = useCallback(() => {
    localStorage.setItem(storageKey(langId, projectId), JSON.stringify(files));
  }, [files, langId, projectId]);

  const createFile = useCallback((name: string) => {
    if (files[name]) return false;
    setFiles(prev => ({ ...prev, [name]: "" }));
    setOpenFiles(prev => prev.includes(name) ? prev : [...prev, name]);
    setActiveFile(name);
    return true;
  }, [files]);

  const deleteFile = useCallback((name: string) => {
    setFiles(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
    setOpenFiles(prev => prev.filter(f => f !== name));
    setActiveFile(prev => prev === name ? Object.keys(files).find(f => f !== name) || "" : prev);
  }, [files]);

  const renameFile = useCallback((oldName: string, newName: string) => {
    if (files[newName] || !files[oldName]) return false;
    setFiles(prev => {
      const next: ProjectFiles = {};
      for (const [k, v] of Object.entries(prev)) {
        next[k === oldName ? newName : k] = v;
      }
      return next;
    });
    setOpenFiles(prev => prev.map(f => f === oldName ? newName : f));
    setActiveFile(prev => prev === oldName ? newName : prev);
    return true;
  }, [files]);

  const updateFile = useCallback((name: string, content: string) => {
    setFiles(prev => ({ ...prev, [name]: content }));
  }, []);

  const openFile = useCallback((name: string) => {
    if (!openFiles.includes(name)) {
      setOpenFiles(prev => [...prev, name]);
    }
    setActiveFile(name);
  }, [openFiles]);

  const closeFile = useCallback((name: string) => {
    setOpenFiles(prev => {
      const next = prev.filter(f => f !== name);
      if (activeFile === name) {
        setActiveFile(next[next.length - 1] || "");
      }
      return next;
    });
  }, [activeFile]);

  return {
    files, activeFile, openFiles,
    createFile, deleteFile, renameFile, updateFile,
    openFile, closeFile, setActiveFile, saveNow,
  };
}

export function useEditorSettings() {
  const [settings, setSettings] = useState<EditorSettings>(() => {
    const saved = localStorage.getItem("ide-settings");
    if (saved) try { return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }; } catch { /* */ }
    return DEFAULT_SETTINGS;
  });

  const update = useCallback((partial: Partial<EditorSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      localStorage.setItem("ide-settings", JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings: update };
}

export function generateProjectId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

export function saveProject(projectId: string, files: ProjectFiles, langId: string) {
  localStorage.setItem(`project-${projectId}`, JSON.stringify(files));
  localStorage.setItem(`project-meta-${projectId}`, JSON.stringify({ langId, updatedAt: Date.now() }));
}

export function loadProject(projectId: string): { files: ProjectFiles; langId: string } | null {
  const files = localStorage.getItem(`project-${projectId}`);
  const meta = localStorage.getItem(`project-meta-${projectId}`);
  if (!files || !meta) return null;
  try {
    return { files: JSON.parse(files), langId: JSON.parse(meta).langId };
  } catch { return null; }
}
