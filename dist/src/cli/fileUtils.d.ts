export declare const createProjectDirectories: (projectRoot: string) => void;
export declare const writeFile: (filePath: string, content: string) => void;
export declare const removeFile: (filePath: string) => void;
export declare const updatePackageJson: (projectRoot: string, updateFn: (json: any) => any) => void;
export declare const updateTsConfig: (projectRoot: string, updateFn: (json: any) => any) => void;
