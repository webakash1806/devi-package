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
