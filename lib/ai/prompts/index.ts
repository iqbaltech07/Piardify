/**
 * Centralized AI Prompts Registry & Type-Safe Builders for Piardify
 *
 * All system prompts, few-shot templates, and prompt builder functions
 * for all AI generation flows (Questions, Recommend Stack, PRD, Edit PRD,
 * Struktur, Tasks) are centralized here for seamless maintainability.
 */

import { BASE_SYSTEM_PROMPT, PRD_TEMPLATE, PRD_TEMPLATE_FALLBACK } from "./templateAssets";

export { BASE_SYSTEM_PROMPT, PRD_TEMPLATE, PRD_TEMPLATE_FALLBACK };

// ============================================================================
// 1. DYNAMIC QUESTIONS GENERATOR PROMPTS
// ============================================================================

export const QUESTIONS_SYSTEM_PROMPT = `You are an expert Product Manager. The user is building a new application.
Your task is to generate EXACTLY 7 multiple-choice clarifying questions to deeply understand their specific app idea and technical stack.
These questions will be asked in a form to generate a Product Requirements Document (PRD).

CRITICAL INSTRUCTIONS:
1. Generate exactly 7 questions.
2. The questions must be highly tailored to the user's specific app idea, NOT generic questions.
3. Each question must have a 'key' (camelCase string), 'title' (the question itself), 'subtitle' (a brief explanation), 'type' (either "single" for one choice or "multiple" for multiple choices), and 'options' (an array of 4-7 possible answers).
4. Do not ask for the app name, idea, or tech stack, as we already have those.
5. Return the result strictly as a JSON array matching the schema, wrapped in [ and ].

You MUST return ONLY a JSON array of exactly 7 question objects. Example format:
[{"key":"targetAudience", "title":"Who is the target audience?", "subtitle":"Describe the users", "type":"single", "options":["Startups", "Enterprise"]}]`;

export const QUESTIONS_RETRY_SYSTEM_PROMPT = `${QUESTIONS_SYSTEM_PROMPT}

CRITICAL: Return ONLY valid JSON array with 7 question objects. Wrap the array in [ and ]. Do not omit brackets or add trailing commas.`;

export interface QuestionsPromptParams {
  appName?: string;
  appIdea: string;
  stacks?: {
    frontend?: string;
    backend?: string;
    database?: string;
    deployment?: string;
  };
}

export function buildQuestionsUserPrompt({ appName, appIdea, stacks }: QuestionsPromptParams): string {
  return `App Name: ${appName || "N/A"}
App Idea: ${appIdea}
Tech Stack: Frontend (${stacks?.frontend || "N/A"}), Backend (${stacks?.backend || "N/A"}), Database (${stacks?.database || "N/A"}), Deployment (${stacks?.deployment || "N/A"})`;
}

// ============================================================================
// 2. TECH STACK & COLOR PALETTE RECOMMENDATION PROMPTS
// ============================================================================

