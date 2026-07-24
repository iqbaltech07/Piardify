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
      const templatePath = path.join(process.cwd(), "public", "contoh-prd.md");
      template = fs.readFileSync(templatePath, "utf-8");
    } catch (error) {
      console.warn("Could not read public/contoh-prd.md, using fallback structure", error);
      template = "# PRODUCT REQUIREMENTS DOCUMENT (PRD)\n\n## 1. Overview\n\n## 2. Objectives\n\n...";
    }

    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY
    ].filter(Boolean) as string[];

    if (keys.length === 0) {
      return NextResponse.json({ error: "Gemini API Keys not configured" }, { status: 500 });
    }

    let baseSystemPrompt = "You are an expert Product Manager and System Architect.\nYour task is to generate a comprehensive, professional Product Requirements Document (PRD) strictly based on the user's inputs.";
    try {
      const promptPath = path.join(process.cwd(), "system-prompt.txt");
      baseSystemPrompt = fs.readFileSync(promptPath, "utf-8");
    } catch (error) {
      console.warn("Could not read system-prompt.txt, using fallback base prompt", error);
    }

    const systemPrompt = `${baseSystemPrompt}

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

    const settings: any = (await redis.get("app:settings")) || {};
    const geminiModel = settings.geminiModel || "gemini-3.6-flash";
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
