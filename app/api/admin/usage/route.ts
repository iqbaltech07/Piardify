import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getDailyUsage } from "@/lib/usageTracker";

const ADMIN_EMAIL = "dev.iqbal007@gmail.com";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const usage = await getDailyUsage();

    return NextResponse.json({
      success: true,
      data: usage,
    });
  } catch (error) {
    console.error("Error fetching daily usage:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
