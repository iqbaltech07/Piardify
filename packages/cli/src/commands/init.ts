import * as fs from "fs";
import * as path from "path";
import { saveProjectConfig, getProjectConfig, getGlobalConfig } from "../config/store.js";
import { apiRequest } from "../api/client.js";

const SKILL_CONTENT = `---
name: piardify
description: Automated PRD, Architecture Blueprint, Kanban Synchronization, and Task Execution Workflow for Piardify.
---

# Piardify Agent Skill

Piardify is an AI PRD Generator & System Architecture Tracking Platform. This skill guides AI Agents (such as Antigravity) to read product blueprints, execute Kanban tasks step-by-step, and automatically sync task status with the Piardify backend without manual user intervention.

---

## Direct Native Commands (Ultra-Fast 10ms Execution)

The Piardify CLI (\`npx piardify init\`) pre-generates lightweight 10ms native helper scripts (\`.piardify/sync\` or \`.piardify/sync.cmd\`) and local blueprint file \`.piardify/context.json\` for zero-latency execution:

| Action | Native Command (10ms Execution) | Fallback NPX Command |
| :--- | :--- | :--- |
| **Read Project Blueprint & Context** | Read \`.piardify/context.json\` (0ms) | \`npx piardify project context --json\` |
| **Get Active Task** | \`.piardify/sync current\` | \`npx piardify task current --json\` |
| **Start Task (\`IN_PROGRESS\`)** | \`.piardify/sync start <id>\` | \`npx piardify task start <id>\` |
| **Complete Task (\`DONE\`)** | \`.piardify/sync complete <id>\` | \`npx piardify task complete <id>\` |
| **Record Task Failure (\`FAILED\`)** | \`.piardify/sync fail <id> "<reason>"\` | \`npx piardify task fail <id> --reason "<r>"\` |

---

## Core Workflow Lifecycle

Read Local Context --> Start Task (10ms) --> Inspect & Code --> Local Verification --> Complete Task (10ms)
 (.piardify/            (.piardify/sync                    (npm run lint/build)      (.piardify/sync
  context.json)          start <id>)                                                  complete <id>)

Follow these exact steps when working on a Piardify project:

### Step 1: Read Project Context & Active Task
- Read local blueprint file \`.piardify/context.json\` using \`view_file\` (0ms token-efficient reading).
- Query active task:
  \`\`\`bash
  .piardify/sync current
  \`\`\`

### Step 2: Start the Task
Before starting code modifications, update the Kanban status to \`IN_PROGRESS\`:
\`\`\`bash
.piardify/sync start <task-id>
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
  .piardify/sync complete <task-id>
  \`\`\`
  *The Kanban card will automatically move to DONE on the Piardify web app in real-time.*

- **If implementation or tests fail:**
  \`\`\`bash
  .piardify/sync fail <task-id> "Build error in TypeScript compiler"
  \`\`\`
  *The task status will update to FAILED with the error context preserved for debugging.*

- **Fetch Next Task:**
  \`\`\`bash
  .piardify/sync current
  \`\`\`

---

## Anti-Hallucination Directives (\`AH-001\` to \`AH-010\`)

1. **\`AH-001\` Zero Invention [CRITICAL]**: Never add unapproved libraries, frameworks, or dependencies outside what is specified in the PRD.
2. **\`AH-002\` Zero Assumption [CRITICAL]**: Never assume un-documented API contracts, DB schemas, or response types. Verify from source code first.
3. **\`AH-003\` Status Sync [REQUIRED]**: Always sync task state (\`start\`, \`complete\`, \`fail\`) via \`.piardify/sync\` or \`npx piardify task\`.
4. **\`AH-004\` Local Verification Gate [CRITICAL]**: Run linter, compiler, and build checks locally before completing any task.
5. **\`AH-005\` Atomic Sequential Execution [CRITICAL]**: Process tasks 1 by 1. Do not jump ahead or update multiple task statuses simultaneously without verification.
`;

