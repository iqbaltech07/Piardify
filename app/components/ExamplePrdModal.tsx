"use client";

import { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import { X, FileText } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const SAMPLE_PRD = `# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## TaskFlow — AI-Powered Task Manager

---

## 1. Overview

**TaskFlow** is an AI-powered smart task management assistant designed to automate work prioritization, summarize team discussions into *action items*, and intelligently align deadlines.

This application is targeted at *software developer* teams, *freelancers*, and project managers who require high operational efficiency.

---

## 2. Product Objectives

### Primary Goals
- Automate team task distribution using AI.
- Reduce meeting coordination time by up to 50%.
- Provide transparent workload visualization.

### Success Metrics
- Average time to create a new task < 10 seconds.
- On-time task completion rate reaches 95%.
- Daily Active Users (DAU) > 10,000 users in the first 3 months.

---

## 3. Target Users

### Project Managers
- Require fast task delegation without manual friction.
- Desire automated team performance reports.

### Freelancers
- Need dynamic and structured daily priority management.

### Software Developers
- Require technical ticket mapping integrated with code repositories.

---

## 4. Key Features

### 4.1 AI Auto-Prioritization
- Automatically analyzes task urgency based on deadlines and complexity.
- Structures the user's daily work sequence.

### 4.2 Voice-to-Task Converter
- Record meeting voice discussions or voice memos, and AI will extract them into ready-to-execute *checklist tasks*.

### 4.3 Interactive Gantt Chart
- Visually adaptive project execution timeline.

### 4.4 Automated Daily Standup Reports
- Summarizes daily contributions from git commits into short text reports for the team.

---

## 5. Tech Stack Recommendation

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons
- **Backend**: Node.js (NestJS), Prisma ORM
- **Database**: PostgreSQL (relational) & Redis (priority caching)
- **Deployment**: Vercel & AWS (for voice processing)

---

## 6. User Journey Flow

\`\`\`mermaid
flowchart TD
    A[User Records Voice Memo] --> B[AI Transcription Processing]
    B --> C[AI Extracts Action Items]
    C --> D[Show Draft Tasks to User]
    D -->|Approve| E[Save to TaskFlow Board]
    D -->|Edit| F[Edit Description / Priority]
    F --> E
\`\`\`

---

## 7. System Architecture

\`\`\`mermaid
flowchart LR
    A[Next.js Client] -->|API Request| B[NestJS Server Gateway]
    B -->|Voice File| C[OpenAI Whisper API]
    B -->|Context Metadata| D[Gemini Engine]
    C -->|Text Transcript| D
    D -->|Structured Task JSON| B
    B -->|Save Data| E[(PostgreSQL)]
\`\`\``;

/* ─── Build TOC statically from markdown source ─── */
function buildTocFromSource(md: string): TocItem[] {
  const items: TocItem[] = [];
  let idx = 0;
  for (const line of md.split("\n")) {
    const m = line.match(/^## (\d+\.\s.+)$/);
    if (m) {
      items.push({ id: `exh-${idx}`, text: m[1], level: 2 });
      idx++;
    }
  }
  return items;
}

const STATIC_TOC = buildTocFromSource(SAMPLE_PRD);

/* ─── Custom renderer: bake IDs into h2 tags ─── */
function renderWithIds(md: string): string {
  let idx = 0;
  const renderer = new marked.Renderer();
  renderer.heading = ({ text, depth }: { text: string; depth: number }) => {
    if (depth === 2 && /^\d+\./.test(text)) {
      const id = `exh-${idx}`;
      idx++;
      return `<h2 id="${id}">${text}</h2>\n`;
    }
    return `<h${depth}>${text}</h${depth}>\n`;
  };
  return marked(md, { renderer, gfm: true, breaks: true }) as string;
}

export default function ExamplePrdModal({ onClose }: { onClose: () => void }) {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [activeTocId, setActiveTocId] = useState<string>(STATIC_TOC[0]?.id ?? "");
  const contentRef = useRef<HTMLDivElement>(null);

  /* Render markdown once */
  useEffect(() => {
    setHtmlContent(renderWithIds(SAMPLE_PRD));
  }, []);

  /* Mermaid diagrams */
  useEffect(() => {
    if (!htmlContent) return;

    const renderMermaid = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      try {
        const { default: mermaid } = await import("mermaid");
        mermaid.initialize({ startOnLoad: false, theme: "dark" });

        const nodes = document.querySelectorAll(".example-prd-modal .language-mermaid");
        if (nodes.length === 0) return;

        nodes.forEach((node) => node.removeAttribute("data-processed"));
        await mermaid.run({ querySelector: ".example-prd-modal .language-mermaid", suppressErrors: true });

        document.querySelectorAll(".example-prd-modal .language-mermaid").forEach((node: any) => {
          const pre = node.parentElement;
          if (pre && pre.tagName === "PRE") {
            pre.style.background = "transparent";
            pre.style.border = "none";
            pre.style.display = "flex";
            pre.style.justifyContent = "center";
          }
        });
      } catch (err) {
        console.error("Mermaid render error in modal", err);
      }
    };
    renderMermaid();
  }, [htmlContent]);

  /* Scroll spy */
  useEffect(() => {
    const container = contentRef.current;
    if (!container || STATIC_TOC.length === 0) return;

    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const containerRect = container.getBoundingClientRect();
      let active = STATIC_TOC[0].id;

      for (const item of STATIC_TOC) {
        const el = container.querySelector<HTMLElement>(`#${item.id}`);
        if (!el) continue;
        const elRect = el.getBoundingClientRect();
        const relTop = elRect.top - containerRect.top + scrollTop;
        if (relTop <= scrollTop + 100) active = item.id;
        else break;
      }
      setActiveTocId(active);
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [htmlContent]);

  const scrollToHeading = (id: string) => {
    const container = contentRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`#${id}`);
    if (!el) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const relativeTop = elRect.top - containerRect.top + container.scrollTop;
    container.scrollTo({ top: relativeTop - 24, behavior: "smooth" });
    setActiveTocId(id);
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)",
        padding: "16px",
      }}
      className="example-prd-modal"
    >
      <div 
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "85vh",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "20px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
        }}
      >
        {/* Modal Header */}
        <header 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid #1e293b",
            background: "#1e293b50",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FileText size={16} color="#818cf8" />
            </div>
            <div>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>Example PRD Preview</h3>
              <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>Previewing 7 core sections of TaskFlow PRD</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={20} />
          </button>
        </header>

        {/* Modal Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          
          {/* TOC Sidebar */}
          <aside 
            style={{
              width: "240px",
              flexShrink: 0,
              borderRight: "1px solid #1e293b",
              background: "#0b0f19",
              overflowY: "auto",
              padding: "20px 0",
            }}
          >
            <div style={{ padding: "0 20px 12px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#475569", textTransform: "uppercase" }}>
              Table of Contents
            </div>
            {STATIC_TOC.map((item) => {
              const isActive = activeTocId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToHeading(item.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 20px",
                    fontSize: "12px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#818cf8" : "#64748b",
                    background: isActive ? "rgba(99,102,241,0.08)" : "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                    lineHeight: 1.4,
                  }}
                >
                  {item.text}
                </button>
              );
            })}
          </aside>

          {/* Content Area */}
          <div 
            ref={contentRef}
            style={{
              flex: 1,
              padding: "40px",
              overflowY: "auto",
              color: "#cbd5e1",
            }}
            className="markdown-preview"
          >
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>

        </div>
      </div>
      
      <style>{`
        .example-prd-modal .markdown-preview h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 16px; color: #f8fafc; border-bottom: 1px solid #1e293b; padding-bottom: 12px; }
        .example-prd-modal .markdown-preview h2 { font-size: 1.25rem; font-weight: 700; margin: 36px 0 12px; color: #f8fafc; }
        .example-prd-modal .markdown-preview h3 { font-size: 1.05rem; font-weight: 600; margin: 24px 0 8px; color: #818cf8; }
        .example-prd-modal .markdown-preview p { font-size: 14px; line-height: 1.75; color: #94a3b8; margin-bottom: 12px; }
        .example-prd-modal .markdown-preview ul, .example-prd-modal .markdown-preview ol { padding-left: 20px; margin-bottom: 12px; }
        .example-prd-modal .markdown-preview li { font-size: 14px; line-height: 1.7; color: #94a3b8; margin-bottom: 4px; }
        .example-prd-modal .markdown-preview code { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.2); border-radius: 4px; padding: 1px 6px; font-size: 12px; color: #818cf8; font-family: monospace; }
        .example-prd-modal .markdown-preview pre { background: #0b0f19; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin: 16px 0; overflow-x: auto; }
        .example-prd-modal .markdown-preview pre code { background: none; border: none; padding: 0; font-size: 13px; color: #94a3b8; }
        .example-prd-modal .markdown-preview hr { border: none; border-top: 1px solid #1e293b; margin: 24px 0; }
        .example-prd-modal .markdown-preview strong { color: #f8fafc; font-weight: 700; }
        .example-prd-modal .markdown-preview table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
        .example-prd-modal .markdown-preview th { background: rgba(99,102,241,0.1); border: 1px solid #1e293b; padding: 8px 12px; text-align: left; font-weight: 600; color: #f8fafc; }
        .example-prd-modal .markdown-preview td { border: 1px solid #1e293b; padding: 8px 12px; color: #94a3b8; }
      `}</style>
    </div>
  );
}
