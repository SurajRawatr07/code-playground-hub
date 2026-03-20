export interface Language {
  id: string;
  name: string;
  icon: string;
  color: string;
  monacoLang: string;
  placeholder: string;
}

export const languages: Language[] = [
  {
    id: "html",
    name: "HTML",
    icon: "🌐",
    color: "hsl(16 85% 57%)",
    monacoLang: "html",
    placeholder: `<!DOCTYPE html>
<html>
<head>
  <title>Hello World</title>
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #1a1a2e;
      color: #eee;
    }
    h1 { color: #e94560; }
  </style>
</head>
<body>
  <h1>Hello, World! 🚀</h1>
</body>
</html>`,
  },
  {
    id: "css",
    name: "CSS",
    icon: "🎨",
    color: "hsl(204 85% 55%)",
    monacoLang: "css",
    placeholder: `/* Modern CSS Demo */
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  font-family: system-ui;
}

.card {
  padding: 2rem 3rem;
  border-radius: 1rem;
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  font-size: 1.5rem;
}`,
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "⚡",
    color: "hsl(50 90% 50%)",
    monacoLang: "javascript",
    placeholder: `// JavaScript Playground
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

for (let i = 0; i < 10; i++) {
  console.log(\`fib(\${i}) = \${fibonacci(i)}\`);
}

console.log("\\n✨ Done!");`,
  },
  {
    id: "python",
    name: "Python",
    icon: "🐍",
    color: "hsl(210 60% 50%)",
    monacoLang: "python",
    placeholder: `# Python Playground (Simulated)
def greet(name):
    return f"Hello, {name}! 👋"

names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(greet(name))

print("\\n✨ Program executed successfully!")`,
  },
  {
    id: "cpp",
    name: "C++",
    icon: "⚙️",
    color: "hsl(210 70% 45%)",
    monacoLang: "cpp",
    placeholder: `// C++ Playground (Simulated)
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<string> langs = {"C++", "Rust", "Go"};
    
    for (const auto& lang : langs) {
        cout << "Hello from " << lang << "!" << endl;
    }
    
    return 0;
}`,
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "hsl(15 80% 50%)",
    monacoLang: "java",
    placeholder: `// Java Playground (Simulated)
public class Main {
    public static void main(String[] args) {
        String[] greetings = {"Hello", "Hola", "Bonjour"};
        
        for (String greeting : greetings) {
            System.out.println(greeting + ", World! 🌍");
        }
    }
}`,
  },
];
