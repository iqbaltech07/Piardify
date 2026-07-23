import React from "react";
import { MessageSquare, Layers, ClipboardList, Download } from "lucide-react";

export const STEPS = [
  {
    number: "01",
    title: "Describe Your Idea",
    desc: "Give Piardify a short description of your app concept — a few sentences is all it takes to kick off the process.",
    detail: "No lengthy briefs. Just your raw idea.",
    accentVar: "var(--color-signal)",
    icon: <MessageSquare size={20} strokeWidth={1.5} />,
  },
  {
    number: "02",
    title: "Choose Your Stack",
    desc: "Pick your frontend, backend, database, and deployment tech — or let the AI recommend the perfect combination.",
    detail: "4 categories. Infinite combinations.",
    accentVar: "var(--color-circuit)",
    icon: <Layers size={20} strokeWidth={1.5} />,
    chips: ["React", "Node.js", "PostgreSQL", "Vercel"],
  },
  {
    number: "03",
    title: "Answer 7 Questions",
    desc: "Seven targeted prompts covering target audience, platform, core features, monetization, and success metrics.",
    detail: "Eliminates AI hallucination completely.",
    accentVar: "var(--color-circuit)",
    icon: <ClipboardList size={20} strokeWidth={1.5} />,
    progress: 3,
  },
  {
    number: "04",
    title: "Refine & Export",
    desc: "Get your complete PRD. Edit the mindmap visually and refine specs in the editor. Smart sync updates tasks, then export to Markdown.",
    detail: "Visual mindmap, smart task list & export.",
    accentVar: "var(--color-signal)",
    icon: <Download size={20} strokeWidth={1.5} />,
  },
];

export type StepType = (typeof STEPS)[number];
