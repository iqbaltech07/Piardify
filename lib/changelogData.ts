export type Category = "all" | "feat" | "improvement" | "fix";

export interface ReleaseItem {
  type: "feat" | "improvement" | "fix";
  title: string;
  description: string;
  tags?: string[];
}

export interface Release {
  version: string;
  date: string;
  title: string;
  badge?: string;
  summary: string;
  highlights: ReleaseItem[];
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export const RELEASES: Release[] = [
  {
    version: "v2.2.3",
    date: "11 Agustus 2026",
    title: "Hybrid Context XML, Token Optimization, & Lazy Loaded Taste Skill",
    badge: "Latest Release",
    summary:
      "Memperkenalkan format konteks baru (Hybrid XML + Markdown + CDATA) yang memangkas penggunaan token secara drastis, serta optimasi Taste Skill dengan mekanisme On-Demand Fetching via CLI.",
    highlights: [
      {
        type: "feat",
        title: "Hybrid Context Serialization",
        description:
          "Semua JSON stringified payloads pada PRD dan Design kini dikonversi menjadi format XML CDATA + Compact JSON. Ini menghilangkan masalah escape characters dan memangkas penggunaan token hingga 20-30%.",
        tags: ["Token Optimization", "XML", "CDATA"],
      },
      {
        type: "feat",
        title: "Lazy Loading Taste Skill (AH-013 Update)",
        description:
          "Taste Skill kini tidak lagi di-embed penuh di context.md, melainkan dipotong (truncate) menjadi maksimal 140 baris. AI Agent diwajibkan (Mandatory Critical Gate) untuk memanggil npx piardify project taste-skill sebelum melakukan UI coding.",
        tags: ["Lazy Load", "CLI Fetch", "Anti-Hallucination"],
      },
      {
        type: "improvement",
        title: "Personalization Inputs & Freshness Marker",
        description:
          "Menambahkan data jawaban pengguna (Personalization Inputs) ke dalam payload konteks, serta penanda Snapshot Freshness (AH-017) untuk mendeteksi apakah context yang dibaca AI sudah basi atau belum.",
        tags: ["Personalization", "AH-017"],
      },
      {
        type: "improvement",
        title: "Centralized System Directives",
        description:
          "Seluruh aturan AH-00x (Anti-Hallucination) yang sebelumnya di-hardcode pada SKILL.md kini dipindahkan ke backend systemDirectives.ts agar dapat di-inject secara dinamis ke context.md.",
        tags: ["Refactoring", "Clean Code"],
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "10 Agustus 2026",
    title: "100% Zero-Slop Mandate, AH-016 Chunk-Read, & Full GSAP Kinetic Restoration",
    summary:
      "Penegakan hukum visual mutlak (Zero-Slop & Zero-Hallucination) via AH-014, perlindungan lupa konteks dengan Mandatory Chunk-Read (AH-016), dan pemulihan 100% kemampuan animasi Advanced GSAP Motion pada gptTaste tanpa kompromi.",
    highlights: [
      {
        type: "feat",
        title: "Full GSAP Motion Restoration in gptTaste",
        description:
          "Memulihkan superpower asli gptTaste (Scroll Pinning, Text Scrubbing, Card Stacking, True Randomization Python RNG, Gapless Bento Grid) sambil tetap mengunci ketat warna & gaya ke token design.md.",
        tags: ["GSAP", "Taste Skill", "Awwwards"],
      },
      {
        type: "feat",
        title: "Zero-Slop & Zero-Hallucination Visual Quality Mandate (AH-014)",
        description:
          "Deklarasi pemblokiran total (BANNED FOREVER) terhadap ciri khas web AI murahan: Navy Blue #0F172A containers, Neon Purple-Blue Glows, Hairline Dividers, dan Meta-Labels murah. Diwajibkan di setiap komponen.",
        tags: ["Anti-Slop", "Visual Quality", "AH-014"],
      },
      {
        type: "improvement",
        title: "Mandatory Skill Focus Gate (AH-013)",
        description:
          "AI Agent diwajibkan menulis <skill_comprehension> dan <design_plan> sebelum mengeluarkan 1 baris pun kode UI untuk memastikan fokus 100% dan tidak melewatkan/mengabaikan Taste Skill yang aktif.",
        tags: ["Skill Comprehension", "AI Gate"],
      },
      {
        type: "improvement",
        title: "Context Persistence & Mandatory Chunk-Read (AH-015 & AH-016)",
        description:
          "Mencegah AI lupa konteks saat percakapan panjang dengan mewajibkan pemanggilan view_file pada context.md sebelum setiap task, serta mewajibkan pembacaan bertahap (chunk-read) untuk file >800 baris.",
        tags: ["Memory Persistence", "No-Loss Context"],
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "9 Agustus 2026",
    title: "Modular Taste Skill Library, Selective Payload Delivery & Design Hierarchy",
    badge: "Latest Release",
    summary:
      "Integrasi 100% Taste Skill tanpa potongan dari Knowledge OS Second Brain, pengiriman payload selektif hemat 90% token, hirarki sinergi design.md vs Taste Skill, serta pembagian file modular.",
    highlights: [
      {
        type: "feat",
        title: "Unabridged Modular Taste Skill Library",
        description:
          "Integrasi 8 Taste Skill utuh (designTasteFrontend, highEndVisualDesign, minimalistUi, redesignExistingProjects, gptTaste, stitchDesignTaste, fullOutputEnforcement, findSkills) beserta canonical code skeletons (GSAP StickyStack, HorizontalPan, Motion RevealStagger, Apple Liquid Glass Web CSS).",
        tags: ["Taste Skill", "Design System", "Anti-Slop"],
      },
      {
        type: "feat",
        title: "Selective Taste Skill Payload Reduction (On-Demand Delivery)",
        description:
          "Pengurangan beban context JSON sebesar 90% (163KB -> 12KB) dengan mendeteksi vibe project dan hanya melampirkan 1 skill aktif. Menyediakan endpoint API & CLI taste-skill --skill <name> secara on-demand.",
        tags: ["Performance", "Context API", "Payload 90% Reduced"],
      },
      {
        type: "improvement",
        title: "Design Hierarchy of Authority (design.md vs Taste Skill)",
        description:
          "Penetapan tegas Level 1 Ground Truth (design.md menentukan WHAT to build) vs Level 2 Engineering Quality (Taste Skill menentukan HOW to build with excellence). Eliminasi total bentrok token warna & font.",
        tags: ["Hierarchy", "Design Synergy", "Anti-Hallucination"],
      },
      {
        type: "improvement",
        title: "Hidden Background Skill Injection & English Console Logs",
        description:
          "Taste Skill dan direktif sistem disuntikkan secara tersembunyi (hidden) di latar belakang melalui .piardify/context.md & .agents/skills/ tanpa mengotori tampilan terminal/UI manusia. Seluruh CLI log distandarisasi ke Bahasa Inggris.",
        tags: ["CLI", "UX", "Hidden Directives"],
      },
    ],
    codeSnippet: {
      language: "bash",
      code: `# Fetch specific taste skill on-demand
npx piardify project taste-skill --skill minimalistUi --json

# Automatic Project Context with 90% Reduced Payload
npx piardify project context --json`,
    },
  },
  {
    version: "v1.2.0",
    date: "9 Agustus 2026",
    title: "NPX CLI, Agent Skill & 10ms Realtime Autonomous Sync",
    summary:
      "Transformasi penuh integrasi AI Agent dari legacy MCP ke Zero-Friction NPX CLI, native Agent Skill (.agents/skills/piardify/SKILL.md), serta instant Upstash Redis sync engine (<10ms).",
    highlights: [
      {
        type: "feat",
        title: "Zero-Friction NPX CLI Provisioning",
        description:
          "Autentikasi dan inisialisasi ruang kerja serba otomatis dengan perintah 'npx piardify login' dan 'npx piardify init'. Otomatis menyuntikkan Agent Skill ke dalam .agents/skills/piardify/SKILL.md.",
        tags: ["CLI", "Agent Skill", "DX"],
      },
      {
        type: "feat",
        title: "10ms Native Realtime Autonomous Sync",
        description:
          "AI Agent mengklaim (start), mengeksekusi, menguji, dan menyelesaikan (complete) tugas langsung dari terminal. Papan Kanban web ter-update secara otomatis tanpa rotasi kartu manual.",
        tags: ["Realtime", "Redis", "Kanban"],
      },
      {
        type: "improvement",
        title: "Upgrade Core AI Engine ke Gemini 3.6 Flash",
        description:
          "Sintesis Product Requirements Document (PRD), mindmap arsitektur visual, dan rincian tugas 10x lebih cepat dengan presisi struktur tinggi.",
        tags: ["AI Engine", "Gemini 3.6 Flash"],
      },
      {
        type: "improvement",
        title: "Enforced Reading Order & Directive Context API",
        description:
          "Menegakkan urutan penelusuran wajib (Structure -> PRD -> Design -> Task) pada SKILL.md dan context API payload untuk eliminasi total AI hallucination.",
        tags: ["Anti-Hallucination", "Context API"],
      },
    ],
    codeSnippet: {
      language: "bash",
      code: `# Login & Inisialisasi Proyek dalam 1 Langkah
npx piardify login --token piar_live_7667e783d8a93539758e2c8eb8f8dad0
npx piardify init --project cmshkki2x0001l104vdj6hnfc

# Klaim & Selesaikan Tugas secara Otonom
npx piardify task start clx9988776655
npx piardify task complete clx9988776655`,
    },
  },
  {
    version: "v1.1.0",
    date: "6 Agustus 2026",
    title: "Modular Detail Architecture & Live Color Swatch Parser",
    summary:
      "Refactoring total halaman detail proyek menjadi sub-komponen modular, perbaikan parser markdown untuk tag HTML semantik, dan render sampel warna desain token secara langsung.",
    highlights: [
      {
        type: "feat",
        title: "Live Color Tokens Swatches",
        description:
          "Parser otomatis yang membaca token warna Hex dalam dokumen desain dan menampilkan visual color swatch interaktif pada tabel warna proyek.",
        tags: ["Design System", "UI Parser"],
      },
      {
        type: "improvement",
        title: "Modular Sub-Component Refactoring",
        description:
          "Memecah monolith detail page menjadi ColorTokensTable, DesignAccordions, DesignDropzone, dan ProjectHeaderCard untuk performa dan kemudahan pemeliharaan.",
        tags: ["Refactoring", "Clean Code"],
      },
      {
        type: "fix",
        title: "Semantic HTML Escaping pada Markdown Format",
        description:
          "Mengatasi isu perenderan tag HTML seperti <header>, <main>, <section>, dan <article> agar tidak terpotong saat diparsing dari dokumen PRD.",
        tags: ["Markdown Parser", "Bugfix"],
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "1 Agustus 2026",
    title: "Peluncuran Perdana AI PRD Architect & System Directives",
    summary:
      "Rilis resmi Piardify — platform pembangkit PRD cerdas berbasis AI dengan wizard 7 langkah anti-halusinasi dan papan Kanban terintegrasi.",
    highlights: [
      {
        type: "feat",
        title: "7-Step Anti-Hallucination Blueprint Wizard",
        description:
          "Sistem kuesioner terstruktur 7 langkah yang mengunci batasan teknis, fitur utama, dan aturan AH-001 hingga AH-010 sebelum pembuatan PRD.",
        tags: ["PRD Wizard", "System Directives"],
      },
      {
        type: "feat",
        title: "Visual Architecture Mindmap Canvas",
        description:
          "Visualisasi hirarki proyek dalam bentuk diagram graph interaktif yang dapat diedit inline dan tersinkronisasi balik ke struktur JSON.",
        tags: ["Interactive Graph", "Architecture"],
      },
      {
        type: "feat",
        title: "Automated Kanban Task Generation",
        description:
          "Ekstraksi kebutuhan PRD menjadi kartu-kartu tugas Kanban yang siap dikerjakan oleh developer maupun AI Agent.",
        tags: ["Kanban", "Project Management"],
      },
    ],
  },
];
