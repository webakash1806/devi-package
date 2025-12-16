import chalk from "chalk";
import { execSync } from "child_process";
import { logger } from "./logger.js";
let packageManager = "npm";
export const setPackageManager = (pm) => {
    packageManager = pm;
    logger.debug(`Package manager set to: ${pm}`);
};
export const getPackageManager = () => {
    return packageManager;
};
const getInstallCommand = (dev = false) => {
    const commands = {
        npm: { install: "npm install", installDev: "npm install -D" },
        yarn: { install: "yarn add", installDev: "yarn add -D" },
        pnpm: { install: "pnpm add", installDev: "pnpm add -D" },
    };
    return dev ? commands[packageManager].installDev : commands[packageManager].install;
};
const runCommand = (command, description) => {
    logger.verbose(description);
    logger.debug(`Running command: ${command}`);
    execSync(command, { stdio: "inherit" });
};
export const installDependencies = () => {
    console.log(chalk.blue("📦 Installing dependencies..."));
    const cmd = packageManager === "npm" ? "npm install" : packageManager === "yarn" ? "yarn install" : "pnpm install";
    runCommand(cmd, "Installing project dependencies");
};
export const installTailwind = () => {
    console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
    const cmd = `${getInstallCommand(true)} tailwindcss @tailwindcss/vite postcss autoprefixer`;
    runCommand(cmd, "Installing Tailwind CSS and related packages");
};
export const installShadcn = () => {
    console.log(chalk.blue("🛠 Installing ShadCN UI..."));
    runCommand("npx shadcn@latest init", "Initializing ShadCN UI");
    console.log(chalk.blue("📦 Installing ShadCN components..."));
    runCommand("npx shadcn@latest add button", "Installing button component");
};
export const installReactRouter = () => {
    console.log(chalk.blue("🔩 Installing React Router DOM..."));
    const cmd = `${getInstallCommand()} react-router-dom`;
    runCommand(cmd, "Installing React Router DOM");
};
export const installCodeQualityDependencies = () => {
    console.log(chalk.blue("🛡️  Installing Code Quality tools..."));
    const cmd = `${getInstallCommand(true)} husky lint-staged prettier eslint-plugin-simple-import-sort @trivago/prettier-plugin-sort-imports prettier-plugin-tailwindcss`;
    runCommand(cmd, "Installing code quality dependencies");
};
export const initHusky = () => {
    console.log(chalk.blue("🐶 Initializing Husky..."));
    runCommand("npx husky init", "Initializing Husky Git hooks");
};
export const installEnvDependencies = () => {
    console.log(chalk.blue("🔐 Installing environment validation dependencies..."));
    const cmd = `${getInstallCommand()} zod`;
    runCommand(cmd, "Installing Zod for environment validation");
};
export const installLottieReact = () => {
    console.log(chalk.blue("🎬 Installing Lottie React..."));
    const cmd = `${getInstallCommand()} lottie-react`;
    runCommand(cmd, "Installing Lottie React for animations");
};
export const installBasicUIComponents = () => {
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
            runCommand(`npx shadcn@latest add ${url} -y`, `Installing ${name} component`);
        }
        catch (error) {
            console.error(chalk.red(`Failed to install ${name}`));
        }
    });
    console.log(chalk.green("✅ UI components installed successfully!"));
};
export const installTestingDependencies = () => {
    console.log(chalk.blue("🧪 Installing testing dependencies..."));
    const cmd = `${getInstallCommand(true)} vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/ui`;
    runCommand(cmd, "Installing Vitest and React Testing Library");
};
