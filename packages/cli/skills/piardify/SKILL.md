---
name: piardify
description: Automated PRD, Architecture Blueprint, Kanban Synchronization, and Task Execution Workflow for Piardify.
---

# 🚀 Piardify Agent Skill

Piardify is an AI PRD Generator & System Architecture Tracking Platform. This skill guides AI Agents (such as Antigravity) to read product blueprints, execute Kanban tasks step-by-step, and automatically sync task status with the Piardify backend without manual user intervention.

---

## 🛠️ Direct Native Commands (Ultra-Fast 10ms Execution)

The Piardify CLI (`npx piardify init`) pre-generates lightweight 10ms native helper scripts (`.piardify/sync` or `.piardify/sync.cmd`) and local blueprint file `.piardify/context.md` for zero-latency execution:

| Action | Native Command (10ms Execution) | Fallback NPX Command |
| :--- | :--- | :--- |
| **Read Project Blueprint & Context** | Read `.piardify/context.md` (0ms) | `npx piardify project context --json` |
| **Get Active Task** | `.piardify/sync current` | `npx piardify task current --json` |
| **Start Task (`IN_PROGRESS`)** | `.piardify/sync start <id>` | `npx piardify task start <id>` |
| **Complete Task (`DONE`)** | `.piardify/sync complete <id>` | `npx piardify task complete <id>` |
| **Record Task Failure (`FAILED`)** | `.piardify/sync fail <id> "<reason>"` | `npx piardify task fail <id> --reason "<r>"` |

---

## 📋 Core Workflow Lifecycle

```text
Read Local Context ──► Start Task (10ms) ──► Inspect & Code ──► Local Verification ──► Complete Task (10ms)
 (.piardify/            (.piardify/sync                    (npm run lint/build)      (.piardify/sync
  context.md)             start <id>)                                                  complete <id>)
```

Follow these exact steps when working on a Piardify project:

### Step 1: Read Blueprint in Order (Structure ──► PRD ──► Design ──► Active Task)
- Read local blueprint file `.piardify/context.md` using `view_file` (0ms token-efficient reading).
- Digest the project blueprint in this exact hierarchical sequence:
  1. **`<structure>`**: Visual feature hierarchy, mindmap nodes, and architectural components.
  2. **`<prd_document>`**: Product Requirements Document (specs, user flow, data flow, API contracts).
  3. **`<design_data>`**: Color tokens, typography, layout rules, and UI anti-slop guidelines.
  4. **`<task_list>`**: Current task ID, acceptance criteria, and status.
- Query active task:
  ```bash
  .piardify/sync current
  ```

### Step 2: Start the Task
Before starting code modifications, update the Kanban status to `IN_PROGRESS`:
```bash
.piardify/sync start <task-id>
```

### Step 3: Implement Changes
- Inspect the codebase (`grep_search`, `list_dir`, `view_file`).
- Write clean, production-ready code adhering strictly to the PRD specifications.
- Do NOT invent unmentioned libraries, frameworks, or database schemas (**AH-001 Zero Invention**).

### Step 4: Local Verification (CRITICAL GATE)
**DO NOT claim completion or mark a task as DONE before running local checks.**
Execute the following in the terminal:
1. `npm run lint` (or project linter)
2. `npm run build` (or relevant compiler/type check)
3. Relevant unit/integration tests if available.

### Step 5: Complete or Fail Task
- **If all verifications pass:**
  ```bash
  .piardify/sync complete <task-id>
  ```
  *The Kanban card will automatically move to DONE on the Piardify web app in real-time.*

- **If implementation or tests fail:**
  ```bash
  .piardify/sync fail <task-id> "Build error in TypeScript compiler"
  ```
  *The task status will update to FAILED with the error context preserved for debugging.*

- **Fetch Next Task:**
  ```bash
  .piardify/sync current
  ```

---

## 🛡️ Anti-Hallucination Directives & Design Hierarchy

> [!IMPORTANT]
> To avoid redundant tokens, all `AH-00x` directives (Zero Invention, Local Verification Gate, Skill Routing, etc.) and the **Hierarchy of Authority** (`design.md` vs Taste Skill) are now injected dynamically into your context.
>
> **You MUST read and strictly obey the `<system_directives>` XML tag located at the very top of `.piardify/context.md`.**
> The rules listed there are non-negotiable and carry the highest execution priority.


