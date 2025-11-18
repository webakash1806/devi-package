import chalk from "chalk";
import { execSync } from "child_process";
export const installDependencies = () => {
    console.log(chalk.blue("📦 Installing dependencies..."));
    execSync(`npm install`, { stdio: "inherit" });
};
export const installTailwind = () => {
    console.log(chalk.blue("🎨 Installing Tailwind CSS & Vite plugin..."));
    execSync(`npm install -D tailwindcss @tailwindcss/vite postcss autoprefixer`, { stdio: "inherit" });
};
export const installShadcn = () => {
    console.log(chalk.blue("🛠 Installing ShadCN UI..."));
    execSync(`npx shadcn@latest init`, { stdio: "inherit" });
    console.log(chalk.blue("📦 Installing ShadCN components..."));
    execSync(`npx shadcn@latest add button`, { stdio: "inherit" });
};
export const installReactRouter = () => {
    console.log(chalk.blue("🔩 Installing React Router DOM..."));
    execSync(`npm install react-router-dom`, { stdio: "inherit" });
};
