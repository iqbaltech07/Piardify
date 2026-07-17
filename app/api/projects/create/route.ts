import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    const { appName, appIdea, ...rest } = body;

    if (!appName || !appIdea) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const projectsThisMonth = await prisma.project.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: firstDayOfMonth,
        },
      },
    });

    const prdLimit = user.tier === "PRO" ? 3 : 1;

    if (projectsThisMonth >= prdLimit) {
      return NextResponse.json({ error: "LIMIT_REACHED", message: `Plan ${user.tier} hanya bisa membuat ${prdLimit} project per bulan.` }, { status: 403 });
    }

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        appName: appName,
        appIdea: appIdea,
        formInputs: JSON.stringify(body),
      },
    });

    return NextResponse.json({ projectId: project.id });
  } catch (error: any) {
    console.error("Project Create Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