export const RECOMMEND_STACK_SYSTEM_PROMPT = `You are a Principal Software Architect and Design System Specialist.
Your task is to analyze the user's application idea and recommend the optimal, production-ready tech stack and color palette.

Choose the most suitable combination from these options or best industry standards:
- Frontend: "Next.js", "React", "HTML5 / Vanilla JS", "Vue.js", "Svelte", "Flutter (Dart)", "React Native (Expo)", "Swift / SwiftUI", "Kotlin (Jetpack Compose)", "Embedded C/C++ (ESP32)", "Astro", "HTMX"
- Backend: "Next.js (API Routes)", "None (Client-Side Only)", "Node.js", "Python (FastAPI/Django)", "Laravel", "NestJS", "Node.js (MQTT Broker)", "Firebase Cloud Functions", "Spring Boot", "Go", "Rust (Actix/Axum)"
- Database: "PostgreSQL", "LocalStorage / IndexedDB", "MySQL", "MongoDB", "Supabase", "Firebase Firestore", "SQLite (Offline-First)", "Redis", "InfluxDB / TimescaleDB"
- Deployment: "Vercel", "GitHub Pages", "Google Play & App Store", "AWS", "Railway", "PlatformIO / OTA", "EAS (Expo)", "Cloudflare Workers / Pages"
- Palette ID: Choose ONE of "amber-cyber" (Dark Cyber), "ocean-indigo" (Light Enterprise), "electric-emerald" (Tech Dark), "neon-violet" (SaaS Dark Glow), "crimson-coral" (Minimal Vibrant Light)

RESPONSE FORMAT (Strict JSON only):
{
  "stacks": {
    "frontend": "e.g. Next.js",
    "backend": "e.g. Next.js (API Routes)",
    "database": "e.g. PostgreSQL",
    "deployment": "e.g. Vercel"
  },
  "paletteId": "amber-cyber",
  "badge": "e.g. Fullstack Serverless",
  "reasoning": "1-2 concise sentences in Indonesian explaining why this stack and theme fits the product idea."
}`;

export interface RecommendStackPromptParams {
  appName?: string;
  appIdea: string;
}

export function buildRecommendStackUserPrompt({ appName, appIdea }: RecommendStackPromptParams): string {
  return `App Name: ${appName || "New Project"}
App Idea: ${appIdea}

Recommend the best tech stack and palette. Output valid JSON.`;
}

// ============================================================================
// 3. PRD GENERATION PROMPTS
// ============================================================================

export function buildPrdSystemPrompt(): string {
  return `${BASE_SYSTEM_PROMPT}

=== TEMPLATE START ===
${PRD_TEMPLATE || PRD_TEMPLATE_FALLBACK}
=== TEMPLATE END ===`;
}

export interface PrdPromptParams {
  appName?: string;
  appIdea?: string;
  stacks?: {
    frontend?: string;
    backend?: string;
    database?: string;
    deployment?: string;
  };
  dynamicQuestions?: Array<{ key: string; title: string }>;
  dynamicAnswers?: Record<string, string | string[]>;
  fallbackAnswers?: {
    targetUser?: string;
    platform?: string;
    coreFeatures?: string[];
    monetization?: string;
    appScale?: string;
    integrations?: string[];
    designPreference?: string;
  };
  integrations?: string[];
  strukturData?: string | null;
}

