import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { headers } from "next/headers";
import { generateApiKey } from "@/lib/auth/apiKey";

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

    // If user doesn't have an apiKey or has an old legacy hash format, generate a valid key
    if (!apiKey || !apiKey.startsWith("piar_live_")) {
      apiKey = generateApiKey();
      await prisma.user.update({
        where: { id: session.user.id },
        data: { apiKey },
      });
    }

    return NextResponse.json({ hasApiKey: true, apiKey });
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

    const apiKey = generateApiKey();
    await prisma.user.update({
      where: { id: session.user.id },
      data: { apiKey },
    });

    return NextResponse.json({ hasApiKey: true, apiKey });
  } catch (error: any) {
    console.error("Error regenerating API Key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}