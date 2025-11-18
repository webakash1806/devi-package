#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { getProjectName, getProjectVariant, getRouterOption, getStyleMode } from "./src/cli/prompt";
import { createProjectDirectories, writeFile, removeFile } from "./src/cli/fileUtils";
import { installDependencies, installTailwind, installShadcn, installReactRouter } from "./src/cli/install";
import { AppFileWithoutReactRouterDOMJS, AppFileWithReactRouterDOMJS, homeLayoutJS, homePageJS, jsConfig, } from "./utils/templatesJS";
import { AppFileWithoutReactRouterDOMTS, AppFileWithReactRouterDOMTS, homeLayoutTS, homePageTS, tsConfig, } from "./utils/templatesTS";
const require = createRequire(import.meta.url);
const { version } = require("../package.json");
const program = new Command();
program
    .version(version)
    .action(async () => {
    console.log(chalk.green("\n🚀 Welcome to the DEVI setup for REACT\n"));
    const projectName = await getProjectName();
    const variant = await getProjectVariant();
    try {
        createViteProject(projectName, variant);
        process.chdir(projectName);
        installDependencies();
        const styleMode = await getStyleMode();
        const installReactRouterDom = styleMode !== "none" ? await getRouterOption() : false;
        switch (styleMode) {
            case "tailwind":
                await setupTailwindProject(variant, installReactRouterDom);
                break;
            case "tailwind + shadcn":
                await setupTailwindShadcnProject(variant, installReactRouterDom);
                break;
            default:
                await setupBasicProject(variant, installReactRouterDom);
                break;
        }
        printNextSteps(projectName);
    }
    catch (error) {
        console.error(chalk.red("❌ Error setting up the project:", error.message));
    }
});
program.parse(process.argv);
function createViteProject(projectName, variant) {
    console.log(chalk.blue(`\n📂 Creating project: ${projectName}...`));
    const safeProjectName = projectName.trim();
    if (!safeProjectName) {
        throw new Error("Project name cannot be empty");
    }
    execSync(`npm create vite@latest "${safeProjectName}" -- --template ${variant}`, { stdio: "inherit" });
}
async function setupTailwindProject(variant, installReactRouterDom) {
    installTailwind();
    ensureTypesNodeIfTs();
    const viteConfig = fs.existsSync("vite.config.ts")
        ? "vite.config.ts"
        : "vite.config.js";
    console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));
    writeFile(viteConfig, `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`);
    console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
    writeFile("src/index.css", `@import 'tailwindcss';\n`);
    console.log(chalk.yellow("🧹 Removing default styles..."));
    removeFile("src/App.css");
    createProjectDirectories(".");
    createLayoutAndHome(variant, false);
    updateAppComponent(variant, installReactRouterDom);
    console.log(chalk.green(`✅ Successfully set up project with Vite, React & Tailwind!`));
}
async function setupTailwindShadcnProject(variant, installReactRouterDom) {
    installTailwind();
    ensureTypesNodeIfTs();
    const viteConfig = fs.existsSync("vite.config.ts")
        ? "vite.config.ts"
        : "vite.config.js";
    console.log(chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`));
    writeFile(viteConfig, `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
`);
    const jsonConfig = fs.existsSync("tsconfig.json") ? "tsconfig.json" : "jsconfig.json";
    console.log(chalk.yellow(`\n⚙️ Configuring ${variant} with path aliases in ${jsonConfig}...`));
    const jsonConfigContent = fs.existsSync("tsconfig.json") ? tsConfig : jsConfig;
    writeFile(jsonConfig, jsonConfigContent);
    const appConfigFile = "tsconfig.app.json";
    if (fs.existsSync(appConfigFile)) {
        console.log(chalk.yellow(`\n⚙️ Configuring path aliases in ${appConfigFile}...`));
        try {
            let appConfigContent = fs.readFileSync(appConfigFile, "utf-8");
            appConfigContent = appConfigContent
                .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "")
                .trim();
            const appConfig = JSON.parse(appConfigContent);
            if (!appConfig.compilerOptions) {
                appConfig.compilerOptions = {};
            }
            appConfig.compilerOptions.baseUrl = ".";
            appConfig.compilerOptions.paths = { "@/*": ["./src/*"] };
            writeFile(appConfigFile, JSON.stringify(appConfig, null, 2));
            console.log(chalk.green(`✅ Successfully updated ${appConfigFile} with path aliases!`));
        }
        catch (error) {
            console.error(chalk.red("❌ Error updating tsconfig:", error.message));
        }
    }
    console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
    writeFile("src/index.css", `@import 'tailwindcss';\n`);
    console.log(chalk.yellow("🧹 Removing default styles..."));
    removeFile("src/App.css");
    installShadcn();
    createProjectDirectories(".");
    createLayoutAndHome(variant, true);
    updateAppComponent(variant, installReactRouterDom, true);
    console.log(chalk.green(`✅ Successfully set up project with Vite, React, Tailwind & ShadCN UI!`));
}
async function setupBasicProject(variant, installReactRouterDom) {
    createProjectDirectories(".");
    createLayoutAndHome(variant, false, true);
    updateAppComponent(variant, installReactRouterDom, false, true);
    console.log(chalk.green(`✅ Successfully set up project with React ${variant}!`));
}
function ensureTypesNodeIfTs() {
    if (fs.existsSync("tsconfig.json")) {
        console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
        execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
    }
}
function createLayoutAndHome(variant, useShadcnLayout, minimalLayout = false) {
    const layoutDir = path.join("src", "Layout");
    const pagesDir = path.join("src", "pages");
    const layoutFile = path.join(layoutDir, variant === "react-ts" ? "HomeLayout.tsx" : "HomeLayout.jsx");
    const homeFile = path.join(pagesDir, variant === "react-ts" ? "Home.tsx" : "Home.jsx");
    if (minimalLayout) {
        if (variant === "react-ts") {
            writeFile(layoutFile, `import React from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`);
        }
        else {
            writeFile(layoutFile, `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`);
        }
    }
    else if (useShadcnLayout && variant === "react-ts") {
        writeFile(layoutFile, `import React from 'react';
import { Button } from "@/components/ui/button"

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-orange-500">Devi/webakash1806</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>
          <Button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-all duration-300">
            Login
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Devi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
`);
    }
    else if (useShadcnLayout && variant === "react") {
        writeFile(layoutFile, `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 bg-black/50 backdrop-blur-md py-4 px-6 border-b border-white/10">
        <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">Devi/webakash1806</h1>
          <nav>
            <ul className="flex space-x-6 text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </nav>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors">
            Login
          </button>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-black/50 backdrop-blur-md py-6 px-6 border-t border-white/10">
        <div className="container mx-auto text-center text-gray-400">
          &copy; {new Date().getFullYear()} Devi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
`);
    }
    else {
        writeFile(layoutFile, variant === "react-ts" ? homeLayoutTS : homeLayoutJS);
    }
    writeFile(homeFile, variant === "react-ts" ? homePageTS : homePageJS);
}
function updateAppComponent(variant, installReactRouterDom, useShadcnLayout = false, minimalLayout = false) {
    const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";
    let appContent;
    if ((useShadcnLayout || minimalLayout) && !installReactRouterDom) {
        appContent =
            variant === "react-ts"
                ? `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`
                : `import React from 'react';
import HomeLayout from './Layout/HomeLayout';
import Home from './pages/Home';

const App = () => {
  return (
    <HomeLayout>
      <Home />
    </HomeLayout>
  );
};

export default App;
`;
    }
    else if (!installReactRouterDom) {
        appContent =
            variant === "react-ts"
                ? AppFileWithoutReactRouterDOMTS
                : AppFileWithoutReactRouterDOMJS;
    }
    else {
        installReactRouter();
        appContent =
            variant === "react-ts"
                ? AppFileWithReactRouterDOMTS
                : AppFileWithReactRouterDOMJS;
    }
    writeFile(appFile, appContent);
}
function printNextSteps(projectName) {
    console.log(chalk.yellow("\n👉 Done. Now run:\n"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev\n`));
}
