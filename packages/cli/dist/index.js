#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const login_js_1 = require("./commands/login.js");
const init_js_1 = require("./commands/init.js");
const status_js_1 = require("./commands/status.js");
const project_js_1 = require("./commands/project.js");
const task_js_1 = require("./commands/task.js");
const kanban_js_1 = require("./commands/kanban.js");
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
        if (args[i] === "--status" && args[i + 1]) {
            options.status = args[i + 1];
        }
        if (args[i] === "--reason" && args[i + 1]) {
            options.reason = args[i + 1];
        }
        if (args[i] === "--url" && args[i + 1]) {
            options.url = args[i + 1];
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
        case "task":
            await (0, task_js_1.taskCommand)(args[1], args[2], options);
            break;
        case "kanban":
            await (0, kanban_js_1.kanbanCommand)(options);
            break;
        case "help":
        case "-h":
        case "--help":
        default:
            if (options.json) {
                console.log(JSON.stringify({
                    name: "piardify",
                    version: "1.0.0",
                    commands: ["login", "init", "status", "project", "task", "kanban"],
                }));
            }
            else {
                console.log("\n  Piardify AI Agent CLI");
                console.log("  =====================");
                console.log("  Usage: npx piardify <command> [options]\n");
                console.log("  Core Developer Commands:");
                console.log("    npx piardify login --token <TOKEN>   Save auth token");
                console.log("    npx piardify init                    Connect project & install Agent Skill");
                console.log("    npx piardify status                  Display health & connection status\n");
                console.log("  AI Agent Commands:");
                console.log("    npx piardify project [section]       Fetch project context (prd, mindmap, directives)");
                console.log("    npx piardify task <action> [id]      Task lifecycle (list, current, start, complete, fail)");
                console.log("    npx piardify kanban                  Fetch full Kanban board state\n");
                console.log("  Flags:");
                console.log("    --json                              Machine-readable JSON output");
                console.log("    --project <id>                      Specify project ID explicitly");
                console.log("    --force                             Force state transitions\n");
            }
            break;
    }
}
main().catch((err) => {
    console.error("CLI Execution Error:", err.message);
    process.exit(1);
});
