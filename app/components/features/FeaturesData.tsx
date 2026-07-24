import React from "react";
import { Bot, Layers, ClipboardList, Award, Network, Download, ListTodo } from "lucide-react";

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
    title: "AI PRD Generator",
    desc: "Input your idea and watch Piardify structure an entire Product Requirements Document (from executive summary to success metrics) in seconds.",
    stat: "10×",
    statLabel: "Faster than manual",
    accent: "var(--color-signal)",
    size: "large",
    icon: <Bot size={22} strokeWidth={1.5} />,
    tag: "Powered by GPT-4o",
  },
  {
    id: "tech-stack",
    label: "Smart Recommendation",
    title: "Tech Stack Advisor",
    desc: "Choose your stack or let AI recommend frontend, backend, database & deployment.",
    stat: "4",
    statLabel: "Categories covered",
    accent: "var(--color-circuit)",
    size: "normal",
    icon: <Layers size={22} strokeWidth={1.5} />,
  },
  {
    id: "wizard",
    label: "Anti-Hallucination",
    title: "7-Step Wizard",
    desc: "Seven targeted questions that eliminate AI drift and lock in your exact product vision before generation begins.",
    stat: "7",
    statLabel: "Precision steps",
    accent: "var(--color-circuit)",
    size: "tall",
    icon: <ClipboardList size={22} strokeWidth={1.5} />,
    tag: "Zero hallucination",
  },
  {
    id: "gamification",
    label: "Gamification",
    title: "Points & Rank Rewards",
    desc: "Complete project tasks to claim +100 Points. Climb 10 ranks from Idea Sprout to Legendary Builder.",
    stat: "10",
    statLabel: "Unique rank tiers",
    accent: "var(--color-signal)",
    size: "normal",
    icon: <Award size={22} strokeWidth={1.5} />,
  },
  {
    id: "diagrams",
    label: "Visual Graph Editor",
    title: "Interactive Mindmap",
    desc: "Drag nodes, edit inline, add categories, link edges visually, and auto-parse back to structured JSON.",
    stat: "100%",
    statLabel: "Interactive canvas",
    accent: "var(--color-signal)",
    size: "normal",
    icon: <Network size={22} strokeWidth={1.5} />,
  },
  {
    id: "export",
    label: "Ready to Ship",
    title: "Markdown Export",
    desc: "Download a clean .md file formatted for GitHub, Notion, Confluence, or any platform your team uses.",
    stat: "1-click",
    statLabel: "Export anywhere",
    accent: "var(--color-circuit)",
    size: "normal",
    icon: <Download size={22} strokeWidth={1.5} />,
  },
  {
    id: "task-sync",
    label: "Sync Engine",
    title: "Smart Task Sync",
    desc: "Update the mindmap or PRD: our sync engine targets only affected tasks to save AI costs.",
    stat: "95%",
    statLabel: "Token cost reduction",
    accent: "var(--color-circuit)",
    size: "normal",
    icon: <ListTodo size={22} strokeWidth={1.5} />,
    tag: "Token Saver",
  },
];
