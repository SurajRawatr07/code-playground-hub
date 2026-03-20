export interface ExecutionResult {
  output: string;
  isError: boolean;
}

export async function executeCode(languageId: string, code: string): Promise<ExecutionResult> {
  await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

  if (languageId === "javascript" || languageId === "nodejs") {
    return executeJavaScript(code);
  }

  if (languageId === "html" || languageId === "css") {
    return { output: "Preview rendered in iframe →", isError: false };
  }

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
    c: `Hello from C!\nCount: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5\n\n✅ Process exited with code 0`,
    csharp: `Hello from C#! 🎯\nIteration 1\nIteration 2\nIteration 3\n\n✅ Build successful`,
    php: `Hello from PHP! 🐘\nFruit: Apple\nFruit: Banana\nFruit: Cherry\n\n✅ Execution complete`,
    ruby: `Hello from Ruby! 💎\nIteration 1\nIteration 2\nIteration 3\n\n✅ Done`,
    lua: `Hello from Lua! 🌙\nCount: 1\nCount: 2\nCount: 3\nCount: 4\nCount: 5\n\n✅ Done`,
    assembly: `Program executed successfully\n\n✅ Process exited with code 0`,
    mysql: `+----+-------+--------+\n| id | name  | active |\n+----+-------+--------+\n|  1 | Alice |      1 |\n|  2 | Bob   |      1 |\n+----+-------+--------+\n2 rows in set (0.01 sec)`,
    postgresql: `  name   | age\n---------+-----\n Alice   |  28\n Bob     |  32\n Carol   |  25\n(3 rows)`,
    mongodb: `{ acknowledged: true, insertedId: ObjectId("...") }\n\n✅ Query executed`,
    plsql: `Hello, World!\n\nPL/SQL procedure successfully completed.`,
    react: `Compiled successfully!\n\n✅ App rendered at localhost:3000`,
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
