#!/usr/bin/env node

import { execSync } from "child_process";
import inquirer from "inquirer";
import chalk from "chalk";
import { Command } from "commander";
import fs from "fs";

const program = new Command();

program.version("1.7.0").action(async () => {
  console.log(chalk.green("\n🚀 Welcome to the DEVI setup for REACT\n"));

  // Ask for project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input) => (input ? true : "Project name cannot be empty!"),
    },
  ]);

  try {
    console.log(chalk.blue(`\n📂 Creating project: ${projectName}...`));

    const { variant } = await inquirer.prompt([
      {
        type: "list",
        name: "variant",
        message: "Choose a variant:",
        choices: [
          { name: "JavaScript", value: "react" },
          { name: "TypeScript", value: "react-ts" }
        ],
      },
    ]);

    // Run Vite create command with the selected variant
    execSync(`npm create vite@latest ${projectName} -- --template ${variant}`);

    // Navigate to project directory
    process.chdir(projectName);

    // Install dependencies
    console.log(chalk.blue("📦 Installing dependencies..."));
    execSync(`npm install`, { stdio: "inherit" });

    // Install Tailwind CSS and Vite plugin
    console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
    execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });

    if (fs.existsSync("tsconfig.json")) {
      console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
      execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
    }

    const viteConfig = fs.existsSync("vite.config.ts") ? "vite.config.ts" : "vite.config.js";
    console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));
    fs.writeFileSync(viteConfig, `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nimport tailwindcss from '@tailwindcss/vite';\nimport path from "path";\n\nexport default defineConfig({\n  plugins: [react(), tailwindcss()],\n  resolve: {\n    alias: {\n      "@": path.resolve(__dirname, "./src"),\n    },\n  },\n});\n`);

    const jsonConfig = fs.existsSync("tsconfig.json") ? "tsconfig.json" : "jsconfig.json";
    console.log(chalk.yellow(`\n⚙️ Configuring ${variant} with Tailwind plugin in ${jsonConfig}...`));

    // Ensure the main config file exists before writing
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
        // Read the file as a string
        let appConfigContent = fs.readFileSync(appConfigFile, "utf-8");

        // Remove comments from JSON (basic regex-based approach)
        appConfigContent = appConfigContent.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "").trim();

        // Parse the cleaned JSON
        let appConfig = JSON.parse(appConfigContent);

        // Ensure compilerOptions exists
        if (!appConfig.compilerOptions) {
          appConfig.compilerOptions = {};
        }

        // Add or update baseUrl and paths
        appConfig.compilerOptions.baseUrl = ".";
        appConfig.compilerOptions.paths = { "@/*": ["./src/*"] };

        // Write the updated config back to the file
        fs.writeFileSync(appConfigFile, JSON.stringify(appConfig, null, 2));

        console.log(chalk.green(`✅ Successfully updated ${appConfigFile} with path aliases!`));
      } catch (error) {
        console.error(chalk.red("❌ Error updating tsconfig:", error.message));
      }
    }


    // Modify index.css to include Tailwind directives
    console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
    fs.writeFileSync("src/index.css", `@import 'tailwindcss';\n`);

    // Remove app.css if it exists
    console.log(chalk.yellow("🧹 Removing default styles..."));
    try {
      fs.unlinkSync("src/App.css");
    } catch (err) {
      console.log(chalk.gray("No App.css found, skipping..."));
    }

    // Install ShadCN UI
    console.log(chalk.blue("🛠 Installing ShadCN UI..."));
    execSync(`npx shadcn@latest init`, { stdio: "inherit" });

    // Add default components
    console.log(chalk.blue("📦 Installing ShadCN components..."));
    execSync(`npx shadcn@latest add button`, { stdio: "inherit" });


    // Clear App.jsx or App.tsx and add custom code
    console.log(chalk.yellow("📝 Updating App component..."));
    const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
    fs.writeFileSync(appFile, `
            import { useState } from "react";
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


    console.log(chalk.green(`✅ Successfully set up ${projectName} with Vite, React & Tailwind!`));
    console.log(chalk.yellow("\n👉 Done. Now run:\n"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev\n`));
  } catch (error) {
    console.error(chalk.red("❌ Error setting up the project:", error.message));
  }
});

program.parse(process.argv);
