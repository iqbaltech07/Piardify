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
    const cacheKey = `project:${projectId}:struktur`;
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

    if (project.strukturData) {
      const data = JSON.parse(project.strukturData);
      try { await redis.set(cacheKey, data); } catch {}
      return NextResponse.json(data);
    }

    const formInputs = project.formInputs ? JSON.parse(project.formInputs) : {};

    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY,
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Gemini API Keys not configured" }, { status: 500 });
    }

    const systemPrompt = `You are a senior software architect specializing in product decomposition and feature mapping.

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
4. Each node MUST have a "phase" (1=MVP/Core, 2=Post-launch, 3=Future).
5. Each node MUST have a "color" — use these palette options based on phase:
   - Phase 1: "#6366f1" (indigo) or "#3b82f6" (blue) or "#06b6d4" (cyan)
   - Phase 2: "#10b981" (emerald) or "#8b5cf6" (violet) or "#f59e0b" (amber)
   - Phase 3: "#f97316" (orange) or "#ec4899" (pink) or "#64748b" (slate)
6. Each node should have 3-6 children representing SPECIFIC, ACTIONABLE sub-features.
7. Keep all labels concise (max 5 words), use Title Case.
8. Base ALL nodes strictly on the user's provided Core Features and app idea.
9. Return ONLY valid JSON, nothing else.`;

    const userPrompt = `Generate a feature mindmap for this product:

App Name: ${project.appName || "N/A"}
App Idea: ${project.appIdea || "N/A"}
Target User: ${formInputs.targetUser || "N/A"}
Platform: ${formInputs.platform || "N/A"}
Core Features Selected: ${Array.isArray(formInputs.coreFeatures) ? formInputs.coreFeatures.join(", ") : "N/A"}
Monetization Model: ${formInputs.monetization || "N/A"}
App Scale: ${formInputs.appScale || "N/A"}
Integrations: ${Array.isArray(formInputs.integrations) ? formInputs.integrations.join(", ") : "N/A"}
Frontend Stack: ${formInputs.stacks?.frontend || "N/A"}
Backend Stack: ${formInputs.stacks?.backend || "N/A"}
Database: ${formInputs.stacks?.database || "N/A"}
Deployment: ${formInputs.stacks?.deployment || "N/A"}
Design Preference: ${formInputs.designPreference || "N/A"}

IMPORTANT: The nodes you generate will be used as the feature structure for the PRD. Make sure each node maps to a real section of features in the product.`;

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
          console.warn(`[Struktur Fallback] ${model}:`, err.message);
        }
      }
      if (success) break;
    }

    if (!success || !response) {
      return NextResponse.json({ error: "Failed to generate struktur" }, { status: 500 });
    }

    let text: string = response.text?.trim() || "";
    // Strip markdown code fences if present
    text = text.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");

    try {
      const parsed = JSON.parse(text);
      
      // Save to Database
      await prisma.project.update({
        where: { id: projectId },
        data: { strukturData: JSON.stringify(parsed) },
      });

      // Save to Redis Cache
      try {
        await redis.set(cacheKey, parsed);
      } catch (err) {
        console.warn("Redis set error:", err);
      }

      return NextResponse.json(parsed);
    } catch {
      console.error("Failed to parse struktur JSON:", text);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }
  } catch (error) {
    console.error("Struktur generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