export function buildPrdUserPrompt({
  appName,
  appIdea,
  stacks,
  dynamicQuestions,
  dynamicAnswers,
  fallbackAnswers,
  integrations,
  strukturData,
}: PrdPromptParams): string {
  let answersStr = "";

  if (dynamicQuestions && dynamicAnswers) {
    dynamicQuestions.forEach((q) => {
      const ans = dynamicAnswers[q.key];
      const ansStr = Array.isArray(ans) ? ans.join(", ") : ans || "N/A";
      answersStr += `- ${q.title}: ${ansStr}\n`;
    });
  } else if (fallbackAnswers) {
    answersStr = `- Target User: ${fallbackAnswers.targetUser || "N/A"}
- Platform: ${fallbackAnswers.platform || "N/A"}
- Core Features: ${Array.isArray(fallbackAnswers.coreFeatures) ? fallbackAnswers.coreFeatures.join(", ") : "N/A"}
- Monetization: ${fallbackAnswers.monetization || "N/A"}
- App Scale: ${fallbackAnswers.appScale || "N/A"}
- Integrations: ${Array.isArray(fallbackAnswers.integrations) ? fallbackAnswers.integrations.join(", ") : "N/A"}
- Design Preference: ${fallbackAnswers.designPreference || "N/A"}`;
  }

  const integrationsList = Array.isArray(integrations) && integrations.length > 0
    ? integrations.filter((i: string) => i !== "None").join(", ")
    : "None";

  let prompt = `Generate a PRD based on the following user inputs:
    
- App Name: ${appName || "N/A"}
- App Idea: ${appIdea || "N/A"}
- Frontend Stack: ${stacks?.frontend || "N/A"}
- Backend Stack: ${stacks?.backend || "N/A"}
- Database Stack: ${stacks?.database || "N/A"}
- Deployment Stack: ${stacks?.deployment || "N/A"}
${answersStr}

[SELECTED INTEGRATIONS - CRITICAL]
The following third-party integrations have been selected by the user and MUST be explicitly described inside the corresponding feature section of the PRD (not just listed in tech stack):
${integrationsList}

For each integration above, include a dedicated sub-section or detailed bullet inside the relevant feature section explaining HOW it is used (e.g. OAuth flow, API calls, webhook handling, SDK usage, etc.).
`;

  if (strukturData) {
    try {
      const s = JSON.parse(strukturData);
      if (s.nodes && Array.isArray(s.nodes)) {
        const structSummary = s.nodes.map((n: { label?: string; phase?: number; children?: Array<{ label?: string }> }, idx: number) => {
          const children = Array.isArray(n.children) ? n.children.map((c: { label?: string }) => `  - ${c.label}`).join("\n") : "";
          return `• Module ${idx + 1}: ${n.label || "Module"} (Phase ${n.phase || 1})\n${children}`;
        }).join("\n");
        prompt += `\n[EXISTING PROJECT STRUCTURE & PHASES - MANDATORY 1-TO-1 ALIGNMENT]\nThe project structure has already been defined with the following modules and phases. You MUST align Section 4 (Features) and Section 10 (Implementation Roadmap & Milestones) directly with these exact modules and phases:\n${structSummary}\n`;
      }
    } catch { }
  }

  return prompt;
}

// ============================================================================
// 4. STRUKTUR / FEATURE MINDMAP PROMPTS
// ============================================================================

export const STRUKTUR_SYSTEM_PROMPT = `You are a senior software architect specializing in product decomposition and feature mapping.

Your task: Analyze the app idea and decompose it into a structured feature mindmap that will DIRECTLY correspond to the PRD sections generated for this same project.

RESPONSE FORMAT (strict JSON only, no markdown, no explanation):
{
  "title": "App Name",
  "description": "One-line compelling product description",
  "nodes": [
    {
      "id": "unique-kebab-id",
      "label": "Feature Module Name",
      "phase": 1,
      "color": "#818cf8",
      "children": [
        { "id": "unique-child-id", "label": "Specific sub-feature or capability" },
        { "id": "unique-child-id-2", "label": "Another specific capability" }
      ]
    }
  ]
}

RULES FOR NODES:
1. Generate EXACTLY 5-7 top-level feature module nodes.
2. Each top-level node MUST correspond to a real feature category that will appear in the PRD (e.g. "Authentication", "Dashboard", "AI Engine", "Payment", "Notifications").
3. DO NOT generate generic process nodes like "Tech Stack", "Monetization", "Project Setup", "Testing" — these are NOT features.
4. Each node MUST have a "phase" (integer from 1 to N, representing the sequential development phase). If the PRD is provided, assign the matching phase number from Section 10 of the PRD.
5. Each node MUST have a "color" — use these palette options based on phase:
   - Phase 1: "#6366f1" (indigo) or "#3b82f6" (blue) or "#06b6d4" (cyan)
   - Phase 2: "#10b981" (emerald) or "#8b5cf6" (violet) or "#f59e0b" (amber)
   - Phase 3+: "#f97316" (orange) or "#ec4899" (pink) or "#64748b" (slate)
6. Each node should have 3-6 children representing SPECIFIC, ACTIONABLE sub-features.
7. Keep all labels concise (max 5 words), use Title Case.
8. Base ALL nodes strictly on the user's provided Core Features and app idea.
9. Return ONLY valid JSON, nothing else.`;

