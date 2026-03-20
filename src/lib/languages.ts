export interface Language {
  id: string;
  name: string;
  icon: string;
  color: string;
  monacoLang: string;
  category: string;
  placeholder: string;
}

export const categories = ["Popular", "Programming", "Web", "Databases"] as const;

export const languages: Language[] = [
  {
    id: "html",
    name: "HTML",
    icon: "🌐",
    color: "hsl(16 85% 57%)",
    monacoLang: "html",
    category: "Web",
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
    category: "Web",
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
    category: "Popular",
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
    category: "Popular",
    placeholder: `# Python Playground (Simulated)
def greet(name):
    return f"Hello, {name}! 👋"

names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(greet(name))

print("\\n✨ Program executed successfully!")`,
  },
  {
    id: "java",
    name: "Java",
    icon: "☕",
    color: "hsl(15 80% 50%)",
    monacoLang: "java",
    category: "Popular",
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
  {
    id: "cpp",
    name: "C++",
    icon: "⚙️",
    color: "hsl(210 70% 45%)",
    monacoLang: "cpp",
    category: "Programming",
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
    id: "c",
    name: "C",
    icon: "🔧",
    color: "hsl(220 50% 50%)",
    monacoLang: "c",
    category: "Programming",
    placeholder: `// C Playground (Simulated)
#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    for (int i = 1; i <= 5; i++) {
        printf("Count: %d\\n", i);
    }
    return 0;
}`,
  },
  {
    id: "csharp",
    name: "C#",
    icon: "🎯",
    color: "hsl(270 60% 50%)",
    monacoLang: "csharp",
    category: "Programming",
    placeholder: `// C# Playground (Simulated)
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello from C#! 🎯");
        for (int i = 0; i < 3; i++) {
            Console.WriteLine($"Iteration {i + 1}");
        }
    }
}`,
  },
  {
    id: "php",
    name: "PHP",
    icon: "🐘",
    color: "hsl(240 40% 55%)",
    monacoLang: "php",
    category: "Web",
    placeholder: `<?php
// PHP Playground (Simulated)
echo "Hello from PHP! 🐘\\n";

$fruits = ["Apple", "Banana", "Cherry"];
foreach ($fruits as $fruit) {
    echo "Fruit: $fruit\\n";
}
?>`,
  },
  {
    id: "ruby",
    name: "Ruby",
    icon: "💎",
    color: "hsl(0 65% 50%)",
    monacoLang: "ruby",
    category: "Programming",
    placeholder: `# Ruby Playground (Simulated)
puts "Hello from Ruby! 💎"

3.times do |i|
  puts "Iteration #{i + 1}"
end`,
  },
  {
    id: "nodejs",
    name: "NodeJS",
    icon: "🟢",
    color: "hsl(120 50% 40%)",
    monacoLang: "javascript",
    category: "Web",
    placeholder: `// NodeJS Playground (Simulated)
const http = require('http');

console.log("Starting server...");
console.log("Server running at http://localhost:3000");
console.log("Hello from NodeJS! 🟢");`,
  },
  {
    id: "react",
    name: "React",
    icon: "⚛️",
    color: "hsl(193 80% 55%)",
    monacoLang: "javascript",
    category: "Web",
    placeholder: `// React Playground (Simulated)
function App() {
  return (
    <div>
      <h1>Hello React! ⚛️</h1>
      <p>Building UIs is fun.</p>
    </div>
  );
}`,
  },
  {
    id: "lua",
    name: "Lua",
    icon: "🌙",
    color: "hsl(240 60% 55%)",
    monacoLang: "lua",
    category: "Programming",
    placeholder: `-- Lua Playground (Simulated)
print("Hello from Lua! 🌙")

for i = 1, 5 do
  print("Count: " .. i)
end`,
  },
  {
    id: "assembly",
    name: "Assembly",
    icon: "🔩",
    color: "hsl(0 0% 50%)",
    monacoLang: "plaintext",
    category: "Programming",
    placeholder: `; Assembly Playground (Simulated)
section .text
global _start

_start:
    mov eax, 4
    mov ebx, 1
    mov ecx, msg
    int 0x80`,
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: "🗄️",
    color: "hsl(200 70% 45%)",
    monacoLang: "sql",
    category: "Databases",
    placeholder: `-- MySQL Playground (Simulated)
SELECT * FROM users WHERE active = 1;

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  price DECIMAL(10,2)
);`,
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: "🐘",
    color: "hsl(210 55% 45%)",
    monacoLang: "sql",
    category: "Databases",
    placeholder: `-- PostgreSQL Playground (Simulated)
SELECT name, age FROM employees
WHERE department = 'Engineering'
ORDER BY name ASC;`,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: "🍃",
    color: "hsl(140 55% 40%)",
    monacoLang: "javascript",
    category: "Databases",
    placeholder: `// MongoDB Playground (Simulated)
db.users.find({ active: true })

db.products.insertOne({
  name: "Widget",
  price: 29.99,
  category: "Tools"
})`,
  },
  {
    id: "plsql",
    name: "PL/SQL",
    icon: "📊",
    color: "hsl(10 60% 50%)",
    monacoLang: "sql",
    category: "Databases",
    placeholder: `-- PL/SQL Playground (Simulated)
DECLARE
  v_name VARCHAR2(50) := 'World';
BEGIN
  DBMS_OUTPUT.PUT_LINE('Hello, ' || v_name || '!');
END;`,
  },
];
