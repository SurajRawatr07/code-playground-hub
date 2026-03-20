export interface ExecutionResult {
  output: string;
  isError: boolean;
}

export async function executeCode(languageId: string, code: string): Promise<ExecutionResult> {
  // Simulate delay
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  if (languageId === "javascript") {
    return executeJavaScript(code);
  }

  if (languageId === "html" || languageId === "css") {
    return { output: "Preview rendered in iframe →", isError: false };
  }

  // Simulated languages
  return simulateExecution(languageId, code);
}

function executeJavaScript(code: string): ExecutionResult {
  const logs: string[] = [];
  const fakeConsole = {
    log: (...args: unknown[]) => logs.push(args.map(String).join(" ")),
    error: (...args: unknown[]) => logs.push("Error: " + args.map(String).join(" ")),
    warn: (...args: unknown[]) => logs.push("Warning: " + args.map(String).join(" ")),
  };

  try {
    const fn = new Function("console", code);
    fn(fakeConsole);
    return { output: logs.join("\n") || "✅ Code executed (no output)", isError: false };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { output: `❌ ${msg}`, isError: true };
  }
}

function simulateExecution(languageId: string, code: string): ExecutionResult {
  if (!code.trim()) {
    return { output: "⚠️ No code to execute", isError: true };
  }

  const outputs: Record<string, string> = {
    python: `Hello, Alice! 👋\nHello, Bob! 👋\nHello, Charlie! 👋\n\n✨ Program executed successfully!`,
    cpp: `Hello from C++!\nHello from Rust!\nHello from Go!\n\n✅ Process exited with code 0`,
    java: `Hello, World! 🌍\nHola, World! 🌍\nBonjour, World! 🌍\n\n✅ Build successful`,
  };

  return { output: outputs[languageId] || "✅ Program executed successfully", isError: false };
}

export function buildHtmlPreview(code: string, languageId: string): string {
  if (languageId === "html") return code;
  if (languageId === "css") {
    return `<!DOCTYPE html><html><head><style>${code}</style></head><body><div class="card">CSS Preview ✨</div></body></html>`;
  }
  return "";
}
