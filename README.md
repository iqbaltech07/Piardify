# 🚀 Piardify — AI PRD Architect & System Architecture Tracking Platform (v2.7.0)

**Piardify** is an AI-powered platform for generating **Product Requirements Documents (PRDs)**, tracking System Architecture, and enforcing Anti-Slop Visual Governance for AI Agents and software developers.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.3-black.svg)](https://nextjs.org/)
[![CLI Version](https://img.shields.io/npm/v/piardify.svg)](https://www.npmjs.com/package/piardify)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Key Platform Features

- 📝 **AI PRD Generator**: Synthesize structured PRDs with tech stack recommendations powered by Google Gemini 3.6 Flash.
- 🗺️ **Visual Architecture Mindmap**: Interactive graph canvas with `@xyflow/react` for visual-to-JSON system structure.
- 🪝 **Piardify CLI v2.7.0**: Autonomous Agent Skill & CLI package for 10ms realtime Kanban task sync (`npx piardify`).
- 🛡️ **AST Anti-Slop Linter**: Static code analysis engine (`npx piardify validate-ui`) blocking AI slop visual patterns.
- 🎨 **Multi-Archetype Component Generator**: Scaffold 100% Anti-Slop UI components (`card`, `hero`, `table`, `form`, `modal`, `bento`).
- 🔒 **Automated Guardrail Hooks**: Git pre-commit & NPM pre-build hooks via `npx piardify hook`.

---

## 🛠️ Development & Local Setup

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore Piardify.

---

## 📦 Piardify CLI & Agent Skill Usage

```bash
# Authenticate CLI
npx piardify login --token <YOUR_TOKEN>

# Connect workspace to project
npx piardify init [--target web|mobile|iot|backend]

# Fetch live design tokens
npx piardify design

# Run AST Anti-Slop Linter
npx piardify validate-ui

# Scaffold Anti-Slop UI component
npx piardify generate hero LandingHero

# Install automated Git pre-commit & build guardrails
npx piardify hook
```

---

## 📋 License

MIT © [Piardify](https://piardify.com)
