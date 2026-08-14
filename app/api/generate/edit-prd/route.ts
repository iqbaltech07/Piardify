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

    const isEditIntent = /(tambah|ubah|ganti|update|edit|hapus|masukkan|terapkan|buatkan|revisi|sesuaikan|add|remove|change|insert|delete|append|modify|fix|perbaiki)/i.test(prompt);

    const systemPrompt = `You are an expert AI Product Manager and Brainstorming Partner.
You are helping the user refine, discuss, or update their Product Requirements Document (PRD).

TASK INSTRUCTIONS:
1. Analyze the user's prompt instruction.
2. Determine if the user is BRAINSTORMING / ASKING A QUESTION / DISCUSSING (e.g. asking for ideas, pros/cons, recommendations, technical advice, feedback).
   - If BRAINSTORMING: Provide a helpful, clear conversational response in Indonesian answering their question. Set isPrdUpdated to false.
3. Determine if the user wants to REVISE / EDIT / ADD TO / REMOVE / UPDATE / FIX the PRD (e.g. "Tambahkan fitur X", "Hapus section Y", "Ubah bahasa", "Terapkan rekomendasi tadi").
   - If EDITING: Provide a friendly confirmation message and generate the FULL updated PRD markdown.

OUTPUT FORMAT (You can use Tagged Format for maximum reliability):
<reply>Your conversational response, answer, ideas, or edit confirmation in Indonesian.</reply>
<is_prd_updated>true or false</is_prd_updated>
<updated_prd>
(Full updated PRD markdown here if is_prd_updated is true, otherwise leave empty)
</updated_prd>

Alternatively, you may return strict valid JSON:
{
  "reply": "Your conversational response in Indonesian.",
  "isPrdUpdated": true,
  "updatedMarkdown": "Full updated PRD markdown string"
}`;

    const userPrompt = `=== CURRENT PRD START ===
${currentPrd}
=== CURRENT PRD END ===

=== USER INSTRUCTION ===
${prompt}

${isEditIntent ? "USER INTENT: The user wants to EDIT/UPDATE the PRD. Please provide the updated PRD with their changes applied." : ""}`;

    let rawText = "";
    const modelToUse = selectedModel || "gemini-3.7-flash";

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
        jsonObject: false,
      });
      rawText = res.text;
    }

    if (!rawText) {
      return NextResponse.json({ error: "Failed to process prompt" }, { status: 500 });
    }

    function parseOrExtractResponse(text: string): { reply: string; isPrdUpdated: boolean; updatedMarkdown?: string | null } {
      const trimmed = text.trim();

      // 1. Check Tagged Delimiter Format (<reply>...</reply>, <updated_prd>...</updated_prd>)
      const replyTagMatch = trimmed.match(/<reply>([\s\S]*?)<\/reply>/i);
      const isUpdatedTagMatch = trimmed.match(/<is_prd_updated>([\s\S]*?)<\/is_prd_updated>/i);
      const prdTagMatch = trimmed.match(/<updated_prd>([\s\S]*?)<\/updated_prd>/i);

      if (replyTagMatch || prdTagMatch) {
        const reply = replyTagMatch ? replyTagMatch[1].trim() : "Perubahan PRD telah diterapkan.";
        const isUpdatedStr = isUpdatedTagMatch ? isUpdatedTagMatch[1].trim().toLowerCase() : "";
        const prdContent = prdTagMatch ? prdTagMatch[1].trim() : "";
        const isPrdUpdated = isUpdatedStr === "true" || prdContent.length > 50 || isEditIntent;

        return {
          reply: reply || "PRD berhasil diperbarui!",
          isPrdUpdated: isPrdUpdated && prdContent.length > 30,
          updatedMarkdown: prdContent.length > 30 ? prdContent : null,
        };
      }

      // 2. Try JSON Parse
      const repairedObj = parseAndRepairJson<Record<string, unknown>>(text);
      if (repairedObj && typeof repairedObj === "object") {
        const reply = typeof repairedObj.reply === "string" ? repairedObj.reply : "Respons diterima.";
        const isPrdUpdated = Boolean(repairedObj.isPrdUpdated);
        const updatedMarkdown = typeof repairedObj.updatedMarkdown === "string" ? repairedObj.updatedMarkdown : null;

        if (isPrdUpdated && updatedMarkdown && updatedMarkdown.trim().length > 30) {
          return {
            reply,
            isPrdUpdated: true,
            updatedMarkdown: updatedMarkdown.trim(),
          };
        }
      }

      // 3. Fallback: Regex extraction for JSON strings with unescaped newlines
      const mdMatch = text.match(/"updatedMarkdown"\s*:\s*"([\s\S]*?)"(?:\s*,\s*"|\s*})/);
      const replyMatch = text.match(/"reply"\s*:\s*"([\s\S]*?)"(?:\s*,\s*"|\s*})/);

      let extractedMd = mdMatch ? mdMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";
      let extractedReply = replyMatch ? replyMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";

      if (extractedMd && extractedMd.length > 50) {
        return {
          reply: extractedReply || "Saya telah memperbarui PRD sesuai instruksi Anda.",
          isPrdUpdated: true,
          updatedMarkdown: extractedMd,
        };
      }

      // 4. Fallback: Check if response contains direct Markdown headings (e.g. # PRODUCT REQUIREMENTS DOCUMENT)
      if (text.includes("# PRODUCT REQUIREMENTS DOCUMENT") || (text.includes("## 1. Overview") && text.length > 200)) {
        let cleanMd = text;
        if (cleanMd.includes("```markdown")) {
          const match = cleanMd.match(/```markdown([\s\S]*?)```/);
          if (match) cleanMd = match[1];
        } else if (cleanMd.includes("```")) {
          const match = cleanMd.match(/```([\s\S]*?)```/);
          if (match) cleanMd = match[1];
        }

        return {
          reply: "PRD telah berhasil diperbarui dan diselaraskan.",
          isPrdUpdated: true,
          updatedMarkdown: cleanMd.trim(),
        };
      }

      // 5. Pure conversational response
      let cleanText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
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

    const parsed = parseOrExtractResponse(rawText);

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