# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Piardify — AI PRD Generator Platform

---

## 1. Overview

**Piardify** adalah aplikasi berbasis AI yang memungkinkan pengguna menghasilkan Product Requirements Document (PRD) secara otomatis, terstruktur, dan minim halusinasi.

Platform ini membantu developer, product manager, dan mahasiswa dalam membuat dokumentasi produk dengan cepat, akurat, dan profesional.

---

## 2. Objectives

### Primary Goals

- Menghasilkan PRD otomatis berbasis AI
- Mengurangi halusinasi AI
- Menyediakan struktur PRD profesional
- Mempercepat workflow dokumentasi

### Success Metrics

- ≥ 90% PRD selesai dalam < 3 menit
- ≥ 80% tanpa revisi besar
- Retention ≥ 40%

---

## 3. User Personas & Problems

### 3.1 Mahasiswa IT / CS

- **Latar Belakang**: Mahasiswa yang sedang menyusun tugas akhir, skripsi, atau proyek mata kuliah.
- **Masalah Utama (Pain Points)**:
  - Kesulitan menyusun dokumen PRD berstandar industri dari nol.
  - Bingung menentukan *tech stack* dan arsitektur produk yang tepat.
  - Membutuhkan waktu lama untuk membuat dokumentasi teknis secara manual.

### 3.2 Software Developer

- **Latar Belakang**: Engineer / Solo Developer yang membangun proyek sampingan (*side-project*) atau MVP.
- **Masalah Utama (Pain Points)**:
  - Dokumentasi teknis sering terabaikan karena memakan waktu development.
  - Kesulitan memecah spesifikasi PRD menjadi daftar *task* teknis yang modular.
  - Hasil AI generatif biasa sering mengalami halusinasi dan spesifikasi tidak konsisten.

### 3.3 Startup Founder & Product Manager

- **Latar Belakang**: Non-technical founder atau Product Manager yang sedang memvalidasi ide produk baru.
- **Masalah Utama (Pain Points)**:
  - Sulit mengomunikasikan ide bisnis abstrak menjadi spesifikasi teknis untuk tim developer.
  - Menyusun spesifikasi produk dari nol memakan waktu berminggu-minggu.
  - Kurangnya alat visual untuk mengedit hirarki fitur secara cepat dan fleksibel.

---

## 4. Features

| Modul Fitur | Deskripsi & Fungsionalitas | Komponen / Detail Utama |
| :--- | :--- | :--- |
| **4.1 AI PRD Generator** | Generator otomatis untuk membuat dokumen PRD terstruktur dari masukan ide pengguna. | • **Input**: Ide aplikasi<br>• **Output**: PRD Markdown terstruktur lengkap |
| **4.2 Tech Stack Selection** | Modul penentuan *tech stack* aplikasi berbasis pilihan manual atau rekomendasi AI. | • **Manual Selection**: Frontend, Backend, Database, Deployment<br>• **AI Recommendation**: Rekomendasi cerdas berbasis ide produk |
| **4.3 7-Step Personalization** | Kuesioner 7 langkah terarah untuk memastikan akurasi konteks (Anti-Halusinasi). | 1. Target user & Platform (Web/Mobile)<br>2. Core features & Monetisasi<br>3. Skala aplikasi, Integrasi 3rd party, & Preferensi desain |
| **4.4 PRD Preview & Editor** | Antarmuka ganda untuk membaca pratinjau dan menyunting isi dokumen PRD. | • **Mode Baca**: Real-time Markdown preview<br>• **Mode Edit**: Raw text editor untuk penyesuaian kustom cepat |
| **4.5 Visual Graph Mindmap** | Editor mindmap arsitektur produk visual interaktif berbentuk pohon hirarki (*Root -> Kategori -> Sub-fitur*). | • **Interactive Editing**: Drag node, inline-edit judul, tambah node/edge visual<br>• **Visual-to-JSON Parser**: Auto reverse-engineer diagram ke skema JSON |
| **4.6 Smart Task Sync Engine** | Pembagian modul arsitektur menjadi daftar task *checklist* dengan penghematan token. | • **Checklist Task**: Pembagian kerja modular terstruktur<br>• **Smart Sync**: AI hanya menyelaraskan task pada bagian yang berubah (`_tasksOutdated: true`) |
| **4.7 Gamification & EXP System** | Sistem akumulasi EXP dan kenaikan peringkat (*rank*) berbasis penyelesaian proyek. | • **EXP Reward**: +100 EXP per proyek yang diselesaikan<br>• **Rank Progression**: Peningkatan peringkat disertai ikon Lucide representatif |
| **4.8 Monthly Plan Limits** | Pembatasan kuota pembuatan proyek bulanan berdasarkan tingkat langganan. | • **Plan Free**: 1x generate project per bulan<br>• **Plan Pro**: 3x generate project per bulan |

