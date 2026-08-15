"use client";

import { useEffect, useState, useRef } from "react";
import { X, FileText } from "lucide-react";
import MarkdownRenderer, { TocItem } from "./MarkdownRenderer";

const SAMPLE_PRD = `# Product Requirements Document (PRD)

## Piardify — AI-Powered PRD & Architecture Engine

---

## 1. Overview & Objectives

### 1.1 Product Summary
**Piardify** adalah platform otomasi rekayasa perangkat lunak yang mengubah ide produk mentah menjadi **Product Requirements Document (PRD)**, diagram arsitektur interaktif, spesifikasi desain (*design.md*), dan daftar tugas teknis (*6-Phase Kanban Tasks*) yang presisi dan siap dieksekusi tanpa halusinasi.

### 1.2 Core Problem & Solution
* **Problem**: Menyusun dokumentasi teknis dan memecahnya menjadi arsitektur file membutuhkan waktu berhari-hari. Generator AI generik sering berhalusinasi dan menghasilkan spesifikasi yang tidak konsisten antar komponen.
* **Solution**: Pipeline berantai 4 tahap terikat (*Contextual Chaining Pipeline*): Kuesioner Personal $\\rightarrow$ PRD $\\rightarrow$ Visual Tree $\\rightarrow$ 6-Phase Task List.

### 1.3 Success Metrics (KPIs)
* Waktu generasi end-to-end $< 3$ menit per project.
* $\\ge 95\\%$ konsistensi konteks antara PRD, struktur folder, dan task list.
* Zero build errors pada scaffold kode yang dihasilkan.

---

## 2. User Personas & Pain Points

### 2.1 Software Engineers / Solo Developers
* **Pain Point**: Dokumentasi teknis memakan waktu; kesulitan memecah PRD abstrak menjadi task teknis atomik; output AI generik sering menghasilkan nama file yang inkonsisten.
* **Solution**: Auto-scaffolding arsitektur folder dan breakdown task 6 fase yang langsung sinkron dengan MCP Agent di IDE.

### 2.2 Product Managers & Technical Founders
* **Pain Point**: Kesulitan mengomunikasikan ide bisnis abstrak menjadi arsitektur teknis bagi developer; draf revisi sering hilang saat navigasi tab.
* **Solution**: Editor PRD interaktif dengan auto-save draf lokal, visual mindmap yang bisa diedit langsung, dan preview token desain.

---

## 3. End-to-End User Flow & Journey

\`\`\`mermaid
flowchart TD
    A["1. Input Ide & Nama App"] --> B{"2. Pilih Tech Stack & Template Desain"}
    B -->|"Preset Manual"| C["Pilih 4 Layer Stack"]
    B -->|"AI Recommendation"| D["Rekomendasi Cerdas AI"]
    C --> E["3. Jawab 7 Pertanyaan Spesifikasi AI"]
    D --> E
    E --> F["4. Generate PRD & Live Viewer"]
    F --> G{"Perlu Revisi PRD?"}
    G -->|"Ya"| H["Chat Prompt Revisi AI (useChatStore)"]
    H --> F
    G -->|"Tidak"| I["5. Generate Visual Architecture Tree"]
    I --> J["6. Sync 6-Phase Kanban Tasks"]
    J --> K["7. Hubungkan MCP Agent / Eksekusi Task"]
    K --> L["8. Selesaikan Project & Klaim EXP"]
\`\`\`

---

## 4. Functional Requirements & Feature Matrix

| ID | Modul Fitur | User Story & Fungsionalitas | Kriteria Keberhasilan (Acceptance Criteria) |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Multi-Step Generator** | Sebagai user, saya ingin mengisi ide produk secara bertahap dengan auto-save draf. | Draf ide & jawaban kuesioner tersimpan otomatis di \`localStorage\` via Zustand \`persist\` dan tidak hilang saat refresh. |
| **FR-02** | **7-Step Contextual AI** | Sebagai user, saya ingin menjawab 7 pertanyaan terarah yang relevan dengan domain ide saya. | AI menghasilkan 7 pertanyaan spesifik domain; jawaban diikat sebagai konteks permanen generasi PRD. |
| **FR-03** | **Interactive PRD Editor** | Sebagai user, saya ingin merevisi bagian PRD tertentu melalui chat instruksi interaktif. | PRD Markdown terbarui secara inkremental tanpa merusak struktur bab yang tidak diubah. |
| **FR-04** | **Visual Architecture Tree** | Sebagai user, saya ingin melihat dan mengedit diagram pohon arsitektur produk (*React Flow*). | Node dapat digeser, ditambahkan, dihapus, dan di-reverse engineer otomatis ke format JSON terstruktur. |
| **FR-05** | **Smart Task Synchronizer** | Sebagai developer, saya ingin modul arsitektur dipecah menjadi 6 fase pengerjaan modular. | Tasks otomatis dikelompokkan ke 6 fase; perubahan PRD/Struktur menandai task lama untuk disinkronkan ulang. |
| **FR-06** | **Reactive Kanban Board** | Sebagai developer, saya ingin menggeser status task (*Todo, In Progress, Done*) secara instan. | Pergeseran kartu task responsif (0ms lag) dan status live disinkronkan ke server secara background. |
| **FR-07** | **Gamification & EXP Engine**| Sebagai user, saya ingin mendapatkan reward EXP saat menyelesaikan project. | +100 EXP ditambahkan ke profil user dan memperbarui status ranking leaderboard publik. |
| **FR-08** | **MCP Agent Server** | Sebagai developer, saya ingin menghubungkan Cursor/Windsurf/Antigravity ke project via API Key. | Endpoint MCP menyediakan tools \`get_project_context\`, \`list_tasks\`, dan \`update_task_status\`. |

---

## 5. System Architecture & Component Interactions

\`\`\`mermaid
flowchart LR
    subgraph Client ["Client Layer (Next.js 16 + Zustand)"]
        UI["React 19 UI Components"]
        Store["Zustand 5-Store Suite"]
        SDK["Centralized apiClient.ts"]
    end

    subgraph Server ["Server Layer (Next.js App Router API)"]
        Auth["Better-Auth Session Guard"]
        ProjectAPI["Projects & Tasks Controller"]
        LLMEngine["LLM Context Pipeline"]
        AgentAPI["MCP Agent Endpoints"]
    end

    subgraph Data ["Data & External Layer"]
        DB[("PostgreSQL Prisma ORM")]
        Cache[("Upstash Redis Caching")]
        Gemini["Google Gemini / OpenRouter"]
    end

    UI --> Store
    Store --> SDK
    SDK --> ProjectAPI
    AgentAPI --> Auth
    ProjectAPI --> Auth
    ProjectAPI --> DB
    ProjectAPI --> Cache
    ProjectAPI --> LLMEngine
    LLMEngine --> Gemini
\`\`\`

---

## 6. API Specifications & Data Contracts

| Method | Endpoint Path | Request Payload Schema | Expected 200 Response Schema |
| :--- | :--- | :--- | :--- |
| \`POST\` | \`/api/projects/create\` | \`{ appName: string, appIdea: string, stacks: object, dynamicAnswers: object }\` | \`{ projectId: string }\` |
| \`GET\` | \`/api/projects/detail\` | \`?projectId=string\` | \`{ project: ProjectDetailData }\` |
| \`POST\` | \`/api/projects/update\` | \`{ projectId: string, prdData?: string, strukturData?: object, taskData?: object }\` | \`{ success: boolean }\` |
| \`POST\` | \`/api/generate/prd\` | \`{ projectId: string }\` | \`{ markdown: string }\` |
| \`POST\` | \`/api/generate/edit-prd\`| \`{ projectId: string, currentPrd: string, prompt: string, selectedModel?: string }\`| \`{ updatedMarkdown: string, diffSummary: string }\` |
| \`POST\` | \`/api/generate/struktur\`| \`{ projectId: string }\` | \`{ title: string, description: string, nodes: Array }\` |
| \`POST\` | \`/api/generate/tasks\` | \`{ projectId: string, forceSync?: boolean }\` | \`{ phases: Array, savedStatus: object }\` |
| \`POST\` | \`/api/projects/finish\` | \`{ projectId: string, checkedTasks: object }\` | \`{ success: boolean, expGained: number, newExp: number }\` |

---

## 7. Data Model & Database Schema

\`\`\`mermaid
erDiagram
    USER ||--o{ PROJECT : "owns"
    USER ||--o{ SESSION : "has"
    USER ||--o{ ACCOUNT : "links"

    USER {
        string id PK "Unique CUID"
        string email UK "User email"
        string name "User full name"
        string tier "FREE | PRO"
        int exp "Leaderboard EXP points"
        string apiKey UK "Agent MCP Auth Key"
        datetime createdAt
    }

    PROJECT {
        string id PK "Unique CUID"
        string userId FK "Owner reference"
        string appName "Application title"
        string appIdea "Problem & feature description"
        string formInputs "JSON: Tech stacks & questionnaire"
        string prdData "Markdown: Full PRD content"
        string strukturData "JSON: Node & category hierarchy"
        string taskData "JSON: 6-Phase modular tasks"
        string designData "Markdown: Design tokens & guidelines"
        string status "IN_PROGRESS | FINISHED"
        string checkedTasks "JSON: Record<taskId, status>"
        datetime finishedAt "Completion timestamp"
        datetime createdAt
        datetime updatedAt
    }
\`\`\`
\`;`;

