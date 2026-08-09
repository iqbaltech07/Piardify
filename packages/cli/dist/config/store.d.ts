export interface GlobalConfig {
    token?: string;
    apiUrl?: string;
}
export interface ProjectConfig {
    projectId?: string;
    appName?: string;
    linkedAt?: string;
}
export declare function getGlobalConfig(): GlobalConfig;
export declare function saveGlobalConfig(config: GlobalConfig): void;
export declare function getProjectConfig(): ProjectConfig;
export declare function saveProjectConfig(config: ProjectConfig): void;
