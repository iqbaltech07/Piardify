# Product Requirements Document (PRD)

## Piardify — AI-Powered PRD & Architecture Engine

---

## 1. Overview & Objectives

### 1.1 Product Summary
**Piardify** adalah platform otomasi rekayasa perangkat lunak yang mengubah ide produk mentah menjadi **Product Requirements Document (PRD)**, diagram arsitektur interaktif, spesifikasi desain (*design.md*), dan daftar tugas teknis (*6-Phase Kanban Tasks*) yang presisi dan siap dieksekusi tanpa halusinasi.

### 1.2 Core Problem & Solution
* **Problem**: Menyusun dokumentasi teknis dan memecahnya menjadi arsitektur file membutuhkan waktu berhari-hari. Generator AI generik sering berhalusinasi dan menghasilkan spesifikasi yang tidak konsisten antar komponen.
* **Solution**: Pipeline berantai 4 tahap terikat (*Contextual Chaining Pipeline*): Kuesioner Personal $\rightarrow$ PRD $\rightarrow$ Visual Tree $\rightarrow$ 6-Phase Task List.

### 1.3 Success Metrics (KPIs)
* Waktu generasi end-to-end $< 3$ menit per project.
* $\ge 95\%$ konsistensi konteks antara PRD, struktur folder, dan task list.
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

```mermaid
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
```

---

## 4. Functional Requirements & Feature Matrix

| ID | Modul Fitur | User Story & Fungsionalitas | Kriteria Keberhasilan (Acceptance Criteria) |
| :--- | :--- | :--- | :--- |
| **FR-01** | **Multi-Step Generator** | Sebagai user, saya ingin mengisi ide produk secara bertahap dengan auto-save draf. | Draf ide & jawaban kuesioner tersimpan otomatis di `localStorage` via Zustand `persist` dan tidak hilang saat refresh. |
| **FR-02** | **7-Step Contextual AI** | Sebagai user, saya ingin menjawab 7 pertanyaan terarah yang relevan dengan domain ide saya. | AI menghasilkan 7 pertanyaan spesifik domain; jawaban diikat sebagai konteks permanen generasi PRD. |
| **FR-03** | **Interactive PRD Editor** | Sebagai user, saya ingin merevisi bagian PRD tertentu melalui chat instruksi interaktif. | PRD Markdown terbarui secara inkremental tanpa merusak struktur bab yang tidak diubah. |
| **FR-04** | **Visual Architecture Tree** | Sebagai user, saya ingin melihat dan mengedit diagram pohon arsitektur produk (*React Flow*). | Node dapat digeser, ditambahkan, dihapus, dan di-reverse engineer otomatis ke format JSON terstruktur. |
| **FR-05** | **Smart Task Synchronizer** | Sebagai developer, saya ingin modul arsitektur dipecah menjadi 6 fase pengerjaan modular. | Tasks otomatis dikelompokkan ke 6 fase; perubahan PRD/Struktur menandai task lama untuk disinkronkan ulang. |
| **FR-06** | **Reactive Kanban Board** | Sebagai developer, saya ingin menggeser status task (*Todo, In Progress, Done*) secara instan. | Pergeseran kartu task responsif (0ms lag) dan status live disinkronkan ke server secara background. |
| **FR-07** | **Gamification & EXP Engine**| Sebagai user, saya ingin mendapatkan reward EXP saat menyelesaikan project. | +100 EXP ditambahkan ke profil user dan memperbarui status ranking leaderboard publik. |
| **FR-08** | **MCP Agent Server** | Sebagai developer, saya ingin menghubungkan Cursor/Windsurf/Antigravity ke project via API Key. | Endpoint MCP menyediakan tools `get_project_context`, `list_tasks`, dan `update_task_status`. |

---

## 5. System Architecture & Component Interactions

```mermaid
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
```

---

## 6. API Specifications & Data Contracts