export default function ExamplePrdModal({ onClose }: { onClose: () => void }) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeTocId, setActiveTocId] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* Scroll spy */
  useEffect(() => {
    const container = contentRef.current;
    if (!container || toc.length === 0) return;
    const onScroll = () => {
      const scrollTop = container.scrollTop;
      const containerRect = container.getBoundingClientRect();
      let active = toc[0].id;
      for (const item of toc) {
        const el = container.querySelector<HTMLElement>(`#${item.id}`);
        if (!el) continue;
        const relTop = el.getBoundingClientRect().top - containerRect.top + scrollTop;
        if (relTop <= scrollTop + 100) active = item.id;
        else break;
      }
      setActiveTocId(active);
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [toc]);

  const scrollToHeading = (id: string) => {
    const container = contentRef.current;
    if (!container) return;
    const el = container.querySelector<HTMLElement>(`#${id}`);
    if (!el) return;
    const relTop = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTo({ top: relTop - 24, behavior: "smooth" });
    setActiveTocId(id);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Example PRD Preview"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(8, 11, 20, 0.85)",
        backdropFilter: "blur(4px)",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "85vh",
          background: "var(--bg-base)",
          border: "1px solid var(--border-hairline)",
          borderRadius: "var(--radius-lg)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 20px",
            borderBottom: "1px solid var(--border-hairline)",
            background: "var(--bg-elevated)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-hairline)",
                background: "var(--bg-base)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-signal)",
              }}
              aria-hidden="true"
            >
              <FileText size={14} />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                Example PRD Preview
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  color: "var(--fg-muted)",
                  margin: 0,
                  letterSpacing: "0.06em",
                }}
              >
                REF: PRD-2024-0042 · TaskFlow · 7 sections
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: "transparent",
              border: "1px solid var(--border-hairline)",
              color: "var(--fg-secondary)",
              cursor: "pointer",
              padding: "6px",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--color-mist)";
              el.style.color = "var(--fg-primary)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = "var(--border-hairline)";
              el.style.color = "var(--fg-secondary)";
            }}
          >
            <X size={16} />
          </button>
        </header>

        {/* Body */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* TOC Sidebar */}
          <aside
            style={{
              width: "210px",
              flexShrink: 0,
              borderRight: "1px solid var(--border-hairline)",
              background: "var(--bg-base)",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
            }}
            aria-label="Table of contents"
          >
            <div
              style={{
                padding: "16px 14px 8px",
                borderBottom: "1px solid var(--border-hairline)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  color: "var(--fg-muted)",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Contents
              </p>
            </div>
            <nav style={{ flex: 1, overflowY: "auto", padding: "8px 8px 16px" }}>
              {toc.map((item) => {
                const isActive = activeTocId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToHeading(item.id)}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      lineHeight: 1.4,
                      padding: "7px 10px",
                      borderRadius: "var(--radius-sm)",
                      background: isActive ? "var(--bg-elevated)" : "transparent",
                      color: isActive ? "var(--color-signal)" : "var(--fg-muted)",
                      fontWeight: isActive ? 600 : 400,
                      border: "none",
                      borderLeft: isActive
                        ? "2px solid var(--color-signal)"
                        : "2px solid transparent",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                      marginBottom: 2,
                      letterSpacing: "0.03em",
                    }}
                  >
                    {item.text}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Document content */}
          <div
            ref={contentRef}
            style={{
              flex: 1,
              padding: "32px 44px",
              overflowY: "auto",
              background: "var(--bg-base)",
            }}
          >
            <MarkdownRenderer
              content={SAMPLE_PRD}
              onTocUpdate={(newToc) => {
                const filtered = newToc.filter((item) => /^\d+\./.test(item.text));
                setToc(filtered);
                if (filtered.length > 0 && !activeTocId) {
                  setActiveTocId(filtered[0].id);
                }
              }}
              idPrefix="exh-"
              className="markdown-preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
