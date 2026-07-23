import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redis } from "@/lib/redis";
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
    const { appName, appIdea, stacks } = body;

    if (!appIdea) {
      return NextResponse.json({ error: "Missing appIdea" }, { status: 400 });
    }

    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Gemini API Keys not configured" }, { status: 500 });
    }

    const systemPrompt = `You are an expert Product Manager. The user is building a new application.
Your task is to generate EXACTLY 7 multiple-choice clarifying questions to deeply understand their specific app idea and technical stack.
These questions will be asked in a form to generate a Product Requirements Document (PRD).

CRITICAL INSTRUCTIONS:
1. Generate exactly 7 questions.
2. The questions must be highly tailored to the user's specific app idea, NOT generic questions.
3. Each question must have a 'key' (camelCase string), 'title' (the question itself), 'subtitle' (a brief explanation), 'type' (either "single" for one choice or "multiple" for multiple choices), and 'options' (an array of 4-7 possible answers).
4. Do not ask for the app name, idea, or tech stack, as we already have those.
5. Return the result strictly as a JSON array matching the schema.`;

    const userPrompt = `App Name: ${appName || "N/A"}
App Idea: ${appIdea}
Tech Stack: Frontend (${stacks?.frontend || "N/A"}), Backend (${stacks?.backend || "N/A"}), Database (${stacks?.database || "N/A"}), Deployment (${stacks?.deployment || "N/A"})`;

    const settings: any = (await redis.get("app:settings")) || {};
    const geminiModel = settings.geminiModel || "gemini-3.5-flash";
    const openRouterModel = settings.openRouterModel || "nvidia/nemotron-3-ultra-550b-a55b:free";
    
    const models = [geminiModel, "gemini-2.5-flash-lite"];

    let response: any;
    let success = false;
    let lastError = null;

    // Priority 1: OpenRouter (using configured openRouterModel)
    if (process.env.OPENROUTER_API_KEY) {
      console.log(`Generating questions via OpenRouter (${openRouterModel})`);
      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
        });

        const sysPromptWithFormat = `${systemPrompt}\n\nYou MUST return ONLY a JSON array of exactly 7 question objects. Example format:\n[{"key":"targetAudience", "title":"Who is the target audience?", "subtitle":"Describe the users", "type":"single", "options":["Startups", "Enterprise"]}]`;

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

        const text = completion.choices[0].message.content?.trim();
        if (!text) throw new Error("Empty response from OpenRouter");

        const match = text.match(/\[[\s\S]*\]/);
        const jsonText = match ? match[0] : text;

        // Validate JSON parsing before declaring success
        const parsed = JSON.parse(jsonText);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error("Invalid question array from OpenRouter");
        }

        response = { text: jsonText };
        success = true;
        await incrementUsage("openrouter");
      } catch (err: any) {
        lastError = err;
        console.warn(`[OpenRouter Questions] Failed or invalid JSON, will fallback:`, err.message);
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
              model: model,
              contents: userPrompt,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      key: { type: Type.STRING },
                      title: { type: Type.STRING },
                      subtitle: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["single", "multiple"] },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["key", "title", "subtitle", "type", "options"],
                  },
                },
              },
            });

            success = true;
            const provider = apiKey === process.env.GEMINI_API_KEY ? "gemini_key_1" : "gemini_key_2";
            await incrementUsage(provider);
            break;
          } catch (err: any) {
            lastError = err;
            console.warn(`[Gemini Fallback] Failed with key ${apiKey.substring(0, 10)}... and model ${model}:`, err.message);
          }
        }
        if (success) break;
      }
    }

    if (!success || !response) {
      console.error("All fallback combinations (Gemini & OpenRouter) failed:", lastError);
      return NextResponse.json({ error: "Failed to generate questions" }, { status: 500 });
    }

    const text = response.text;
    const questions = JSON.parse(text);

    return NextResponse.json({ questions });

  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
