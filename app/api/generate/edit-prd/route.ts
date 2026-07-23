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
    const { projectId, currentPrd, prompt, selectedModel } = body;

    if (!currentPrd || !prompt) {
      return NextResponse.json({ error: "Missing currentPrd or prompt" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isUnlimited = user.email === "dev.iqbal007@gmail.com";
    const tier = user.tier || "FREE";
    const chatLimit = isUnlimited ? Infinity : (tier === "PRO" ? 20 : 5);

    // Track chat count per project in Redis
    const chatKey = projectId ? `project:${projectId}:chats:${session.user.id}` : `user:${session.user.id}:chats`;
    let currentChats = 0;
    try {
      const val = await redis.get<number>(chatKey);
      currentChats = val ? Number(val) : 0;
    } catch (e) {
      console.warn("Redis get chat count warn:", e);
    }

    if (currentChats >= chatLimit) {
      return NextResponse.json({
        error: `Batas chat tercapai (${currentChats}/${chatLimit}). User ${tier} hanya mendapatkan ${chatLimit}x chat AI. Upgrade ke ${tier === "FREE" ? "PRO" : "unlimited"} untuk menambah kuota chat!`,
        chatLimitReached: true,
        chatCount: currentChats,
        chatLimit,
        tier
      }, { status: 403 });
    }

    const systemPrompt = `You are an expert AI Product Manager and Brainstorming Partner.
You are helping the user refine, discuss, or update their Product Requirements Document (PRD).

Task Instructions:
1. Analyze the user's prompt instruction.
2. Determine if the user is BRAINSTORMING / ASKING A QUESTION / DISCUSSING (e.g. asking for ideas, pros/cons, recommendations, technical advice, feedback, or asking questions about the project).
   - If BRAINSTORMING: Provide a helpful, clear conversational response in Indonesian answering their question or offering creative PM ideas. Do NOT edit the PRD markdown. Set "isPrdUpdated" to false, and "updatedMarkdown" to null.
3. Determine if the user explicitly wants to REVISE / EDIT / ADD TO / REMOVE / UPDATE the PRD (e.g. "Tambahkan fitur X", "Hapus section Y", "Ubah bahasa ke Inggris", "Terapkan poin-poin tadi ke PRD").
   - If EDITING: Provide a short friendly confirmation message in "reply" (e.g., "Saya telah memperbarui PRD dengan menambahkan fitur X!"), set "isPrdUpdated" to true, and generate the FULL updated PRD markdown in "updatedMarkdown".

You MUST respond strictly with a valid JSON object matching this schema:
{
  "reply": "Your conversational response, answer, ideas, or edit confirmation in Indonesian.",
  "isPrdUpdated": true or false,
  "updatedMarkdown": "Full updated PRD markdown string IF isPrdUpdated is true, otherwise null."
}`;

    const userPrompt = `=== CURRENT PRD START ===
${currentPrd}
=== CURRENT PRD END ===

=== USER INSTRUCTION ===
${prompt}

Respond in valid JSON according to the instructions.`;

    let rawText = "";
    const modelToUse = selectedModel || "gemini-3.5-flash";

    if (modelToUse.startsWith("gemini-")) {
      const keys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_SECONDARY
      ].filter(Boolean) as string[];

      if (keys.length === 0) {
        return NextResponse.json({ error: "Gemini API Keys not configured" }, { status: 500 });
      }

      const modelsToTry = [modelToUse, "gemini-2.5-flash-lite"];

      let success = false;
      let lastError = null;

      for (const apiKey of keys) {
        const ai = new GoogleGenAI({ apiKey });

        for (const model of modelsToTry) {
          try {
            const response = await ai.models.generateContent({
              model: model,
              contents: userPrompt,
              config: {
                systemInstruction: systemPrompt,
                responseMimeType: "application/json",
              }
            });

            if (response && response.text) {
              rawText = response.text;
              success = true;
              break;
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`[Edit PRD Fallback] Failed with model ${model}:`, err.message);
          }
        }
        if (success) break;
      }

      if (!success || !rawText) {
        return NextResponse.json({ error: "Failed to process prompt using Gemini model" }, { status: 500 });
      }
    } else {
      // OpenRouter Model
      if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json({ error: "OpenRouter API Key not configured" }, { status: 500 });
      }

      try {
        const { default: OpenAI } = await import("openai");
        const openai = new OpenAI({
          baseURL: "https://openrouter.ai/api/v1",
          apiKey: process.env.OPENROUTER_API_KEY,
        });

        const completion = await openai.chat.completions.create({
          model: modelToUse,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        });

        rawText = completion.choices[0]?.message?.content?.trim() || "";
        if (!rawText) {
          return NextResponse.json({ error: "Empty response from OpenRouter model" }, { status: 500 });
        }
      } catch (err: any) {
        console.error("OpenRouter edit error:", err);
        return NextResponse.json({ error: `OpenRouter edit failed: ${err.message}` }, { status: 500 });
      }
    }

    // Parse JSON with robust fallback
    function parseOrExtractJsonResponse(text: string): { reply: string; isPrdUpdated: boolean; updatedMarkdown?: string | null } {
      const cleanJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      // 1. Try standard JSON parse
      try {
        const obj = JSON.parse(cleanJson);
        if (obj && typeof obj === "object") {
          return {
            reply: typeof obj.reply === "string" ? obj.reply : "Respons diterima.",
            isPrdUpdated: Boolean(obj.isPrdUpdated),
            updatedMarkdown: typeof obj.updatedMarkdown === "string" ? obj.updatedMarkdown : null,
          };
        }
      } catch (e) {
        // Fallthrough to regex extraction
      }

      // 2. Fallback: Extract "reply" value via regex if JSON syntax was malformed
      const replyMatch = cleanJson.match(/"reply"\s*:\s*"([\s\S]*?)"(?:\s*,\s*"isPrdUpdated"|\s*})/);
      let replyText = replyMatch ? replyMatch[1] : "";

      if (!replyText && cleanJson.includes('"reply"')) {
        const idx = cleanJson.indexOf('"reply"');
        if (idx !== -1) {
          const afterReply = cleanJson.substring(idx + 7);
          const firstQuote = afterReply.indexOf('"');
          if (firstQuote !== -1) {
            replyText = afterReply.substring(firstQuote + 1);
          }
        }
      }

      if (replyText) {
        return {
          reply: replyText.replace(/\\n/g, "\n").replace(/\\"/g, '"'),
          isPrdUpdated: false,
          updatedMarkdown: null,
        };
      }

      // 3. Clean raw text fallback
      let cleanText = cleanJson;
      if (cleanText.startsWith("{") && cleanText.endsWith("}")) {
        cleanText = cleanText.slice(1, -1).trim();
      }
      cleanText = cleanText.replace(/^"reply"\s*:\s*"/, "").replace(/"$/, "");

      return {
        reply: cleanText || "Respons diterima.",
        isPrdUpdated: false,
        updatedMarkdown: null,
      };
    }

    const parsed = parseOrExtractJsonResponse(rawText);

    let updatedMarkdown = parsed.updatedMarkdown || "";

    // Auto fix mermaid syntax if PRD was updated
    if (parsed.isPrdUpdated && updatedMarkdown) {
      try {
        const { parse: mermaidParse } = await import("@mermaid-js/parser");
        function autoQuoteFlowchartLabels(code: string): string {
          const codeLines = code.split('\n');
          return codeLines.map((line, idx) => {
            if (idx === 0) return line;
            if (line.trim().startsWith('%%')) return line;
            line = line.replace(/([A-Za-z0-9_]+)\[(?!["\[(\//])([^\]\n"]+)\]/g, (_m, id, label) => `${id}["${label}"]`);
            line = line.replace(/([A-Za-z0-9_]+)\{(?!["\{])([^}\n"]+)\}/g, (_m, id, label) => `${id}{"${label}"}`);
            line = line.replace(/([A-Za-z0-9_]+)\((?!["\(\[])([^)\n"]+)\)/g, (_m, id, label) => `${id}("${label}")`);
            return line;
          }).join('\n');
        }

        const blockRegex = /```mermaid\n([\s\S]*?)```/g;
        let match;
        const blocks: { original: string, code: string }[] = [];
        while ((match = blockRegex.exec(updatedMarkdown)) !== null) {
          blocks.push({ original: match[0], code: match[1] });
        }

        for (const block of blocks) {
          let code = block.code.replace(/\*\*/g, "").replace(/__/g, "").replace(/`/g, "");
          const diagramFirstLine = code.trim().split('\n')[0].trim();
          const diagramType = diagramFirstLine.split(' ')[0];
          if (diagramType === 'flowchart' || diagramType === 'graph') {
            code = autoQuoteFlowchartLabels(code);
          }
          const supportedTypes = ["pie", "info", "gitGraph", "architecture", "packet", "radar", "railroad", "cynefin", "mindmap", "timeline"];
          if (supportedTypes.includes(diagramType)) {
            try { await mermaidParse(diagramType as any, code); } catch (e) {}
          }
          updatedMarkdown = updatedMarkdown.replace(block.original, '```mermaid\n' + code + '\n```');
        }
      } catch (e) {
        console.warn("Mermaid auto-fix error:", e);
      }

      // Save to Database & Redis if projectId is provided
      if (projectId) {
        try {
          await prisma.project.update({
            where: { id: projectId },
            data: { prdData: updatedMarkdown },
          });
          const cacheKey = `project:${projectId}:prd`;
          await redis.set(cacheKey, updatedMarkdown);
        } catch (e) {
          console.warn("Database/Redis update warn:", e);
        }
      }
    }

    // Increment chat count in Redis upon successful response
    try {
      await redis.set(chatKey, currentChats + 1);
    } catch (e) {
      console.warn("Redis set chat count warn:", e);
    }

    return NextResponse.json({
      reply: parsed.reply,
      isPrdUpdated: parsed.isPrdUpdated,
      markdown: parsed.isPrdUpdated ? updatedMarkdown : null,
      chatCount: currentChats + 1,
      chatLimit: isUnlimited ? null : chatLimit
    });
  } catch (error: any) {
    console.error("Error editing/brainstorming PRD:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
