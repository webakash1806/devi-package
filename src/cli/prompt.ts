import inquirer from "inquirer";
import * as fs from "fs";
import { logger } from "./logger.js";

export const getProjectName = async (): Promise<string> => {
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Enter your project name:",
      validate: (input: string) => {
        if (!input || !input.trim()) {
          return "Project name cannot be empty!";
        }

        const trimmedInput = input.trim();

        // Check for invalid npm package name characters
        if (!/^[a-z0-9-_@/]+$/i.test(trimmedInput)) {
          return "Project name can only contain letters, numbers, dashes, underscores, @ and /";
        }

        // Check if starts with . or _
        if (trimmedInput.startsWith(".") || trimmedInput.startsWith("_")) {
          return "Project name cannot start with . or _";
        }

        // Check if directory already exists
        if (fs.existsSync(trimmedInput)) {
          return `Directory "${trimmedInput}" already exists. Please choose a different name.`;
        }

        logger.verbose(`Project name validated: ${trimmedInput}`);
        return true;
      },
    },
  ]);
  return projectName;
};

export const getProjectVariant = async (): Promise<"react" | "react-ts"> => {
  const { variant } = await inquirer.prompt([
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
  return variant;
};

export const getStyleMode = async (): Promise<"tailwind" | "tailwind + shadcn" | "none"> => {
  const { styleMode } = await inquirer.prompt([
    {
      type: "list",
      name: "styleMode",
      message: "Choose a Style mode:",
      choices: [
        { name: "tailwind CSS", value: "tailwind" },
        { name: "tailwind CSS + ShadCN UI", value: "tailwind + shadcn" },
        { name: "None", value: "none" },
      ],
    },
  ]);
  return styleMode;
};

export const getRouterOption = async (): Promise<boolean> => {
  const { router } = await inquirer.prompt([
    {
      type: "confirm",
      name: "router",
      message: "Do you want to set up React Router DOM?",
      default: false,
    },
  ]);
  return router;
};

export const getCodeQualityOption = async (): Promise<boolean> => {
  const { codeQuality } = await inquirer.prompt([
    {
      type: "confirm",
      name: "codeQuality",
      message: "Do you want to setup Code Quality tools? (Husky, Prettier, Lint-staged)",
      default: true,
    },
  ]);
  return codeQuality;
};

export const getEnvOption = async (): Promise<boolean> => {
  const { envSetup } = await inquirer.prompt([
    {
      type: "confirm",
      name: "envSetup",
      message: "Do you want to setup Environment Variables? (.env + validation)",
      default: true,
    },
  ]);
  return envSetup;
};

export const getUIComponentsOption = async (): Promise<boolean> => {
  const { uiComponents } = await inquirer.prompt([
    {
      type: "confirm",
      name: "uiComponents",
      message: "Do you want to add basic UI components? (Accordion, Input, Select, Textarea)",
      default: true,
    },
  ]);
  return uiComponents;
};

export const getTestingOption = async (): Promise<boolean> => {
  const { testing } = await inquirer.prompt([
    {
      type: "confirm",
      name: "testing",
      message: "Do you want to setup Testing? (Vitest + React Testing Library)",
      default: false,
    },
  ]);
  return testing;
};

export const getGitOption = async (): Promise<boolean> => {
  const { git } = await inquirer.prompt([
    {
      type: "confirm",
      name: "git",
      message: "Do you want to initialize Git repository?",
      default: true,
    },
  ]);
  return git;
};
