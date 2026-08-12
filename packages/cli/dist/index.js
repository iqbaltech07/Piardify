#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_js_1 = require("./commands/login.js");
const init_js_1 = require("./commands/init.js");
const status_js_1 = require("./commands/status.js");
const project_js_1 = require("./commands/project.js");
const task_js_1 = require("./commands/task.js");
const kanban_js_1 = require("./commands/kanban.js");
const validate_js_1 = require("./commands/validate.js");
const theme_js_1 = require("./commands/theme.js");
const hook_js_1 = require("./commands/hook.js");
const generate_js_1 = require("./commands/generate.js");
const design_js_1 = require("./commands/design.js");
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] ? args[0].toLowerCase() : "help";
    const options = {
        json: args.includes("--json"),
        quiet: args.includes("--quiet"),
        force: args.includes("--force"),
    };
    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--token" && args[i + 1]) {
            options.token = args[i + 1];
        }
        if (args[i] === "--project" && args[i + 1]) {
            options.project = args[i + 1];
        }
        if (args[i] === "--target" && args[i + 1]) {
            options.target = args[i + 1];
        }
        if (args[i] === "--status" && args[i + 1]) {
            options.status = args[i + 1];
        }
        if (args[i] === "--reason" && args[i + 1]) {
            options.reason = args[i + 1];
        }
        if (args[i] === "--url" && args[i + 1]) {
            options.url = args[i + 1];
        }
        if (args[i] === "--skill" && args[i + 1]) {
            options.skill = args[i + 1];
        }
    }
    switch (command) {
        case "login":
            await (0, login_js_1.loginCommand)(options);
            break;
        case "init":
            await (0, init_js_1.initCommand)(options);
            break;
        case "status":
            await (0, status_js_1.statusCommand)(options);
            break;
        case "project":
            await (0, project_js_1.projectCommand)(args[1], options);
            break;
        case "design":
        case "design-context":
            await (0, design_js_1.designCommand)(options);
            break;
        case "task":
            await (0, task_js_1.taskCommand)(args[1], args[2], options);
            break;
        case "kanban":
            await (0, kanban_js_1.kanbanCommand)(options);
            break;
        case "validate-ui":
        case "validate":
        case "validate-mobile":
        case "validate-hardware":
        case "validate-api":
            await (0, validate_js_1.validateCommand)(options);
            break;
        case "init-theme":
        case "theme":
            await (0, theme_js_1.themeCommand)(options);
            break;
        case "hook":
            await (0, hook_js_1.hookCommand)(options);
            break;
        case "generate":
            await (0, generate_js_1.generateCommand)(args[1], args[2], options);
            break;
        case "help":
        case "-h":
        case "--help":
        default:
            if (options.json) {
                console.log(JSON.stringify({
                    name: "piardify",
                    version: "2.2.4",
                    commands: ["login", "init", "status", "project", "design", "task", "kanban", "validate-ui", "init-theme", "hook", "generate"],
                }));
            }
            else {
                console.log("\n  Piardify AI Agent CLI v2.0");
                console.log("  ==========================");
                console.log("  Usage: npx piardify <command> [options]\n");
                console.log("  Core Developer Commands:");
                console.log("    npx piardify login --token <TOKEN>         Save auth token");
                console.log("    npx piardify init [--target web|mobile...] Connect project & setup Agent Skill");
                console.log("    npx piardify status                        Display health & connection status\n");
                console.log("  Anti-Slop Visual Governance & Tooling (v2.0):");
                console.log("    npx piardify design                        Fetch design context & tokens");
                console.log("    npx piardify validate-ui                   Run AST Anti-Slop Linter on workspace");
                console.log("    npx piardify init-theme                    Generate Tailwind preset & CSS tokens");
                console.log("    npx piardify hook                          Install Git pre-commit & build hooks");
                console.log("    npx piardify generate <ComponentName>     Scaffold 100% Anti-Slop compliant component\n");
                console.log("  AI Agent Commands:");
                console.log("    npx piardify project [tokens|rules|prd...] Fetch modular context or full hybrid");
                console.log("    npx piardify task <action> [id]            Task lifecycle (list, current, start, complete, fail)");
                console.log("    npx piardify kanban                        Fetch full Kanban board state\n");
                console.log("  Flags:");
                console.log("    --target <web|mobile|iot|backend>          Specify multi-domain target ecosystem");
                console.log("    --json                                    Machine-readable JSON output");
                console.log("    --project <id>                            Specify project ID explicitly");
                console.log("    --force                                   Force state transitions\n");
            }
            break;
    }
}
main().catch((err) => {
    console.error("CLI Execution Error:", err.message);
    process.exit(1);
});
