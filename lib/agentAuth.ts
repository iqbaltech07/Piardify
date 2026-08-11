import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashApiKey } from "@/lib/apiKey";

export interface AgentAuthResult {
  user: {
    id: string;
    name: string;
    email: string;
    apiKey: string | null;
  } | null;
  error?: string;
  statusCode?: number;
}

/**
 * Authenticates an agent (CLI) request using the SHA-256 hashed API key.
 *
 * The plaintext key is never stored. Lookup is done via `hashApiKey(token)`.
 * A legacy fallback also matches against any pre-migration plaintext keys and
 * transparently re-hashes them on the fly so existing CLI users keep working.
 */
export async function authenticateAgentRequest(req: NextRequest): Promise<AgentAuthResult> {
  const authHeader = req.headers.get("authorization");
  let token = "";

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else {
    const url = new URL(req.url);
    token = url.searchParams.get("apiKey") || "";
  }

  if (!token) {
    return { user: null, error: "Missing API Key token in Authorization header or apiKey parameter.", statusCode: 401 };
  }

  const hashed = hashApiKey(token);

  let user = await prisma.user.findUnique({
    where: { apiKey: hashed },
    select: {
      id: true,
      name: true,
      email: true,
      apiKey: true,
    },
  });

  // Legacy path: match a pre-hash plaintext key, then migrate it to the hash.
  if (!user && token !== hashed) {
    const legacy = await prisma.user.findUnique({
      where: { apiKey: token },
      select: { id: true },
    });
    if (legacy) {
      await prisma.user.update({
        where: { id: legacy.id },
        data: { apiKey: hashed },
      });
      user = await prisma.user.findUnique({
        where: { id: legacy.id },
        select: { id: true, name: true, email: true, apiKey: true },
      });
    }
  }

  if (!user) {
    return { user: null, error: "Invalid or expired API Key token.", statusCode: 401 };
  }

  return { user };
}