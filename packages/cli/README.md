# Piardify CLI

Official CLI & Agent Skill package for **Piardify** — AI PRD Generator & System Architecture Tracking Platform.

## Quick Start

Execute directly via `npx`:

```bash
npx piardify --help
```

### 1. Authenticate
Authenticate using your API key from Piardify Settings:

```bash
npx piardify login --token <YOUR_PIARDIFY_API_KEY>
```

### 2. Connect Project & Install Agent Skill
Run inside your target codebase workspace directory:

```bash
npx piardify init
```

This will:
- Connect the local directory with your Piardify project.
- Save local blueprint context to `.piardify/context.md` (hybrid format for optimal AI consumption).
- Generate zero-overhead native sync scripts (`.piardify/sync`).
- Install the **Piardify Agent Skill** into `.agents/skills/piardify/SKILL.md`.

### 3. Check Status
Verify your connection and active project:

```bash
npx piardify status
```

---

## AI Agent Integration

AI Agents (such as Antigravity) use `npx piardify` or the fast native `.piardify/sync` script to autonomously fetch tasks, update Kanban board status, and adhere to anti-hallucination directives.

### Key Commands

```bash
# Fetch project context
npx piardify project context --json

# Query current active task
npx piardify task current --json

# Update task status
npx piardify task start <TASK_ID>
npx piardify task complete <TASK_ID>
npx piardify task fail <TASK_ID> --reason "Error details"

# View full Kanban board
npx piardify kanban
```

---

## License

MIT © [Piardify](https://piardify.com)
