import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { parseDesignMarkdown } from "@/lib/designParser";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let projectId = "";
    let designText = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      projectId = (formData.get("projectId") as string) || "";
      const file = formData.get("file") as File | null;
      const rawText = (formData.get("designText") as string) || "";

      if (file) {
        designText = await file.text();
      } else if (rawText) {
        designText = rawText;
      }
    } else {
      const body = await req.json();
      projectId = body.projectId || "";
      designText = body.designData || body.designText || "";
    }

    if (!designText || !designText.trim()) {
      return NextResponse.json({ error: "No design.md content or file provided" }, { status: 400 });
    }

    // Parse markdown into structured JSON object
    const structuredData = parseDesignMarkdown(designText);
    const designJsonString = JSON.stringify(structuredData);

    // Instant save directly to Database (0 Vercel Blob overhead)
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId, userId: session.user.id },
        select: { id: true },
      });

      if (!project) {
        return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 404 });
      }

      await prisma.project.update({
        where: { id: projectId },
        data: {
          designData: designJsonString,
        } as any,
        select: { id: true },
      });
    }

    return NextResponse.json({
      success: true,
      designData: designJsonString,
      structured: structuredData,
    });
  } catch (error: any) {
    console.error("Error saving design.md:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