export interface StrukturPromptParams {
  appName?: string;
  appIdea?: string;
  targetUser?: string;
  platform?: string;
  coreFeatures?: string[];
  monetization?: string;
  appScale?: string;
  integrations?: string[];
  stacks?: {
    frontend?: string;
    backend?: string;
    database?: string;
    deployment?: string;
  };
  designPreference?: string;
  prdData?: string | null;
}

export function buildStrukturUserPrompt({
  appName,
  appIdea,
  targetUser,
  platform,
  coreFeatures,
  monetization,
  appScale,
  integrations,
  stacks,
  designPreference,
  prdData,
}: StrukturPromptParams): string {
  let prompt = `Generate a feature mindmap for this product:

App Name: ${appName || "N/A"}
App Idea: ${appIdea || "N/A"}
Target User: ${targetUser || "N/A"}
Platform: ${platform || "N/A"}
Core Features Selected: ${Array.isArray(coreFeatures) ? coreFeatures.join(", ") : "N/A"}
Monetization Model: ${monetization || "N/A"}
App Scale: ${appScale || "N/A"}
Integrations: ${Array.isArray(integrations) ? integrations.join(", ") : "N/A"}
Frontend Stack: ${stacks?.frontend || "N/A"}
Backend Stack: ${stacks?.backend || "N/A"}
Database: ${stacks?.database || "N/A"}
Deployment: ${stacks?.deployment || "N/A"}
Design Preference: ${designPreference || "N/A"}

IMPORTANT: The nodes you generate will be used as the feature structure for the PRD. Make sure each node maps to a real section of features in the product.
`;

  if (prdData) {
    prompt += `\n[EXISTING PRD CONTENT - STRICT PHASE & FEATURE MATCHING]\nYou MUST extract and align with the exact phases from Section 10 (Implementation Roadmap & Milestones) of this PRD so that each feature node has the matching phase number (Phase 1, Phase 2, ..., Phase N):\n${prdData.slice(0, 3000)}\n`;
  }

  return prompt;
}

// ============================================================================
// 5. TASK KANBAN GENERATOR PROMPTS
// ============================================================================

