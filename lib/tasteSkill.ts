export const TASTE_SKILL_DIRECTIVES = {
  name: "taste-skill-v2",
  version: "2.0.0-experimental",
  description: "Taste Skill v2 — Anti-Slop Frontend Engineering Framework for AI Coding Agents",
  
  briefInference: {
    rule: "Sebelum menulis kode UI, analisa konteks produk & deklarasikan satu arah desain yang eksplisit (misal: Minimalist Editorial, High-Density Technical SaaS, Swiss Brutalist, Soft Calming Workspace, atau Warm Industrial).",
    forbiddenDefaults: "Dilarang keras memakai safe default otomatis (misal: background ungu-cyan gradient + 3 card simetris + hero centered)."
  },

  designLocks: {
    colorConsistencyLock: "Gunakan 1 sistem warna aksen utama untuk seluruh halaman. Komponen di section 5 tidak boleh mendadak memakai warna aksen yang berbeda.",
    shapeConsistencyLock: "Gunakan 1 sistem corner-radius konsisten per halaman (misal: 4px sharp, 8-12px soft, atau 16px rounded).",
    pageThemeLock: "Tetapkan tema (light atau dark mode) pada root halaman. Dilarang membalik tema secara acak di tengah section."
  },

  heroDiscipline: {
    headline: "Maksimal 2 baris pada tampilan desktop dengan value proposition yang spesifik.",
    subtext: "Maksimal 20 kata / 4 baris.",
    primaryCTA: "Wajib terlihat langsung tanpa perlu scroll (above the fold).",
    navigation: "Tinggi navbar maksimal 80px, single-line pada desktop."
  },

  antiSlopBans: [
    "EM-DASH & EN-DASH OVERUSE: Dilarang memakai '—' atau '–' pada headline, eyebrow, body text, button, maupun alt text. Gunakan hyphen atau susun kalimat secara alami.",
    "SECTION-NUMBERING EYEBROWS: Dilarang memakai label '00 / INDEX', '01 · Features', atau '06 · how it works'. Sebutkan topik section dengan bahasa langsung.",
    "HERO VERSION LABELS: Dilarang menempatkan badge 'v0.6', 'BETA', atau 'INVITE-ONLY' langsung di atas H1 hero kecuali jika produk memang sedang launch.",
    "HERO DECORATION TEXT STRIPS: Dilarang menempatkan strip teks mono uppercase seperti 'BRAND. MOTION. SPATIAL.' di bagian bawah hero.",
    "PILLS OVERLAID ON IMAGES: Dilarang menaruh badge/pill melayang di atas foto/ilustrasi. Tempatkan caption di bawah gambar.",
    "VERSION FOOTERS ON MARKETING PAGES: Dilarang menampilkan 'v1.4.2' atau 'Build 0048' pada landing page pemasaran.",
    "LOCALE, CITY & WEATHER STRIPS: Dilarang memasukkan baris 'Lisbon 14:23 · 18°C' yang tidak relevan dengan fungsionalitas produk.",
    "SCROLL CUES: Dilarang menaruh teks 'Scroll to explore' atau icon panah bawah.",
    "DECORATIVE STATUS DOTS: Maksimal 1 dot per section dan HANYA untuk menunjukkan status nyata (contoh: status server active).",
    "BORDER-T PLUS BORDER-B ON EVERY ROW: Dilarang pada list panjang/tabel spesifikasi. Gunakan card, tab, marquee, atau carousel.",
    "DIV-BASED FAKE PRODUCT UI: Dilarang membuat fake terminal, fake task list, atau fake dashboard menggunakan div polos. Gunakan screenshot nyata atau komponen UI asli.",
    "THREE-EQUAL-CARD FEATURE ROWS: Dilarang menjadikan 3 card simetris sebagai layout default. Gunakan 2-column layout, bento grid asimetris, atau preview interaktif.",
    "AI-PURPLE & MESH BLOB GRADIENTS: Dilarang menggunakan background gradient ungu-biru atau blob abstrak tanpa tujuan brand.",
    "HAND-ROLLED DECORATIVE SVG ILLUSTRATIONS: Dilarang ilustrasi SVG manual bergaya doodle. Gunakan icon profesional atau visual nyata.",
    "UNRESTRICTED SCROLL LISTENERS: Dilarang menggunakan window.addEventListener('scroll') di React state. Gunakan Motion useScroll, GSAP ScrollTrigger, atau CSS scroll-driven animations."
  ],

  componentVariety: {
    rule: "Pilih pola komponen yang bervariasi sesuai jenis konten:",
    patterns: [
      "Feature Highlights (Split 2-kolom dengan screenshot/preview)",
      "Comparison Tables (Tabel perbandingan fitur/harga)",
      "Process Timelines (Langkah berurutan horizontal/vertikal)",
      "Interactive Dashboards / Previews",
      "Accordions / Expandable Sections (FAQ / Detail)",
      "Tabs (Kategori setara)",
      "Social Proof (Testimonial / Grid logo mitra)"
    ]
  },

  preFlightChecklist: [
    "☐ Apakah ada em-dash di copy output?",
    "☐ Apakah layout antar section bervariasi (tidak semua centered / 3-card grid)?",
    "☐ Apakah warna aksen konsisten di seluruh section?",
    "☐ Apakah typography scale dengan proporsional di mobile tanpa horizontal overflow?",
    "☐ Apakah spacing dan visual hierarchy terlihat intentional?"
  ]
};
