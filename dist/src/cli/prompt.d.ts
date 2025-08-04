export declare const getProjectName: () => Promise<string>;
export declare const getProjectVariant: () => Promise<"react" | "react-ts">;
export declare const getStyleMode: () => Promise<"tailwind" | "tailwind + shadcn" | "none">;
export declare const getRouterOption: () => Promise<boolean>;
