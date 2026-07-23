import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
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

    const response = await fetch("https://openrouter.ai/api/v1/models");
    if (!response.ok) {
      throw new Error(`OpenRouter API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Filter only free models (pricing.prompt === "0" and pricing.completion === "0")
    const freeModels = data.data.filter((model: any) => {
      return model.pricing && model.pricing.prompt === "0" && model.pricing.completion === "0";
    });

    // Map to a cleaner format
    const formattedModels = freeModels.map((model: any) => ({
      id: model.id,
      name: model.name,
      contextLength: model.context_length,
      architecture: model.architecture?.modality || "Text",
    }));

    // Sort alphabetically
    formattedModels.sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json({ models: formattedModels });
  } catch (error: any) {
    console.error("Error fetching OpenRouter models:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
