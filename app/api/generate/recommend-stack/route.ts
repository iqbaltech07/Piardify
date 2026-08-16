import { NextRequest, NextResponse } from "next/server";
import { generateGemini, generateOpenRouter, parseAndRepairJson } from "@/lib/llm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { COLOR_PALETTE_PRESETS } from "@/app/generate/constants";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { appName, appIdea, selectedModel } = body;

    if (!appIdea || appIdea.length < 10) {
      return NextResponse.json({ error: "App idea is required" }, { status: 400 });
    }

    const systemPrompt = `You are a Principal Software Architect and Design System Specialist.
Your task is to analyze the user's application idea and recommend the optimal, production-ready tech stack and color palette.

Choose the most suitable combination from these options or best industry standards:
- Frontend: "Next.js", "React", "HTML5 / Vanilla JS", "Vue.js", "Svelte", "Flutter (Dart)", "React Native (Expo)", "Swift / SwiftUI", "Kotlin (Jetpack Compose)", "Embedded C/C++ (ESP32)", "Astro", "HTMX"
- Backend: "Next.js (API Routes)", "None (Client-Side Only)", "Node.js", "Python (FastAPI/Django)", "Laravel", "NestJS", "Node.js (MQTT Broker)", "Firebase Cloud Functions", "Spring Boot", "Go", "Rust (Actix/Axum)"
- Database: "PostgreSQL", "LocalStorage / IndexedDB", "MySQL", "MongoDB", "Supabase", "Firebase Firestore", "SQLite (Offline-First)", "Redis", "InfluxDB / TimescaleDB"
- Deployment: "Vercel", "GitHub Pages", "Google Play & App Store", "AWS", "Railway", "PlatformIO / OTA", "EAS (Expo)", "Cloudflare Workers / Pages"
- Palette ID: Choose ONE of "amber-cyber" (Dark Cyber), "ocean-indigo" (Light Enterprise), "electric-emerald" (Tech Dark), "neon-violet" (SaaS Dark Glow), "crimson-coral" (Minimal Vibrant Light)

RESPONSE FORMAT (Strict JSON only):
{
  "stacks": {
    "frontend": "e.g. Next.js",
    "backend": "e.g. Next.js (API Routes)",
    "database": "e.g. PostgreSQL",
    "deployment": "e.g. Vercel"
  },
  "paletteId": "amber-cyber",
  "badge": "e.g. Fullstack Serverless",
  "reasoning": "1-2 concise sentences in Indonesian explaining why this stack and theme fits the product idea."
}`;

    const userPrompt = `App Name: ${appName || "New Project"}
App Idea: ${appIdea}

Recommend the best tech stack and palette. Output valid JSON.`;

    let rawText = "";
    const modelToUse = selectedModel || "gemini-3.7-flash";

    if (modelToUse.startsWith("gemini-")) {
      const res = await generateGemini({
        systemPrompt,
        userPrompt,
        preferredModel: modelToUse,
      });
      rawText = res.text;
    } else {
      const res = await generateOpenRouter({
        systemPrompt,
        userPrompt,
        model: modelToUse,
        jsonObject: true,
      });
      rawText = res.text;
    }

    const parsed = parseAndRepairJson<{
      stacks?: {
        frontend?: string;
        backend?: string;
        database?: string;
        deployment?: string;
      };
      paletteId?: string;
      badge?: string;
      reasoning?: string;
    }>(rawText);

    if (!parsed || !parsed.stacks) {
      // High-grade intelligent fallback based on keywords
      const isMobile = /mobile|android|ios|flutter|react native|smartphone|apk/i.test(appIdea);
      const isIot = /iot|esp32|arduino|sensor|hardware|mqtt|device/i.test(appIdea);
      const isVanilla = /vanilla|html|css|javascript|no db|simple web|tugas kuliah/i.test(appIdea);

      if (isMobile) {
        return NextResponse.json({
          success: true,
          recommendation: {
            stacks: {
              frontend: "Flutter (Dart)",
              backend: "Firebase Cloud Functions",
              database: "Firebase Firestore",
              deployment: "Google Play & App Store"
            },
            paletteId: "electric-emerald",
            badge: "Mobile Native",
            reasoning: "Flutter dan Firebase memberikan performa cross-platform native dengan backend real-time tanpa setup server rumit."
          }
        });
      }

      if (isIot) {
        return NextResponse.json({
          success: true,
          recommendation: {
            stacks: {
              frontend: "Embedded C/C++ (ESP32)",
              backend: "Node.js (MQTT Broker)",
              database: "InfluxDB / TimescaleDB",
              deployment: "PlatformIO / OTA"
            },
            paletteId: "amber-cyber",
            badge: "IoT & Hardware",
            reasoning: "ESP32 dengan protokol MQTT dan time-series database sangat ideal untuk transmisi telemetri sensor latensi rendah."
          }
        });
      }

      if (isVanilla) {
        return NextResponse.json({
          success: true,
          recommendation: {
            stacks: {
              frontend: "HTML5 / Vanilla JS",
              backend: "None (Client-Side Only)",
              database: "LocalStorage / IndexedDB",
              deployment: "GitHub Pages"
            },
            paletteId: "ocean-indigo",
            badge: "Zero Backend",
            reasoning: "Arsitektur client-side ringan menggunakan LocalStorage tanpa dependensi backend atau biaya database."
          }
        });
      }

      return NextResponse.json({
        success: true,
        recommendation: {
          stacks: {
            frontend: "Next.js",
            backend: "Next.js (API Routes)",
            database: "PostgreSQL",
            deployment: "Vercel"
          },
          paletteId: "amber-cyber",
          badge: "Most Recommended",
          reasoning: "Next.js Fullstack dengan App Router dan Postgres memberikan skalabilitas tinggi, SEO optimal, dan deployment instan."
        }
      });
    }

    return NextResponse.json({
      success: true,
      recommendation: parsed,
    });
  } catch (error: any) {
    console.error("Error recommending stack:", error);
    return NextResponse.json({ error: error?.message || "Failed to recommend stack" }, { status: 500 });
  }
}