| Method | Endpoint Path | Request Payload Schema | Expected 200 Response Schema |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/projects/create` | `{ appName: string, appIdea: string, stacks: object, dynamicAnswers: object }` | `{ projectId: string }` |
| `GET` | `/api/projects/detail` | `?projectId=string` | `{ project: ProjectDetailData }` |
| `POST` | `/api/projects/update` | `{ projectId: string, prdData?: string, strukturData?: object, taskData?: object }` | `{ success: boolean }` |
| `POST` | `/api/generate/prd` | `{ projectId: string }` | `{ markdown: string }` |
| `POST` | `/api/generate/edit-prd`| `{ projectId: string, currentPrd: string, prompt: string, selectedModel?: string }`| `{ updatedMarkdown: string, diffSummary: string }` |
| `POST` | `/api/generate/struktur`| `{ projectId: string }` | `{ title: string, description: string, nodes: Array }` |
| `POST` | `/api/generate/tasks` | `{ projectId: string, forceSync?: boolean }` | `{ phases: Array, savedStatus: object }` |
| `POST` | `/api/projects/finish` | `{ projectId: string, checkedTasks: object }` | `{ success: boolean, expGained: number, newExp: number }` |

---

## 7. Data Model & Database Schema

```mermaid
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
```

---

## 8. Tech Stack, State Management & Integrations

* **Core Framework**: Next.js 16 (Turbopack, App Router), React 19, TypeScript.
* **Global State Management (Zustand 5-Store Suite)**:
  * `useProjectStore`: Caching project aktif di memori client untuk navigasi 0ms antar tab.
  * `useChatStore`: Riwayat chat AI dan preferensi model yang persisten.
  * `useWizardStore`: Draf multi-step generator dengan auto-save `localStorage`.
  * `useKanbanStore`: Drag-and-drop responsif dan sinkronisasi task.
  * `useUiStore`: Kontrol modal global (MCP, Rename, Upgrade).
* **Database & ORM**: PostgreSQL dengan Prisma ORM v6 (menggunakan composite index `[userId, createdAt]` dan compound unique `[id, userId]`).
* **Caching & Rate Limiting**: Upstash Redis (Fail-open sliding window rate limiting & 30s SWR TTL cache).
* **AI & LLM Services**: Google GenAI SDK (`@google/genai` Gemini 2.5/3.7) & OpenRouter API.
* **Authentication**: Better-Auth (HTTP-Only Secure Cookie Session).

---

## 9. Non-Functional Requirements & Security Guidelines

* **Performance & Latency SLAs**:
  * Initial page load: $\le 1.5$ detik.
  * Navigasi antar step berkat Zustand memory cache: **0ms network delay**.
* **Security & Access Control**:
  * Autentikasi ketat pada seluruh endpoint mutasi data (`/api/projects/*`, `/api/generate/*`).
  * Compound query `where: { id_userId: { id, userId } }` menjamin user hanya dapat mengakses project miliknya.
  * Rate-limiting per user untuk mencegah eksploitasi kuota API LLM.
* **Design System Reference**:
  * Seluruh token warna (HEX/HSL), hirarki tipografi, dan aturan komponen UI mengacu secara ketat pada spesifikasi berkas `design.md` (`designData`).

---

## 10. Implementation Roadmap & Milestones

* **Phase 1: Database & Auth Infrastructure**
  * Setup PostgreSQL, Prisma schema indexes, Better-Auth, dan Upstash Redis rate-limiter.
* **Phase 2: Zustand 5-Store Suite & Centralized API Client**
  * Implementasi `lib/apiClient.ts` dan 5 store Zustand (`useProjectStore`, `useChatStore`, `useWizardStore`, `useKanbanStore`, `useUiStore`).
* **Phase 3: Form Generator & 7-Step Contextual Questionnaire**
  * UI Wizard interaktif, auto-save draf, dan integrasi prompt AI generator pertanyaan.
* **Phase 4: PRD Engine & Interactive Chat Editor**
  * Pipeline generasi PRD Markdown dan panel chat revisi real-time tanpa reload halaman.
* **Phase 5: Visual Mindmap Tree & 6-Phase Task Synchronization**
  * Diagram React Flow interaktif dan auto-breakdown task list dengan status tracking.
* **Phase 6: Gamification, MCP Agent Server & Production Hardening**
  * Sistem reward EXP, endpoint MCP untuk koneksi IDE eksternal, dan build audit clean.
