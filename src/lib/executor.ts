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

const ERROR_OVERLAY = `
<script>
(function(){
  function showError(msg){
    try {
      var existing = document.getElementById('__preview_error__');
      if (existing) existing.remove();
      var div = document.createElement('div');
      div.id = '__preview_error__';
      div.style.cssText = 'position:fixed;left:0;right:0;bottom:0;padding:10px 14px;background:rgba(220,38,38,0.95);color:#fff;font:12px/1.4 system-ui,sans-serif;z-index:2147483647;white-space:pre-wrap;max-height:40%;overflow:auto;';
      div.textContent = 'Preview Error: ' + msg;
      (document.body || document.documentElement).appendChild(div);
    } catch(e) {}
  }
  window.addEventListener('error', function(e){ showError(e.message || String(e.error || e)); });
  window.addEventListener('unhandledrejection', function(e){ showError(String(e.reason)); });
})();
<\/script>`;

function stripExternalLocalRefs(html: string): string {
  // Remove <link rel="stylesheet" href="style.css"> and <script src="script.js"></script> style refs to local files (we inline them)
  return html
    .replace(/<link[^>]+href=["'](?:\.\/)?(?:style\.css|styles\.css|main\.css)["'][^>]*>/gi, "")
    .replace(/<script[^>]+src=["'](?:\.\/)?(?:script\.js|main\.js|index\.js|app\.js)["'][^>]*><\/script>/gi, "");
}

export function buildHtmlPreview(files: ProjectFiles, languageId: string): string {
  if (!(languageId === "html" || languageId === "css" || languageId === "javascript")) {
    return "";
  }

  const html = files["index.html"] || "";
  const css =
    files["style.css"] ||
    files["styles.css"] ||
    files["main.css"] ||
    (languageId === "css" ? Object.values(files).find((_, i) => Object.keys(files)[i].endsWith(".css")) || "" : "");
  const js =
    files["script.js"] ||
    files["main.js"] ||
    files["index.js"] ||
    files["app.js"] ||
    (languageId === "javascript" ? Object.values(files).find((_, i) => Object.keys(files)[i].endsWith(".js")) || "" : "");

  const styleTag = css ? `<style>${css}</style>` : "";
  const scriptTag = js ? `<script>\ntry {\n${js}\n} catch (e) { (window.onerror||function(){})(e.message); throw e; }\n<\/script>` : "";

  if (html && html.trim()) {
    let result = stripExternalLocalRefs(html);
    // Inject CSS into head
    if (styleTag) {
      result = result.includes("</head>")
        ? result.replace("</head>", `${styleTag}</head>`)
        : `<head>${styleTag}</head>` + result;
    }
    // Inject error overlay + JS before </body>
    const tail = `${ERROR_OVERLAY}${scriptTag}`;
    result = result.includes("</body>")
      ? result.replace("</body>", `${tail}</body>`)
      : result + tail;
    return result;
  }

  // No HTML file — synthesize a document
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${styleTag}</head><body>${
    languageId === "css" ? '<div class="card">CSS Preview ✨</div>' : ""
  }${ERROR_OVERLAY}${scriptTag}</body></html>`;
}