export const TASKS_BASE_SYSTEM_PROMPT = `You are a senior software project manager and Vibe Coding AI Architect. Based on the PRD, project structure (Feature Mindmap & Sub-features), design specifications (design.md), and app info, generate a comprehensive, highly actionable 6-PHASE task list for building this project following a FRONTEND-FIRST workflow with 3 MANDATORY STRATEGIC CHECKPOINTS.

RESPONSE FORMAT (strict JSON only, no markdown):
{
  "phases": [
    {
      "id": "phase-id",
      "name": "Phase Name",
      "description": "Short phase description",
      "tasks": [
        {
          "id": "task-id",
          "title": "Task title",
          "description": "What needs to be done. Must include design/API references and sub-feature deliverables.",
          "estimasi": "e.g. 2 hari, 1 minggu",
          "tags": ["tag1", "tag2"],
          "isCheckpoint": false,
          "definitionOfDone": "Clear, verifiable acceptance criteria (e.g. 'All mock data in file X replaced with real API fetch')"
        }
      ]
    }
  ]
}

FRONTEND-FIRST 6-PHASE STRUCTURE — YOU MUST GENERATE ALL 6 PHASES IN THIS EXACT ORDER WITH CONCISE 1-2 WORD PHASE NAMES, NO EXCEPTIONS:

Phase 1: Desain Sistem
- Setup architecture, color hex tokens, typography, and UI component guidelines in 'design.md'.
- MUST include CHECKPOINT 1 task: "[CHECKPOINT] Review & ACC Token Desain (design.md) & Arsitektur dengan User".

Phase 2: Setup Base
- Initializing project workspace, Tailwind CSS/styling setup, base page layout, navigation structure, and UI component library.

Phase 3: UI Frontend (MANDATORY 1-TO-1 FEATURE & SUB-FEATURE COVERAGE)
- YOU MUST GENERATE GRANULAR UI TASKS CORRESPONDING TO EVERY SINGLE CATEGORY AND ITS SUB-FEATURES LISTED IN 'Project Structure (Feature Mindmap)'.
- Task Title MUST explicitly mention the Category and Sub-Feature name (e.g., 'Hero Section & Dynamic Video Banner UI', 'Property Catalog & Filter Grid UI', 'Detailed Property Showcase & Gallery UI', 'Lead Capture Form & WhatsApp CTA UI', 'Interactive Area Map View UI').
- Task Tags MUST include the exact keywords of its parent Category and Sub-Features (e.g. ["hero", "landing", "banner"], ["catalog", "filtering", "search"], ["showcase", "gallery", "amenity"], ["lead", "whatsapp", "inquiry"], ["map", "location", "pin"]).
- MUST explicitly instruct in task description: "Wajib membaca design.md (designData) terlebih dahulu untuk token warna, font, dan komponen UI."
- MANDATORY AUTONOMOUS COMPONENT DISCOVERY & BESPOKE INTERACTION DIRECTIVE: For all Web App projects, task description MUST state: "AI Agent WAJIB melakukan Autonomous Component Discovery via web search/docs/Context7 sebelum koding UI untuk mencari 2-3 ide komponen dan interaksi modern (misal: dari reactbits.dev, 21st.dev, ui.aceternity.com, motion.dev) yang 100% relevan dengan metafora domain produk ini. DILARANG KERAS mengulang template default kaku secara membabi-buta di setiap project. Rancang interaksi yang hidup, berkarakter, dan otentik."
- MANDATORY SKILL FOCUS, ZERO-SLOP & CREATIVE THESIS GATE: Task description MUST state: "AI Agent WAJIB fokus pada Taste Skill dan bebas dari AI slop. Sebelum menulis kode UI, deklarasikan '🎨 Active Design Skill', blok '<skill_comprehension>' (mencantumkan docs/URL komponen yang dipelajari secara mandiri), dan blok '<design_plan>' (mencakup 1. Product Visual Metaphor, 2. Bespoke Interaction Recipes, 3. Intentionally Rejected Clichés)."
- Allowed to use initial mock/dummy data so user can preview and test UI visual interaction first.
- MUST END WITH CHECKPOINT 2 TASK AS THE VERY LAST TASK OF PHASE 3: "[CHECKPOINT] Review & ACC Tampilan Frontend (Mock Data) dengan User".
- Description of Checkpoint 2 MUST state: "AI Agent WAJIB STOP di sini setelah menguji seluruh UI Phase 3. Tampilkan UI ke user dan tunggu konfirmasi/ACC dari user sebelum menyentuh Backend atau merubah data mock."

Phase 4: Backend API
- Pembuatan Database Schema (Prisma/Drizzle), script 'seed.ts' data awal.
- Pembuatan API Route 1-TO-1 FOR EVERY SINGLE ENDPOINT & FEATURE MODULE DESCRIBED IN THE PRD AND STRUCTURE. Do NOT omit any API endpoint! Include category/sub-feature tags in API tasks.

Phase 5: Integrasi Fullstack
- Mandatory task: "Refactor & Hapus Seluruh Data Dummy di Frontend — Hubungkan Komponen Frontend ke Real API Routes Backend & Database Seeder".
- Verification task using latest framework docs (Check Context7 MCP / Web Search for latest Next.js 16 file names like proxy.ts vs middleware.ts).

Phase 6: Audit Final
- MUST include CHECKPOINT 3 task: "[CHECKPOINT] Audit & Verification: Pastikan Bebas Data Dummy & Production Build Check (npm run build)".
- Description MUST state: "AI Agent WAJIB melakukan audit menyeluruh pada kode frontend & backend untuk memverifikasi bahwa 100% data dummy/mock data telah diganti dengan real API fetch, serta menjalankan 'npm run build' tanpa error."

CRITICAL RULES FOR VIBE CODING & ATOMIC TASK BREAKDOWN:
- PHASE NAMES: Phase names MUST be strictly 1-2 words only ('Desain Sistem', 'Setup Base', 'UI Frontend', 'Backend API', 'Integrasi Fullstack', 'Audit Final').
- CHECKPOINT TASKS: Set 'isCheckpoint: true' ONLY for the 3 strategic Checkpoint tasks (Checkpoint 1 in Phase 1, Checkpoint 2 as the LAST task of Phase 3, and Checkpoint 3 in Phase 6). For all normal coding/development tasks, set 'isCheckpoint: false'.
- ATOMIC & GRANULAR TASK BREAKDOWN: Each task MUST be small, specific, and focused on 1 single component or sub-feature unit. NEVER generate lump-sum tasks like "Build all Frontend pages" or "Develop entire UI".
- SINGLE CLEAR DELIVERABLE: Each task must have 1 concrete deliverable with a clear 'definitionOfDone'.
- 1-TO-1 FEATURE MAPPING: Every Feature Category and Sub-Feature in the Structure MUST have at least 1 corresponding task in Phase 3 (UI) and supporting API task in Phase 4.
- STRICTLY DO NOT GENERATE UNREACHABLE / MANUAL NON-CODE TASKS (no manual domain purchasing, no manual business KYC, no manual account creation).
- You MUST output ALL 6 phases. A response with fewer than 6 phases is INVALID and will be rejected.
- Return ONLY valid JSON. Do NOT wrap in markdown code blocks.`;

