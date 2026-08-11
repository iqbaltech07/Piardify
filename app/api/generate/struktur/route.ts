import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateText, extractJson } from "@/lib/llm";
import { PRD_TEMPLATE, PRD_TEMPLATE_FALLBACK, BASE_SYSTEM_PROMPT } from "@/lib/prompts";
import { getOwnedProject } from "@/lib/projectHelpers";
import { checkRateLimit, RateLimitWindows } from "@/lib/rateLimit";
import { getDailyAiCallLimit } from "@/lib/planQuota";
import { parseBody, projectIdSchema, strukturSchema } from "@/lib/validation";
import { fixMermaidBlocks } from "@/lib/mermaidFix";

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

    const { projectId } = await parseBody(req, projectIdSchema);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, email: true },
    });

    const dailyLimit = getDailyAiCallLimit(user?.tier, user?.email);
    const rl = await checkRateLimit({
      userId: session.user.id,
      scope: "generate:struktur",
      limit: dailyLimit,
      windowSeconds: RateLimitWindows.DAY,
    });
    if (!rl.allowed) {
      return NextResponse.json({ error: "DAILY_LIMIT_REACHED", message: `Batas generate harian tercapai. Coba lagi besok.` }, { status: 429 });
    }

    // 1. Check Redis Cache
    const cacheKeyStruktur = `project:${projectId}:struktur`;

    try {
      const cached = await redis.get(cacheKeyStruktur);
      if (cached) {
        return NextResponse.json(cached);
      }
    } catch (err) {
      console.warn("Redis Cache Miss/Error:", err);
    }

    // 2. Check Database (typed ownership)
    const project = await getOwnedProject(session.user.id, projectId, {
      id: true,
      userId: true,
      appName: true,
      appIdea: true,
      formInputs: true,
      strukturData: true,
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

IMPORTANT: The nodes you generate will be used as the feature structure for the PRD. Make sure each node maps to a real section of features in the product.
`;

    // ==========================================
    // PRD GENERATION SETUP
    // ==========================================
    const prdSystemPrompt = `${BASE_SYSTEM_PROMPT}

=== TEMPLATE START ===
${PRD_TEMPLATE || PRD_TEMPLATE_FALLBACK}
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

    const integrationsList = Array.isArray(formInputs.integrations) && formInputs.integrations.length > 0
      ? formInputs.integrations.filter((i: string) => i !== "None").join(", ")
      : "None";

    const prdUserPrompt = `Generate a PRD based on the following user inputs:
    
- App Name: ${project.appName || "N/A"}
- App Idea: ${project.appIdea || "N/A"}
- Frontend Stack: ${formInputs.stacks?.frontend || "N/A"}
- Backend Stack: ${formInputs.stacks?.backend || "N/A"}
- Database Stack: ${formInputs.stacks?.database || "N/A"}
- Deployment Stack: ${formInputs.stacks?.deployment || "N/A"}
${answersStr}

[SELECTED INTEGRATIONS - CRITICAL]
The following third-party integrations have been selected by the user and MUST be explicitly described inside the corresponding feature section of the PRD (not just listed in tech stack):
${integrationsList}

For each integration above, include a dedicated sub-section or detailed bullet inside the relevant feature section explaining HOW it is used (e.g. OAuth flow, API calls, webhook handling, SDK usage, etc.).
`;

    // ==========================================
    // PARALLEL EXECUTION (Gemini → OpenRouter fallback)
    // ==========================================
    console.log("Starting parallel generation of Struktur and PRD...");
    const [strukturResult, prdResult] = await Promise.all([
      generateText({
        systemPrompt: strukturSystemPrompt,
        userPrompt: strukturUserPrompt,
      }).catch((err) => { console.error("[Struktur] generation failed:", err); return null; }),
      generateText({
        systemPrompt: prdSystemPrompt,
        userPrompt: prdUserPrompt,
      }).catch((err) => { console.error("[PRD] generation failed:", err); return null; }),
    ]);

    if (!prdResult || !strukturResult) {
      return NextResponse.json({ error: "Failed to generate project structure/PRD" }, { status: 500 });
    }
    console.log("Parallel generation complete.");

    // Process Struktur (extract + validate JSON)
    const strukturJson = extractJson(strukturResult.text);
    if (!strukturJson) {
      console.error("Failed to extract struktur JSON:", strukturResult.text);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }
    let parsedStruktur;
    try {
      parsedStruktur = strukturSchema.parse(JSON.parse(strukturJson));
    } catch {
      console.error("Failed to parse/validate struktur JSON:", strukturJson);
      return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
    }

    // Process PRD (clean up code blocks + auto-fix mermaid)
    let prdText = prdResult.text;
    if (prdText.startsWith("```markdown")) {
      prdText = prdText.replace(/^```markdown\n?/, "").replace(/\n?```$/, "");
    }
    prdText = await fixMermaidBlocks(prdText);

    // Save both to Database
    await prisma.project.update({
      where: { id: projectId },
      data: {
        strukturData: JSON.stringify(parsedStruktur),
        prdData: prdText,
      },
      select: { id: true },
    });

    // Save both to Redis Cache
    try {
      await redis.set(cacheKeyStruktur, parsedStruktur);
      await redis.set(`project:${projectId}:prd`, prdText);
    } catch (err) {
      console.warn("Redis set error:", err);
    }

    return NextResponse.json(parsedStruktur);
  } catch (error: any) {
    console.error("Parallel generation error:", error);
    const status = error?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? error.message : "Internal Server Error" }, { status });
  }
}