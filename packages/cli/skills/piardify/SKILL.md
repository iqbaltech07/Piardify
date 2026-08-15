---
name: piardify
description: Automated PRD, Architecture Blueprint, Kanban Synchronization, and Task Execution Workflow for Piardify.
---

# 🚀 Piardify Agent Skill

Piardify is an AI PRD Generator & System Architecture Tracking Platform. This skill guides AI Agents to read product blueprints, execute Kanban tasks step-by-step, and automatically sync task status with the Piardify backend without manual user intervention.

## 📌 Single Source of Truth (SSOT) Priority Rules

To prevent AI Agent cognitive overload or token duplication confusion, follow this strict SSOT reading order:
1. **Primary Ground Truth**: `.piardify/context.md` (Contains XML+Markdown top-pinned design locks, layout governance, PRD, and task status in 1 unified snapshot).
2. **Live Remote Design Refresh**: `npx piardify design` (Use ONLY if user specifies they just updated design tokens on the Piardify Web App).
3. **Helper Files**: `.piardify/tokens.json` & `.piardify/anti_slop_rules.md` are programmatic helper caches for CLI commands/linters. AI Agents DO NOT need to read them separately if `.piardify/context.md` has already been read.

---

## 🛠️ Direct Native Commands (Ultra-Fast 10ms Execution)

The Piardify CLI (`npx piardify init`) pre-generates lightweight 10ms native helper scripts (`.piardify/sync` or `.piardify/sync.cmd`) and local blueprint file `.piardify/context.md` for zero-latency execution:

| Action | Native Command (10ms Execution) | Fallback NPX Command |
| :--- | :--- | :--- |
| **Read Project Blueprint & Context** | Read `.piardify/context.md` (0ms) | `npx piardify project context --json` |
| **Fetch Design Context & Tokens** | Read `.piardify/tokens.json` | `npx piardify design` |
| **Get Active Task** | `.piardify/sync current` | `npx piardify task current --json` |
| **Start Task (`IN_PROGRESS`)** | `.piardify/sync start <id>` | `npx piardify task start <id>` |
| **Complete Task (`DONE`)** | `.piardify/sync complete <id>` | `npx piardify task complete <id>` |
| **Record Task Failure (`FAILED`)** | `.piardify/sync fail <id> "<reason>"` | `npx piardify task fail <id> --reason "<r>"` |
| **Fetch Complete Taste Skill** | `.piardify/sync taste <skill-key>` | `npx piardify project taste-skill --skill <skill-key>` |
| **Fetch Modular Design Tokens** | Read `.piardify/tokens.json` | `npx piardify project tokens` |
| **Fetch Anti-Slop Rules** | Read `.piardify/anti_slop_rules.md` | `npx piardify project rules` |
| **Run AST Anti-Slop Linter** | `.piardify/sync validate` | `npx piardify validate-ui` |
| **Generate Theme Boilerplate** | `.piardify/sync theme` | `npx piardify init-theme` |
| **Scaffold Anti-Slop Component** | N/A | `npx piardify generate [type] <Name>` |
| **Install Guardrail Hooks** | N/A | `npx piardify hook` |

---

## 📋 Core Workflow Lifecycle

```text
Read Local Context ──► Start Task (10ms) ──► Inspect & Code ──► Local Verification ──► Complete Task (10ms)
 (.piardify/            (.piardify/sync                    (npm run lint/build)      (.piardify/sync
  context.md)             start <id>)                                                  complete <id>)
```

Follow these exact steps when working on a Piardify project:

### Step 1: Read Blueprint in Order (Personalization ──► Structure ──► PRD ──► Design ──► Active Task)
- Read local blueprint file `.piardify/context.md` using `view_file` (0ms token-efficient reading).
- **FRESHNESS GATE (AH-017)**: Bandingkan `generatedAt` di komentar header `<!-- Piardify Context Snapshot -->` dengan `<project_context>.updatedAt`. Jika `updatedAt` LEBIH BARU dari `generatedAt`, konteks sudah basi — refresh dulu:
  ```bash
  .piardify/sync context > .piardify/context.md
  ```
  lalu baca ulang file tersebut.
- Digest the project blueprint in this exact hierarchical sequence:
  1. **`<personalization_inputs>`**: Jawaban 7-step personalization & tech stack (target user, platform, core features, monetisasi, skala, integrasi, design preference).
  2. **`<structure>`**: Visual feature hierarchy, mindmap nodes, dan architectural components.
  3. **`<prd_document>`**: Product Requirements Document (specs, user flow, data flow, API contracts).
  4. **`<design_data>`**: Color tokens, typography, layout rules, dan UI anti-slop guidelines.
  5. **`<task_list>`**: Current task ID, acceptance criteria, dan status.
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
- **MANDATORY DESIGN CONTEXT GATE (AH-018)**: Sebelum menulis/mengubah komponen UI/frontend, AI Agent WAJIB membaca 100% Konteks Desain (`npx piardify design` atau `.piardify/sync design`) TANPA ADA SATUPUN ATURAN/TOKEN YANG TERABAIKAN.
- **MANDATORY SHADCN/UI MANDATE (AH-021)**: AI Agent WAJIB MUTLAK menggunakan `shadcn/ui` primitives (`@/components/ui/*`) untuk seluruh pembuatan dan pengeditan komponen UI (Button, Input, Dialog, Select, Card, Sheet, DropdownMenu, Table, Tabs, Tooltip, Popover, Avatar, Badge). Dilarang mengarang komponen raw HTML polos dari nol.
- Inspect the codebase (`grep_search`, `list_dir`, `view_file`).
- Write clean, production-ready code adhering strictly to the PRD specifications.
- Do NOT invent unmentioned libraries, frameworks, or database schemas (**AH-001 Zero Invention**).
- **Complete Taste Skill**: The `<taste_skill>` in `.piardify/context.md` may embed hanya excerpt skill (untuk hemat token). Sebelum pekerjaan UI yang kompleks, fetch skill LENGKAP-nya:
  ```bash
  .piardify/sync taste <active_key>
  ```
  atau `npx piardify project taste-skill --skill <active_key>`.

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


