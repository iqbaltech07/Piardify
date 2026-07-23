import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import crypto from "crypto";

function generateApiKey(): string {
  return `piar_live_${crypto.randomBytes(16).toString("hex")}`;
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { apiKey: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let apiKey = user.apiKey;
    if (!apiKey) {
      apiKey = generateApiKey();
      await prisma.user.update({
        where: { id: session.user.id },
        data: { apiKey },
      });
    }

    return NextResponse.json({ apiKey });
  } catch (error: any) {
    console.error("Error fetching API Key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const newApiKey = generateApiKey();
    await prisma.user.update({
      where: { id: session.user.id },
      data: { apiKey: newApiKey },
    });

    return NextResponse.json({ apiKey: newApiKey });
  } catch (error: any) {
    console.error("Error regenerating API Key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
