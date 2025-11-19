import chalk from "chalk";
import * as fs from "fs";
import * as path from "path";

export const createProjectDirectories = (projectRoot: string): void => {
  const dirs = [
    path.join(projectRoot, "src", "Layout"),
    path.join(projectRoot, "src", "pages"),
    path.join(projectRoot, "src", "components", "ui"),
  ];

  dirs.forEach(dir => {
    fs.mkdirSync(dir, { recursive: true });
  });
};

export const writeFile = (filePath: string, content: string): void => {
  try {
    fs.writeFileSync(filePath, content);
  } catch (error: any) {
    console.error(chalk.red(`Error writing file ${filePath}:`, error.message));
    throw error;
  }
};

export const removeFile = (filePath: string): void => {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.log(chalk.gray(`No ${filePath} found, skipping...`));
  }
};

export const updatePackageJson = (projectRoot: string, updateFn: (json: any) => any): void => {
  const packageJsonPath = path.join(projectRoot, "package.json");
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    const updatedPackageJson = updateFn(packageJson);
    fs.writeFileSync(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2));
  }
};

export const updateTsConfig = (projectRoot: string, updateFn: (json: any) => any): void => {
  const tsConfigPath = path.join(projectRoot, "tsconfig.json");
  if (fs.existsSync(tsConfigPath)) {
    // tsconfig might have comments, but for this simple CLI we assume standard JSON or we might need a comment-aware parser.
    // However, the standard template we generate is clean JSON.
    // If it's not, we might break it.
    // Let's assume it's clean JSON as we generated it.
    try {
      const tsConfig = JSON.parse(fs.readFileSync(tsConfigPath, "utf-8"));
      const updatedTsConfig = updateFn(tsConfig);
      fs.writeFileSync(tsConfigPath, JSON.stringify(updatedTsConfig, null, 2));
    } catch (e) {
      console.log(chalk.yellow("⚠️  Could not parse tsconfig.json to enable strict mode. You may need to do it manually."));
    }
  }
};
