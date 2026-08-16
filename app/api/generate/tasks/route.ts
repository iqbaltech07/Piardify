import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateText, parseAndRepairJson } from "@/lib/llm";
import { getOwnedProject } from "@/lib/projectHelpers";
import { checkRateLimit, RateLimitWindows } from "@/lib/rateLimit";
import { getDailyAiCallLimit } from "@/lib/planQuota";
import { parseBody, projectIdSchema, tasksSchema } from "@/lib/validation";

export const maxDuration = 120;

const BASE_SYSTEM_PROMPT = `You are a senior software project manager and Vibe Coding AI Architect. Based on the PRD, project structure (Feature Mindmap & Sub-features), design specifications (design.md), and app info, generate a comprehensive, highly actionable 6-PHASE task list for building this project following a FRONTEND-FIRST workflow with 3 MANDATORY STRATEGIC CHECKPOINTS.

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

const SYNC_SYSTEM_PROMPT = `You are a senior software project manager and Vibe Coding AI Architect. The user has manually updated their PRD, Project Structure (Feature Mindmap & Sub-features), and/or Design Specifications. Your task is to intelligently sync the EXISTING task list with the new requirements.

CRITICAL INSTRUCTIONS:
1. ONLY modify, add, or remove tasks that are directly affected by the changes in the PRD, Structure, or Design.
2. Ensure EVERY Category and Sub-Feature in the updated Structure has 1-to-1 matching tasks in Phase 3 (UI Frontend) and Phase 4 (Backend API) with accurate tags.
3. Ensure ALL tasks (new or updated) are actionable code/UI tasks suitable for Vibe Coding and strictly exclude manual non-code tasks (no manual domain purchase, no manual KYC, no manual developer account creation).
4. Preserve the exact details (title, description, estimasi, tags, priority) of existing tasks that are NOT affected.
5. You must maintain the exact same JSON format with 6 phases using 1-2 word phase names.
6. Output the FULL updated JSON, ensuring you include all unchanged tasks alongside the modified ones.`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, forceSync } = await parseBody(req, projectIdSchema);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, email: true },
    });

    const dailyLimit = getDailyAiCallLimit(user?.tier, user?.email);
    const rl = await checkRateLimit({
      userId: session.user.id,
      scope: "generate:tasks",
      limit: dailyLimit,
      windowSeconds: RateLimitWindows.DAY,
    });
    if (!rl.allowed) {
      return NextResponse.json({ error: "DAILY_LIMIT_REACHED", message: `Batas generate harian tercapai. Coba lagi besok.` }, { status: 429 });
    }

    // 1. Check Redis Cache (Bypassed if forceSync or tasksOutdated)
    const cacheKey = `project:${projectId}:tasks`;
    if (!forceSync) {
      try {
        const cached = await redis.get(cacheKey);
        if (cached) {
          return NextResponse.json(cached);
        }
      } catch (err) {
        console.warn("Redis Cache Miss/Error:", err);
      }
    }

    // 2. Check Database (typed ownership)
    const project = await getOwnedProject(session.user.id, projectId, {
      id: true,
      userId: true,
      appName: true,
      appIdea: true,
      formInputs: true,
      strukturData: true,
      prdData: true,
      taskData: true,
      checkedTasks: true,
      designData: true,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    const form = project.formInputs ? JSON.parse(project.formInputs) : {};
    const isOutdated = form._tasksOutdated === true || forceSync === true;

    if (project.taskData && !isOutdated) {
      const data = JSON.parse(project.taskData);
      let savedStatus = {};
      if (project.checkedTasks) {
        try { savedStatus = JSON.parse(project.checkedTasks); } catch { }
      }
      const responseData = { ...data, savedStatus };
      try { await redis.set(cacheKey, responseData); } catch { }
      return NextResponse.json(responseData);
    }

    const prdMarkdown = project.prdData || "";

    const strukturSummary = project.strukturData
      ? (() => {
        try {
          const s = JSON.parse(project.strukturData);
          if (s.nodes && Array.isArray(s.nodes)) {
            return s.nodes.map((n: any, idx: number) => {
              const children = Array.isArray(n.children)
                ? n.children.map((c: any, cIdx: number) => `    - Sub-feature ${idx + 1}.${cIdx + 1}: ${c.label}`).join("\n")
                : "";
              return `• Category ${idx + 1}: ${n.label} (Phase ${n.phase || 1})${children ? "\n" + children : ""}`;
            }).join("\n");
          }
        } catch { }
        return "";
      })()
      : "";

    const designSnippet = project.designData
      ? project.designData.slice(0, 1500)
      : "";

    const integrations = Array.isArray(form?.integrations)
      ? form.integrations.filter((i: string) => i !== "None").join(", ")
      : "N/A";

    let systemPrompt = BASE_SYSTEM_PROMPT;
    let userPrompt = `Generate a complete Frontend-First 6-phase task list with 3 strategic checkpoints for this project:

