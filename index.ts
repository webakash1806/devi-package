#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";

import { getProjectName, getProjectVariant, getRouterOption, getStyleMode, getCodeQualityOption, getEnvOption, getUIComponentsOption, getTestingOption, getGitOption } from "./src/cli/prompt.js";
import { createProjectDirectories, writeFile, removeFile, updatePackageJson, updateTsConfig } from "./src/cli/fileUtils.js";
import { installDependencies, installTailwind, installShadcn, installReactRouter, installCodeQualityDependencies, initHusky, installEnvDependencies, installLottieReact, installBasicUIComponents, setPackageManager, getPackageManager, installTestingDependencies } from "./src/cli/install.js";
import { logger, LogLevel } from "./src/cli/logger.js";
import type { CLIOptions, TemplateConfig, Variant } from "./src/cli/types.js";
import { TEMPLATE_PRESETS } from "./src/cli/types.js";
import {
  AppFileWithoutReactRouterDOMJS,
  AppFileWithReactRouterDOMJS,
  homeLayoutJS,
  homePageJS,
  homePageNoTailwindJS,
  jsConfig,
} from "./utils/templatesJS.js";
import {
  AppFileWithoutReactRouterDOMTS,
  AppFileWithReactRouterDOMTS,
  homeLayoutTS,
  homePageTS,
  homePageNoTailwindTS,
  tsConfig,
} from "./utils/templatesTS.js";
import { prettierConfig, lintStagedConfig, vsCodeSettings } from "./utils/templatesConfig.js";
import { envExample, envValidationTS, envValidationJS, gitignoreEnvAddition } from "./utils/templatesEnv.js";
import { vitestConfigTS, vitestConfigJS, testSetupTS, testSetupJS, exampleTestTS, exampleTestJS } from "./utils/templatesTest.js";
import { gitAttributesTemplate } from "./utils/templatesGit.js";
import { lottie404Animation, notFound404TS, notFound404JS, notFound404NoTailwindTS, notFound404NoTailwindJS, notFound404CSS } from "./utils/templates404.js";
import { errorBoundaryTS, errorBoundaryJS, errorBoundaryNoTailwindTS, errorBoundaryNoTailwindJS, errorBoundaryCSS } from "./utils/templatesErrorBoundary.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const program = new Command();

