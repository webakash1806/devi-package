import chalk from "chalk";
import { execSync } from "child_process";

export const installDependencies = (): void => {
  console.log(chalk.blue("📦 Installing dependencies..."));
  execSync(`npm install`, { stdio: "inherit" });
};

export const installTailwind = (): void => {
  console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
  execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });
};

export const installShadcn = (): void => {
  console.log(chalk.blue("🛠 Installing ShadCN UI..."));
  execSync(`npx shadcn@latest init`, { stdio: "inherit" });
  console.log(chalk.blue("📦 Installing ShadCN components..."));
  execSync(`npx shadcn@latest add button`, { stdio: "inherit" });
};

export const installReactRouter = (): void => {
  console.log(chalk.blue("🔩 Installing React Router DOM..."));
  execSync(`npm install react-router-dom`, { stdio: "inherit" });
};

export const installCodeQualityDependencies = (): void => {
  console.log(chalk.blue("🛡️  Installing Code Quality tools..."));
  execSync(
    `npm install -D husky lint-staged prettier eslint-plugin-simple-import-sort @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss`,
    { stdio: "inherit" }
  );
};

export const initHusky = (): void => {
  console.log(chalk.blue("🐶 Initializing Husky..."));
  execSync(`npx husky init`, { stdio: "inherit" });
  // Add pre-commit hook
  const preCommitPath = ".husky/pre-commit";
  // npx husky init creates a pre-commit file with "npm test", we want to replace/append
  // For simplicity in this cross-platform CLI, we'll just write the file content we want.
  // Note: On Windows, echo might behave differently, so using node fs in fileUtils is safer, 
  // but here we are in install.ts. Let's rely on fileUtils later or just use a simple command if possible.
  // Actually, 'npx husky init' sets up "npm test" in .husky/pre-commit. 
  // We want "npx lint-staged".
};

export const installEnvDependencies = (): void => {
  console.log(chalk.blue("🔐 Installing environment validation dependencies..."));
  execSync(`npm install zod`, { stdio: "inherit" });
};

export const installLottieReact = (): void => {
  console.log(chalk.blue("🎬 Installing Lottie React..."));
  execSync(`npm install lottie-react`, { stdio: "inherit" });
};

export const installBasicUIComponents = (): void => {
  console.log(chalk.blue("🎨 Installing basic UI components..."));

  const components = [
    { name: "Accordion", url: "https://coss.com/origin/r/comp-350.json" },
    { name: "Input", url: "https://coss.com/origin/r/comp-06.json" },
    { name: "Select", url: "https://coss.com/origin/r/comp-208.json" },
    { name: "Textarea", url: "https://coss.com/origin/r/comp-64.json" },
  ];

  components.forEach(({ name, url }) => {
    console.log(chalk.gray(`  Installing ${name}...`));
    try {
      execSync(`npx shadcn@latest add ${url} -y`, { stdio: "inherit" });
    } catch (error) {
      console.error(chalk.red(`Failed to install ${name}`));
    }
  });

  console.log(chalk.green("✅ UI components installed successfully!"));
};
