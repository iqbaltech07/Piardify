export declare function taskCommand(action?: string, taskId?: string, options?: {
    project?: string;
    status?: string;
    force?: boolean;
    reason?: string;
    json?: boolean;
}): Promise<void>;