---

## 5. User Flow

```mermaid
flowchart TD
    A[User Input Idea] --> B{Choose Tech Stack}
    B -->|Manual| C[Select Stack]
    B -->|AI| D[AI Recommend Stack]
    C --> E[Answer 7 Questions]
    D --> E[Answer 7 Questions]
    E --> F[AI Processing]
    F --> G[Generate PRD]
    G --> H[Preview PRD]
    H --> I{Edit Needed?}
    I -->|Yes| J[Edit PRD]
    I -->|No| K[Download Markdown]
    J --> K
```

---

## 6. System Architecture

```mermaid
flowchart LR
    A[Frontend - Next.js] --> B[Backend API]
    B --> C[AI Engine]
    B --> D[Database]
    B --> E[Markdown Generator]

    C --> F[LLM API]
    D --> G[(PostgreSQL/MySQL)]
    E --> H[Markdown File .md]
```

---

## 7. Data Flow

```mermaid
flowchart TD
    A[User Input] --> B[Validation Layer]
    B --> C[Prompt Builder]
    C --> D[AI Engine]
    D --> E[Structured PRD JSON]
    E --> F[Markdown Renderer]
    F --> G[Preview UI]
    G --> H[Export File]
```

---

## 8. Tech Stack

### Frontend

- Next.js
- Tailwind CSS & Vanilla CSS (custom design tokens)
- @xyflow/react (React Flow untuk Diagram Mindmap Interaktif)
- Lucide React (ikonografi)

### Backend

- Next JS API Routes

### AI Engine

- Gemini API / LLM

### Database

- PostgreSQL (prisma ORM online by vercel)

### Storage

- JSON (PRD structure)
- Markdown file

---

## 9. Design Guidelines

> [!NOTE]
> Detail spesifikasi sistem desain, token warna (HEX/HSL), hirarki tipografi, serta panduan komponen UI (Do's & Don'ts) dikelola secara terpusat dan terpisah di dokumen `design.md` (`designData`).

### 9.1 General Aesthetics

- **Style**: Ultra-clean, modern enterprise light-mode, users-first.
- **UI Principles**: High readability, clear visual hierarchy, minimal clutter, micro-animations untuk responsivitas visual.
- **Design Alignment**: Seluruh penamaan token warna dan aturan komponen mengacu secara ketat pada spesifikasi berkas `design.md`.

---

## 10. Development Process Flow

```mermaid
flowchart LR
    A[Planning] --> B[Design]
    B --> C[Development]
    C --> D[Testing]
    D --> E[Deployment]
    E --> F[Iteration]
    F --> A
```

---

## 11. Constraints & Risks

### Constraints

- AI hallucination
- API cost
- Latency

### Risks

- Output terlalu generic
- User input tidak jelas

### Mitigation

- 7-step personalization
- Prompt engineering
- Validation system

---

## 12. Future Enhancements

- Multi-user collaboration
- PRD versioning
- Export ke PDF / DOCX
- Integrasi Jira / Trello
- Custom AI model

---

## 13. Unique Value Proposition

- PRD otomatis dalam hitungan menit
- Minim halusinasi dibanding AI biasa
- Visual + dokumentasi dalam satu platform
- Developer-focused workflow

---

## 14. Conclusion

Piardify memberikan solusi cepat, akurat, dan terstruktur untuk pembuatan PRD tanpa memerlukan pengalaman mendalam dalam product documentation.
