import { getGlobalConfig } from "../config/store.js";

export async function apiRequest(endpoint: string, options: { method?: string; body?: any; token?: string; apiUrl?: string } = {}): Promise<any> {
  const globalConfig = getGlobalConfig();
  const token = options.token || globalConfig.token || process.env.PIARDIFY_API_KEY || "";
  const baseUrl = (options.apiUrl || globalConfig.apiUrl || process.env.PIARDIFY_API_URL || "http://localhost:3000").replace(/\/$/, "");

  if (!token && !endpoint.includes("/api/agent/status")) {
    throw new Error("NOT_AUTHENTICATED: Please run 'npx piardify login --token <TOKEN>' first.");
  }

  const url = `${baseUrl}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers,
  };
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(url, fetchOptions);
    const data: any = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data.error?.message || data.error || res.statusText || "Request failed";
      throw new Error(`API_ERROR_${res.status}: ${msg}`);
    }
    return data;
  } catch (err: any) {
    if (err.message?.startsWith("API_ERROR_") || err.message?.startsWith("NOT_AUTHENTICATED")) {
      throw err;
    }
    throw new Error(`NETWORK_ERROR: Unable to connect to Piardify API at ${baseUrl}. ${err.message}`);
  }
}
