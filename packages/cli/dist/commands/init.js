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
const constants_js_1 = require("../config/constants.js");
const client_js_1 = require("../api/client.js");
async function initCommand(options) {
    try {
        const globalConfig = (0, store_js_1.getGlobalConfig)();
        const token = globalConfig.token || process.env.PIARDIFY_API_KEY || "";
        const baseUrl = (globalConfig.apiUrl || constants_js_1.DEFAULT_API_URL).replace(/\/$/, "");
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
        const piardifyDir = path.join(workspaceRoot, ".piardify");
        if (!fs.existsSync(piardifyDir)) {
            fs.mkdirSync(piardifyDir, { recursive: true });
        }
        // Save full project context locally in hybrid format (XML + Markdown + JSON)
        try {
            const fullContextRes = await (0, client_js_1.apiRequest)(`/api/agent/project?projectId=${projectId}&section=context`, { rawText: true });
            fs.writeFileSync(path.join(piardifyDir, "context.md"), fullContextRes, "utf-8");
        }
        catch { }
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
if "%ACTION%"=="taste" (
  curl -s "%API_URL%/api/agent/project?projectId=%PROJECT_ID%&section=taste-skill&skill=%TASK_ID%" -H "Authorization: Bearer %TOKEN%"
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
elif [ "$ACTION" = "taste" ]; then
  curl -s "$API_URL/api/agent/project?projectId=$PROJECT_ID&section=taste-skill&skill=$TASK_ID" -H "Authorization: Bearer $TOKEN"
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
        const bundledSkillPath = path.resolve(__dirname, "..", "..", "skills", "piardify", "SKILL.md");
        if (!fs.existsSync(bundledSkillPath)) {
            throw new Error(`BUNDLED_SKILL_MISSING: Bundled skill file not found at ${bundledSkillPath}. Reinstall the piardify package.`);
        }
        const skillContentToWrite = fs.readFileSync(bundledSkillPath, "utf-8");
        fs.writeFileSync(targetSkillFile, skillContentToWrite, "utf-8");
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
                nativeHelpers: [path.join(piardifyDir, "sync.cmd"), shPath],
                localContext: path.join(piardifyDir, "context.md"),
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
            console.log("  Local Context : Saved -> .piardify/context.md (hybrid format)");
            console.log("  Native Helper : Generated -> .piardify/sync (10ms)");
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
