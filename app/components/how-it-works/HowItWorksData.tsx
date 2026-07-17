import React from "react";
import { MessageSquare, Layers, ClipboardList, Check, Download } from "lucide-react";

export const STEPS = [
  {
    number: "01",
    title: "Describe Your Idea",
    desc: "Give Piardify a short description of your app concept — a few sentences is all it takes to kick off the process.",
    detail: "No lengthy briefs. Just your raw idea.",
    accent: "#818cf8",
    accentRgb: "129,140,248",
    align: "right" as const,
    icon: <MessageSquare size={32} strokeWidth={1.5} />,
    mockup: (
      <div className="hiw-mockup hiw-mockup--text">
        <div className="hiw-mock-line hiw-mock-line--short" />
        <div className="hiw-mock-line" />
        <div className="hiw-mock-line hiw-mock-line--med" />
        <div className="hiw-mock-cursor" />
      </div>
    ),
  },
  {
    number: "02",
    title: "Choose Your Stack",
    desc: "Pick your frontend, backend, database, and deployment tech — or let the AI recommend the perfect combination.",
    detail: "4 categories. Infinite combinations.",
    accent: "#60a5fa",
    accentRgb: "96,165,250",
    align: "left" as const,
    icon: <Layers size={32} strokeWidth={1.5} />,
    mockup: (
      <div className="hiw-mockup hiw-mockup--chips">
        {["React", "Node.js", "PostgreSQL", "Vercel"].map((t) => (
          <span key={t} className="hiw-chip">{t}</span>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    title: "Answer 7 Questions",
    desc: "Seven targeted prompts covering your target audience, platform, core features, monetization, and success metrics.",
    detail: "Eliminates AI hallucination completely.",
    accent: "#34d399",
    accentRgb: "52,211,153",
    align: "right" as const,
    icon: <ClipboardList size={32} strokeWidth={1.5} />,
    mockup: (
      <div className="hiw-mockup hiw-mockup--progress">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className={`hiw-progress-dot ${n <= 3 ? "hiw-progress-dot--done" : ""}`}>
            {n <= 3 ? (
              <Check size={10} strokeWidth={3} />
            ) : n}
          </div>
        ))}
      </div>
    ),
  },
  {
    number: "04",
    title: "Refine & Export",
    desc: "Get your complete PRD. Edit the mindmap visually and refine specs on the editor. The smart sync updates your tasks, then export to Markdown.",
    detail: "Visual mindmap, smart task list & export.",
    accent: "#f472b6",
    accentRgb: "244,114,182",
    align: "left" as const,
    icon: <Download size={32} strokeWidth={1.5} />,
    mockup: (
      <div className="hiw-mockup hiw-mockup--doc">
        <div className="hiw-doc-bar">
          <div className="hiw-doc-dot" style={{ background: "#f87171" }} />
          <div className="hiw-doc-dot" style={{ background: "#fbbf24" }} />
          <div className="hiw-doc-dot" style={{ background: "#34d399" }} />
          <span className="hiw-doc-title">prd.md</span>
        </div>
        <div className="hiw-doc-lines">
          <div className="hiw-doc-line hiw-doc-line--h1" />
          <div className="hiw-doc-line" />
          <div className="hiw-doc-line hiw-doc-line--short" />
          <div className="hiw-doc-line hiw-doc-line--h2" />
          <div className="hiw-doc-line" />
        </div>
      </div>
    ),
  },
];

export type StepType = (typeof STEPS)[number];
