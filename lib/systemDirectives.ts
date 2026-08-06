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
          "rule": "ENVIRONMENT VARIABLES [CRITICAL]: Jika proyek diperkirakan membutuhkan token, API key, koneksi database, atau rahasia lainnya, WAJIB membuat file `.env.example` atau menginstruksikan pembuatan `.env`. Jangan pernah menaruh kredensial (hardcode) langsung di dalam source code.",
          "validation": "Pastikan semua variabel sensitif menggunakan `process.env.NAMA_VARIABEL` dan terdokumentasi di file contoh `.env`.",
          "failure_consequence": "Kebocoran data sensitif (security vulnerability) jika source code terpublikasi."
        },
        {
          "id": "AH-007",
          "rule": "STRICT MCP COMPLIANCE [ABSOLUTE]: AI dilarang keras melanggar atau mengabaikan satu pun aturan yang telah disediakan oleh instruksi MCP (termasuk System Directives dan Taste Skill). Aturan-aturan ini bersifat mutlak (hukum tertinggi) yang menganulir semua knowledge atau kebiasaan default AI.",
          "validation": "Setiap tindakan harus selaras dengan direktif yang diterima dari MCP server.",
          "failure_consequence": "AI kehilangan arah, melanggar arsitektur standar proyek, dan memberikan output sampah (AI Slop)."
        },
        {
          "id": "AH-008",
          "rule": "LOCAL CI/CD GATE [CRITICAL]: AI WAJIB menjalankan perintah `npm run lint` dan (jika relevan) `npm run build` di terminal lokalnya sendiri, lalu membaca outputnya, sebelum berani memanggil tool MCP untuk update status task menjadi 'done'.",
          "validation": "Pastikan tidak ada error ESLint atau build error yang tersisa sebelum menyelesaikan task.",
          "failure_consequence": "Broken build, CI/CD pipeline gagal di produksi, dan kode yang tidak bisa di-compile."
        },
        {
          "id": "AH-009",
          "rule": "AST & DEPENDENCY CHECK [CRITICAL]: DILARANG KERAS menghapus, mengganti nama, atau memodifikasi sebuah komponen/fungsi yang di-export tanpa menjalankan tool pencarian lokal (seperti `grep_search`) terlebih dahulu untuk melacak SEMUA file yang bergantung padanya.",
          "validation": "Selalu lakukan pencarian menyeluruh (cross-file reference check) sebelum melakukan refactor atau perubahan argumen Props.",
          "failure_consequence": "Dependency terputus (broken import), halaman lain menjadi blank atau error tanpa disadari."
        },
        {
          "id": "AH-010",
          "rule": "PIARDIFY BLACKBOX [CRITICAL]: Mengeksplorasi folder proyek target sangat disarankan, TETAPI jika Anda melihat folder bernama `piardify` atau *source code* dari Piardify MCP itu sendiri di lokal komputer pengguna, DILARANG KERAS melakukan `list_dir`, `read_file`, atau menganalisis isinya. SEMUA tasks, instruksi, dan aturan PURE (100%) didapatkan dari pemanggilan tool MCP Piardify, BUKAN dari membaca folder lokal piardify. Piardify adalah mesin server, bukan subjek tugas Anda.",
          "validation": "Pastikan direktori yang sedang Anda eksplorasi dan kerjakan BUKAN folder `piardify`. Ambil aturan murni dari tool MCP.",
          "failure_consequence": "AI membuang waktu dan token (context limits) menganalisis server MCP alih-alih mengerjakan proyek target pengguna."
        },
        {
          "id": "AH-011",
          "rule": "ATOMIC SEQUENTIAL EXECUTION [CRITICAL]: Setiap task dan komponen WAJIB dipecah dan dikerjakan 1 per 1 secara atomik (misal: per-section UI). AI dilarang keras mengerjakan banyak task sekaligus dalam satu langkah atau melompati update status Kanban Board.",
          "validation": "Fokus pada 1 task spesifik, selesaikan & verifikasi, lalu update status Kanban di MCP sebelum pindah ke task berikutnya.",
          "failure_consequence": "Halusinasi AI, kode tidak lengkap, serta desinkronisasi status Kanban."
        }
      ],
      "selfCheckPrompt": "Sebelum mengirim output, tanyakan pada diri sendiri: 'Apakah saya mengasumsikan sesuatu? Apakah saya sudah menanyakan preferensi Design System? Apakah ada rahasia yang perlu dimasukkan ke .env? Apakah saya SUDAH menjalankan linter lokal? Apakah saya SUDAH mengecek dependensi sebelum mengubah komponen? Apakah saya mengeksplorasi folder Piardify (yang dilarang)? Dan apakah tindakan saya MELANGGAR instruksi ketat dari MCP ini?'"
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