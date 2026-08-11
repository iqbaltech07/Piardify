import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { generateText, extractJson } from "@/lib/llm";
import { checkRateLimit, RateLimitWindows } from "@/lib/rateLimit";
import { getDailyAiCallLimit } from "@/lib/planQuota";
import { questionsSchema } from "@/lib/validation";

export const maxDuration = 60;

const SYSTEM_PROMPT = `You are an expert Product Manager. The user is building a new application.
Your task is to generate EXACTLY 7 multiple-choice clarifying questions to deeply understand their specific app idea and technical stack.
These questions will be asked in a form to generate a Product Requirements Document (PRD).

CRITICAL INSTRUCTIONS:
1. Generate exactly 7 questions.
2. The questions must be highly tailored to the user's specific app idea, NOT generic questions.
3. Each question must have a 'key' (camelCase string), 'title' (the question itself), 'subtitle' (a brief explanation), 'type' (either "single" for one choice or "multiple" for multiple choices), and 'options' (an array of 4-7 possible answers).
4. Do not ask for the app name, idea, or tech stack, as we already have those.
5. Return the result strictly as a JSON array matching the schema.`;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tier: true, email: true },
    });

    const dailyLimit = getDailyAiCallLimit(user?.tier, user?.email);
    const rl = await checkRateLimit({
      userId: session.user.id,
      scope: "generate:questions",
      limit: dailyLimit,
      windowSeconds: RateLimitWindows.DAY,
    });
    if (!rl.allowed) {
      return NextResponse.json({ error: "DAILY_LIMIT_REACHED", message: `Batas generate harian tercapai. Coba lagi besok.` }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const { appName, appIdea, stacks } = body as {
      appName?: string;
      appIdea?: string;
      stacks?: { frontend?: string; backend?: string; database?: string; deployment?: string };
    };

    if (!appIdea || typeof appIdea !== "string" || appIdea.trim().length < 10) {
      return NextResponse.json({ error: "Missing or invalid appIdea" }, { status: 400 });
    }

    const userPrompt = `App Name: ${appName || "N/A"}
App Idea: ${appIdea}
Tech Stack: Frontend (${stacks?.frontend || "N/A"}), Backend (${stacks?.backend || "N/A"}), Database (${stacks?.database || "N/A"}), Deployment (${stacks?.deployment || "N/A"})`;

    const sysPromptWithFormat = `${SYSTEM_PROMPT}\n\nYou MUST return ONLY a JSON array of exactly 7 question objects. Example format:\n[{"key":"targetAudience", "title":"Who is the target audience?", "subtitle":"Describe the users", "type":"single", "options":["Startups", "Enterprise"]}]`;

    // OpenRouter first (this endpoint historically preferred it), Gemini fallback.
    let result: Awaited<ReturnType<typeof generateText>> | null = null;
    try {
      result = await generateText({
        systemPrompt: sysPromptWithFormat,
        userPrompt,
        priority: "openrouter",
        jsonObject: true,
      });
    } catch (err: any) {
      console.warn("[Questions] generation failed:", err?.message);
    }

    if (!result) {
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }

    const jsonText = extractJson(result.text);
    if (!jsonText) {
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }

    let questions;
    try {
      questions = questionsSchema.parse(JSON.parse(jsonText));
    } catch (err) {
      console.error("Invalid questions JSON from AI:", jsonText);
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}