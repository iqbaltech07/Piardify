import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
      try { await redis.set(cacheKey, data); } catch {}
      return NextResponse.json(data);
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

    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
    let response: any;
    let success = false;
    let lastError = null;

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
          break;
        } catch (err: any) {
          lastError = err;
          console.warn(`[Tasks Fallback] ${model}:`, err.message);
        }
      }
      if (success) break;
    }

    if (!success || !response) {
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
