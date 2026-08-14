# Piardify CLI & Visual Governance Engine (v2.8.0)

Official CLI & Agent Skill package for **Piardify** — AI PRD Generator, System Architecture Tracker, & Anti-Slop Visual Governance Engine.

[![npm version](https://img.shields.io/npm/v/piardify.svg)](https://www.npmjs.com/package/piardify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ What's New in v2.8.0

- **🚀 Tri-Combo Zero-Redundancy Context Engine**: Reduces AI Agent context payload by **~84%** (from 1050+ lines to ~165 lines) via lazy-loaded Taste Skill pointers (`<active_skill fetch_cmd="...">`), minified 1-line Anti-Hallucination rule tags (`AH-001`..`AH-021`), and active task windowing.
- **💎 Gemini 3.7 Flash Ready**: Full support for high-reasoning Gemini 3.7 Flash models.
- **🎨 Anti-Slop Visual Governance & React Bits Directives**: AST-based UI linter (`npx piardify validate-ui`) and mandatory adaptive integration with `reactbits.dev` for animated backgrounds, micro-interactions, and obsidian surfaces.
- **📦 Multi-Platform Stack Presets**: Out-of-the-box presets for Vanilla Web (HTML+CSS+JS, LocalStorage), Flutter Mobile App, IoT Hardware (ESP32/MQTT), and React Native Expo.

---

## ⚡ Quick Start

Run directly via `npx` (Zero Installation Required):

```bash
npx piardify --help
```

### 1. Authenticate
Authenticate using your API key from Piardify Settings:

```bash
npx piardify login --token <YOUR_PIARDIFY_API_KEY>
```

### 2. Connect Project & Install Agent Skill
Run inside your codebase workspace:

```bash
npx piardify init [--target web|mobile|iot|backend]
```

This automatically:
- Links your workspace to your Piardify Project.
- Generates Tri-Combo Zero-Redundancy Context (`.piardify/context.md`).
- Generates 10ms native execution scripts (`.piardify/sync`).
- Installs **Piardify Agent Skill** into `.agents/skills/piardify/SKILL.md`.

### 3. Check Status
Verify your connection and active project:

```bash
npx piardify status
```

---

## 🎨 Anti-Slop Visual Governance & Tooling

Piardify CLI enforces automated visual governance to ensure 100% human-designed aesthetics with zero AI slop:

### 1. Live Design Context & Tokens
Fetch live design tokens (colors, typography rules, radius hierarchy) directly from Piardify API:

```bash
npx piardify design
```

### 2. AST Static Analysis Anti-Slop Linter
Scan source code without runtime overhead for visual slop (gradient headlines, over-nested cards >2 levels, forbidden slop colors `bg-slate-900`/`bg-black`, icon container syndrome, indiscriminate `rounded-2xl`, slow motion latencies):

```bash
npx piardify validate-ui
```

### 3. On-Demand Taste Skill Fetcher
Fetch full design tokens and implementation guidelines on-demand when writing UI components:

```bash
npx piardify skill
```

### 4. Modular Theme Presets Generator
Generate Tailwind CSS preset (`piardify.preset.js`) and CSS variables (`.piardify/theme.css`):

```bash
npx piardify init-theme
```

### 5. Multi-Archetype Component Generator
Scaffold 100% Anti-Slop compliant UI components for 6 UI archetypes (`card`, `hero`, `table`, `form`, `modal`, `bento`):

```bash
npx piardify generate hero LandingHero
npx piardify generate table AuditTable
npx piardify generate form ProjectForm
```

### 6. Automated CI/CD & Git Guardrail Hooks
Install Git Pre-Commit Hook (`.git/hooks/pre-commit`) and NPM Pre-Build Script (`"prebuild"` in `package.json`) to block bad commits/builds automatically:

```bash
npx piardify hook
```

---

## 🛠️ CLI Command Reference Matrix

| Command | Category | Description |
| :--- | :--- | :--- |
| `npx piardify login --token <t>` | Auth | Authenticate CLI with Bearer API token |
| `npx piardify init [--target <t>]` | Project Setup | Initialize workspace, context.md, and Agent Skill |
| `npx piardify status` | Health | Display connection status and project health |
| `npx piardify design` | Visual Governance | Fetch live design context and color tokens |
| `npx piardify skill` | Taste Skill | Fetch active Taste Skill specification on-demand |
| `npx piardify validate-ui` | Quality QA | Run AST Anti-Slop Linter on workspace source files |
| `npx piardify init-theme` | Theme | Generate Tailwind preset and CSS variables |
| `npx piardify generate [type] <Name>` | Scaffolding | Scaffold Anti-Slop UI component (card, hero, table, form, modal, bento) |
| `npx piardify hook` | CI/CD QA | Install Git pre-commit and NPM pre-build guardrails |
| `npx piardify project context` | Agent API | Fetch Tri-Combo zero-redundancy project context payload |
| `npx piardify task start <id>` | Kanban Lifecycle | Claim and mark Kanban task as IN_PROGRESS (10ms) |
| `npx piardify task complete <id>` | Kanban Lifecycle | Mark Kanban task as DONE (10ms) |
| `npx piardify kanban` | Task Board | Query complete active Kanban board state |

---

## 📋 License

MIT © [Piardify](https://piardify.com)
