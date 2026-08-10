import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { incrementUsage } from "@/lib/usageTracker";
import { generateWithGeminiContextCache } from "@/lib/geminiCache";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    // 1. Check Redis Cache
    const cacheKey = `project:${projectId}:tasks`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json(cached);
      }
    } catch (err) {
      console.warn("Redis Cache Miss/Error:", err);
    }

    // 2. Check Database
    const project = await (prisma.project as any).findUnique({
      where: { id: projectId, userId: session.user.id },
      select: {
        id: true,
        userId: true,
        appName: true,
        appIdea: true,
        formInputs: true,
        strukturData: true,
        prdData: true,
        taskData: true,
        designData: true,
        status: true,
        checkedTasks: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    const form = project.formInputs ? JSON.parse(project.formInputs) : {};
    const isOutdated = form._tasksOutdated === true;

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

    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY,
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Gemini API Keys not configured" }, { status: 500 });
    }

    let systemPrompt = `You are a senior software project manager and Vibe Coding AI Architect. Based on the PRD, project structure, and app info, generate a comprehensive, highly actionable 6-PHASE task list for building this project following a FRONTEND-FIRST workflow with 3 MANDATORY STRATEGIC CHECKPOINTS.

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
          "description": "What needs to be done. Must include design/API references.",
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

Phase 3: UI Frontend
- Granular UI tasks (1-by-1 per section/component): Hero Section, Header CTA, Features Grid, Sidebar Navigation, Form Modals, Footer, etc.
- MUST explicitly instruct in task description: "Wajib membaca design.md (designData) terlebih dahulu untuk token warna, font, dan komponen UI."
- MANDATORY REACT BITS DIRECTIVE: For Hero Section and UI components, task description MUST state: "Wajib menggunakan React Bits (reactbits.dev) untuk animasi UI, background FX Hero Section (misal: Aurora Background, Grid Pattern, Spotlight Card, Text Animations), & komponen interaktif."
- MANDATORY SKILL FOCUS & ZERO-SLOP GATE: Task description MUST state: "AI Agent WAJIB fokus & TIDAK BOLEH melewatkan Taste Skill. Setiap UI/komponen/halaman WAJIB 100% eye-catching, bebas dari AI slop, dan DILARANG BERHALUSINASI. Deklarasikan '🎨 Active Design Skill', blok '<skill_comprehension>', dan '<design_plan>' sebelum menulis kode UI."
- Allowed to use initial mock/dummy data so user can preview and test UI visual interaction first.
- MUST END WITH CHECKPOINT 2 TASK AS THE VERY LAST TASK OF PHASE 3: "[CHECKPOINT] Review & ACC Tampilan Frontend (Mock Data) dengan User".
- Description of Checkpoint 2 MUST state: "AI Agent WAJIB STOP di sini setelah menguji seluruh UI Phase 3. Tampilkan UI ke user dan tunggu konfirmasi/ACC dari user sebelum menyentuh Backend atau merubah data mock."

Phase 4: Backend API
- Pembuatan Database Schema (Prisma/Drizzle), script 'seed.ts' data awal.
- Pembuatan API Route 1-TO-1 FOR EVERY SINGLE ENDPOINT & API DESCRIBED IN THE PRD. Do NOT omit any API endpoint!

Phase 5: Integrasi Fullstack
- Mandatory task: "Refactor & Hapus Seluruh Data Dummy di Frontend — Hubungkan Komponen Frontend ke Real API Routes Backend & Database Seeder".
- Verification task using latest framework docs (Check Context7 MCP / Web Search for latest Next.js 16 file names like proxy.ts vs middleware.ts).

Phase 6: Audit Final
- MUST include CHECKPOINT 3 task: "[CHECKPOINT] Audit & Verification: Pastikan Bebas Data Dummy & Production Build Check (npm run build)".
- Description MUST state: "AI Agent WAJIB melakukan audit menyeluruh pada kode frontend & backend untuk memverifikasi bahwa 100% data dummy/mock data telah diganti dengan real API fetch, serta menjalankan 'npm run build' tanpa error."

CRITICAL RULES FOR VIBE CODING & ATOMIC TASK BREAKDOWN:
- PHASE NAMES: Phase names MUST be strictly 1-2 words only ('Desain Sistem', 'Setup Base', 'UI Frontend', 'Backend API', 'Integrasi Fullstack', 'Audit Final').
- CHECKPOINT TASKS: Set 'isCheckpoint: true' ONLY for the 3 strategic Checkpoint tasks (Checkpoint 1 in Phase 1, Checkpoint 2 as the LAST task of Phase 3, and Checkpoint 3 in Phase 6). For all normal coding/development tasks, set 'isCheckpoint: false'.
- ATOMIC & GRANULAR TASK BREAKDOWN: Each task MUST be small, specific, and focused on 1 single component or feature unit. NEVER generate lump-sum tasks like "Build all Frontend pages" or "Develop entire UI".
- SINGLE CLEAR DELIVERABLE: Each task must have 1 concrete deliverable with a clear 'definitionOfDone'.
- 1-TO-1 API MAPPING: Read the ENTIRE PRD. Every API endpoint, authentication flow, CRUD operation, and integration MUST be mapped into a specific backend task in Phase 4.
- STRICTLY DO NOT GENERATE UNREACHABLE / MANUAL NON-CODE TASKS (no manual domain purchasing, no manual business KYC, no manual account creation).
- You MUST output ALL 6 phases. A response with fewer than 6 phases is INVALID and will be rejected.
- Return ONLY valid JSON. Do NOT wrap in markdown code blocks.`;

    const integrations = Array.isArray(form?.integrations)
      ? form.integrations.filter((i: string) => i !== "None").join(", ")
      : "N/A";

    const strukturSummary = project.strukturData
      ? (() => {
        try {
          const s = JSON.parse(project.strukturData);
          if (s.nodes && Array.isArray(s.nodes)) {
            return s.nodes.map((n: any) => {
              const children = Array.isArray(n.children)
                ? n.children.map((c: any) => `  - ${c.label}`).join("\n")
                : "";
              return `• ${n.label} (Phase ${n.phase})${children ? "\n" + children : ""}`;
            }).join("\n");
          }
        } catch { }
        return "";
      })()
      : "";

    let userPrompt = `Generate a complete Frontend-First 6-phase task list with 3 strategic checkpoints for this project:

App Name: ${form?.appName || "N/A"}
App Idea: ${form?.appIdea || "N/A"}
Tech Stack: Frontend=${form?.stacks?.frontend || "N/A"}, Backend=${form?.stacks?.backend || "N/A"}, Database=${form?.stacks?.database || "N/A"}, Deployment=${form?.stacks?.deployment || "N/A"}
Core Features: ${Array.isArray(form?.coreFeatures) ? form.coreFeatures.join(", ") : "N/A"}
Integrations: ${integrations}

${strukturSummary ? `Project Structure (Feature Mindmap):
${strukturSummary}

` : ""}PRD Content (FULL):
${prdMarkdown || "N/A"}

REMINDER: You MUST output all 6 phases with 1-2 word names including Checkpoint 2 at the end of Phase 3 and Phase 6 AI Agent Audit (Bebas Data Dummy). All tasks must include 'definitionOfDone'. Read the FULL PRD and map EVERY API 1-to-1.`;

    if (project.taskData && isOutdated) {
      systemPrompt = `You are a senior software project manager and Vibe Coding AI Architect. The user has manually updated their PRD and/or Project Structure. Your task is to intelligently sync the EXISTING task list with the new requirements.

CRITICAL INSTRUCTIONS:
1. ONLY modify, add, or remove tasks that are directly affected by the changes in the PRD or Structure.
2. Ensure ALL tasks (new or updated) are actionable code/UI tasks suitable for Vibe Coding and strictly exclude manual non-code tasks (no manual domain purchase, no manual KYC, no manual developer account creation).
3. Preserve the exact details (title, description, estimasi, tags, priority) of existing tasks that are NOT affected.
4. You must maintain the exact same JSON format with 6 phases using 1-2 word phase names.
5. Output the FULL updated JSON, ensuring you include all unchanged tasks alongside the modified ones.`;

      userPrompt = `Here is the NEW PRD Content:
${prdMarkdown || "N/A"}

Here is the NEW Project Structure (Mindmap):
${project.strukturData || "N/A"}

Here is the EXISTING Task List that needs to be updated:
${project.taskData}

Please return the fully synchronized 6-Phase Task List with Checkpoints in JSON format.`;
    }

    const settings: any = (await redis.get("app:settings")) || {};
    const geminiModel = settings.geminiModel || "gemini-3.6-flash";
    const openRouterModel = settings.openRouterModel || "nvidia/nemotron-3-ultra-550b-a55b:free";

    const fallbackModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite"
    ];
    // Pastikan model pilihan user dicoba pertama, lalu fallback urut ke bawah tanpa duplikat
    const models = Array.from(new Set([geminiModel, ...fallbackModels]));
    let response: any;
    let success = false;
    let lastError = null;

    // Priority 1: Gemini (using API Keys & fallback models)
    if (keys.length > 0) {
      console.log(`Generating tasks via Gemini (${geminiModel})`);
      for (const apiKey of keys) {
        const ai = new GoogleGenAI({ apiKey });
        for (const model of models) {
          try {
            response = await generateWithGeminiContextCache({
              ai,
              model,
              systemInstruction: systemPrompt,
              userPrompt
            });
            const rawText = response.text?.trim() || "";
            const cleaned = rawText.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
            const match = cleaned.match(/\{[\s\S]*\}/);
            const jsonText = match ? match[0] : cleaned;
            const parsed = JSON.parse(jsonText);
            if (!parsed.phases || !Array.isArray(parsed.phases)) {
              throw new Error("Invalid task phases JSON structure from Gemini");
            }
            response = { text: jsonText };
            success = true;
            const provider = apiKey === process.env.GEMINI_API_KEY ? "gemini_key_1" : "gemini_key_2";
            await incrementUsage(provider);
            break;
          } catch (err: any) {
            lastError = err;
            console.warn(`[Tasks Gemini] ${model}:`, err.message);
          }
        }
        if (success) break;
      }
    }

    // Priority 2: OpenRouter Fallback if Gemini failed or not configured
    if (!success && process.env.OPENROUTER_API_KEY) {
      console.log(`Gemini unavailable or failed, falling back to OpenRouter (${openRouterModel})`);
      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
        });

        const sysPromptWithFormat = `${systemPrompt}\n\nYou MUST return ONLY valid JSON matching the format exactly. Do NOT wrap in markdown code blocks, just raw JSON.`;

        let completion;
        try {
          completion = await openai.chat.completions.create({
            model: openRouterModel,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: sysPromptWithFormat },
              { role: "user", content: userPrompt }
            ]
          });
        } catch (e: any) {
          if (e.status === 400 || e.message?.includes("json_object")) {
            console.log("Model doesn't support json_object, retrying without it...");
            completion = await openai.chat.completions.create({
              model: openRouterModel,
              messages: [
                { role: "system", content: sysPromptWithFormat },
                { role: "user", content: userPrompt }
              ]
            });
          } else {
            throw e;
          }
        }

        const text = completion.choices[0].message.content?.trim() || "";
        if (!text) throw new Error("Empty response from OpenRouter");

        const cleanText = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
        const match = cleanText.match(/\{[\s\S]*\}/);
        const jsonText = match ? match[0] : cleanText;

        // Validate JSON parsing before declaring success
        const parsed = JSON.parse(jsonText);
        if (!parsed.phases || !Array.isArray(parsed.phases)) {
          throw new Error("Invalid task phases JSON structure from OpenRouter");
        }

        response = { text: jsonText };
        success = true;
        await incrementUsage("openrouter");
      } catch (err: any) {
        lastError = err;
        console.warn(`[OpenRouter Tasks Fallback] Failed or invalid JSON:`, err.message);
      }
    }

    if (!success || !response) {
      console.error("All fallback combinations (Gemini & OpenRouter) failed:", lastError);
      return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 });
    }

    let text: string = response.text?.trim() || "";
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");

    // Helper to parse and validate task JSON — returns parsed object or null
    const parseAndValidateTasks = (raw: string): { phases: any[] } | null => {
      try {
        const cleaned = raw.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
        const match = cleaned.match(/\{[\s\S]*\}/);
        const jsonStr = match ? match[0] : cleaned;
        const parsed = JSON.parse(jsonStr);
        if (!parsed.phases || !Array.isArray(parsed.phases)) return null;
        return parsed;
      } catch {
        return null;
      }
    };

    let parsed = parseAndValidateTasks(text);

    // Auto-retry if fewer than 6 phases returned
    if (!parsed || parsed.phases.length < 6) {
      console.warn(`[Tasks] Got ${parsed?.phases?.length ?? 0} phases, expected 6. Auto-retrying...`);

      const retryPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response was incomplete — it only had ${parsed?.phases?.length ?? 0} phases. You MUST return ALL 6 phases. Do NOT stop after phase 1 or phase 2. Generate the complete JSON with all 6 phases now.`;

      let retryText = "";
      let retrySuccess = false;

      // Retry with Gemini first
      if (keys.length > 0) {
        for (const apiKey of keys) {
          const ai = new GoogleGenAI({ apiKey });
          for (const model of models) {
            try {
              const retryResponse = await generateWithGeminiContextCache({
                ai,
                model,
                systemInstruction: systemPrompt,
                userPrompt: retryPrompt
              });
              retryText = retryResponse.text?.trim() || "";
              retrySuccess = true;
              break;
            } catch (err: any) {
              console.warn(`[Tasks Retry Gemini] ${model}:`, err.message);
            }
          }
          if (retrySuccess) break;
        }
      }

      // Retry with OpenRouter if Gemini failed
      if (!retrySuccess && process.env.OPENROUTER_API_KEY) {
        try {
          const { default: OpenAI } = await import("openai");
          const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
          });
          const settings2: any = (await redis.get("app:settings")) || {};
          const retryModel = settings2.openRouterModel || "nvidia/nemotron-3-ultra-550b-a55b:free";
          const completion = await openai.chat.completions.create({
            model: retryModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: retryPrompt }
            ]
          });
          retryText = completion.choices[0].message.content?.trim() || "";
          retrySuccess = true;
        } catch (err: any) {
          console.warn(`[Tasks Retry OpenRouter]:`, err.message);
        }
      }

      if (retrySuccess && retryText) {
        const retryParsed = parseAndValidateTasks(retryText);
        if (retryParsed && retryParsed.phases.length >= 6) {
          parsed = retryParsed;
          console.log(`[Tasks] Retry succeeded with ${retryParsed.phases.length} phases.`);
        } else {
          console.warn(`[Tasks] Retry still incomplete (${retryParsed?.phases?.length ?? 0} phases). Using best available result.`);
          if (retryParsed && (!parsed || retryParsed.phases.length > parsed.phases.length)) {
            parsed = retryParsed;
          }
        }
      }
    }

    if (!parsed) {
      console.error("Failed to parse tasks JSON:", text);
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
  } catch (error) {
    console.error("Tasks generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
