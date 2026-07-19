import React from "react";

export interface Feature {
  id: string;
  label: string;
  title: string;
  desc: string;
  stat: string;
  statLabel: string;
  accent: string;
  accentRgb: string;
  size: "large" | "tall" | "normal";
  icon: React.ReactNode;
  tag?: string;
}

import { Bot, Layers, ClipboardList, Award, Network, Download, ListTodo } from "lucide-react";

/* ─── Feature data ────────────────────────── */
export const FEATURES: Feature[] = [
  {
    id: "ai-prd",
    label: "Core Engine",
    title: "AI PRD Generator",
    desc: "Input your idea and watch Piardify structure an entire Product Requirements Document — from executive summary to success metrics — in seconds.",
    stat: "10x",
    statLabel: "Faster than manual",
    accent: "#818cf8",
    accentRgb: "129,140,248",
    size: "large",
    icon: <Bot size={28} strokeWidth={1.5} />,
    tag: "Powered by GPT-4o",
  },
  {
    id: "tech-stack",
    label: "Smart Recommendation",
    title: "Tech Stack AI Advisor",
    desc: "Choose your stack or let the AI recommend the perfect technologies paired with your product — frontend, backend, database & deployment.",
    stat: "4",
    statLabel: "Categories covered",
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    size: "normal",
    icon: <Layers size={28} strokeWidth={1.5} />,
  },
  {
    id: "wizard",
    label: "Anti-Hallucination",
    title: "7-Step Wizard",
    desc: "Seven targeted questions to eliminate AI drift and lock in your exact product vision before generation begins.",
    stat: "7",
    statLabel: "Precision steps",
    accent: "#34d399",
    accentRgb: "52,211,153",
    size: "tall",
    icon: <ClipboardList size={28} strokeWidth={1.5} />,
    tag: "Zero hallucination",
  },
  {
    id: "gamification",
    label: "Gamification",
    title: "Points & Rank Rewards",
    desc: "Complete your project tasks to claim +100 Points. Watch your rank grow from an Idea Sprout to a Legendary Builder, complete with special icon badges.",
    stat: "10",
    statLabel: "Unique rank tiers",
    accent: "#f472b6",
    accentRgb: "244,114,182",
    size: "normal",
    icon: <Award size={28} strokeWidth={1.5} />,
  },
  {
    id: "diagrams",
    label: "Visual Graph Editor",
    title: "Interactive Mindmap",
    desc: "Visualize your app's architecture in real-time. Drag nodes, edit titles inline, add categories/features, link edges visually, and auto-parse back to structured JSON.",
    stat: "100%",
    statLabel: "Interactive canvas",
    accent: "#fb923c",
    accentRgb: "251,146,60",
    size: "normal",
    icon: <Network size={28} strokeWidth={1.5} />,
  },
  {
    id: "export",
    label: "Ready to Ship",
    title: "Markdown Export",
    desc: "Download a clean .md file — formatted for GitHub, Notion, Confluence, or any docs platform your team uses.",
    stat: "1-click",
    statLabel: "Export anywhere",
    accent: "#22d3ee",
    accentRgb: "34,211,238",
    size: "normal",
    icon: <Download size={28} strokeWidth={1.5} />,
  },
  {
    id: "task-sync",
    label: "Sync Engine",
    title: "Smart Task Sync",
    desc: "Change your mind on a feature? Simply update the mindmap or PRD. Our sync engine targets only affected tasks, leaving the rest untouched to save AI costs.",
    stat: "95%",
    statLabel: "Token cost reduction",
    accent: "#a78bfa",
    accentRgb: "167,139,250",
    size: "normal",
    icon: <ListTodo size={28} strokeWidth={1.5} />,
    tag: "Token Saver",
  },
];
