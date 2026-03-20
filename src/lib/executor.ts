import type { ProjectFiles } from "@/hooks/useFileSystem";

export interface ExecutionResult {
  output: string;
  error: string;
}

export async function executeCode(languageId: string, code: string, files?: ProjectFiles): Promise<ExecutionResult> {
  await new Promise(r => setTimeout(r, 600 + Math.random() * 500));

  if (languageId === "javascript" || languageId === "nodejs") {
    return executeJavaScript(code);
  }

  if (languageId === "html" || languageId === "css" || languageId === "react") {
    return { output: "✅ Preview rendered successfully", error: "" };
  }

  return simulateExecution(languageId, code);
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

function simulateExecution(languageId: string, code: string): ExecutionResult {
  if (!code.trim()) {
    return { output: "", error: "⚠️ No code to execute" };
  }

  const outputs: Record<string, string> = {
    python: "Hello, Alice! 👋\nHello, Bob! 👋\nHello, Charlie! 👋\n\n✨ Program executed successfully!",
    cpp: "Hello from C++!\n\n✅ Process exited with code 0",
    java: "Hello, World! 🌍\n\n✅ Build successful",
    c: "Hello from C!\nCount: 1\nCount: 2\nCount: 3\n\n✅ Process exited with code 0",
    csharp: "Hello from C#! 🎯\nIteration 1\nIteration 2\n\n✅ Build successful",
    php: "Hello from PHP! 🐘\nFruit: Apple\nFruit: Banana\n\n✅ Execution complete",
    ruby: "Hello from Ruby! 💎\n\n✅ Done",
    lua: "Hello from Lua! 🌙\nCount: 1\nCount: 2\nCount: 3\n\n✅ Done",
    assembly: "Program executed successfully\n\n✅ Process exited with code 0",
    mysql: "+----+-------+--------+\n| id | name  | active |\n+----+-------+--------+\n|  1 | Alice |      1 |\n|  2 | Bob   |      1 |\n+----+-------+--------+\n2 rows in set (0.01 sec)",
    postgresql: "  name   | age\n---------+-----\n Alice   |  28\n Bob     |  32\n(2 rows)",
    mongodb: '{ acknowledged: true, insertedId: ObjectId("...") }\n\n✅ Query executed',
    plsql: "Hello, World!\n\nPL/SQL procedure successfully completed.",
  };

  return { output: outputs[languageId] || "✅ Program executed successfully", error: "" };
}

export function buildHtmlPreview(files: ProjectFiles, languageId: string): string {
  if (languageId === "html" || languageId === "css") {
    const html = files["index.html"] || "";
    const css = files["style.css"] || "";
    const js = files["script.js"] || "";

    if (html) {
      // Inject CSS and JS into the HTML
      let result = html;
      if (css && !result.includes("<link")) {
        result = result.replace("</head>", `<style>${css}</style></head>`);
      } else if (css) {
        result = result.replace(/<link[^>]*style\.css[^>]*>/, `<style>${css}</style>`);
      }
      if (js && !result.includes("<script")) {
        result = result.replace("</body>", `<script>${js}</script></body>`);
      } else if (js) {
        result = result.replace(/<script[^>]*script\.js[^>]*><\/script>/, `<script>${js}</script>`);
      }
      return result;
    }

    if (css) {
      return `<!DOCTYPE html><html><head><style>${css}</style></head><body><div class="card">CSS Preview ✨</div></body></html>`;
    }
  }

  if (languageId === "react") {
    const appCode = files["App.jsx"] || Object.values(files)[0] || "";
    return `<!DOCTYPE html><html><head>
<script src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head><body><div id="root"></div>
<script type="text/babel">${appCode}</script></body></html>`;
  }

  return "";
}
