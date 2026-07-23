import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { redis } from "@/lib/redis";
import { headers } from "next/headers";

const ADMIN_EMAIL = "dev.iqbal007@gmail.com";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const settings = await redis.get("app:settings");
    return NextResponse.json(settings || {});
  } catch (error) {
    console.error("Error fetching admin settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    
    // Validate inputs
    const { geminiModel, openRouterModel } = body;
    
    if (!geminiModel || !openRouterModel) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newSettings = {
      geminiModel,
      openRouterModel,
      updatedAt: new Date().toISOString(),
    };

    await redis.set("app:settings", newSettings);

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (error) {
    console.error("Error saving admin settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
