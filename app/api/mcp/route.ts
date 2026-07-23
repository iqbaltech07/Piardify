import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    } else {
      const url = new URL(req.url);
      token = url.searchParams.get("apiKey") || "";
    }

    if (!token) {
      return NextResponse.json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Missing API Key in Authorization header or query parameter" },
        id: null
      }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { apiKey: token },
    });

    if (!user) {
      return NextResponse.json({
        jsonrpc: "2.0",
        error: { code: -32601, message: "Invalid API Key" },
        id: null
      }, { status: 401 });
    }

    const body = await req.json();
    const { jsonrpc, method, params, id } = body || {};

    if (jsonrpc !== "2.0") {
      return NextResponse.json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid JSON-RPC version" },
        id: id || null
      }, { status: 400 });
    }

    // ── 1. MCP initialize handshake
    if (method === "initialize") {
      return NextResponse.json({
        jsonrpc: "2.0",
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: "piardify-mcp-server",
            version: "1.0.0"
          }
        },
        id
      });
    }

    // ── 2. List tools
    if (method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        result: {
          tools: [
            {
              name: "get_project_blueprint",
              description: "Mengambil data lengkap PRD (Product Requirements Document), Mindmap Structure, dan Kanban Task List dari proyek Piardify untuk konteks koding anti-halusinasi.",
              inputSchema: {
                type: "object",
                properties: {
                  projectId: { type: "string", description: "ID unik proyek Piardify" }
                },
                required: ["projectId"]
              }
            },
            {
              name: "get_project_structure",
              description: "Mengambil data hirarki modul dan pilar arsitektur dari Mindmap Structure.",
              inputSchema: {
                type: "object",
                properties: {
                  projectId: { type: "string", description: "ID unik proyek Piardify" }
                },
                required: ["projectId"]
              }
            },
            {
              name: "get_prd_details",
              description: "Mengambil detail isi dokumen PRD proyek.",
              inputSchema: {
                type: "object",
                properties: {
                  projectId: { type: "string", description: "ID unik proyek Piardify" }
                },
                required: ["projectId"]
              }
            },
            {
              name: "get_task_list",
              description: "Mengambil daftar seluruh task dan statusnya saat ini.",
              inputSchema: {
                type: "object",
                properties: {
                  projectId: { type: "string", description: "ID unik proyek Piardify" }
                },
                required: ["projectId"]
              }
            },
            {
              name: "update_task_status",
              description: "Memperbarui status tugas pada Kanban Board proyek Piardify.",
              inputSchema: {
                type: "object",
                properties: {
                  projectId: { type: "string", description: "ID unik proyek Piardify" },
                  taskId: { type: "string", description: "ID unik task" },
                  status: { type: "string", enum: ["todo", "in_progress", "done"], description: "Status baru task" }
                },
                required: ["projectId", "taskId", "status"]
              }
            }
          ]
        },
        id
      });
    }

    // ── 3. Call tool
    if (method === "tools/call") {
      const { name, arguments: args } = params || {};
      const { projectId } = args || {};

      if (!projectId) {
        return NextResponse.json({
          jsonrpc: "2.0",
          error: { code: -32602, message: "Missing projectId argument" },
          id
        }, { status: 400 });
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId, userId: user.id }
      });

      if (!project) {
        return NextResponse.json({
          jsonrpc: "2.0",
          error: { code: -32602, message: "Project not found or unauthorized" },
          id
        }, { status: 404 });
      }

      if (name === "get_project_blueprint") {
        let tasks = [];
        let savedStatus = {};
        if (project.taskData) {
          try { tasks = JSON.parse(project.taskData); } catch {}
        }
        if (project.checkedTasks) {
          try { savedStatus = JSON.parse(project.checkedTasks); } catch {}
        }
        let structure = null;
        if (project.strukturData) {
          try { structure = JSON.parse(project.strukturData); } catch {}
        }

        const contentText = JSON.stringify({
          appName: project.appName,
          appIdea: project.appIdea,
          prd: project.prdData || "",
          structure,
          tasks,
          taskStatuses: savedStatus
        }, null, 2);

        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            content: [{ type: "text", text: contentText }]
          },
          id
        });
      }

      if (name === "get_project_structure") {
        let structure = null;
        if (project.strukturData) {
          try { structure = JSON.parse(project.strukturData); } catch {}
        }
        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            content: [{ type: "text", text: JSON.stringify(structure, null, 2) }]
          },
          id
        });
      }

      if (name === "get_prd_details") {
        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            content: [{ type: "text", text: project.prdData || "No PRD data" }]
          },
          id
        });
      }

      if (name === "get_task_list") {
        let tasks = [];
        let savedStatus = {};
        if (project.taskData) {
          try { tasks = JSON.parse(project.taskData); } catch {}
        }
        if (project.checkedTasks) {
          try { savedStatus = JSON.parse(project.checkedTasks); } catch {}
        }
        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            content: [{ type: "text", text: JSON.stringify({ tasks, savedStatus }, null, 2) }]
          },
          id
        });
      }

      if (name === "update_task_status") {
        const { taskId, status } = args;
        if (!taskId || !status) {
          return NextResponse.json({
            jsonrpc: "2.0",
            error: { code: -32602, message: "Missing taskId or status" },
            id
          }, { status: 400 });
        }

        let savedStatus: Record<string, string> = {};
        if (project.checkedTasks) {
          try { savedStatus = JSON.parse(project.checkedTasks); } catch {}
        }
        savedStatus[taskId] = status;

        await prisma.project.update({
          where: { id: projectId },
          data: { checkedTasks: JSON.stringify(savedStatus) }
        });

        try {
          await redis.set(`project:${projectId}:taskStatus`, savedStatus);
          await redis.del(`project:${projectId}:tasks`);
        } catch (e) {}

        return NextResponse.json({
          jsonrpc: "2.0",
          result: {
            content: [{ type: "text", text: `Task ${taskId} status successfully updated to '${status}'.` }]
          },
          id
        });
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        error: { code: -32601, message: `Tool '${name}' not found` },
        id
      }, { status: 404 });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      error: { code: -32601, message: "Method not found" },
      id: id || null
    }, { status: 404 });

  } catch (error: any) {
    console.error("MCP Server Error:", error);
    return NextResponse.json({
      jsonrpc: "2.0",
      error: { code: -32603, message: "Internal server error" },
      id: null
    }, { status: 500 });
  }
}
