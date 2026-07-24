import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { incrementUsage } from "@/lib/usageTracker";

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
    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: session.user.id },
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
        try { savedStatus = JSON.parse(project.checkedTasks); } catch {}
      }
      const responseData = { ...data, savedStatus };
      try { await redis.set(cacheKey, responseData); } catch {}
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

    let systemPrompt = `You are a senior software project manager. Based on the PRD, project structure, and app info, generate a comprehensive, actionable task list for building this project.

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
          "description": "What needs to be done",
          "priority": "high|medium|low",
          "estimasi": "e.g. 2 hari, 1 minggu",
          "tags": ["tag1", "tag2"]
        }
      ]
    }
  ]
}

PHASE STRUCTURE — YOU MUST GENERATE ALL 5 PHASES, NO EXCEPTIONS:
1. Perencanaan & Desain
2. Setup & Infrastruktur
3. Pengembangan Backend
4. Pengembangan Frontend
5. Testing & Deployment

CRITICAL RULES:
- You MUST output ALL 5 phases. A response with fewer than 5 phases is INVALID and will be rejected.
- Phase 5 (Testing & Deployment) MUST include tasks such as: unit testing, integration testing, UAT, CI/CD pipeline setup, staging deployment, production deployment, monitoring setup.
- Generate 4-8 specific, actionable tasks per phase based on the PRD features and project structure.
- Each task MUST be directly traceable to a feature or requirement in the PRD or project structure.
- Priority: high = must have for MVP, medium = important but not blocking, low = nice to have
- Estimasi must be realistic time estimates in Bahasa Indonesia
- Tags should be short tech labels (e.g. "React", "API", "Database", "UI/UX", "Testing", "DevOps")
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
          } catch {}
          return "";
        })()
      : "";

    let userPrompt = `Generate a complete 5-phase task list for this project:

App Name: ${form?.appName || "N/A"}
App Idea: ${form?.appIdea || "N/A"}
Tech Stack: Frontend=${form?.stacks?.frontend || "N/A"}, Backend=${form?.stacks?.backend || "N/A"}, Database=${form?.stacks?.database || "N/A"}, Deployment=${form?.stacks?.deployment || "N/A"}
Core Features: ${Array.isArray(form?.coreFeatures) ? form.coreFeatures.join(", ") : "N/A"}
Integrations: ${integrations}

${strukturSummary ? `Project Structure (Feature Mindmap):
${strukturSummary}

` : ""}PRD Content (first 4000 chars):
${(prdMarkdown || "").substring(0, 4000)}

REMINDER: You MUST output all 5 phases including Phase 5 (Testing & Deployment). Tasks must align with the PRD content and project structure above.`;

    if (project.taskData && isOutdated) {
      systemPrompt = `You are a senior software project manager. The user has manually updated their PRD and/or Project Structure. Your task is to intelligently sync the EXISTING task list with the new requirements.

CRITICAL INSTRUCTIONS:
1. ONLY modify, add, or remove tasks that are directly affected by the changes in the PRD or Structure.
2. Preserve the exact details (title, description, estimasi, tags, priority) of existing tasks that are NOT affected.
3. You must maintain the exact same JSON format with 5 phases.
4. Output the FULL updated JSON, ensuring you include all unchanged tasks alongside the modified ones.`;

      userPrompt = `Here is the NEW PRD Summary:
${(prdMarkdown || "").substring(0, 2000)}

Here is the NEW Project Structure (Mindmap):
${(project.strukturData || "").substring(0, 2000)}

Here is the EXISTING Task List that needs to be updated:
${project.taskData}

Please return the fully synchronized Task List in JSON format.`;
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
            response = await ai.models.generateContent({
              model,
              contents: userPrompt,
              config: { systemInstruction: systemPrompt },
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

    // Auto-retry if fewer than 5 phases returned
    if (!parsed || parsed.phases.length < 5) {
      console.warn(`[Tasks] Got ${parsed?.phases?.length ?? 0} phases, expected 5. Auto-retrying...`);

      const retryPrompt = `${userPrompt}\n\nIMPORTANT: Your previous response was incomplete — it only had ${parsed?.phases?.length ?? 0} phases. You MUST return ALL 5 phases. Do NOT stop after phase 1 or phase 2. Generate the complete JSON with all 5 phases now.`;

      let retryText = "";
      let retrySuccess = false;

      // Retry with Gemini first
      if (keys.length > 0) {
        for (const apiKey of keys) {
          const ai = new GoogleGenAI({ apiKey });
          for (const model of models) {
            try {
              const retryResponse = await ai.models.generateContent({
                model,
                contents: retryPrompt,
                config: { systemInstruction: systemPrompt },
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
        if (retryParsed && retryParsed.phases.length >= 5) {
          parsed = retryParsed;
          console.log(`[Tasks] Retry succeeded with ${retryParsed.phases.length} phases.`);
        } else {
          console.warn(`[Tasks] Retry still incomplete (${retryParsed?.phases?.length ?? 0} phases). Using best available result.`);
          // Use retry result if it has more phases than original
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
