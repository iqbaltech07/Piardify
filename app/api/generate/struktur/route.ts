import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { incrementUsage } from "@/lib/usageTracker";
import fs from "fs";
import path from "path";

// Allow execution up to 60 seconds on Vercel
export const maxDuration = 60;

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
    const cacheKeyStruktur = `project:${projectId}:struktur`;
    const cacheKeyPrd = `project:${projectId}:prd`;
    
    try {
      const cached = await redis.get(cacheKeyStruktur);
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
      try { await redis.set(cacheKeyStruktur, data); } catch {}
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

    // ==========================================
    // STRUKTUR GENERATION SETUP
    // ==========================================
    const strukturSystemPrompt = `You are a senior software architect specializing in product decomposition and feature mapping.

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

    const strukturUserPrompt = `Generate a feature mindmap for this product:

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

    // ==========================================
    // PRD GENERATION SETUP
    // ==========================================
    let template = "";
    try {
      const templatePath = path.join(process.cwd(), "public", "contoh-prd.md");
      template = fs.readFileSync(templatePath, "utf-8");
    } catch (error) {
      console.warn("Could not read public/contoh-prd.md, using fallback structure", error);
      template = "# PRODUCT REQUIREMENTS DOCUMENT (PRD)\n\n## 1. Overview\n\n## 2. Objectives\n\n...";
    }

    let baseSystemPrompt = "You are an expert Product Manager and System Architect.\nYour task is to generate a comprehensive, professional Product Requirements Document (PRD) strictly based on the user's inputs.";
    try {
      const promptPath = path.join(process.cwd(), "system-prompt.txt");
      baseSystemPrompt = fs.readFileSync(promptPath, "utf-8");
    } catch (error) {
      console.warn("Could not read system-prompt.txt, using fallback base prompt", error);
    }

    const prdSystemPrompt = `${baseSystemPrompt}

=== TEMPLATE START ===
${template}
=== TEMPLATE END ===`;

    let answersStr = "";
    if (formInputs.dynamicQuestions && formInputs.dynamicAnswers) {
      formInputs.dynamicQuestions.forEach((q: any) => {
        const ans = formInputs.dynamicAnswers[q.key];
        const ansStr = Array.isArray(ans) ? ans.join(", ") : ans || "N/A";
        answersStr += `- ${q.title}: ${ansStr}\n`;
      });
    } else {
      answersStr = `- Target User: ${formInputs.targetUser || "N/A"}
- Platform: ${formInputs.platform || "N/A"}
- Core Features: ${Array.isArray(formInputs.coreFeatures) ? formInputs.coreFeatures.join(", ") : "N/A"}
- Monetization: ${formInputs.monetization || "N/A"}
- App Scale: ${formInputs.appScale || "N/A"}
- Integrations: ${Array.isArray(formInputs.integrations) ? formInputs.integrations.join(", ") : "N/A"}
- Design Preference: ${formInputs.designPreference || "N/A"}`;
    }

    const prdUserPrompt = `Generate a PRD based on the following user inputs:
    
- App Name: ${project.appName || "N/A"}
- App Idea: ${project.appIdea || "N/A"}
- Frontend Stack: ${formInputs.stacks?.frontend || "N/A"}
- Backend Stack: ${formInputs.stacks?.backend || "N/A"}
- Database Stack: ${formInputs.stacks?.database || "N/A"}
- Deployment Stack: ${formInputs.stacks?.deployment || "N/A"}
${answersStr}
`;

    // ==========================================
    // PARALLEL EXECUTION
    // ==========================================
    
    // Function to run a prompt with fallback models and keys
    const generateWithFallback = async (sysPrompt: string, usrPrompt: string) => {
      let responseText = "";
      let success = false;
      let lastError = null;
      for (const apiKey of keys) {
        const ai = new GoogleGenAI({ apiKey });
        for (const model of models) {
          try {
            const response = await ai.models.generateContent({
              model,
              contents: usrPrompt,
              config: { systemInstruction: sysPrompt },
            });
            responseText = response.text?.trim() || "";
            success = true;
            const provider = apiKey === process.env.GEMINI_API_KEY ? "gemini_key_1" : "gemini_key_2";
            await incrementUsage(provider);
            break;
          } catch (err: any) {
            lastError = err;
            console.warn(`[Fallback] ${model}:`, err.message);
          }
        }
        if (success) break;
      }

      if (!success && process.env.OPENROUTER_API_KEY) {
        console.log("Both Gemini keys failed, falling back to OpenRouter");
        try {
          const { default: OpenAI } = await import("openai");
          const openai = new OpenAI({
            baseURL: "https://openrouter.ai/api/v1",
            apiKey: process.env.OPENROUTER_API_KEY,
          });

          const completion = await openai.chat.completions.create({
            model: openRouterModel,
            messages: [
              { role: "system", content: sysPrompt },
              { role: "user", content: usrPrompt }
            ]
          });
          
          responseText = completion.choices[0].message.content?.trim() || "";
          success = true;
          await incrementUsage("openrouter");
        } catch (err: any) {
          lastError = err;
          console.warn(`[OpenRouter Fallback] Failed:`, err.message);
        }
      }

      if (!success || !responseText) throw new Error("Generation failed: " + lastError?.message);
      return responseText;
    };

    // Run both simultaneously
    console.log("Starting parallel generation of Struktur and PRD...");
    const [strukturTextRaw, prdTextRaw] = await Promise.all([
      generateWithFallback(strukturSystemPrompt, strukturUserPrompt),
      generateWithFallback(prdSystemPrompt, prdUserPrompt)
    ]);
    console.log("Parallel generation complete.");

    // Process Struktur
    let strukturText = strukturTextRaw;
    strukturText = strukturText.replace(/^```json\n?/, "").replace(/^```\n?/, "").replace(/\n?```$/, "");
    let parsedStruktur;
    try {
      parsedStruktur = JSON.parse(strukturText);
    } catch {
      console.error("Failed to parse struktur JSON:", strukturText);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    // Process PRD (clean up code blocks if it wrapped the markdown)
    let prdText = prdTextRaw;
    if (prdText.startsWith("\`\`\`markdown")) {
        prdText = prdText.replace(/^\`\`\`markdown\n?/, "").replace(/\n?\`\`\`$/, "");
    }
    // Validate mermaid blocks for PRD
    prdText = prdText.replace(/```mermaid\n([\s\S]*?)```/g, (match, content) => {
      let cleaned = content;
      cleaned = cleaned.replace(/-->\s*([^{}[\]()|]+)\s*-->/g, "-->|\"$1\"|-->"); 
      return `\`\`\`mermaid\n${cleaned}\n\`\`\``;
    });

    // Save both to Database
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        strukturData: JSON.stringify(parsedStruktur),
        prdData: prdText 
      },
    });

    // Save both to Redis Cache
    try {
      await redis.set(cacheKeyStruktur, parsedStruktur);
      await redis.set(cacheKeyPrd, prdText);
    } catch (err) {
      console.warn("Redis set error:", err);
    }

    return NextResponse.json(parsedStruktur);
  } catch (error) {
    console.error("Parallel generation error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
