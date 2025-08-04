import inquirer from "inquirer";
export const getProjectName = async () => {
    const { projectName } = await inquirer.prompt([
        {
            type: "input",
            name: "projectName",
            message: "Enter your project name:",
            validate: (input) => (input ? true : "Project name cannot be empty!"),
        },
    ]);
    return projectName;
};
export const getProjectVariant = async () => {
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
export const getStyleMode = async () => {
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
export const getRouterOption = async () => {
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
