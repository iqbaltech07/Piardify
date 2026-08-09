"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRequest = apiRequest;
const store_js_1 = require("../config/store.js");
async function apiRequest(endpoint, options = {}) {
    const globalConfig = (0, store_js_1.getGlobalConfig)();
    const token = options.token || globalConfig.token || process.env.PIARDIFY_API_KEY || "";
    const baseUrl = (options.apiUrl || globalConfig.apiUrl || process.env.PIARDIFY_API_URL || "http://localhost:3000").replace(/\/$/, "");
    if (!token && !endpoint.includes("/api/agent/status")) {
        throw new Error("NOT_AUTHENTICATED: Please run 'npx piardify login --token <TOKEN>' first.");
    }
    const url = `${baseUrl}${endpoint}`;
    const headers = {
        "Content-Type": "application/json",
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const fetchOptions = {
        method: options.method || "GET",
        headers,
    };
    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }
    try {
        const res = await fetch(url, fetchOptions);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const msg = data.error?.message || data.error || res.statusText || "Request failed";
            throw new Error(`API_ERROR_${res.status}: ${msg}`);
        }
        return data;
    }
    catch (err) {
        if (err.message?.startsWith("API_ERROR_") || err.message?.startsWith("NOT_AUTHENTICATED")) {
            throw err;
        }
        throw new Error(`NETWORK_ERROR: Unable to connect to Piardify API at ${baseUrl}. ${err.message}`);
    }
}