program
  .name("create-devi")
  .description("A CLI tool for scaffolding React projects with modern tooling")
  .version(version, "-v, --version", "Display version number")
  .option("-t, --template <name>", "Use a predefined template (typescript-full, typescript-minimal, javascript-full, javascript-minimal, basic-ts, basic-js)")
  .option("--no-install", "Skip dependency installation")
  .option("-pm, --package-manager <pm>", "Choose package manager (npm, yarn, pnpm)", "npm")
  .option("--dry-run", "Show what would be created without creating anything")
  .option("--verbose", "Enable verbose logging")
  .option("--debug", "Enable debug logging")
  .addHelpText('after', `
${chalk.bold('Template Presets:')}
  ${chalk.cyan('typescript-full')}      TypeScript with all features enabled
  ${chalk.cyan('typescript-minimal')}   TypeScript with Tailwind CSS only
  ${chalk.cyan('javascript-full')}      JavaScript with all features enabled
  ${chalk.cyan('javascript-minimal')}   JavaScript with Tailwind CSS only
  ${chalk.cyan('basic-ts')}             TypeScript without styling
  ${chalk.cyan('basic-js')}             JavaScript without styling

${chalk.bold('Examples:')}
  ${chalk.gray('$')} npm create devi@latest
  ${chalk.gray('$')} npm create devi@latest -- --template typescript-full
  ${chalk.gray('$')} npm create devi@latest -- --template typescript-minimal --no-install
  ${chalk.gray('$')} npm create devi@latest -- --package-manager pnpm --verbose
  ${chalk.gray('$')} npm create devi@latest -- --dry-run
`)
  .action(async (options) => {
    const cliOptions: CLIOptions = {
      template: options.template,
      install: options.install !== false,
      packageManager: options.packageManager as "npm" | "yarn" | "pnpm",
      dryRun: options.dryRun || false,
      verbose: options.verbose || false,
      debug: options.debug || false,
    };

    // Set logger level based on flags
    if (cliOptions.debug) {
      logger.setLevel(LogLevel.DEBUG);
    } else if (cliOptions.verbose) {
      logger.setLevel(LogLevel.VERBOSE);
    }

    // Validate package manager
    if (!['npm', 'yarn', 'pnpm'].includes(cliOptions.packageManager)) {
      logger.error(`Invalid package manager: ${cliOptions.packageManager}. Must be npm, yarn, or pnpm.`);
      process.exit(1);
    }

    // Set the package manager globally
    setPackageManager(cliOptions.packageManager);
    logger.debug(`CLI Options: ${JSON.stringify(cliOptions, null, 2)}`);

    console.log(chalk.green("\n🚀 Welcome to the DEVI setup for REACT\n"));

    let projectName: string;
    let variant: Variant;
    let styleMode: "tailwind" | "tailwind + shadcn" | "none";
    let installReactRouterDom: boolean;
    let setupCodeQuality: boolean;
    let setupEnv: boolean;
    let setupUIComponents: boolean = false;
    let setupTesting: boolean = false;
    let setupGit: boolean = true;

    // Check if template is provided
    if (cliOptions.template) {
      const template = TEMPLATE_PRESETS[cliOptions.template];
      if (!template) {
        logger.error(`Unknown template: ${cliOptions.template}`);
        logger.info(`Available templates: ${Object.keys(TEMPLATE_PRESETS).join(', ')}`);
        process.exit(1);
      }

      logger.info(`Using template: ${chalk.cyan(template.name)}`);
      logger.verbose(`Template description: ${template.description}`);

      // Get project name only
      projectName = await getProjectName();

      // Use template configuration
      variant = template.variant;
      styleMode = template.styleMode;
      installReactRouterDom = template.router;
      setupCodeQuality = template.codeQuality;
      setupEnv = template.env;
      setupUIComponents = template.uiComponents;
      setupTesting = template.testing;
      setupGit = template.git;

      logger.verbose(`Variant: ${variant}`);
      logger.verbose(`Style: ${styleMode}`);
      logger.verbose(`Router: ${installReactRouterDom}`);
      logger.verbose(`Code Quality: ${setupCodeQuality}`);
      logger.verbose(`Env Setup: ${setupEnv}`);
      logger.verbose(`UI Components: ${setupUIComponents}`);
      logger.verbose(`Testing: ${setupTesting}`);
      logger.verbose(`Git: \${setupGit} `);
    } else {
      // Interactive mode - ask all questions
      projectName = await getProjectName();
      variant = await getProjectVariant();
      styleMode = await getStyleMode();
      installReactRouterDom = styleMode !== "none" ? await getRouterOption() : false;
      setupCodeQuality = await getCodeQualityOption();
      setupEnv = await getEnvOption();
      setupUIComponents = styleMode === "tailwind + shadcn" ? await getUIComponentsOption() : false;
      setupTesting = await getTestingOption();
      setupGit = await getGitOption();
    }

    // Dry run mode - show what would be created
    if (cliOptions.dryRun) {
      console.log(chalk.yellow("\n🔍 DRY RUN MODE - Nothing will be created\n"));
      console.log(chalk.bold("Configuration:"));
      console.log(`  Project Name: ${ chalk.cyan(projectName) } `);
      console.log(`  Variant: ${ chalk.cyan(variant) } `);
      console.log(`  Style Mode: ${ chalk.cyan(styleMode) } `);
      console.log(`  Router: ${ chalk.cyan(installReactRouterDom ? 'Yes' : 'No') } `);
      console.log(`  Code Quality: ${ chalk.cyan(setupCodeQuality ? 'Yes' : 'No') } `);
      console.log(`  Environment: ${ chalk.cyan(setupEnv ? 'Yes' : 'No') } `);
      console.log(`  UI Components: ${ chalk.cyan(setupUIComponents ? 'Yes' : 'No') } `);
      console.log(`  Package Manager: ${ chalk.cyan(cliOptions.packageManager) } `);
      console.log(`  Install Dependencies: ${ chalk.cyan(cliOptions.install ? 'Yes' : 'No') } `);

      console.log(chalk.bold("\nCommands that would run:"));
      console.log(`  ${ chalk.gray('npm create vite@latest') } ${ projectName } ${ chalk.gray('--template') } ${ variant } `);
      if (cliOptions.install) {
        console.log(`  ${ chalk.gray('cd') } ${ projectName } `);
        console.log(`  ${ chalk.gray(cliOptions.packageManager) } install`);
        if (styleMode !== "none") {
          console.log(`  ${ chalk.gray(cliOptions.packageManager) } install - D tailwindcss @tailwindcss/vite`);
        }
if (styleMode === "tailwind + shadcn") {
  console.log(`  ${chalk.gray('npx shadcn@latest init')}`);
}
if (installReactRouterDom) {
  console.log(`  ${chalk.gray(cliOptions.packageManager)} install react-router-dom`);
}
      }

console.log(chalk.yellow("\n✅ Dry run complete. No files were created.\n"));
return;
    }

try {
  logger.verbose("Creating Vite project...");
  createViteProject(projectName, variant, cliOptions.packageManager);

  process.chdir(projectName);
  logger.debug(`Changed directory to: ${projectName}`);

  if (cliOptions.install) {
    installDependencies();
  } else {
    logger.warn("Skipping dependency installation (--no-install flag)");
  }

  switch (styleMode) {
    case "tailwind":
      await setupTailwindProject(variant, installReactRouterDom, cliOptions.install);
      break;
    case "tailwind + shadcn":
      await setupTailwindShadcnProject(variant, installReactRouterDom, setupUIComponents, cliOptions.install);
      break;
    default:
      await setupBasicProject(variant, installReactRouterDom);
      break;
  }

  if (setupCodeQuality) {
    await setupCodeQualityTools(projectName, cliOptions.install);
  }

  if (setupEnv) {
    await setupEnvironmentVariables(variant, cliOptions.install);
  }

  if (installReactRouterDom) {
    await setup404Page(variant, styleMode, cliOptions.install);
  }

  if (setupTesting) {
    await setupTestingInfrastructure(variant, cliOptions.install);
  }

  if (setupGit) {
    await setupGitRepository(projectName);
  }

  // Always setup Error Boundary for production safety
  await setupErrorBoundary(variant, styleMode);

  printNextSteps(projectName, cliOptions);
} catch (error: any) {
  logger.error("Error setting up the project:");
  logger.error(error.message);
  logger.debug(error.stack);
  process.exit(1);
}
  });

