#!/usr/bin/env node

import { loginCommand } from "./commands/login.js";
import { initCommand } from "./commands/init.js";
import { statusCommand } from "./commands/status.js";
import { projectCommand } from "./commands/project.js";
import { taskCommand } from "./commands/task.js";
import { kanbanCommand } from "./commands/kanban.js";
import { validateCommand } from "./commands/validate.js";
import { themeCommand } from "./commands/theme.js";
import { hookCommand } from "./commands/hook.js";
import { generateCommand } from "./commands/generate.js";
import { designCommand } from "./commands/design.js";

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : "help";

  const options: Record<string, any> = {
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
      await loginCommand(options);
      break;

    case "init":
      await initCommand(options);
      break;

    case "status":
      await statusCommand(options);
      break;

    case "project":
      await projectCommand(args[1], options);
      break;

    case "design":
    case "design-context":
      await designCommand(options);
      break;

    case "task":
      await taskCommand(args[1], args[2], options);
      break;

    case "kanban":
      await kanbanCommand(options);
      break;

    case "validate-ui":
    case "validate":
    case "validate-mobile":
    case "validate-hardware":
    case "validate-api":
      await validateCommand(options);
      break;

    case "init-theme":
    case "theme":
      await themeCommand(options);
      break;

    case "hook":
      await hookCommand(options);
      break;

    case "generate":
      await generateCommand(args[1], args[2], options);
      break;

    case "help":
    case "-h":
    case "--help":
    default:
      if (options.json) {
        console.log(JSON.stringify({
          name: "piardify",
          version: "2.7.1",
          commands: ["login", "init", "status", "project", "design", "task", "kanban", "validate-ui", "init-theme", "hook", "generate"],
        }));
      } else {
        console.log("\n  Piardify AI Agent CLI v2.7.1 (Anti-Slop Architecture)");
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