export async function initCommand(options: { project?: string; json?: boolean }) {
  try {
    const globalConfig = getGlobalConfig();
    const token = globalConfig.token || process.env.PIARDIFY_API_KEY || "";
    const baseUrl = (globalConfig.apiUrl || process.env.PIARDIFY_API_URL || "http://localhost:3000").replace(/\/$/, "");

    const statusRes = await apiRequest("/api/agent/status");
    if (!statusRes.authenticated) {
      throw new Error("NOT_AUTHENTICATED: Run 'npx piardify login --token <TOKEN>' first.");
    }

    let projectId = options.project || getProjectConfig().projectId;

    if (!projectId) {
      const projectsRes = await apiRequest("/api/agent/project");
      const projects = projectsRes.projects || [];

      if (projects.length === 0) {
        throw new Error("NO_PROJECTS_FOUND: No Piardify projects found in your account. Please create one on Piardify web app first.");
      }

      projectId = projects[0].id;
    }

    const projectRes = await apiRequest(`/api/agent/project?projectId=${projectId}`);
    const project = projectRes.project;

    if (!project) {
      throw new Error(`PROJECT_NOT_FOUND: Project ID '${projectId}' was not found.`);
    }

    saveProjectConfig({
      projectId: project.id,
      appName: project.appName,
    });

    const workspaceRoot = process.cwd();
    const piardifyDir = path.join(workspaceRoot, ".piardify");
    if (!fs.existsSync(piardifyDir)) {
      fs.mkdirSync(piardifyDir, { recursive: true });
    }

    // Save full project context locally in 0ms readable format
    try {
      const fullContextRes = await apiRequest(`/api/agent/project?projectId=${projectId}&section=context`);
      fs.writeFileSync(path.join(piardifyDir, "context.json"), JSON.stringify(fullContextRes, null, 2), "utf-8");
    } catch {}

    // Generate Windows CMD 10ms native helper
    const cmdScript = `@echo off
set "ACTION=%~1"
set "TASK_ID=%~2"
set "EXTRA=%~3"
set "API_URL=${baseUrl}"
set "TOKEN=${token}"
set "PROJECT_ID=${projectId}"

if "%ACTION%"=="start" (
  curl -s -X POST "%API_URL%/api/agent/tasks/%TASK_ID%/start?projectId=%PROJECT_ID%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
  exit /b
)
if "%ACTION%"=="complete" (
  curl -s -X POST "%API_URL%/api/agent/tasks/%TASK_ID%/complete?projectId=%PROJECT_ID%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json"
  exit /b
)
if "%ACTION%"=="fail" (
  curl -s -X POST "%API_URL%/api/agent/tasks/%TASK_ID%/fail?projectId=%PROJECT_ID%" -H "Authorization: Bearer %TOKEN%" -H "Content-Type: application/json" -d "{\\"reason\\":\\"%EXTRA%\\"}"
  exit /b
)
if "%ACTION%"=="current" (
  curl -s "%API_URL%/api/agent/tasks/current?projectId=%PROJECT_ID%" -H "Authorization: Bearer %TOKEN%"
  exit /b
)
if "%ACTION%"=="context" (
  curl -s "%API_URL%/api/agent/project?projectId=%PROJECT_ID%&section=context" -H "Authorization: Bearer %TOKEN%"
  exit /b
)
`;
    fs.writeFileSync(path.join(piardifyDir, "sync.cmd"), cmdScript, "utf-8");

    // Generate POSIX shell 10ms native helper
    const shScript = `#!/bin/sh
ACTION="$1"
TASK_ID="$2"
EXTRA="$3"
API_URL="${baseUrl}"
TOKEN="${token}"
PROJECT_ID="${projectId}"

if [ "$ACTION" = "start" ]; then
  curl -s -X POST "$API_URL/api/agent/tasks/$TASK_ID/start?projectId=$PROJECT_ID" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"
elif [ "$ACTION" = "complete" ]; then
  curl -s -X POST "$API_URL/api/agent/tasks/$TASK_ID/complete?projectId=$PROJECT_ID" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"
elif [ "$ACTION" = "fail" ]; then
  curl -s -X POST "$API_URL/api/agent/tasks/$TASK_ID/fail?projectId=$PROJECT_ID" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{\\"reason\\":\\"$EXTRA\\"}"
elif [ "$ACTION" = "current" ]; then
  curl -s "$API_URL/api/agent/tasks/current?projectId=$PROJECT_ID" -H "Authorization: Bearer $TOKEN"
elif [ "$ACTION" = "context" ]; then
  curl -s "$API_URL/api/agent/project?projectId=$PROJECT_ID&section=context" -H "Authorization: Bearer $TOKEN"
fi
`;
    const shPath = path.join(piardifyDir, "sync");
    fs.writeFileSync(shPath, shScript, { mode: 0o755 });

    // Install Agent Skill into workspace (.agents/skills/piardify/SKILL.md)
    const targetSkillDir = path.join(workspaceRoot, ".agents", "skills", "piardify");
    const targetSkillFile = path.join(targetSkillDir, "SKILL.md");

    if (!fs.existsSync(targetSkillDir)) {
      fs.mkdirSync(targetSkillDir, { recursive: true });
    }
    fs.writeFileSync(targetSkillFile, SKILL_CONTENT, "utf-8");

    let currentTask = null;
    try {
      const taskRes = await apiRequest(`/api/agent/tasks/current?projectId=${projectId}`);
      currentTask = taskRes.task;
    } catch {}

    if (options.json) {
      console.log(JSON.stringify({
        success: true,
        project: {
          id: project.id,
          appName: project.appName,
        },
        nativeHelpers: [path.join(piardifyDir, "sync.cmd"), shPath],
        localContext: path.join(piardifyDir, "context.json"),
        skillInstalled: targetSkillFile,
        currentTask,
      }));
    } else {
      console.log("\n==========================================");
      console.log("  Piardify CLI - Project Initialized");
      console.log("==========================================");
      console.log(`  Project Name  : ${project.appName}`);
      console.log(`  Project ID    : ${project.id}`);
      console.log("  Local Context : Saved -> .piardify/context.json (0ms)");
      console.log("  Native Helper : Generated -> .piardify/sync (10ms)");
      console.log("  Agent Skill   : Installed -> .agents/skills/piardify/SKILL.md");
      console.log(`  Authentication: Connected (${statusRes.user?.email})`);
      console.log("  Kanban Sync   : Active");
      if (currentTask) {
        console.log(`\n  Current Task  : #${currentTask.id} ${currentTask.title} [Status: ${currentTask.status.toUpperCase()}]`);
      } else {
        console.log("\n  Current Task  : None pending.");
      }
      console.log("\nAI Agent is ready to work on tasks.\n");
    }
  } catch (err: any) {
    if (options.json) {
      console.log(JSON.stringify({ success: false, error: err.message }));
    } else {
      console.error(`\n[ERROR] Initialization failed: ${err.message}\n`);
    }
    process.exit(1);
  }
}
