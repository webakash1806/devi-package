#!/usr/bin/env node
import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { getProjectName, getProjectVariant, getRouterOption, getStyleMode, getCodeQualityOption, getEnvOption, getUIComponentsOption } from "./src/cli/prompt.js";
import { createProjectDirectories, writeFile, removeFile, updatePackageJson, updateTsConfig } from "./src/cli/fileUtils.js";
import { installDependencies, installTailwind, installShadcn, installReactRouter, installCodeQualityDependencies, initHusky, installEnvDependencies, installLottieReact, installBasicUIComponents } from "./src/cli/install.js";
import { AppFileWithoutReactRouterDOMJS, AppFileWithReactRouterDOMJS, homeLayoutJS, homePageJS, homePageNoTailwindJS, jsConfig, } from "./utils/templatesJS.js";
import { AppFileWithoutReactRouterDOMTS, AppFileWithReactRouterDOMTS, homeLayoutTS, homePageTS, homePageNoTailwindTS, tsConfig, } from "./utils/templatesTS.js";
import { prettierConfig, lintStagedConfig, vsCodeSettings } from "./utils/templatesConfig.js";
import { envExample, envValidationTS, envValidationJS, gitignoreEnvAddition } from "./utils/templatesEnv.js";
import { lottie404Animation, notFound404TS, notFound404JS, notFound404NoTailwindTS, notFound404NoTailwindJS, notFound404CSS } from "./utils/templates404.js";
import { errorBoundaryTS, errorBoundaryJS, errorBoundaryNoTailwindTS, errorBoundaryNoTailwindJS, errorBoundaryCSS } from "./utils/templatesErrorBoundary.js";
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
        const setupCodeQuality = await getCodeQualityOption();
        const setupEnv = await getEnvOption();
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
        if (setupCodeQuality) {
            await setupCodeQualityTools(projectName);
        }
        if (setupEnv) {
            await setupEnvironmentVariables(variant);
        }
        if (installReactRouterDom) {
            await setup404Page(variant, styleMode);
        }
        // Always setup Error Boundary for production safety
        await setupErrorBoundary(variant, styleMode);
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
    // Ask if user wants basic UI components
    const addUIComponents = await getUIComponentsOption();
    if (addUIComponents) {
        installBasicUIComponents();
    }
    console.log(chalk.green(`✅ Successfully set up project with Vite, React, Tailwind & ShadCN UI!`));
}
async function setupBasicProject(variant, installReactRouterDom) {
    createProjectDirectories(".");
    writeHomeCss();
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
function writeHomeCss() {
    const css = `:root {
  --home-bg: #000000;
  --home-surface: #020617;
  --home-surface-soft: #111827;
  --home-border-subtle: rgba(31, 41, 55, 0.7);
  --home-text: #ffffff;
  --home-text-muted: #9ca3af;
}

body {
  margin: 0;
  background-color: var(--home-bg);
  color: var(--home-text);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.home-root {
  min-height: 100vh;
  background-color: var(--home-bg);
  color: var(--home-text);
}

.home-nav {
  position: fixed;
  inset: 0 auto auto 0;
  width: 100%;
  z-index: 50;
  border-bottom: 1px solid var(--home-border-subtle);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(16px);
}

.home-nav-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.home-logo {
  font-size: 1.125rem;
  font-weight: 600;
}

.home-nav-links {
  display: none;
  gap: 2rem;
}

.home-nav-links a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.15s ease;
}

.home-nav-links a:hover {
  color: #ffffff;
}

.home-nav-actions {
  display: none;
  align-items: center;
  gap: 1rem;
}

.home-nav-toggle {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
}

.home-nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  border-radius: 999px;
  background: #ffffff;
}

.home-nav-mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.5rem 1.5rem;
  background: rgba(0, 0, 0, 0.95);
  border-top: 1px solid var(--home-border-subtle);
}

.home-nav-mobile a {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
}

.home-nav-mobile a:hover {
  color: #ffffff;
}

.home-nav-mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--home-border-subtle);
}

.home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.home-btn-primary {
  background: #ffffff;
  color: #000000;
}

.home-btn-primary:hover {
  background: #e5e7eb;
}

.home-btn-ghost {
  background: transparent;
  color: #ffffff;
}

.home-btn-ghost:hover {
  background: rgba(31, 41, 55, 0.7);
}

.home-btn-gradient {
  background-image: linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.7));
  color: #000000;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-size: 0.9rem;
}

.home-btn-gradient:hover {
  transform: scale(1.03);
}

.home-btn-gradient:active {
  transform: scale(0.97);
}

.home-hero {
  min-height: 100vh;
  padding: 7rem 1.5rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
}

.home-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--home-border-subtle);
  background: rgba(31, 41, 55, 0.6);
  margin-bottom: 1.5rem;
}

.home-badge span {
  font-size: 0.75rem;
  color: var(--home-text-muted);
}

.home-badge a {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--home-text-muted);
  text-decoration: none;
}

.home-badge a:hover {
  color: #ffffff;
}

.home-badge-arrow {
  font-size: 0.75rem;
}

.home-hero-title {
  max-width: 48rem;
  margin: 0 auto 1.5rem;
  padding: 0 1.5rem;
  font-size: 2.25rem;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.05em;
  background-image: linear-gradient(to bottom, #ffffff, #ffffff, rgba(255, 255, 255, 0.6));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.home-hero-subtitle {
  max-width: 36rem;
  margin: 0 auto 2.5rem;
  padding: 0 1.5rem;
  font-size: 0.9rem;
  color: var(--home-text-muted);
}

.home-hero-cta {
  margin-bottom: 4rem;
}

.home-hero-media {
  position: relative;
  max-width: 960px;
  width: 100%;
  padding-bottom: 5rem;
}

.home-hero-glow {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  pointer-events: none;
  z-index: 0;
  top: -23%;
}

.home-hero-glow img {
  width: 100%;
  height: auto;
  display: block;
}

.home-hero-image {
  position: relative;
  z-index: 10;
}

.home-hero-image img {
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
}

@media (min-width: 768px) {
  .home-hero-title {
    font-size: 3rem;
  }

  .home-hero-subtitle {
    font-size: 1rem;
  }

  .home-nav-links {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
  }

  .home-nav-actions {
    display: flex;
  }

  .home-nav-toggle {
    display: none;
  }
}

@media (min-width: 1024px) {
  .home-hero-title {
    font-size: 3.5rem;
  }
}
`;
    const pagesDir = path.join("src", "pages");
    if (!fs.existsSync(pagesDir)) {
        fs.mkdirSync(pagesDir, { recursive: true });
    }
    writeFile(path.join(pagesDir, "home.css"), css);
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
    if (minimalLayout) {
        writeFile(homeFile, variant === "react-ts" ? homePageNoTailwindTS : homePageNoTailwindJS);
    }
    else {
        writeFile(homeFile, variant === "react-ts" ? homePageTS : homePageJS);
    }
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
async function setupCodeQualityTools(projectName) {
    console.log(chalk.yellow("\n🛡️  Setting up Code Quality tools..."));
    installCodeQualityDependencies();
    // Write config files
    writeFile(".prettierrc", prettierConfig);
    writeFile(".lintstagedrc", lintStagedConfig);
    // VS Code settings
    const vscodeDir = ".vscode";
    if (!fs.existsSync(vscodeDir)) {
        fs.mkdirSync(vscodeDir);
    }
    writeFile(path.join(vscodeDir, "settings.json"), vsCodeSettings);
    // Init Husky
    initHusky();
    writeFile(".husky/pre-commit", "npx lint-staged");
    // Update package.json
    updatePackageJson(".", (json) => {
        json.scripts = {
            ...json.scripts,
            "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
            "format": "prettier --write .",
            "prepare": "husky"
        };
        return json;
    });
    // Enforce Strict Mode in tsconfig
    updateTsConfig(".", (json) => {
        if (!json.compilerOptions)
            json.compilerOptions = {};
        json.compilerOptions.strict = true;
        json.compilerOptions.noImplicitAny = true;
        return json;
    });
    console.log(chalk.green("✅ Code Quality tools configured successfully!"));
}
async function setupEnvironmentVariables(variant) {
    console.log(chalk.yellow("\n🔐 Setting up Environment Variables..."));
    installEnvDependencies();
    // Create .env.example
    writeFile(".env.example", envExample);
    // Create src/config directory
    const configDir = path.join("src", "config");
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
    }
    // Create env validation file
    const envFile = path.join(configDir, variant === "react-ts" ? "env.ts" : "env.js");
    const envContent = variant === "react-ts" ? envValidationTS : envValidationJS;
    writeFile(envFile, envContent);
    // Update .gitignore
    const gitignorePath = ".gitignore";
    if (fs.existsSync(gitignorePath)) {
        const currentGitignore = fs.readFileSync(gitignorePath, "utf-8");
        if (!currentGitignore.includes(".env")) {
            fs.appendFileSync(gitignorePath, gitignoreEnvAddition);
        }
    }
    else {
        writeFile(gitignorePath, gitignoreEnvAddition);
    }
    console.log(chalk.green("✅ Environment variables configured successfully!"));
    console.log(chalk.yellow("📝 Remember to:"));
    console.log(chalk.yellow("   1. Copy .env.example to .env"));
    console.log(chalk.yellow("   2. Fill in your actual values in .env"));
    console.log(chalk.yellow("   3. Import env from '@/config/env' to use validated env vars"));
}
async function setup404Page(variant, styleMode) {
    console.log(chalk.yellow("\n🚫 Setting up 404 Error Page..."));
    installLottieReact();
    // Create assets directory
    const assetsDir = path.join("src", "assets");
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }
    // Save Lottie animation JSON
    writeFile(path.join(assetsDir, "404-animation.json"), lottie404Animation);
    // Create 404 page component
    const pagesDir = path.join("src", "pages");
    const notFoundFile = path.join(pagesDir, variant === "react-ts" ? "NotFound.tsx" : "NotFound.jsx");
    let notFoundContent;
    if (styleMode === "none") {
        notFoundContent = variant === "react-ts" ? notFound404NoTailwindTS : notFound404NoTailwindJS;
        // Also create CSS file for non-Tailwind version
        writeFile(path.join(pagesDir, "NotFound.css"), notFound404CSS);
    }
    else {
        notFoundContent = variant === "react-ts" ? notFound404TS : notFound404JS;
    }
    writeFile(notFoundFile, notFoundContent);
    console.log(chalk.green("✅ 404 Error Page configured successfully!"));
}
async function setupErrorBoundary(variant, styleMode) {
    console.log(chalk.yellow("\n🛡️  Setting up Error Boundary..."));
    // Create components directory if it doesn't exist
    const componentsDir = path.join("src", "components");
    if (!fs.existsSync(componentsDir)) {
        fs.mkdirSync(componentsDir, { recursive: true });
    }
    // Create Error Boundary component
    const errorBoundaryFile = path.join(componentsDir, variant === "react-ts" ? "ErrorBoundary.tsx" : "ErrorBoundary.jsx");
    let errorBoundaryContent;
    if (styleMode === "none") {
        errorBoundaryContent = variant === "react-ts" ? errorBoundaryNoTailwindTS : errorBoundaryNoTailwindJS;
        // Also create CSS file for non-Tailwind version
        writeFile(path.join(componentsDir, "ErrorBoundary.css"), errorBoundaryCSS);
    }
    else {
        errorBoundaryContent = variant === "react-ts" ? errorBoundaryTS : errorBoundaryJS;
    }
    writeFile(errorBoundaryFile, errorBoundaryContent);
    console.log(chalk.green("✅ Error Boundary configured successfully!"));
    console.log(chalk.yellow("📝 Note: Wrap your App with <ErrorBoundary> in main.tsx/jsx"));
}
function printNextSteps(projectName) {
    console.log(chalk.yellow("\n👉 Done. Now run:\n"));
    console.log(chalk.cyan(`  cd ${projectName}`));
    console.log(chalk.cyan(`  npm run dev\n`));
}
