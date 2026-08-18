import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return new NextResponse("Missing projectId", { status: 400 });
    }

    const project = await (prisma.project as any).findUnique({
      where: { id: projectId },
      select: { designData: true },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const proj = project as any;
    let markdownText = proj.designData || "";

    if (markdownText.startsWith("{") && markdownText.includes("rawMarkdown")) {
      try {
        const parsed = JSON.parse(markdownText);
        markdownText = parsed.rawMarkdown || markdownText;
      } catch {}
    }

    return new NextResponse(markdownText, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": "inline",
      },
    });
  } catch (error: any) {
    console.error("Error serving raw design.md:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
