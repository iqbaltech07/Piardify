export type Step = 1 | 2 | 3;

export interface FormData {
  appIdea: string;
  appName: string;
  stackMode: "manual" | "ai";
  stacks: {
    frontend: string;
    backend: string;
    database: string;
    deployment: string;
  };
  targetUser: string;
  platform: string;
  coreFeatures: string[];
  monetization: string;
  appScale: string;
  integrations: string[];
  designPreference: string;
}

export type StackCategory = "frontend" | "backend" | "database" | "deployment";
