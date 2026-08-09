# Migration Guide: MCP Protocol → NPX CLI + Agent Skill + REST API

This document details the migration mapping from the legacy **Model Context Protocol (MCP)** JSON-RPC server (`/api/mcp`) to the new **NPX CLI + Agent Skill + REST API** architecture in Piardify.

---

## 1. Architecture Overview

### Legacy MCP Architecture:
```text
User  ──►  Piardify Web App  ──►  MCP Server (/api/mcp)  ──►  Database
```

### Target NPX + Skill + API Architecture:
```text
User  ──►  Piardify Web App  ──►  Kanban Board
                                     ▲
                                     │ Auto Sync
                                     ▼
Developer ──► npx piardify login & init ──► Piardify REST API ──► Database
                                                ▲
                                                │ HTTPS
                                         Piardify Agent Skill
                                                ▲
                                                │ Workflow
                                            AI Agent
```

---

## 2. Function & Endpoint Mapping

| Legacy MCP Tool | CLI Command Equivalent | REST API Endpoint Equivalent |
| :--- | :--- | :--- |
| `get_project_blueprint` | `npx piardify project current`<br>`npx piardify project context` | `GET /api/agent/project`<br>`GET /api/agent/project/context` |
| `get_project_structure` | `npx piardify project mindmap` | `GET /api/agent/project/mindmap` |
| `get_prd_details` | `npx piardify project prd` | `GET /api/agent/project/prd` |
| `get_task_list` | `npx piardify task list [--status]` | `GET /api/agent/tasks` |
| `get_system_directives` | `npx piardify project directives` | `GET /api/agent/project/directives` |
| `get_taste_skill` | `npx piardify project directives --taste` | `GET /api/agent/project/directives?type=taste` |
| `get_design_md` | `npx piardify project design` | `GET /api/agent/project/design` |
| `update_task_status` | `npx piardify task start <id>`<br>`npx piardify task update <id>`<br>`npx piardify task complete <id>`<br>`npx piardify task fail <id>` | `POST /api/agent/tasks/:id/start`<br>`PATCH /api/agent/tasks/:id`<br>`POST /api/agent/tasks/:id/complete`<br>`POST /api/agent/tasks/:id/fail` |

---

## 3. Developer Quickstart

```bash
# 1. Login with API key token from Piardify settings
npx piardify login --token <PIARDIFY_API_KEY>

# 2. Link local project & auto-install Agent Skill
npx piardify init
```

Once `npx piardify init` is executed, the **Piardify Agent Skill** is installed in `.agents/skills/piardify/SKILL.md` and auto-loaded by AI Agents (such as Antigravity).
