#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const inquirer_1 = require("inquirer");
const chalk_1 = require("chalk");
const commander_1 = require("commander");
const fs = require("fs");
const program = new commander_1.Command();
program.version("1.8.0").action(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log(chalk_1.default.green("\n🚀 Welcome to the DEVI setup for REACT\n"));
    const { projectName } = yield inquirer_1.default.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Enter your project name:",
            validate: (input) => (input ? true : "Project name cannot be empty!"),
        },
    ]);
    try {
        console.log(chalk_1.default.blue(`\n📂 Creating project: ${projectName}...`));
        const { variant } = yield inquirer_1.default.prompt([
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
        (0, child_process_1.execSync)(`npm create vite@latest ${projectName} -- --template ${variant}`, { stdio: "inherit" });
        process.chdir(projectName);
        console.log(chalk_1.default.blue("📦 Installing dependencies..."));
        (0, child_process_1.execSync)(`npm install`, { stdio: "inherit" });
        console.log(chalk_1.default.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
        (0, child_process_1.execSync)(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });
        if (fs.existsSync("tsconfig.json")) {
            console.log(chalk_1.default.blue("📝 Installing TypeScript types for Node.js..."));
            (0, child_process_1.execSync)(`npm install --save-dev @types/node`, { stdio: "inherit" });
        }
        const viteConfig = fs.existsSync("vite.config.ts") ? "vite.config.ts" : "vite.config.js";
        console.log(chalk_1.default.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));
        fs.writeFileSync(viteConfig, `import { defineConfig } from 'vite';
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
`);
        const jsonConfig = fs.existsSync("tsconfig.json") ? "tsconfig.json" : "jsconfig.json";
        console.log(chalk_1.default.yellow(`\n⚙️ Configuring ${variant} with Tailwind plugin in ${jsonConfig}...`));
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
            console.log(chalk_1.default.yellow(`\n⚙️ Configuring path aliases in ${appConfigFile}...`));
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
                console.log(chalk_1.default.green(`✅ Successfully updated ${appConfigFile} with path aliases!`));
            }
            catch (error) {
                console.error(chalk_1.default.red("❌ Error updating tsconfig:", error.message));
            }
        }
        console.log(chalk_1.default.yellow("✍️ Adding Tailwind to global styles..."));
        fs.writeFileSync("src/index.css", `@import 'tailwindcss';\n`);
        console.log(chalk_1.default.yellow("🧹 Removing default styles..."));
        try {
            fs.unlinkSync("src/App.css");
        }
        catch (err) {
            console.log(chalk_1.default.gray("No App.css found, skipping..."));
        }
        console.log(chalk_1.default.blue("🛠 Installing ShadCN UI..."));
        (0, child_process_1.execSync)(`npx shadcn@latest init`, { stdio: "inherit" });
        console.log(chalk_1.default.blue("📦 Installing ShadCN components..."));
        (0, child_process_1.execSync)(`npx shadcn@latest add button`, { stdio: "inherit" });
        console.log(chalk_1.default.yellow("📝 Updating App component..."));
        const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
        fs.writeFileSync(appFile, `import { useState } from "react";
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
`);
        console.log(chalk_1.default.green(`✅ Successfully set up ${projectName} with Vite, React & Tailwind!`));
        console.log(chalk_1.default.yellow("\n👉 Done. Now run:\n"));
        console.log(chalk_1.default.cyan(`  cd ${projectName}`));
        console.log(chalk_1.default.cyan(`  npm run dev\n`));
    }
    catch (error) {
        console.error(chalk_1.default.red("❌ Error setting up the project:", error.message));
    }
}));
program.parse(process.argv);
