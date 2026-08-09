import * as fs from "fs";
import * as path from "path";
import * as os from "os";

export interface GlobalConfig {
  token?: string;
  apiUrl?: string;
}

export interface ProjectConfig {
  projectId?: string;
  appName?: string;
  linkedAt?: string;
}

const GLOBAL_CONFIG_DIR = path.join(os.homedir(), ".piardify");
const GLOBAL_CONFIG_FILE = path.join(GLOBAL_CONFIG_DIR, "config.json");
const PROJECT_CONFIG_DIR = path.join(process.cwd(), ".piardify");
const PROJECT_CONFIG_FILE = path.join(PROJECT_CONFIG_DIR, "project.json");

export function getGlobalConfig(): GlobalConfig {
  try {
    if (fs.existsSync(GLOBAL_CONFIG_FILE)) {
      const content = fs.readFileSync(GLOBAL_CONFIG_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {
    // Ignore read errors
  }
  return {};
}

export function saveGlobalConfig(config: GlobalConfig): void {
  try {
    if (!fs.existsSync(GLOBAL_CONFIG_DIR)) {
      fs.mkdirSync(GLOBAL_CONFIG_DIR, { recursive: true });
    }
    const current = getGlobalConfig();
    const updated = { ...current, ...config };
    fs.writeFileSync(GLOBAL_CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e: any) {
    console.error("Failed to save global config:", e.message);
  }
}

export function getProjectConfig(): ProjectConfig {
  try {
    if (fs.existsSync(PROJECT_CONFIG_FILE)) {
      const content = fs.readFileSync(PROJECT_CONFIG_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (e) {}

  // Fallback: check environment variable
  if (process.env.PIARDIFY_PROJECT_ID) {
    return { projectId: process.env.PIARDIFY_PROJECT_ID };
  }
  return {};
}

export function saveProjectConfig(config: ProjectConfig): void {
  try {
    if (!fs.existsSync(PROJECT_CONFIG_DIR)) {
      fs.mkdirSync(PROJECT_CONFIG_DIR, { recursive: true });
    }
    const current = getProjectConfig();
    const updated = { ...current, ...config, linkedAt: new Date().toISOString() };
    fs.writeFileSync(PROJECT_CONFIG_FILE, JSON.stringify(updated, null, 2), "utf-8");
  } catch (e: any) {
    console.error("Failed to save project config:", e.message);
  }
}
