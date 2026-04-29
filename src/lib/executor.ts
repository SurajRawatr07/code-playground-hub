import type { ProjectFiles } from "@/hooks/useFileSystem";

export interface ExecutionResult {
  output: string;
  error: string;
}

const SUPPORTED = new Set(["html", "css", "javascript"]);

export const UNSUPPORTED_MESSAGE = "Currently only HTML, CSS, and JavaScript are supported.";

export function isExecutable(languageId: string): boolean {
  return SUPPORTED.has(languageId);
}

export async function executeCode(languageId: string, code: string, _files?: ProjectFiles): Promise<ExecutionResult> {
  await new Promise(r => setTimeout(r, 300));

  if (languageId === "javascript") {
    return executeJavaScript(code);
  }

  if (languageId === "html" || languageId === "css") {
    return { output: "✅ Preview rendered successfully", error: "" };
  }

  return { output: "", error: `⚠️ ${UNSUPPORTED_MESSAGE}` };
}

function executeJavaScript(code: string): ExecutionResult {
  const logs: string[] = [];
  const errors: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
    error: (...args: unknown[]) => errors.push(args.map(String).join(" ")),
    warn: (...args: unknown[]) => logs.push("⚠ " + args.map(String).join(" ")),
    info: (...args: unknown[]) => logs.push("ℹ " + args.map(String).join(" ")),
  };

  try {
    const fn = new Function("console", code);
    fn(fakeConsole);
    return {
      output: logs.join("\n") || "✅ Code executed (no output)",
      error: errors.join("\n"),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { output: "", error: `❌ ${msg}` };
  }
}

export function buildHtmlPreview(files: ProjectFiles, languageId: string): string {
  if (languageId === "html" || languageId === "css" || languageId === "javascript") {
    const html = files["index.html"] || "";
    const css = files["style.css"] || "";
    const js =
      files["script.js"] ||
      files["main.js"] ||
      files["index.js"] ||
      (languageId === "javascript" ? Object.values(files)[0] || "" : "");

    if (html) {
      let result = html;
      if (css && !/<link[^>]*style\.css/i.test(result)) {
        result = result.includes("</head>")
          ? result.replace("</head>", `<style>${css}</style></head>`)
          : `<style>${css}</style>` + result;
      } else if (css) {
        result = result.replace(/<link[^>]*style\.css[^>]*>/i, `<style>${css}</style>`);
      }
      if (js && !/<script[^>]*script\.js/i.test(result)) {
        result = result.includes("</body>")
          ? result.replace("</body>", `<script>${js}<\/script></body>`)
          : result + `<script>${js}<\/script>`;
      } else if (js) {
        result = result.replace(/<script[^>]*script\.js[^>]*><\/script>/i, `<script>${js}<\/script>`);
      }
      return result;
    }

    if (css) {
      return `<!DOCTYPE html><html><head><style>${css}</style></head><body><div class="card">CSS Preview ✨</div></body></html>`;
    }

    if (js) {
      return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{font-family:system-ui;padding:1rem;background:#0b0b12;color:#e6e6e6;}</style></head><body><script>
        (function(){
          const _log = (cls, args) => {
            const p = document.createElement('div');
            p.className = cls;
            p.textContent = args.map(a => { try { return typeof a === 'object' ? JSON.stringify(a) : String(a); } catch(e){ return String(a); } }).join(' ');
            document.body.appendChild(p);
          };
          const c = console;
          console.log = (...a)=>{_log('log',a); c.log(...a);};
          console.error = (...a)=>{_log('err',a); c.error(...a);};
          console.warn = (...a)=>{_log('warn',a); c.warn(...a);};
          try { ${js} } catch(e){ _log('err',[e.message]); }
        })();
      <\/script></body></html>`;
    }
  }

  return "";
}
