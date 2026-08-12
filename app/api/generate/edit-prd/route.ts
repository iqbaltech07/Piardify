import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateGemini, generateOpenRouter, parseAndRepairJson } from "@/lib/llm";
import { getAiChatLimit } from "@/lib/planQuota";
import { parseBody, editPrdSchema } from "@/lib/validation";
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

    const body = await parseBody(req, editPrdSchema);
    const { projectId, currentPrd, prompt, selectedModel } = body;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const chatLimit = getAiChatLimit(user.tier, user.email);

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
        error: `Batas chat tercapai (${currentChats}/${chatLimit}). User ${user.tier} hanya mendapatkan ${chatLimit === Infinity ? "unlimited" : chatLimit}x chat AI. Upgrade ke ${user.tier === "FREE" ? "PRO" : "unlimited"} untuk menambah kuota chat!`,
        chatLimitReached: true,
        chatCount: currentChats,
        chatLimit,
        tier: user.tier,
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
      const res = await generateGemini({
        systemPrompt,
        userPrompt,
        preferredModel: modelToUse,
      });
      rawText = res.text;
    } else {
      // OpenRouter Model
      const res = await generateOpenRouter({
        systemPrompt,
        userPrompt,
        model: modelToUse,
        jsonObject: true,
      });
      rawText = res.text;
    }

    if (!rawText) {
      return NextResponse.json({ error: "Failed to process prompt" }, { status: 500 });
    }

    function parseOrExtractJsonResponse(text: string): { reply: string; isPrdUpdated: boolean; updatedMarkdown?: string | null } {
      const cleanJson = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      // 1. Try robust parseAndRepairJson
      const repairedObj = parseAndRepairJson(text);
      if (repairedObj && typeof repairedObj === "object") {
        return {
          reply: typeof repairedObj.reply === "string" ? repairedObj.reply : "Respons diterima.",
          isPrdUpdated: Boolean(repairedObj.isPrdUpdated),
          updatedMarkdown: typeof repairedObj.updatedMarkdown === "string" ? repairedObj.updatedMarkdown : null,
        };
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
      updatedMarkdown = await fixMermaidBlocks(updatedMarkdown);

      // Save to Database & Redis if projectId is provided
      if (projectId) {
        try {
          const project = await prisma.project.findFirst({
            where: { id: projectId, userId: session.user.id },
            select: { formInputs: true },
          });

          const updateData: any = { prdData: updatedMarkdown };

          // Smart-sync: editing the PRD makes the generated task list outdated
          if (project?.formInputs) {
            try {
              const formInputsObj = JSON.parse(project.formInputs);
              formInputsObj._tasksOutdated = true;
              updateData.formInputs = JSON.stringify(formInputsObj);
            } catch {}
          }

          await prisma.project.update({
            where: { id: projectId },
            data: updateData,
            select: { id: true },
          });

          const cacheKey = `project:${projectId}:prd`;
          await redis.set(cacheKey, updatedMarkdown);
          await redis.del(`project:${projectId}:tasks`);
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
      chatLimit: chatLimit === Infinity ? null : chatLimit,
    });
  } catch (error: any) {
    console.error("Error editing/brainstorming PRD:", error);
    const status = error?.status ?? 500;
    return NextResponse.json({ error: status === 400 ? error.message : error?.message || "Internal Server Error" }, { status });
  }
}