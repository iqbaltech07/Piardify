import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
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
    const cacheKey = `project:${projectId}:prd`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({ markdown: cached });
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

    if (project.prdData) {
      try { await redis.set(cacheKey, project.prdData); } catch {}
      return NextResponse.json({ markdown: project.prdData });
    }

    const formInputs = project.formInputs ? JSON.parse(project.formInputs) : {};

    // Read the template file
    let template = "";
    try {
      const templatePath = path.join(process.cwd(), "piardify_prd.md");
      template = fs.readFileSync(templatePath, "utf-8");
    } catch (error) {
      console.warn("Could not read piardify_prd.md, using fallback structure", error);
      template = "# PRODUCT REQUIREMENTS DOCUMENT (PRD)\n\n## 1. Overview\n\n## 2. Objectives\n\n...";
    }

    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Gemini API Keys not configured" }, { status: 500 });
    }

    const systemPrompt = `You are an expert Product Manager and System Architect.
Your task is to generate a comprehensive, professional Product Requirements Document (PRD) strictly based on the user's inputs.

CRITICAL INSTRUCTIONS:
1. You MUST use exactly the same structural format, headings, and numbering as the provided Template below.
2. Replace the template content with the specific details from the user's inputs.
3. Generate Mermaid diagrams exactly where they appear in the template (User Flow, System Architecture, Data Flow, Development Process Flow) but tailored to the user's app idea.

MERMAID SYNTAX RULES (CRITICAL - MERMAID v11.16.0):
- Use only 'flowchart TD' or 'flowchart LR'.
- All node IDs MUST be simple alphanumeric strings (A, B, C, N1, etc.).
- EVERY SINGLE node label MUST be wrapped in double quotes. No exceptions.
  - Reason: characters like (, ), /, \, &, comma, colon break the parser.
- DO NOT use reserved word 'end' as a bare label. Use: Z["Selesai"].
- Shapes: A["process"] B{"decision"} C("start/end")
- Arrows: only --> or -->|Label Text|
- NEVER use ==> or -> or <-- inside flowchart
- NEVER place bold (**text**) or italic (_text_) inside a mermaid block.

CRITICAL REAL-WORLD ERRORS TO AVOID:
BAD (will crash):  A[Frontend - Next.js] --> B[Backend API - Python (FastAPI/Django)]
GOOD (correct):    A["Frontend - Next.js"] --> B["Backend API - Python (FastAPI/Django)"]

BAD (will crash):  D[AI/ML Task Generation Engine]
GOOD (correct):    D["AI/ML Task Generation Engine"]

BAD (will crash):  E[Structured Task Data (JSON)]
GOOD (correct):    E["Structured Task Data (JSON)"]

BAD (will crash):  F[(PostgreSQL Instance)]
GOOD (correct):    F[("PostgreSQL Instance")]

The rule is simple: if it goes inside [], {}, or (), it must have double quotes inside.

4. Respond ONLY with the raw Markdown. Do not include introductory or concluding conversational text.
5. Write the content in Indonesian (Bahasa Indonesia) if the user's inputs are in Indonesian, otherwise match their language.

=== TEMPLATE START ===
${template}
=== TEMPLATE END ===`;

    const userPrompt = `Generate a PRD based on the following user inputs:
    
- App Name: ${project.appName || "N/A"}
- App Idea: ${project.appIdea || "N/A"}
- Target User: ${formInputs.targetUser || "N/A"}
- Platform: ${formInputs.platform || "N/A"}
- Core Features: ${Array.isArray(formInputs.coreFeatures) ? formInputs.coreFeatures.join(", ") : "N/A"}
- Monetization: ${formInputs.monetization || "N/A"}
- App Scale: ${formInputs.appScale || "N/A"}
- Integrations: ${Array.isArray(formInputs.integrations) ? formInputs.integrations.join(", ") : "N/A"}
- Frontend Stack: ${formInputs.stacks?.frontend || "N/A"}
- Backend Stack: ${formInputs.stacks?.backend || "N/A"}
- Database Stack: ${formInputs.stacks?.database || "N/A"}
- Deployment Stack: ${formInputs.stacks?.deployment || "N/A"}
- Design Preference: ${formInputs.designPreference || "N/A"}
`;

    const models = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

    let response: any;
    let success = false;
    let lastError = null;

    for (const apiKey of keys) {
      const ai = new GoogleGenAI({ apiKey });

      for (const model of models) {
        try {
          response = await ai.models.generateContent({
            model: model,
            contents: userPrompt,
            config: {
              systemInstruction: systemPrompt
            }
          });

          success = true;
          break; // break model loop
        } catch (err: any) {
          lastError = err;
          console.warn(`[Fallback] Failed with key ${apiKey.substring(0, 15)}... and model ${model}:`, err.message);
        }
      }
      if (success) break; // break key loop
    }

    if (!success || !response) {
      console.error("All fallback combinations failed:", lastError);
      return NextResponse.json({ error: "Failed to generate PRD due to API limits or errors" }, { status: 500 });
    }

    let text = response.text;

    // Validate and auto-fix mermaid blocks before sending to client
    if (text) {
      const { parse: mermaidParse } = await import("@mermaid-js/parser");

      /**
       * Safe auto-quoting for flowchart node labels.
       * Mermaid v11 requires labels with special chars to be wrapped in double quotes.
       * This function quotes unquoted labels in [], {}, () shapes.
       * It is careful NOT to modify:
       *   - already quoted labels: A["label"]
       *   - special shapes: A[(cylinder)], A[[subroutine]], A[/parallelogram/]
       *   - edge label text: -->|label|
       *   - diagram type declaration line
       */
      function autoQuoteFlowchartLabels(code: string): string {
        const codeLines = code.split('\n');
        return codeLines.map((line, idx) => {
          // Skip: diagram type line, comments
          if (idx === 0) return line;
          if (line.trim().startsWith('%%')) return line;

          // Fix unquoted [label] — skip ["..."], [(...)], [[...]], [/...]
          line = line.replace(
            /([A-Za-z0-9_]+)\[(?!["\[(\//])([^\]\n"]+)\]/g,
            (_m, id, label) => `${id}["${label}"]`
          );

          // Fix unquoted {label} — skip {"..."} and {{...}}
          line = line.replace(
            /([A-Za-z0-9_]+)\{(?!["\{])([^}\n"]+)\}/g,
            (_m, id, label) => `${id}{"${label}"}`
          );

          // Fix unquoted (label) — skip ("..."), ((circle)), ([ asymmetric )
          line = line.replace(
            /([A-Za-z0-9_]+)\((?!["\(\[])([^)\n"]+)\)/g,
            (_m, id, label) => `${id}("${label}")`
          );

          return line;
        }).join('\n');
      }

      const blockRegex = /```mermaid\n([\s\S]*?)```/g;
      let match;
      const blocks: { original: string, code: string }[] = [];
      while ((match = blockRegex.exec(text)) !== null) {
        blocks.push({ original: match[0], code: match[1] });
      }

      for (const block of blocks) {
        let code = block.code;

        // 1. Remove markdown formatting (bold/italic/backtick are always invalid inside mermaid)
        code = code.replace(/\*\*/g, "").replace(/__/g, "").replace(/`/g, "");

        // 2. Fix unquoted node labels for flowchart/graph diagrams
        const diagramFirstLine = code.trim().split('\n')[0].trim();
        const diagramType = diagramFirstLine.split(' ')[0];
        if (diagramType === 'flowchart' || diagramType === 'graph') {
          code = autoQuoteFlowchartLabels(code);
        }

        // 3. Validate with @mermaid-js/parser for Langium-based diagram types
        const supportedTypes = ["pie", "info", "gitGraph", "architecture", "packet", "radar", "railroad", "cynefin", "mindmap", "timeline"];
        if (supportedTypes.includes(diagramType)) {
          try {
            await mermaidParse(diagramType as any, code);
          } catch (e: any) {
            console.warn(`Mermaid parser validation failed for ${diagramType}:`, e.message);
          }
        }

        text = text.replace(block.original, '```mermaid\n' + code + '\n```');
      }
    }

    // Save to Database
    await prisma.project.update({
      where: { id: projectId },
      data: { prdData: text },
    });

    // Save to Redis Cache
    try {
      await redis.set(cacheKey, text);
    } catch (err) {
      console.warn("Redis set error:", err);
    }

    return NextResponse.json({ markdown: text });

  } catch (error) {
    console.error("Error generating PRD:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
