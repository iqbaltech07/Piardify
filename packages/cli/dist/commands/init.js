"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const store_js_1 = require("../config/store.js");
const client_js_1 = require("../api/client.js");
const SKILL_CONTENT = `---
name: piardify
description: Automated PRD, Architecture Blueprint, Kanban Synchronization, and Task Execution Workflow for Piardify.
---

# Piardify Agent Skill

Piardify is an AI PRD Generator & System Architecture Tracking Platform. This skill guides AI Agents (such as Antigravity) to read product blueprints, execute Kanban tasks step-by-step, and automatically sync task status with the Piardify backend without manual user intervention.

---

## Core Workflow Lifecycle

Get Current Task  -->  Start Task  -->  Inspect & Code  -->  Local Verification  -->  Complete Task
 (npx piardify          (npx piardify                       (npm run lint/build)      (npx piardify
   task current)          task start)                                                  task complete)

Follow these exact steps when working on a Piardify project:

### Step 1: Read Project Context & Active Task
Fetch the project blueprint, system directives, and current active task using the Piardify CLI:
\`\`\`bash
npx piardify project context --json
npx piardify task current --json
\`\`\`

### Step 2: Start the Task
Before starting code modifications, update the Kanban status to \`IN_PROGRESS\`:
\`\`\`bash
npx piardify task start <task-id>
\`\`\`

### Step 3: Implement Changes
- Inspect the codebase (\`grep_search\`, \`list_dir\`, \`view_file\`).
- Write clean, production-ready code adhering strictly to the PRD specifications.
- Do NOT invent unmentioned libraries, frameworks, or database schemas (**AH-001 Zero Invention**).

### Step 4: Local Verification (CRITICAL GATE)
**DO NOT claim completion or mark a task as DONE before running local checks.**
Execute the following in the terminal:
1. \`npm run lint\` (or project linter)
2. \`npm run build\` (or relevant compiler/type check)
3. Relevant unit/integration tests if available.

### Step 5: Complete or Fail Task
- **If all verifications pass:**
  \`\`\`bash
  npx piardify task complete <task-id>
  \`\`\`
  *The Kanban card will automatically move to DONE on the Piardify web app.*

- **If implementation or tests fail:**
  \`\`\`bash
  npx piardify task fail <task-id> --reason "Build error in TS"
  \`\`\`
  *The task status will update to FAILED with the error context preserved.*

- **Fetch Next Task:**
  \`\`\`bash
  npx piardify task current --json
  \`\`\`
`;
async function initCommand(options) {
    try {
        const statusRes = await (0, client_js_1.apiRequest)("/api/agent/status");
        if (!statusRes.authenticated) {
            throw new Error("NOT_AUTHENTICATED: Run 'npx piardify login --token <TOKEN>' first.");
        }
        let projectId = options.project || (0, store_js_1.getProjectConfig)().projectId;
        if (!projectId) {
            const projectsRes = await (0, client_js_1.apiRequest)("/api/agent/project");
            const projects = projectsRes.projects || [];
            if (projects.length === 0) {
                throw new Error("NO_PROJECTS_FOUND: No Piardify projects found in your account. Please create one on Piardify web app first.");
            }
            projectId = projects[0].id;
        }
        const projectRes = await (0, client_js_1.apiRequest)(`/api/agent/project?projectId=${projectId}`);
        const project = projectRes.project;
        if (!project) {
            throw new Error(`PROJECT_NOT_FOUND: Project ID '${projectId}' was not found.`);
        }
        (0, store_js_1.saveProjectConfig)({
            projectId: project.id,
            appName: project.appName,
        });
        const workspaceRoot = process.cwd();
        const targetSkillDir = path.join(workspaceRoot, ".agents", "skills", "piardify");
        const targetSkillFile = path.join(targetSkillDir, "SKILL.md");
        if (!fs.existsSync(targetSkillDir)) {
            fs.mkdirSync(targetSkillDir, { recursive: true });
        }
        fs.writeFileSync(targetSkillFile, SKILL_CONTENT, "utf-8");
        let currentTask = null;
        try {
            const taskRes = await (0, client_js_1.apiRequest)(`/api/agent/tasks/current?projectId=${projectId}`);
            currentTask = taskRes.task;
        }
        catch { }
        if (options.json) {
            console.log(JSON.stringify({
                success: true,
                project: {
                    id: project.id,
                    appName: project.appName,
                },
                skillInstalled: targetSkillFile,
                currentTask,
            }));
        }
        else {
            console.log("\n==========================================");
            console.log("  Piardify CLI - Project Initialized");
            console.log("==========================================");
            console.log(`  Project Name  : ${project.appName}`);
            console.log(`  Project ID    : ${project.id}`);
            console.log("  Agent Skill   : Installed -> .agents/skills/piardify/SKILL.md");
            console.log(`  Authentication: Connected (${statusRes.user?.email})`);
            console.log("  Kanban Sync   : Active");
            if (currentTask) {
                console.log(`\n  Current Task  : #${currentTask.id} ${currentTask.title} [Status: ${currentTask.status.toUpperCase()}]`);
            }
            else {
                console.log("\n  Current Task  : None pending.");
            }
            console.log("\nAI Agent is ready to work on tasks.\n");
        }
    }
    catch (err) {
        if (options.json) {
            console.log(JSON.stringify({ success: false, error: err.message }));
        }
        else {
            console.error(`\n[ERROR] Initialization failed: ${err.message}\n`);
        }
        process.exit(1);
    }
}
