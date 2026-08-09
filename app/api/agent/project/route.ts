import { NextRequest, NextResponse } from "next/server";
import { authenticateAgentRequest } from "@/lib/agentAuth";
import { prisma } from "@/lib/prisma";
import { SYSTEM_DIRECTIVES } from "@/lib/systemDirectives";
import { TASTE_SKILL_DIRECTIVES, getFilteredTasteSkill } from "@/lib/tasteSkill";
import { parseDesignMarkdown } from "@/lib/designParser";

export async function GET(req: NextRequest) {
  try {
    const authResult = await authenticateAgentRequest(req);
    if (!authResult.user) {
      return NextResponse.json({ success: false, error: authResult.error }, { status: authResult.statusCode || 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const section = searchParams.get("section") || "overview";
    const requestedSkill = searchParams.get("skill") || undefined;

    // If no projectId provided, return user's projects list
    if (!projectId) {
      const projects = await prisma.project.findMany({
        where: { userId: authResult.user.id },
        select: {
          id: true,
          appName: true,
          appIdea: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
      });

      return NextResponse.json({
        success: true,
        projects,
      });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId, userId: authResult.user.id },
      select: {
        id: true,
        userId: true,
        appName: true,
        appIdea: true,
        formInputs: true,
        strukturData: true,
        prdData: true,
        taskData: true,
        designData: true,
        status: true,
        checkedTasks: true,
        finishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found or unauthorized" }, { status: 404 });
    }

    // Parse JSON fields safely
    let tasks = [];
    let savedStatus = {};
    let structure = null;

    if (project.taskData) {
      try { tasks = JSON.parse(project.taskData); } catch {}
    }
    if (project.checkedTasks) {
      try { savedStatus = JSON.parse(project.checkedTasks); } catch {}
    }
    if (project.strukturData) {
      try { structure = JSON.parse(project.strukturData); } catch {}
    }

    if (section === "prd") {
      return NextResponse.json({
        success: true,
        projectId: project.id,
        appName: project.appName,
        prd: project.prdData || "",
      });
    }

    if (section === "mindmap") {
      return NextResponse.json({
        success: true,
        projectId: project.id,
        appName: project.appName,
        structure,
      });
    }

    if (section === "directives") {
      return NextResponse.json({
        success: true,
        systemDirectives: SYSTEM_DIRECTIVES.systemDirectives,
        tasteSkill: TASTE_SKILL_DIRECTIVES,
      });
    }

    if (section === "taste-skill") {
      const proj = project as any;
      const rawDesignText = proj.designData || "";
      const filteredSkill = getFilteredTasteSkill(rawDesignText, requestedSkill);
      return NextResponse.json({
        success: true,
        tasteSkill: filteredSkill,
      });
    }

    if (section === "design") {
      const proj = project as any;
      let rawText = proj.designData || "";
      let structured: any = null;

      if (rawText.startsWith("{") && rawText.includes("rawMarkdown")) {
        try {
          structured = JSON.parse(rawText);
          rawText = structured.rawMarkdown || rawText;
        } catch {}
      }

      if (!structured) {
        structured = parseDesignMarkdown(rawText);
      }

      return NextResponse.json({
        success: true,
        design: {
          colorTokens: structured.colorTokens || [],
          sections: structured.sections || [],
          rawMarkdown: structured.rawMarkdown || rawText || "",
        },
      });
    }

    if (section === "context") {
      const proj = project as any;
      let rawText = proj.designData || "";
      let structuredDesign: any = null;

      if (rawText.startsWith("{") && rawText.includes("rawMarkdown")) {
        try {
          structuredDesign = JSON.parse(rawText);
          rawText = structuredDesign.rawMarkdown || rawText;
        } catch {}
      }

      if (!structuredDesign) {
        structuredDesign = parseDesignMarkdown(rawText);
      }

      // SELECTIVE TASTE SKILL PAYLOAD REDUCTION
      // Filter tasteSkill to include ONLY the 1 matching skill for this project
      const selectiveTasteSkill = getFilteredTasteSkill(rawText, requestedSkill);

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          appName: project.appName,
          appIdea: project.appIdea,
          status: project.status,
          createdAt: project.createdAt,
          updatedAt: project.updatedAt,
        },
        structure,
        prd: project.prdData || "",
        design: {
          colorTokens: structuredDesign.colorTokens || [],
          sections: structuredDesign.sections || [],
          rawMarkdown: structuredDesign.rawMarkdown || rawText || "",
        },
        tasks,
        taskStatuses: savedStatus,
        directives: {
          antiHallucinationRules: SYSTEM_DIRECTIVES.systemDirectives.antiHallucinationRules,
          codeQuality: SYSTEM_DIRECTIVES.systemDirectives.codeQuality,
          tasteSkill: selectiveTasteSkill,
        },
      });
    }

    // Default: Overview
    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        appName: project.appName,
        appIdea: project.appIdea,
        status: project.status,
        taskCount: tasks.length,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Agent project API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
