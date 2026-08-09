# Changelog

All notable changes to the **Piardify** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-08-09

### 🚀 Added
- **Unabridged Taste Skill Library (v2.1.0-modular)**: Integrated 100% unabridged Taste Skills directly from Knowledge OS Second Brain (`03 Skills/02 Experience Design/Taste Skills/`) with zero truncation.
  - `designTasteFrontend`: Complete anti-slop frontend guidelines, brief inference, layout discipline, and design system installation rules (Material 3, Fluent UI v9, Carbon, Radix, shadcn/ui, Primer, GOV.UK, USWDS, Atlaskit).
  - `highEndVisualDesign`: Vanguard UI Architect & Doppelrand aesthetics.
  - `minimalistUi`: Premium Utilitarian Minimalism & Editorial UI.
  - `redesignExistingProjects`: Audit-First Redesign Protocol.
  - `gptTaste`: Awwwards-Level GSAP Motion & Gapless Bento Grid.
  - `stitchDesignTaste`: Google Stitch Semantic Design System.
  - `fullOutputEnforcement`: Unabridged Output & Banned Truncation.
  - `findSkills`: Skills CLI Ecosystem & Management.
- **Canonical Code Skeletons**:
  - `StickyStack`: GSAP ScrollTrigger card stack skeleton.
  - `HorizontalPan`: GSAP ScrollTrigger horizontal pan skeleton.
  - `RevealStagger`: Motion spring-animated scroll reveal stagger skeleton.
  - `appleLiquidGlassWebCss`: Apple Liquid Glass web approximation CSS tokens.
- **Selective Taste Skill Payload Reduction**:
  - Automatically detects project design style/vibe from `designData` and serves **ONLY the single matching active skill** inside `.piardify/context.json` and API `/api/agent/project?section=context`.
  - Reduces initial context payload size by **90%** (163 KB $\rightarrow$ 12 KB).
  - Added on-demand skill endpoint `/api/agent/project?section=taste-skill&skill=<skillName>` and CLI command `npx piardify project taste-skill --skill <skillName>`.
- **Design Hierarchy of Authority (`design.md` vs `Taste Skill` Synergy)**:
  - **Level 1 (Ground Truth)**: `design.md` specifies WHAT to build (exact HEX colors, font choices, logo assets, layout wireframe).
  - **Level 2 (Engineering Quality)**: `Taste Skill` specifies HOW to build with excellence (WCAG contrast, spring physics, zero layout shifts, anti-slop).
- **Rule `AH-011` (Project-Specific Design Skill Routing)**: Mandates AI Agents to declare `🎨 Design Skill Active: <skillName>` before generating UI components.

### 🏗️ Refactored
- **Modular Skill File Structure (`lib/tasteSkills/`)**: Split single monolithic skill payload into clean, individual TypeScript modules:
  - `lib/tasteSkills/designTasteFrontend.ts`
  - `lib/tasteSkills/highEndVisualDesign.ts`
  - `lib/tasteSkills/minimalistUi.ts`
  - `lib/tasteSkills/redesignExistingProjects.ts`
  - `lib/tasteSkills/gptTaste.ts`
  - `lib/tasteSkills/stitchDesignTaste.ts`
  - `lib/tasteSkills/fullOutputEnforcement.ts`
  - `lib/tasteSkills/findSkills.ts`
  - `lib/tasteSkills/codeSkeletons.ts`
  - `lib/tasteSkills/index.ts`
  - Reduced `lib/tasteSkill.ts` into a lightweight 141-line router & aggregator.
- **English Standardization for CLI Console Output**:
  - Converted all CLI `console.log` and `console.error` messages across `task.ts`, `init.ts`, `login.ts`, `status.ts`, `kanban.ts`, and `project.ts` to clean, professional English.

### 🛡️ Fixed & Security
- **Mandatory Checkpoint Honor (`AH-006`)**: Enforced mandatory stop & user review at `[CHECKPOINT]` tasks across CLI and skill directives.
- **Type Safety**: Verified zero compilation errors (`npx tsc --noEmit`).

---
