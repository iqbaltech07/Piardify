import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { generateApiKey, hashApiKey } from "@/lib/apiKey";

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

    // The plaintext key is never stored; only its hash. So GET can only
    // report existence — the key is shown once at creation/regeneration time.
    return NextResponse.json({ hasApiKey: Boolean(user.apiKey), apiKey: null });
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
      data: { apiKey: hashApiKey(apiKey) },
    });

    // Return the plaintext exactly once for the user to copy.
    return NextResponse.json({ apiKey });
  } catch (error: any) {
    console.error("Error regenerating API Key:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}