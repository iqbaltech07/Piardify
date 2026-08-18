import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { isAdminEmail } from "@/lib/analytics/planQuota";

// Non-text/non-chat model keywords to exclude (audio, music, speech, image-only, embedding, etc.)
const NON_CHAT_KEYWORDS = [
  "lyria",
  "whisper",
  "embedding",
  "embed",
  "tts",
  "stt",
  "stable-diffusion",
  "dall-e",
  "flux",
  "midjourney",
  "sdxl",
  "music",
  "audio",
  "voice",
  "speech",
  "image-gen",
  "text-to-image",
  "text-to-audio",
  "text-to-speech",
  "text-to-music",
  "realtime",
];

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || !isAdminEmail(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/models");
    if (!response.ok) {
      throw new Error(`OpenRouter API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Filter only free models that support text/chat I/O
    const freeChatModels = data.data.filter((model: any) => {
      // 1. Must be free
      const isFree =
        model.pricing &&
        model.pricing.prompt === "0" &&
        model.pricing.completion === "0";
      if (!isFree) return false;

      const id = (model.id || "").toLowerCase();
      const name = (model.name || "").toLowerCase();
      const modality = (model.architecture?.modality || "").toLowerCase();
      const inputModalities = Array.isArray(model.architecture?.input_modalities)
        ? model.architecture.input_modalities.map((m: string) => m.toLowerCase())
        : [];
      const outputModalities = Array.isArray(model.architecture?.output_modalities)
        ? model.architecture.output_modalities.map((m: string) => m.toLowerCase())
        : [];

      // 2. Exclude known non-text/non-chat keywords in ID, Name, or Modality
      const isNonChat = NON_CHAT_KEYWORDS.some(
        (kw) => id.includes(kw) || name.includes(kw) || modality.includes(kw)
      );
      if (isNonChat) return false;

      // 3. Must support text output
      if (outputModalities.length > 0 && !outputModalities.includes("text")) {
        return false;
      }

      // 4. Modality check if provided (must not be audio/music/image only)
      if (modality && !modality.includes("text")) {
        return false;
      }

      return true;
    });

    // Map to a cleaner format
    const formattedModels = freeChatModels.map((model: any) => ({
      id: model.id,
      name: model.name,
      contextLength: model.context_length,
      architecture: model.architecture?.modality || "Text",
    }));

    // Sort alphabetically by name
    formattedModels.sort((a: any, b: any) => a.name.localeCompare(b.name));

    return NextResponse.json({ models: formattedModels });
  } catch (error: any) {
    console.error("Error fetching OpenRouter models:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
