#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import { Command } from "commander";
import * as fs from "fs";

const program = new Command();

program.version("1.1.3").action(async () => {
  console.log(chalk.green("\n🚀 Welcome to the DEVI setup for REACT\n"));

  const { projectName }: { projectName: string } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input: string) => (input ? true : "Project name cannot be empty!"),
    },
  ]);

  try {
    console.log(chalk.blue(`\n📂 Creating project: ${projectName}...`));

    const { variant }: { variant: "react" | "react-ts" } = await inquirer.prompt([
      {
        type: "list",
        name: "variant",
        message: "Choose a variant:",
        choices: [
          { name: "JavaScript", value: "react" },
          { name: "TypeScript", value: "react-ts" },
        ],
      },
    ]);

    execSync(`npm create vite@latest ${projectName} -- --template ${variant}`, { stdio: "inherit" });

    process.chdir(projectName);

    console.log(chalk.blue("📦 Installing dependencies..."));
    execSync(`npm install`, { stdio: "inherit" });

    const { styleMode }: { styleMode: "tailwind" | "tailwind + shadcn" | "none" } = await inquirer.prompt([
      {
        type: "list",
        name: "styleMode",
        message: "Choose a Style mode:",
        choices: [
          { name: "tailwind CSS", value: "tailwind" },
          { name: "tailwind CSS + ShadCN UI", value: "tailwind + shadcn" },
          { name: "None", value: "none" },
        ],
      },
    ]);

    if (styleMode === "tailwind") {
      console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
      execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });

      if (fs.existsSync("tsconfig.json")) {
        console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
        execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
      }

      const viteConfig = fs.existsSync("vite.config.ts") ? "vite.config.ts" : "vite.config.js";
      console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));

      fs.writeFileSync(
        viteConfig,
        `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`
      );

      console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
      fs.writeFileSync("src/index.css", `@import 'tailwindcss';\n`);

      console.log(chalk.yellow("🧹 Removing default styles..."));
      try {
        fs.unlinkSync("src/App.css");
      } catch (err) {
        console.log(chalk.gray("No App.css found, skipping..."));
      }

      console.log(chalk.yellow("📝 Updating App component..."));
      const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
      fs.writeFileSync(
        appFile,
        `import { useState } from "react";
 
  export default function App() {
    const [showText, setShowText] = useState(false);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-center space-y-4">
        <h1 className="text-4xl text-purple-500">Welcome to Your New Project</h1>
        <button onClick={() => setShowText(true)} className="bg-blue-500 text-white px-4 py-2">
          Click Me
        </button>
        {showText && <h2 className="text-2xl text-green-400">Welcome to Devi Support</h2>}
      </div>
    );
  }
  `
      );

      console.log(chalk.green(`✅ Successfully set up ${projectName} with Vite, React & Tailwind!`));
    } else if (styleMode === "tailwind + shadcn") {
      console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
      execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });

      if (fs.existsSync("tsconfig.json")) {
        console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
        execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
      }

      const viteConfig = fs.existsSync("vite.config.ts") ? "vite.config.ts" : "vite.config.js";
      console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));

      fs.writeFileSync(
        viteConfig,
        `import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';
  import path from "path";
  
  export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  });
  `
      );

      const jsonConfig = fs.existsSync("tsconfig.json") ? "tsconfig.json" : "jsconfig.json";
      console.log(chalk.yellow(`\n⚙️ Configuring ${variant} with Tailwind plugin in ${jsonConfig}...`));

      const jsonConfigContent = fs.existsSync("tsconfig.json")
        ? `{
            "files": [],
            "references": [
              { "path": "./tsconfig.app.json" },
              { "path": "./tsconfig.node.json" }
            ],
            "compilerOptions": {
              "baseUrl": ".",
              "paths": { "@/*": ["./src/*"] }
            }
          }`
        : `{
            "include": ["src/**/*"],
            "compilerOptions": {
              "baseUrl": ".",
              "paths": { "@/*": ["./src/*"] }
            }
          }`;

      fs.writeFileSync(jsonConfig, jsonConfigContent);

      const appConfigFile = "tsconfig.app.json";
      if (fs.existsSync(appConfigFile)) {
        console.log(chalk.yellow(`\n⚙️ Configuring path aliases in ${appConfigFile}...`));

        try {
          let appConfigContent = fs.readFileSync(appConfigFile, "utf-8");

          appConfigContent = appConfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").trim();

          let appConfig = JSON.parse(appConfigContent);

          if (!appConfig.compilerOptions) {
            appConfig.compilerOptions = {};
          }

          appConfig.compilerOptions.baseUrl = ".";
          appConfig.compilerOptions.paths = { "@/*": ["./src/*"] };

          fs.writeFileSync(appConfigFile, JSON.stringify(appConfig, null, 2));

          console.log(chalk.green(`✅ Successfully updated ${appConfigFile} with path aliases!`));
        } catch (error: any) {
          console.error(chalk.red("❌ Error updating tsconfig:", error.message));
        }
      }

      console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
      fs.writeFileSync("src/index.css", `@import 'tailwindcss';\n`);

      console.log(chalk.yellow("🧹 Removing default styles..."));
      try {
        fs.unlinkSync("src/App.css");
      } catch (err) {
        console.log(chalk.gray("No App.css found, skipping..."));
      }

      console.log(chalk.blue("🛠 Installing ShadCN UI..."));
      execSync(`npx shadcn@latest init`, { stdio: "inherit" });

      console.log(chalk.blue("📦 Installing ShadCN components..."));
      execSync(`npx shadcn@latest add button`, { stdio: "inherit" });

      console.log(chalk.yellow("📝 Updating App component..."));
      const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
      fs.writeFileSync(
        appFile,
        `import { useState } from "react";
  import { Button } from "@/components/ui/button";
  
  export default function App() {
    const [showText, setShowText] = useState(false);
  
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-center space-y-4">
        <h1 className="text-4xl text-purple-500">Welcome to Your New Project</h1>
        <Button onClick={() => setShowText(true)} className="bg-blue-500 text-white px-4 py-2">
          Click Me
        </Button>
        {showText && <h2 className="text-2xl text-green-400">Welcome to Devi Support</h2>}
      </div>
    );
  }
  `
      );

      console.log(chalk.green(`✅ Successfully set up ${projectName} with Vite, React & Tailwind!`));
    } else {
      console.log(chalk.green(`✅ Successfully set up ${projectName} with React with ${variant}!`));
    }

    console.log(chalk.yellow("\n👉 Done. Now run:\n"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev\n`));
  } catch (error: any) {
    console.error(chalk.red("❌ Error setting up the project:", error.message));
  }
});

program.parse(process.argv);
