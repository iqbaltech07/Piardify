export declare function apiRequest(endpoint: string, options?: {
    method?: string;
    body?: any;
    token?: string;
    apiUrl?: string;
    rawText?: boolean;
}): Promise<any>;