program.parse(process.argv);

function createViteProject(projectName: string, variant: Variant, packageManager: string = "npm"): void {
  console.log(chalk.blue(`\n📂 Creating project: ${projectName}...`));
  const safeProjectName = projectName.trim();

  if (!safeProjectName) {
    throw new Error("Project name cannot be empty");
  }

  logger.verbose(`Using package manager: ${packageManager}`);
  const createCmd = packageManager === "npm"
    ? `npm create vite@latest "${safeProjectName}" -- --template ${variant}`
    : packageManager === "yarn"
      ? `yarn create vite "${safeProjectName}" --template ${variant}`
      : `pnpm create vite "${safeProjectName}" --template ${variant}`;

  logger.debug(`Running: ${createCmd}`);
  execSync(createCmd, { stdio: "inherit" });
}

async function setupTailwindProject(
  variant: Variant,
  installReactRouterDom: boolean,
  shouldInstall: boolean = true
): Promise<void> {
  if (shouldInstall) {
    installTailwind();
    ensureTypesNodeIfTs();
  } else {
    logger.info("Tailwind installation skipped (--no-install)");
  }

  const viteConfig = fs.existsSync("vite.config.ts")
    ? "vite.config.ts"
    : "vite.config.js";

  console.log(
    chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`)
  );

  writeFile(
    viteConfig,
    `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
`
  );

  console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
  writeFile("src/index.css", `@import 'tailwindcss';\n`);

  console.log(chalk.yellow("🧹 Removing default styles..."));
  removeFile("src/App.css");

  createProjectDirectories(".");

  createLayoutAndHome(variant, false);
  updateAppComponent(variant, installReactRouterDom);

  console.log(
    chalk.green(`✅ Successfully set up project with Vite, React & Tailwind!`)
  );
}

async function setupTailwindShadcnProject(
  variant: Variant,
  installReactRouterDom: boolean,
  addUIComponents: boolean = true,
  shouldInstall: boolean = true
): Promise<void> {
  if (shouldInstall) {
    installTailwind();
    ensureTypesNodeIfTs();
  } else {
    logger.info("Tailwind installation skipped (--no-install)");
  }

  const viteConfig = fs.existsSync("vite.config.ts")
    ? "vite.config.ts"
    : "vite.config.js";

  console.log(
    chalk.yellow(`\n⚙️ Configuring Vite with Tailwind plugin in ${viteConfig}...`)
  );

  writeFile(
    viteConfig,
    `import { defineConfig } from 'vite';
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
`
  );

  const jsonConfig = fs.existsSync("tsconfig.json") ? "tsconfig.json" : "jsconfig.json";

  console.log(
    chalk.yellow(`\n⚙️ Configuring ${variant} with path aliases in ${jsonConfig}...`)
  );

  const jsonConfigContent = fs.existsSync("tsconfig.json") ? tsConfig : jsConfig;
  writeFile(jsonConfig, jsonConfigContent);

  const appConfigFile = "tsconfig.app.json";
  if (fs.existsSync(appConfigFile)) {
    console.log(
      chalk.yellow(`\n⚙️ Configuring path aliases in ${appConfigFile}...`)
    );
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
      console.log(
        chalk.green(`✅ Successfully updated ${appConfigFile} with path aliases!`)
      );
    } catch (error: any) {
      console.error(chalk.red("❌ Error updating tsconfig:", error.message));
    }
  }

  console.log(chalk.yellow("✍️ Adding Tailwind to global styles..."));
  writeFile("src/index.css", `@import 'tailwindcss';\n`);

  console.log(chalk.yellow("🧹 Removing default styles..."));
  removeFile("src/App.css");

  if (shouldInstall) {
    installShadcn();
  } else {
    logger.info("ShadCN installation skipped (--no-install)");
  }

  createProjectDirectories(".");
  createLayoutAndHome(variant, true);
  updateAppComponent(variant, installReactRouterDom, true);

  // Ask if user wants basic UI components
  if (addUIComponents && shouldInstall) {
    installBasicUIComponents();
  }

  console.log(
    chalk.green(
      `✅ Successfully set up project with Vite, React, Tailwind & ShadCN UI!`
    )
  );
}

async function setupBasicProject(
  variant: Variant,
  installReactRouterDom: boolean
): Promise<void> {
  createProjectDirectories(".");
  writeHomeCss();
  createLayoutAndHome(variant, false, true);
  updateAppComponent(variant, installReactRouterDom, false, true);

  console.log(
    chalk.green(`✅ Successfully set up project with React ${variant}!`)
  );
}

function ensureTypesNodeIfTs(): void {
  if (fs.existsSync("tsconfig.json")) {
    console.log(chalk.blue("📝 Installing TypeScript types for Node.js..."));
    execSync(`npm install --save-dev @types/node`, { stdio: "inherit" });
  }
}

function writeHomeCss(): void {
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

function createLayoutAndHome(
  variant: Variant,
  useShadcnLayout: boolean,
  minimalLayout = false
): void {
  const layoutDir = path.join("src", "Layout");
  const pagesDir = path.join("src", "pages");

  const layoutFile = path.join(
    layoutDir,
    variant === "react-ts" ? "HomeLayout.tsx" : "HomeLayout.jsx"
  );
  const homeFile = path.join(
    pagesDir,
    variant === "react-ts" ? "Home.tsx" : "Home.jsx"
  );

  if (minimalLayout) {
    if (variant === "react-ts") {
      writeFile(
        layoutFile,
        `import React from 'react';

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
`
      );
    } else {
      writeFile(
        layoutFile,
        `import React from 'react';

const HomeLayout = ({ children }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      {children}
    </div>
  );
};

export default HomeLayout;
`
      );
    }
  } else if (useShadcnLayout && variant === "react-ts") {
    writeFile(
      layoutFile,
      `import React from 'react';
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
`
    );
  } else if (useShadcnLayout && variant === "react") {
    writeFile(
      layoutFile,
      `import React from 'react';

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
`
    );
  } else {
    writeFile(layoutFile, variant === "react-ts" ? homeLayoutTS : homeLayoutJS);
  }

  if (minimalLayout) {
    writeFile(
      homeFile,
      variant === "react-ts" ? homePageNoTailwindTS : homePageNoTailwindJS
    );
  } else {
    writeFile(homeFile, variant === "react-ts" ? homePageTS : homePageJS);
  }
}

function updateAppComponent(
  variant: Variant,
  installReactRouterDom: boolean,
  useShadcnLayout = false,
  minimalLayout = false
): void {
  const appFile = fs.existsSync("src/App.tsx") ? "src/App.tsx" : "src/App.jsx";

  let appContent: string;

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
  } else if (!installReactRouterDom) {
    appContent =
      variant === "react-ts"
        ? AppFileWithoutReactRouterDOMTS
        : AppFileWithoutReactRouterDOMJS;
  } else {
    installReactRouter();
    appContent =
      variant === "react-ts"
        ? AppFileWithReactRouterDOMTS
        : AppFileWithReactRouterDOMJS;
  }

  writeFile(appFile, appContent);
}

async function setupCodeQualityTools(projectName: string, shouldInstall: boolean = true): Promise<void> {
  console.log(chalk.yellow("\n🛡️  Setting up Code Quality tools..."));

  if (shouldInstall) {
    installCodeQualityDependencies();
  } else {
    logger.info("Code quality tools installation skipped (--no-install)");
  }

  // Write config files
  writeFile(".prettierrc", prettierConfig);
  writeFile(".lintstagedrc", lintStagedConfig);

  // VS Code settings
  const vscodeDir = ".vscode";
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir);
  }
  writeFile(path.join(vscodeDir, "settings.json"), vsCodeSettings);

  if (shouldInstall) {
    // Init Husky
    initHusky();
    writeFile(".husky/pre-commit", "npx lint-staged");
  }

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
    if (!json.compilerOptions) json.compilerOptions = {};
    json.compilerOptions.strict = true;
    json.compilerOptions.noImplicitAny = true;
    return json;
  });

  console.log(chalk.green("✅ Code Quality tools configured successfully!"));
}

async function setupEnvironmentVariables(variant: Variant, shouldInstall: boolean = true): Promise<void> {
  console.log(chalk.yellow("\n🔐 Setting up Environment Variables..."));

  if (shouldInstall) {
    installEnvDependencies();
  } else {
    logger.info("Environment dependencies installation skipped (--no-install)");
  }

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
  } else {
    writeFile(gitignorePath, gitignoreEnvAddition);
  }

  console.log(chalk.green("✅ Environment variables configured successfully!"));
  console.log(chalk.yellow("📝 Remember to:"));
  console.log(chalk.yellow("   1. Copy .env.example to .env"));
  console.log(chalk.yellow("   2. Fill in your actual values in .env"));
  console.log(chalk.yellow("   3. Import env from '@/config/env' to use validated env vars"));
}

async function setup404Page(variant: Variant, styleMode: string, shouldInstall: boolean = true): Promise<void> {
  console.log(chalk.yellow("\n🚫 Setting up 404 Error Page..."));

  if (shouldInstall) {
    installLottieReact();
  } else {
    logger.info("Lottie React installation skipped (--no-install)");
  }

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

  let notFoundContent: string;
  if (styleMode === "none") {
    notFoundContent = variant === "react-ts" ? notFound404NoTailwindTS : notFound404NoTailwindJS;
    // Also create CSS file for non-Tailwind version
    writeFile(path.join(pagesDir, "NotFound.css"), notFound404CSS);
  } else {
    notFoundContent = variant === "react-ts" ? notFound404TS : notFound404JS;
  }

  writeFile(notFoundFile, notFoundContent);

  console.log(chalk.green("✅ 404 Error Page configured successfully!"));
}

async function setupErrorBoundary(variant: Variant, styleMode: string): Promise<void> {
  console.log(chalk.yellow("\n🛡️  Setting up Error Boundary..."));

  // Create components directory if it doesn't exist
  const componentsDir = path.join("src", "components");
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  // Create Error Boundary component
  const errorBoundaryFile = path.join(componentsDir, variant === "react-ts" ? "ErrorBoundary.tsx" : "ErrorBoundary.jsx");

  let errorBoundaryContent: string;
  if (styleMode === "none") {
    errorBoundaryContent = variant === "react-ts" ? errorBoundaryNoTailwindTS : errorBoundaryNoTailwindJS;
    // Also create CSS file for non-Tailwind version
    writeFile(path.join(componentsDir, "ErrorBoundary.css"), errorBoundaryCSS);
  } else {
    errorBoundaryContent = variant === "react-ts" ? errorBoundaryTS : errorBoundaryJS;
  }

  writeFile(errorBoundaryFile, errorBoundaryContent);

  console.log(chalk.green("✅ Error Boundary configured successfully!"));
  console.log(chalk.yellow("📝 Note: Wrap your App with <ErrorBoundary> in main.tsx/jsx"));
}

async function setupTestingInfrastructure(variant: Variant, shouldInstall: boolean = true): Promise<void> {
  console.log(chalk.yellow("\n🧪 Setting up Testing Infrastructure..."));

  if (shouldInstall) {
    installTestingDependencies();
  } else {
    logger.info("Testing dependencies installation skipped (--no-install)");
  }

  // Create Vitest config
  const vitestConfigFile = variant === "react-ts" ? "vitest.config.ts" : "vitest.config.js";
  const vitestConfigContent = variant === "react-ts" ? vitestConfigTS : vitestConfigJS;
  writeFile(vitestConfigFile, vitestConfigContent);

  // Create test directory
  const testDir = path.join("src", "test");
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  // Create test setup file
  const testSetupFile = path.join(testDir, variant === "react-ts" ? "setup.ts" : "setup.js");
  const testSetupContent = variant === "react-ts" ? testSetupTS : testSetupJS;
  writeFile(testSetupFile, testSetupContent);

  // Create example test file
  const exampleTestFile = path.join(testDir, variant === "react-ts" ? "App.test.tsx" : "App.test.jsx");
  const exampleTestContent = variant === "react-ts" ? exampleTestTS : exampleTestJS;
  writeFile(exampleTestFile, exampleTestContent);

  // Add test script to package.json
  updatePackageJson(".", (json) => {
    json.scripts = {
      ...json.scripts,
      "test": "vitest",
      "test:ui": "vitest --ui",
      "test:run": "vitest run",
    };
    return json;
  });

  console.log(chalk.green("✅ Testing infrastructure configured successfully!"));
  console.log(chalk.yellow("📝 Run tests with: npm test"));
  console.log(chalk.yellow("📝 Run tests with UI: npm run test:ui"));
}

async function setupGitRepository(projectName: string): Promise<void> {
  console.log(chalk.yellow("\n🔧 Setting up Git repository..."));

  try {
    // Initialize git repository
    execSync("git init", { stdio: "inherit" });
    logger.verbose("Git repository initialized");

    // Create .gitattributes for proper line endings
    writeFile(".gitattributes", gitAttributesTemplate);
    logger.verbose("Created .gitattributes file");

    // Create initial commit
    execSync("git add .", { stdio: "pipe" });
    logger.verbose("Staged all files");

    execSync(`git commit -m "Initial commit: ${projectName} project created with create-devi"`, { stdio: "pipe" });
    logger.verbose("Created initial commit");

    console.log(chalk.green("✅ Git repository initialized with initial commit!"));
  } catch (error: any) {
    logger.warn("Failed to initialize git repository. You can do it manually with: git init");
    logger.debug(`Git error: ${error.message}`);
  }
}

function printNextSteps(projectName: string, cliOptions: CLIOptions): void {
  console.log(chalk.yellow("\n👉 Done. Now run:\n"));
  console.log(chalk.cyan(`  cd ${projectName}`));

  if (!cliOptions.install) {
    const pm = cliOptions.packageManager;
    const installCmd = pm === "npm" ? "npm install" : pm === "yarn" ? "yarn install" : "pnpm install";
    console.log(chalk.cyan(`  ${installCmd}`));
  }

  const devCmd = cliOptions.packageManager === "npm"
    ? "npm run dev"
    : cliOptions.packageManager === "yarn"
      ? "yarn dev"
      : "pnpm dev";

  console.log(chalk.cyan(`  ${devCmd}\n`));

  if (!cliOptions.install) {
    console.log(chalk.yellow("⚠️  Don't forget to install dependencies first!\n"));
  }
}
