---
name: piardify
description: Automated PRD, Architecture Blueprint, Kanban Synchronization, and Task Execution Workflow for Piardify.
---

# 🚀 Piardify Agent Skill

Piardify is an AI PRD Generator & System Architecture Tracking Platform. This skill guides AI Agents (such as Antigravity) to read product blueprints, execute Kanban tasks step-by-step, and automatically sync task status with the Piardify backend without manual user intervention.

---

## 🛠️ Direct Native Commands (Ultra-Fast 10ms Execution)

The Piardify CLI (`npx piardify init`) pre-generates lightweight 10ms native helper scripts (`.piardify/sync` or `.piardify/sync.cmd`) and local blueprint file `.piardify/context.json` for zero-latency execution:

| Action | Native Command (10ms Execution) | Fallback NPX Command |
| :--- | :--- | :--- |
| **Read Project Blueprint & Context** | Read `.piardify/context.json` (0ms) | `npx piardify project context --json` |
| **Get Active Task** | `.piardify/sync current` | `npx piardify task current --json` |
| **Start Task (`IN_PROGRESS`)** | `.piardify/sync start <id>` | `npx piardify task start <id>` |
| **Complete Task (`DONE`)** | `.piardify/sync complete <id>` | `npx piardify task complete <id>` |
| **Record Task Failure (`FAILED`)** | `.piardify/sync fail <id> "<reason>"` | `npx piardify task fail <id> --reason "<r>"` |

---

## 📋 Core Workflow Lifecycle

```text
Read Local Context ──► Start Task (10ms) ──► Inspect & Code ──► Local Verification ──► Complete Task (10ms)
 (.piardify/            (.piardify/sync                    (npm run lint/build)      (.piardify/sync
  context.json)          start <id>)                                                  complete <id>)
```

Follow these exact steps when working on a Piardify project:

### Step 1: Read Blueprint in Order (Structure ──► PRD ──► Design ──► Active Task)
- Read local blueprint file `.piardify/context.json` using `view_file` (0ms token-efficient reading).
- Digest the project blueprint in this exact hierarchical sequence:
  1. **`structure`**: Visual feature hierarchy, mindmap nodes, and architectural components.
  2. **`prd`**: Product Requirements Document (specs, user flow, data flow, API contracts).
  3. **`design`**: Color tokens, typography, layout rules, and UI anti-slop guidelines.
  4. **`tasks`**: Current task ID, acceptance criteria, and status.
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

## 🛡️ Anti-Hallucination Directives (`AH-001` to `AH-010`)

1. **`AH-001` Zero Invention [CRITICAL]**: Never add unapproved libraries, frameworks, or dependencies outside what is specified in the PRD.
2. **`AH-002` Zero Assumption [CRITICAL]**: Never assume un-documented API contracts, DB schemas, or response types. Verify from source code first.
3. **`AH-003` Status Sync [REQUIRED]**: Always sync task state (`start`, `complete`, `fail`) via `.piardify/sync` or `npx piardify task`.
4. **`AH-004` Local Verification Gate [CRITICAL]**: Run linter, compiler, and build checks locally before completing any task.
5. **`AH-005` Atomic Sequential Execution [CRITICAL]**: Process tasks 1 by 1. Do not jump ahead or update multiple task statuses simultaneously without verification.