App Name: ${form?.appName || "N/A"}
App Idea: ${form?.appIdea || "N/A"}
Tech Stack: Frontend=${form?.stacks?.frontend || "N/A"}, Backend=${form?.stacks?.backend || "N/A"}, Database=${form?.stacks?.database || "N/A"}, Deployment=${form?.stacks?.deployment || "N/A"}
Core Features: ${Array.isArray(form?.coreFeatures) ? form.coreFeatures.join(", ") : "N/A"}
Integrations: ${integrations}

${strukturSummary ? `Project Structure & Feature Blueprint (MANDATORY 1-TO-1 TASK TARGETS):
${strukturSummary}

` : ""}${designSnippet ? `Design Tokens & Guidelines (design.md summary):
${designSnippet}

` : ""}PRD Content (FULL):
${prdMarkdown || "N/A"}

REMINDER: You MUST output all 6 phases with 1-2 word names. In Phase 3 (UI Frontend) & Phase 4 (Backend API), every single Category and Sub-Feature from the Structure above MUST have matching granular tasks with matching tags.`;

    if (project.taskData && isOutdated) {
      systemPrompt = SYNC_SYSTEM_PROMPT;
      userPrompt = `Here is the NEW PRD Content:
${prdMarkdown || "N/A"}

Here is the NEW Project Structure (Feature Mindmap & Sub-features):
${project.strukturData || "N/A"}

${project.designData ? `Here is the Design Guidelines:
${project.designData.slice(0, 1500)}

` : ""}Here is the EXISTING Task List that needs to be updated:
${project.taskData}

Please return the fully synchronized 6-Phase Task List with Checkpoints in JSON format. Ensure all sub-features have 1-to-1 matching tasks in Phase 3 (UI) and Phase 4 (API).`;
    }

    // Core generation (Gemini → OpenRouter fallback handled inside generateText)
    let result: Awaited<ReturnType<typeof generateText>> | null = null;
    try {
      result = await generateText({
        systemPrompt,
        userPrompt,
        jsonObject: true,
      });
    } catch (err: any) {
      console.warn("[Tasks] generation failed:", err?.message);
    }

    let parsed = result ? parseAndValidateTasks(result.text) : null;

    // Auto-retry if fewer than 6 phases returned
    if (!parsed || parsed.phases.length < 6) {
      console.warn(`[Tasks] Got ${parsed?.phases?.length ?? 0} phases, expected 6. Auto-retrying...`);

      const retryPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response was incomplete — it only had ${parsed?.phases?.length ?? 0} phases. You MUST return ALL 6 phases. Do NOT stop after phase 1 or phase 2. Generate the complete JSON with all 6 phases now.`;

      try {
        const retry = await generateText({
          systemPrompt,
          userPrompt: retryPrompt,
          jsonObject: true,
        });
        const retryParsed = parseAndValidateTasks(retry.text);
        if (retryParsed && retryParsed.phases.length >= 6) {
          parsed = retryParsed;
          console.log(`[Tasks] Retry succeeded with ${retryParsed.phases.length} phases.`);
        } else if (retryParsed && retryParsed.phases.length > parsed!.phases.length) {
          parsed = retryParsed;
        }
      } catch (err: any) {
        console.warn("[Tasks] Retry failed:", err?.message);
      }
    }

    if (!parsed) {
      console.error("Failed to parse tasks JSON:", result?.text ?? "no output");
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    // Save to Database
    let updateData: any = { taskData: JSON.stringify(parsed) };
    if (isOutdated) {
      delete form._tasksOutdated;
      updateData.formInputs = JSON.stringify(form);
    }

    await prisma.project.update({
      where: { id: projectId },
      data: updateData,
      select: { id: true },
    });

    // Save to Redis Cache
    try {
      await redis.set(cacheKey, parsed);
    } catch (err) {
      console.warn("Redis set error:", err);
    }

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("Tasks generation error:", error);
    const status = error?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? error.message : "Internal Server Error" }, { status });
  }
}

/** Parses & validates the AI task-list JSON; returns null on any failure. */
function parseAndValidateTasks(raw: string): { phases: any[] } | null {
  const parsedData = parseAndRepairJson(raw);
  if (!parsedData) return null;
  try {
    const parsed = tasksSchema.parse(parsedData);
    if (!parsed.phases || !Array.isArray(parsed.phases)) return null;
    return parsed as unknown as { phases: any[] };
  } catch {
    return null;
  }
}