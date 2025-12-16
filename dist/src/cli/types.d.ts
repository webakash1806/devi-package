export type Variant = "react" | "react-ts";
export type StyleMode = "tailwind" | "tailwind + shadcn" | "none";
export type PackageManager = "npm" | "yarn" | "pnpm";
export interface CLIOptions {
    template?: string;
    install: boolean;
    packageManager: PackageManager;
    dryRun: boolean;
    verbose: boolean;
    debug: boolean;
}
export interface TemplateConfig {
    name: string;
    description: string;
    variant: Variant;
    styleMode: StyleMode;
    router: boolean;
    codeQuality: boolean;
    env: boolean;
    uiComponents: boolean;
    testing: boolean;
    git: boolean;
}
export declare const TEMPLATE_PRESETS: Record<string, TemplateConfig>;
