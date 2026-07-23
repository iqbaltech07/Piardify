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

    let systemPrompt = `You are a senior software project manager. Based on the PRD and app info, generate a comprehensive, actionable task list for building this project.

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

PHASE STRUCTURE (use exactly these 5 phases in order, DO NOT include numbers or emojis in the names):
1. Perencanaan & Desain (Planning & Design)
2. Setup & Infrastruktur (Setup & Infrastructure)  
3. Pengembangan Backend (Backend Development)
4. Pengembangan Frontend (Frontend Development)
5. Testing & Deployment (Testing & Deployment)

RULES:
- Generate 4-8 specific, actionable tasks per phase
- Priority: high = must have for MVP, medium = important but not blocking, low = nice to have
- Estimasi must be realistic time estimates in Bahasa Indonesia
- Tags should be short tech labels (e.g. "React", "API", "Database", "UI/UX")
- Base tasks on the actual PRD content and tech stack
- Return ONLY valid JSON`;

    let userPrompt = `Generate a task list for this project:

App Name: ${form?.appName || "N/A"}
App Idea: ${form?.appIdea || "N/A"}
Tech Stack: Frontend=${form?.stacks?.frontend || "N/A"}, Backend=${form?.stacks?.backend || "N/A"}, Database=${form?.stacks?.database || "N/A"}, Deployment=${form?.stacks?.deployment || "N/A"}
Core Features: ${Array.isArray(form?.coreFeatures) ? form.coreFeatures.join(", ") : "N/A"}

PRD Summary (first 2000 chars):
${(prdMarkdown || "").substring(0, 2000)}`;

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

    // Priority 1: OpenRouter (using configured openRouterModel)
    if (process.env.OPENROUTER_API_KEY) {
      console.log(`Generating tasks via OpenRouter (${openRouterModel})`);
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
        console.warn(`[OpenRouter Tasks] Failed or invalid JSON, will fallback:`, err.message);
      }
    }

    // Priority 2: Gemini Fallback if OpenRouter failed or not configured
    if (!success && keys.length > 0) {
      console.log(`OpenRouter unavailable or failed, falling back to Gemini (${geminiModel})`);
      for (const apiKey of keys) {
        const ai = new GoogleGenAI({ apiKey });
        for (const model of models) {
          try {
            response = await ai.models.generateContent({
              model,
              contents: userPrompt,
              config: { systemInstruction: systemPrompt },
            });
            success = true;
            const provider = apiKey === process.env.GEMINI_API_KEY ? "gemini_key_1" : "gemini_key_2";
            await incrementUsage(provider);
            break;
          } catch (err: any) {
            lastError = err;
            console.warn(`[Tasks Gemini Fallback] ${model}:`, err.message);
          }
        }
        if (success) break;
      }
    }

    if (!success || !response) {
      console.error("All fallback combinations (Gemini & OpenRouter) failed:", lastError);
      return NextResponse.json({ error: "Failed to generate tasks" }, { status: 500 });
    }

    let text: string = response.text?.trim() || "";
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");

    try {
      const parsed = JSON.parse(text);
      
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
    } catch {
      console.error("Failed to parse tasks JSON:", text);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }
  } catch (error) {
    console.error("Tasks generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
