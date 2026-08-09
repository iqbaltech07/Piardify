import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      jsonrpc: "2.0",
      error: {
        code: -32600,
        message: "The MCP protocol endpoint (/api/mcp) has been deprecated and removed. Please migrate to Piardify NPX CLI & Agent Skill via 'npx piardify login --token <TOKEN>' and 'npx piardify init'. API endpoints are available at /api/agent/*.",
      },
      id: null,
    },
    {
      status: 410,
      headers: {
        "X-Piardify-Deprecated": "MCP protocol is permanently removed. Migrate to 'npx piardify init'.",
      },
    }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      error: "MCP protocol endpoint is deprecated and removed. Please migrate to 'npx piardify init' and Piardify REST API (/api/agent/*).",
    },
    { status: 410 }
  );
}
