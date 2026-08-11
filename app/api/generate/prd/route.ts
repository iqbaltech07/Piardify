import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateGemini } from "@/lib/llm";
import { PRD_TEMPLATE, PRD_TEMPLATE_FALLBACK, BASE_SYSTEM_PROMPT } from "@/lib/prompts";
import { getOwnedProject } from "@/lib/projectHelpers";
import { checkRateLimit, RateLimitWindows } from "@/lib/rateLimit";
import { getDailyAiCallLimit } from "@/lib/planQuota";
import { parseBody, projectIdSchema } from "@/lib/validation";
import { fixMermaidBlocks } from "@/lib/mermaidFix";

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
      scope: "generate:prd",
      limit: dailyLimit,
      windowSeconds: RateLimitWindows.DAY,
    });
    if (!rl.allowed) {
      return NextResponse.json({ error: "DAILY_LIMIT_REACHED", message: `Batas generate harian tercapai. Coba lagi besok.` }, { status: 429 });
    }

    // 1. Check Redis Cache
    const cacheKey = `project:${projectId}:prd`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({ markdown: cached });
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
      prdData: true,
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
    }

    if (project.prdData) {
      try { await redis.set(cacheKey, project.prdData); } catch { }
      return NextResponse.json({ markdown: project.prdData });
    }

    const formInputs = project.formInputs ? JSON.parse(project.formInputs) : {};

    const systemPrompt = `${BASE_SYSTEM_PROMPT}

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
      // Fallback for older projects
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

    const userPrompt = `Generate a PRD based on the following user inputs:
    
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

    let response: any;
    let success = false;
    let lastError = null;

    try {
      response = await generateGemini({
        systemPrompt,
        userPrompt,
      });
      success = true;
    } catch (err: any) {
      lastError = err;
      console.warn("[PRD] All Gemini fallback combinations failed:", err.message);
    }

    if (!success || !response) {
      console.error("All fallback combinations failed:", lastError);
      return NextResponse.json({ error: "Failed to generate PRD due to API limits or errors" }, { status: 500 });
    }

    let text = response.text;

    // Validate and auto-fix mermaid blocks before sending to client
    if (text) {
      text = await fixMermaidBlocks(text);
    }

    // Save to Database
    await prisma.project.update({
      where: { id: projectId },
      data: { prdData: text },
      select: { id: true },
    });

    // Save to Redis Cache
    try {
      await redis.set(cacheKey, text);
    } catch (err) {
      console.warn("Redis set error:", err);
    }

    return NextResponse.json({ markdown: text });

  } catch (error: any) {
    console.error("Error generating PRD:", error);
    const status = error?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? error.message : "Internal Server Error" }, { status });
  }
}