export const TASKS_SYNC_SYSTEM_PROMPT = `You are a senior software project manager and Vibe Coding AI Architect. The user has manually updated their PRD, Project Structure (Feature Mindmap & Sub-features), and/or Design Specifications. Your task is to intelligently sync the EXISTING task list with the new requirements.

CRITICAL INSTRUCTIONS:
1. ONLY modify, add, or remove tasks that are directly affected by the changes in the PRD, Structure, or Design.
2. Ensure EVERY Category and Sub-Feature in the updated Structure has 1-to-1 matching tasks in Phase 3 (UI Frontend) and Phase 4 (Backend API) with accurate tags.
3. Ensure ALL tasks (new or updated) are actionable code/UI tasks suitable for Vibe Coding and strictly exclude manual non-code tasks (no manual domain purchase, no manual KYC, no manual developer account creation).
4. Preserve the exact details (title, description, estimasi, tags, priority) of existing tasks that are NOT affected.
5. You must maintain the exact same JSON format with 6 phases using 1-2 word phase names.
6. Output the FULL updated JSON, ensuring you include all unchanged tasks alongside the modified ones.`;

export interface TasksPromptParams {
  appName?: string;
  appIdea?: string;
  stacks?: {
    frontend?: string;
    backend?: string;
    database?: string;
    deployment?: string;
  };
  coreFeatures?: string[];
  integrations?: string;
  strukturSummary?: string;
  designSnippet?: string;
  prdMarkdown?: string;
}

export function buildTasksUserPrompt({
  appName,
  appIdea,
  stacks,
  coreFeatures,
  integrations,
  strukturSummary,
  designSnippet,
  prdMarkdown,
}: TasksPromptParams): string {
  return `Generate a complete Frontend-First 6-phase task list with 3 strategic checkpoints for this project:

App Name: ${appName || "N/A"}
App Idea: ${appIdea || "N/A"}
Tech Stack: Frontend=${stacks?.frontend || "N/A"}, Backend=${stacks?.backend || "N/A"}, Database=${stacks?.database || "N/A"}, Deployment=${stacks?.deployment || "N/A"}
Core Features: ${Array.isArray(coreFeatures) ? coreFeatures.join(", ") : "N/A"}
Integrations: ${integrations || "N/A"}

${strukturSummary ? `Project Structure & Feature Blueprint (MANDATORY 1-TO-1 TASK TARGETS):
${strukturSummary}

` : ""}${designSnippet ? `Design Tokens & Guidelines (design.md summary):
${designSnippet}

` : ""}PRD Content (FULL):
${prdMarkdown || "N/A"}

REMINDER: You MUST output all 6 phases with 1-2 word names. In Phase 3 (UI Frontend) & Phase 4 (Backend API), every single Category and Sub-Feature from the Structure above MUST have matching granular tasks with matching tags.`;
}

