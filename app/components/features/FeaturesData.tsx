import React from "react";
import { Bot, Cpu, Zap, Network, ClipboardList, Layers, Download } from "lucide-react";

export interface Feature {
  id: string;
  label: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  accent: string;
  size: "large" | "tall" | "normal";
  icon: React.ReactNode;
  tag?: string;
}

export const FEATURES: Feature[] = [
  {
    id: "ai-prd",
    label: "Core Engine",
    title: "AI PRD & System Architect",
    desc: "Input your app concept and watch Piardify generate a complete Product Requirements Document, visual architecture mindmap, and task breakdown in seconds.",
    stat: "10×",
    statLabel: "Faster than manual spec writing",
    accent: "var(--color-signal)",
    size: "large",
    icon: <Bot size={24} strokeWidth={1.5} />,
    tag: "Powered by GPT-4o",
  },
  {
    id: "agent-skill",
    label: "Agent Infrastructure",
    title: "NPX CLI & Agent Skill Provisioning",
    desc: "Run 'npx piardify init' once. Automatically installs the Piardify Skill into your AI Coding Agent (.agents/skills/piardify/SKILL.md) with 10ms native sync helpers.",
    stat: "2 Commands",
    statLabel: "Zero-friction developer setup",
    accent: "var(--color-circuit)",
    size: "tall",
    icon: <Cpu size={22} strokeWidth={1.5} />,
    tag: "AI Agent Native",
  },
  {
    id: "realtime-kanban",
    label: "Realtime Execution",
    title: "Autonomous Kanban Sync Engine",
    desc: "AI Agent starts, codes, tests, and completes tasks in terminal. Your web Kanban board updates live (<10ms) without manual card dragging.",
    stat: "<10ms",
    statLabel: "Upstash Redis sync latency",
    accent: "var(--color-signal)",
    size: "normal",
    icon: <Zap size={22} strokeWidth={1.5} />,
    tag: "Live Sync",
  },
  {
    id: "diagrams",
    label: "Visual Graph Canvas",
    title: "Interactive Architecture Mindmap",
    desc: "Edit nodes inline, adjust feature hierarchies visually, add edge relationships, and auto-sync changes back to structured project JSON.",
    stat: "100%",
    statLabel: "Interactive canvas",
    accent: "var(--color-signal)",
    size: "normal",
    icon: <Network size={22} strokeWidth={1.5} />,
  },
  {
    id: "wizard",
    label: "Anti-Hallucination",
    title: "7-Step Wizard & System Directives",
    desc: "Seven targeted prompts lock in your exact vision and enforce strict AH-001 to AH-010 anti-drift rules on AI Agents.",
    stat: "10 Directives",
    statLabel: "Zero AI hallucination",
    accent: "var(--color-circuit)",
    size: "normal",
    icon: <ClipboardList size={22} strokeWidth={1.5} />,
    tag: "Zero Drift",
  },
  {
    id: "tech-stack",
    label: "Smart Recommendation",
    title: "Tech Stack Advisor",
    desc: "Select your preferred tech stack or let AI recommend optimal frontend, backend, database, and deployment configurations.",
    stat: "4",
    statLabel: "Categories covered",
    accent: "var(--color-circuit)",
    size: "normal",
    icon: <Layers size={22} strokeWidth={1.5} />,
  },
  {
    id: "export",
    label: "Ready to Ship",
    title: "1-Click Markdown Export",
    desc: "Export clean .md documentation formatted for GitHub, Notion, Confluence, or your team's internal knowledge base.",
    stat: "1-click",
    statLabel: "Export anywhere",
    accent: "var(--color-circuit)",
    size: "normal",
    icon: <Download size={22} strokeWidth={1.5} />,
  },
];
