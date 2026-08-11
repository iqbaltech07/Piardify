export const SYSTEM_DIRECTIVES = {
  "systemDirectives": {
    "antiHallucinationRules": {
      "severity": "CRITICAL",
      "rules": [
        {
          "id": "AH-001",
          "rule": "ZERO INVENTION: Dilarang keras menambah library, framework, dependency, atau tech stack di luar yang eksplisit disebutkan di PRD.",
          "validation": "Sebelum menulis import statement, cross-check dengan daftar dependency di PRD. Jika tidak ada, JANGAN tulis.",
          "failure_consequence": "Build error, security vulnerability, bloat tidak perlu"
        },
        {
          "id": "AH-002",
          "rule": "ZERO ASSUMPTION: Jangan pernah membuat asumsi tentang skema database, API endpoint, response format, atau business logic yang tidak terdokumentasi.",
          "validation": "Jika PRD tidak menjelaskan API response shape, tulis comment: `// TODO: Confirm API response shape with backend` dan gunakan placeholder type yang jelas.",
          "failure_consequence": "Runtime error, data mismatch, silent bugs"
        },
        {
          "id": "AH-003",
          "rule": "STATUS SYNC: Selalu ubah status task di Piardify menjadi 'in_progress' saat mulai dikerjakan dan 'done' setelah selesai.",
          "validation": "Ini adalah REQUIRED side-effect dari setiap task execution.",
          "failure_consequence": "Project tracking rusak, task duplication"
        },
        {
          "id": "AH-004",
          "rule": "REALITY CHECK: Jika diminta membuat fitur yang memerlukan backend/API yang belum ada, WAJIB flag sebagai blocker, bukan silent mock.",
          "validation": "Tulis komentar inline: `/* BLOCKER: Membutuhkan endpoint POST /api/xxx - saat ini menggunakan mock data */`",
          "failure_consequence": "False progress, broken integration nanti"
        },
        {
          "id": "AH-005",
          "rule": "DESIGN SYSTEM CHECK [CRITICAL]: Saat memulai task pembuatan atau perubahan UI/UX (frontend), WAJIB menanyakan ke user terlebih dahulu apakah ada design system spesifik (misal: shadcn/ui, Material, dll) atau referensi visual yang diinginkan.",
          "validation": "Berhenti dan tanyakan secara eksplisit ke user SEBELUM mulai menulis kode komponen UI. Jangan pernah lanjut membuat UI dengan gaya default (asumsi) tanpa persetujuan / konfirmasi.",
          "failure_consequence": "Desain UI tidak sesuai harapan user, membuang waktu, dan harus dirombak ulang (rework) secara masif."
        },
        {
          "id": "AH-006",
          "rule": "MANDATORY CHECKPOINT HONOR [CRITICAL]: AI Agent WAJIB BERHENTI saat menemukan task dengan flag `isCheckpoint: true` atau judul `[CHECKPOINT]`. AI Agent dilarang keras melanjutkan ke task berikutnya sebelum user memberikan konfirmasi/ACC.",
          "validation": "Outputkan ringkasan hasil ke user dan tunggu konfirmasi user sebelum memanggil `sync complete` atau pindah task.",
          "failure_consequence": "AI Agent melompati persetujuan user dan merusak ekspektasi UI/Backend."
        },
        {
          "id": "AH-007",
          "rule": "MANDATORY DESIGN REFERENCE [CRITICAL]: Sebelum membuat komponen Frontend UI, AI Agent WAJIB membaca file `design.md` (atau tag `<design_data>` di `.piardify/context.md`) untuk mengambil token warna HEX, font, dan komponen UI yang valid.",
          "validation": "Cross-check seluruh style warna dan tipografi dengan design.md. Dilarang menghalusinasi warna di luar token.",
          "failure_consequence": "Desain UI berantakan dan tidak konsisten (AI Slop)."
        },
        {
          "id": "AH-008",
          "rule": "DUMMY DATA ELIMINATION [REQUIRED]: Di Phase 6 (Integrasi Backend), AI Agent WAJIB meretouch seluruh komponen Frontend untuk menghapus data mock/dummy dan menyambungkannya ke real API route & database seeder.",
          "validation": "Pastikan tidak ada array mock/dummy data statis yang tertinggal di komponen Frontend.",
          "failure_consequence": "Tampilan Frontend tidak menampilkan data asli dari database."
        },
        {
          "id": "AH-009",
          "rule": "MODERN DOCS VERIFICATION [REQUIRED]: Sebelum membuat file framework (misal Next.js App Router, Middleware, Auth), AI Agent WAJIB mengecek dokumentasi terbaru via MCP Context7 atau Web Search untuk menggunakan nama file & konvensi terbaru.",
          "validation": "Pastikan nama file dan API mengikuti konvensi versi framework terbaru (misal `proxy.ts` vs `middleware.ts` di Next.js 16).",
          "failure_consequence": "Error kompilasi akibat konvensi framework yang deprecated/outdated."
        },
        {
          "id": "AH-010",
          "rule": "DEFINITION OF DONE VERIFICATION [CRITICAL]: Setiap task harus diverifikasi sesuai kriteria `definitionOfDone` sebelum ditandai `complete`.",
          "validation": "Jalankan pengecekan lokal terhadap kriteria `definitionOfDone` task.",
          "failure_consequence": "Task dianggap selesai padahal kriteria utama belum terpenuhi."
        },
        {
          "id": "AH-011",
          "rule": "PROJECT-SPECIFIC DESIGN SKILL ROUTING [CRITICAL]: AI Agent WAJIB memeriksa `<design_data>` dan `<taste_skill>` di `.piardify/context.md` (atau `design.md`) sebelum membuat UI dan mengaktifkan Taste Skill yang sesuai.",
          "validation": "Deklarasikan 'Design Skill Active: <selected-skill-name>' di awal respon sebelum menulis komponen Frontend.",
          "failure_consequence": "AI Agent salah menggunakan gaya desain yang tidak sesuai dengan instruksi project user."
        },
        {
          "id": "AH-012",
          "rule": "CURATED REACT BITS & CLI INSTALLATION [CRITICAL]: AI Agent WAJIB menggunakan React Bits (reactbits.dev) via `npx shadcn@latest add @react-bits/<ComponentName>-TS-TW`. Komponen difilter secara ketat (misal: Aurora Background, Animated Grid, dsb). DILARANG KERAS menggunakan AI Slop: kursor mouse custom, glow neon berlebihan, efek glitch teks buram.",
          "validation": "Pastikan komponen UI kompleks diambil dari React Bits dan bukan halusinasi manual yang buruk.",
          "failure_consequence": "Desain UI terlalu kekanak-kanakan (AI Slop)."
        },
        {
          "id": "AH-013",
          "rule": "MANDATORY SKILL FOCUS & PRE-FLIGHT COMPREHENSION GATE [CRITICAL]: Sebelum menulis 1 baris kode UI, AI Agent WAJIB deklarasikan: 1) `🎨 Active Design Skill: <name>`, 2) `<skill_comprehension>` (3 prinsip eksekusi), 3) `<design_plan>` (mapping token dari design.md & math).",
          "validation": "Jangan outputkan komponen React sebelum memunculkan blok verifikasi tersebut.",
          "failure_consequence": "AI Agent membuat desain yang tidak selaras dengan instruksi proyek."
        },
        {
          "id": "AH-014",
          "rule": "ZERO-SLOP & ZERO-HALLUCINATION VISUAL QUALITY MANDATE [MANDATORY]: Setiap komponen UI WAJIB 100% mematuhi active Taste Skill dan design.md. Desain harus memukau (agency-grade). ZERO AI-slop, ZERO kontainer biru default (#0F172A), ZERO neon glows, ZERO halusinasi dependency.",
          "validation": "Evaluasi ketat setiap kode UI. Jangan gunakan style default Tailwind yang biasa dipakai AI generik.",
          "failure_consequence": "Tampilan UI terlihat murahan dan amatir."
        },
        {
          "id": "AH-015",
          "rule": "MANDATORY CONTEXT PERSISTENCE & RE-VERIFICATION GATE [CRITICAL]: AI Agent DILARANG KERAS lupa dengan konteks proyek. Sebelum mengeksekusi task APAPUN, AI Agent WAJIB memanggil `view_file` pada `.piardify/context.md` dan membaca semuanya (chunk-read jika >800 baris) untuk me-refresh 100% memori proyek.",
          "validation": "Tidak ada task yang dieksekusi tanpa bukti pemanggilan `view_file` ke context.md sebelumnya di log percakapan.",
          "failure_consequence": "AI Agent melupakan spesifikasi PRD dan token desain saat sesi chat terlalu panjang."
        },
        {
          "id": "AH-016",
          "rule": "MANDATORY CHUNK-READ FOR LARGE FILES [CRITICAL]: Saat membaca file berukuran besar (>800 baris) seperti `.piardify/context.md`, `design.md`, atau file *source code*, AI Agent WAJIB menggunakan `view_file` secara bertahap (chunk: baris 1-800, 801-1600, dst) sampai seluruh baris terbaca tuntas.",
          "validation": "Jangan pernah klaim 'sudah baca' jika tidak menggunakan argument `StartLine` dan `EndLine` untuk membaca keseluruhan file besar.",
          "failure_consequence": "AI Agent berhalusinasi atau melewati aturan kritikal karena teks terpotong oleh batasan `view_file`."
        }
      ],
      "designHierarchy": {
        "rule": "HIERARCHY OF AUTHORITY: design.md vs Taste Skill Synergy",
        "level1_ground_truth": "design.md (atau <design_data> di context.md): Menentukan WHAT to build (Warna HEX spesifik, font spesifik, dan layout wireframe project). Nilai di design.md SELALU memenangkan prioritas utama jika ada perbedaan warna/font.",
        "level2_engineering_quality": "Taste Skill: Menentukan HOW to build (Standar kualitas frontend, anti-slop, kontras WCAG AA, fisika animasi spring, ritme spacing, & anti-klise). Taste Skill digunakan untuk mengimplementasikan design.md secara estetik & presisi, BUKAN untuk menggantikan warna/font dari design.md.",
        "conflictResolution": "Jika design.md menentukan warna tertentu (misal ungu/brand khusus), AI Agent WAJIB menggunakan warna HEX tersebut dari design.md, sembari menerapkan kualitas engineering dari Taste Skill (kontras, padding, & responsivitas)."
      },
      "selfCheckPrompt": "Sebelum mengirim output, tanyakan pada diri sendiri: 'Apakah saya menggunakan warna HEX dari design.md? Apakah Taste Skill membantu kualitas engineering UI tanpa merusak token design.md? Apakah saya SUDAH mematuhi Checkpoint?'"
    },

    "codeQuality": {
      "severity": "HIGH",
      "typeScript": {
        "FORBIDDEN": [
          "Type 'any' (kecuali untuk explicit escape hatch dengan comment TODO)",
          "Type assertion yang tidak perlu (as string ketika TypeScript bisa infer)",
          "// @ts-ignore tanpa penjelasan"
        ],
        "REQUIRED": [
          "Strict typing untuk semua function parameters and return types",
          "Interface/Type untuk API response, form data, dan complex objects",
          "Enum atau union type untuk status/state yang terbatas",
          "Generic types untuk reusable components and utilities"
        ],
        "example": "```typescript\n// ❌ FORBIDDEN\nfunction handleSubmit(data: any) { ... }\n\n// ✅ REQUIRED\ninterface FormData {\n  email: string;\n  password: string;\n  rememberMe: boolean;\n}\n\nfunction handleSubmit(data: FormData): Promise<AuthResponse> { ... }\n```"
      },
      "architecture": {
        "rules": [
          "MODULARITY & FILE SIZE [CRITICAL]: Jangan biarkan satu file berisi ratusan baris kode (monolithic). Pecah UI dan logika kompleks menjadi sub-komponen kecil yang reusable, lalu gunakan Props untuk mengoper data agar mudah di-maintain.",
          "Pertahankan struktur folder yang sudah ada di proyek",
          "Komponen baru diletakkan di folder yang sesuai dengan kategorinya",
          "Naming convention: PascalCase untuk komponen, camelCase untuk utilities, UPPER_SNAKE_CASE untuk constants",
          "Satu komponen per file (kecuali tiny sub-components yang tidak reusable)",
          "Co-locate styles, types, dan tests dengan komponen jika memungkinkan"
        ]
      },
      "componentStructure": {
        "order": [
          "1. Imports",
          "2. Type definitions",
          "3. Constants",
          "4. Helper functions",
          "5. Main component",
          "6. Sub-components (jika ada)",
          "7. Export"
        ]
      }
    },

    "outputValidation": {
      "selfCheck": {
        "runBeforeOutput": true,
        "checklist": [
          "☐ Apakah saya menambah library yang tidak ada di PRD?",
          "☐ Apakah saya mengasumsikan API/database yang tidak terdokumentasi?",
          "☐ Apakah ada 'any' type yang bisa dihindari?",
          "☐ Apakah status task Piardify sudah diupdate?",
          "☐ Apakah saya sudah menjalankan perintah `npm run lint` dan `npm run build`?",
        ],
        "ifAnyFail": "Perbaiki sebelum mengirim output. Jangan compromise."
      }
    }
  }
};