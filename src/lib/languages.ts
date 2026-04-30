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

/** CDN base for devicon SVGs */
const devicon = (slug: string) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${slug}`;

export const languages: Language[] = [
  {
    id: "html",
    name: "HTML",
    icon: devicon("html5/html5-original.svg"),
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
  <h1>Hello, World!</h1>
</body>
</html>`,
  },
  {
    id: "css",
    name: "CSS",
    icon: devicon("css3/css3-original.svg"),
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
    icon: devicon("javascript/javascript-original.svg"),
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

console.log("\\nDone!");`,
  },
  {
    id: "python",
    name: "Python",
    icon: devicon("python/python-original.svg"),
    color: "hsl(210 60% 50%)",
    monacoLang: "python",
    category: "Popular",
    placeholder: `# Python Playground (Simulated)
def greet(name):
    return f"Hello, {name}!"

names = ["Alice", "Bob", "Charlie"]
for name in names:
    print(greet(name))

print("\\nProgram executed successfully!")`,
  },
  {
    id: "java",
    name: "Java",
    icon: devicon("java/java-original.svg"),
    color: "hsl(15 80% 50%)",
    monacoLang: "java",
    category: "Popular",
    placeholder: `// Java Playground (Simulated)
public class Main {
    public static void main(String[] args) {
        String[] greetings = {"Hello", "Hola", "Bonjour"};
        for (String greeting : greetings) {
            System.out.println(greeting + ", World!");
        }
    }
}`,
  },
  {
    id: "c",
    name: "C",
    icon: devicon("c/c-original.svg"),
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
    id: "cpp",
    name: "C++",
    icon: devicon("cplusplus/cplusplus-original.svg"),
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
    id: "php",
    name: "PHP",
    icon: devicon("php/php-original.svg"),
    color: "hsl(240 40% 55%)",
    monacoLang: "php",
    category: "Web",
    placeholder: `<?php
// PHP Playground (Simulated)
echo "Hello from PHP!\\n";

$fruits = ["Apple", "Banana", "Cherry"];
foreach ($fruits as $fruit) {
    echo "Fruit: $fruit\\n";
}
?>`,
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: devicon("nodejs/nodejs-original.svg"),
    color: "hsl(120 50% 40%)",
    monacoLang: "javascript",
    category: "Web",
    placeholder: `// Node.js Playground (Simulated)
const http = require('http');

console.log("Starting server...");
console.log("Server running at http://localhost:3000");
console.log("Hello from Node.js!");`,
  },
  {
    id: "react",
    name: "React",
    icon: devicon("react/react-original.svg"),
    color: "hsl(193 80% 55%)",
    monacoLang: "javascript",
    category: "Web",
    placeholder: `// React Playground (Simulated)
function App() {
  return (
    <div>
      <h1>Hello React!</h1>
      <p>Building UIs is fun.</p>
    </div>
  );
}`,
  },
  {
    id: "sql",
    name: "SQL",
    icon: devicon("mysql/mysql-original.svg"),
    color: "hsl(200 70% 45%)",
    monacoLang: "sql",
    category: "Databases",
    placeholder: `-- SQL Playground (Simulated)
SELECT * FROM users WHERE active = 1;

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  price DECIMAL(10,2)
);`,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    icon: devicon("mongodb/mongodb-original.svg"),
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
];
