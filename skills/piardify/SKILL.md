---
name: piardify
description: Automated PRD, Architecture Blueprint, Kanban Synchronization, and Task Execution Workflow for Piardify.
---

# 🚀 Piardify Agent Skill

Piardify is an AI PRD Generator & System Architecture Tracking Platform. This skill guides AI Agents (such as Antigravity) to read product blueprints, execute Kanban tasks step-by-step, and automatically sync task status with the Piardify backend without manual user intervention.

---

## 📋 Core Workflow Lifecycle

```text
Get Current Task  ──►  Start Task  ──►  Inspect & Code  ──►  Local Verification  ──►  Complete Task
 (npx piardify          (npx piardify                       (npm run lint/build)      (npx piardify
   task current)          task start)                                                  task complete)
```

Follow these exact steps when working on a Piardify project:

### Step 1: Read Project Context & Active Task
Fetch the project blueprint, system directives, and current active task using the Piardify CLI:
```bash
npx piardify project context --json
npx piardify task current --json
```

### Step 2: Start the Task
Before starting code modifications, update the Kanban status to `IN_PROGRESS`:
```bash
npx piardify task start <task-id>
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
  npx piardify task complete <task-id>
  ```
  *The Kanban card will automatically move to DONE on the Piardify web app.*

- **If implementation or tests fail:**
  ```bash
  npx piardify task fail <task-id> --reason "Build error: TS2322 in src/components/Header.tsx"
  ```
  *The task status will update to FAILED with the error context preserved for debugging.*

- **Fetch Next Task:**
  ```bash
  npx piardify task current --json
  ```

---

## 🛡️ Anti-Hallucination Directives (`AH-001` to `AH-010`)

1. **`AH-001` Zero Invention [CRITICAL]**: Never add unapproved libraries, frameworks, or dependencies outside what is specified in the PRD.
2. **`AH-002` Zero Assumption [CRITICAL]**: Never assume un-documented API contracts, DB schemas, or response types. Verify from source code first.
3. **`AH-003` Status Sync [REQUIRED]**: Always sync task state (`start`, `complete`, `fail`) via `npx piardify task`.
4. **`AH-004` Local Verification Gate [CRITICAL]**: Run linter, compiler, and build checks locally before completing any task.
5. **`AH-005` Atomic Sequential Execution [CRITICAL]**: Process tasks 1 by 1. Do not jump ahead or update multiple task statuses simultaneously without verification.