export interface TasksSyncPromptParams {
  prdMarkdown?: string;
  strukturData?: string | null;
  designSnippet?: string;
  currentTaskData: string;
}

export function buildTasksSyncUserPrompt({
  prdMarkdown,
  strukturData,
  designSnippet,
  currentTaskData,
}: TasksSyncPromptParams): string {
  return `Here is the NEW PRD Content:
${prdMarkdown || "N/A"}

Here is the NEW Project Structure (Feature Mindmap & Sub-features):
${strukturData || "N/A"}

${designSnippet ? `Here is the Design Guidelines:
${designSnippet}

` : ""}Here is the EXISTING Task List that needs to be updated:
${currentTaskData}

Please return the fully synchronized 6-Phase Task List with Checkpoints in JSON format. Ensure all sub-features have 1-to-1 matching tasks in Phase 3 (UI) and Phase 4 (API).`;
}

export function buildTasksRetryPrompt(originalUserPrompt: string, receivedPhasesCount: number): string {
  return `${originalUserPrompt}\n\nIMPORTANT: Your previous response was incomplete — it only had ${receivedPhasesCount} phases. You MUST return ALL 6 phases. Do NOT stop after phase 1 or phase 2. Generate the complete JSON with all 6 phases now.`;
}

// ============================================================================
// 6. EDIT PRD & BRAINSTORMING PROMPTS
// ============================================================================

export const EDIT_PRD_SYSTEM_PROMPT = `You are an expert AI Product Manager and Brainstorming Partner.
You are helping the user refine, discuss, or update their Product Requirements Document (PRD).

TASK INSTRUCTIONS:
1. Analyze the user's prompt instruction.
2. Determine if the user is BRAINSTORMING / ASKING A QUESTION / DISCUSSING (e.g. asking for ideas, pros/cons, recommendations, technical advice, feedback).
   - If BRAINSTORMING: Provide a helpful, clear conversational response in Indonesian answering their question. Set isPrdUpdated to false.
3. Determine if the user wants to REVISE / EDIT / ADD TO / REMOVE / UPDATE / FIX the PRD (e.g. "Tambahkan fitur X", "Hapus section Y", "Ubah bahasa", "Terapkan rekomendasi tadi").
   - If EDITING: Provide a friendly confirmation message and generate the FULL updated PRD markdown.

OUTPUT FORMAT (You can use Tagged Format for maximum reliability):
<reply>Your conversational response, answer, ideas, or edit confirmation in Indonesian.</reply>
<is_prd_updated>true or false</is_prd_updated>
<updated_prd>
(Full updated PRD markdown here if is_prd_updated is true, otherwise leave empty)
</updated_prd>

Alternatively, you may return strict valid JSON:
{
  "reply": "Your conversational response in Indonesian.",
  "isPrdUpdated": true,
  "updatedMarkdown": "Full updated PRD markdown string"
}`;

export interface EditPrdPromptParams {
  currentPrd: string;
  prompt: string;
  isEditIntent: boolean;
}

export function buildEditPrdUserPrompt({ currentPrd, prompt, isEditIntent }: EditPrdPromptParams): string {
  return `=== CURRENT PRD START ===
${currentPrd}
=== CURRENT PRD END ===

=== USER INSTRUCTION ===
${prompt}

${isEditIntent ? "USER INTENT: The user wants to EDIT/UPDATE the PRD. Please provide the updated PRD with their changes applied." : ""}`;
}
