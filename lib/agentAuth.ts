import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

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

  const user = await prisma.user.findUnique({
    where: { apiKey: token },
    select: {
      id: true,
      name: true,
      email: true,
      apiKey: true,
    },
  });

  if (!user) {
    return { user: null, error: "Invalid or expired API Key token.", statusCode: 401 };
  }

  return { user };
}
