import * as fs from "fs";
import * as path from "path";
import { saveProjectConfig, getProjectConfig } from "../config/store.js";
import { apiRequest } from "../api/client.js";

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

export async function initCommand(options: { project?: string; json?: boolean }) {
  try {
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
        skillInstalled: targetSkillFile,
        currentTask,
      }));
    } else {
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
