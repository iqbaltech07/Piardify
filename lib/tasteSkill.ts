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

  uiUxAntiSlop: {
    severity: "CRITICAL",
    definition: "AI SLOP adalah pola desain klise yang model pakai karena pola paling sering muncul di training data, bukan karena pilihan brand yang disengaja. Sumber referensi: Impeccable Slop Catalog (46 pola), Adrian Krebs 16-Pattern Audit (1.590 halaman Show HN), dan konsensus praktisi desain 2025-2026.",
    slopPatterns: {
      FORBIDDEN: [
        "MINIMUM VIABLE SLOP (MVS): Desain yang terlalu kosong, sepi, kaku, atau membosankan (boring). AI sering mencari aman dengan membuat UI yang terlalu 'simple' (misal: hanya teks di tengah layar berlatar belakang gelap polos). WAJIB buat desain yang kaya (rich), eye-catching, dinamis, dan premium.",
        "PURPLE-BLUE GRADIENT: Gradient ungu–biru, violet–cyan, atau 'VibeCode Purple' (lavender spesifik) di mana-mana — hero, card, background, button, orbs. Ini tell #1 AI slop.",
        "GRADIENT TEXT: Teks dengan gradient warna di heading, metric, atau CTA. Gunakan solid color untuk teks.",
        "DARK MODE + NEON GLOW: Dark background + colored box-shadow glow / neon accent tanpa alasan brand yang kuat. Bukan 'cyberpunk by default'.",
        "CREAM/BEIGE DEFAULT: Latar cream atau beige 'tasteful' yang dipakai sebagai safe default tanpa konteks palette brand.",
        "GLASSMORPHISM DEFAULT: Frosted glass / blur / glass card sebagai dekorasi default di SEMUA elemen. Hanya boleh jika benar-benar perlu efek transparansi (modal di atas gambar, floating card).",
        "SIDE-TAB ACCENT BORDER: Border aksen tebal di satu sisi card yang rounded (kiri/atas). Ini tell paling recognizable dari AI-generated UI.",
        "NESTED CARDS: Card di dalam card di dalam card. Visual noise berlebihan. Gunakan spacing + divider untuk hierarki.",
        "HAIRLINE + WIDE SHADOW: 1px hairline border DIPASANG bersamaan wide diffuse shadow di komponen yang sama. Pilih satu: defined edge ATAU soft elevation.",
        "REPEATING-GRADIENT STRIPES: Decorasi permukaan pakai repeating-gradient stripes.",
        "OVER-ROUNDING BLOB: Border radius ekstrem (24px+) di elemen kecil yang jadi blob. Card max 12-16px; pill hanya untuk tag/button.",
        "FLAT TYPE HIERARCHY: Ukuran font terlalu dekat antar level. Kontras minimal 1.25x antar step.",
        "SINGLE FONT EVERYWHERE: Satu font family untuk SELURUH halaman tanpa pairing. Pair display + body.",
        "OVERUSED FONT STACK: Inter, Geist, Space Grotesk, Instrument Serif sebagai default tanpa pertimbangan brand. Jika PRD tidak specify, pilih yang tidak termasuk daftar ini.",
        "ICON TILE ABOVE HEADING: Kotak icon rounded di atas heading (template fitur-card AI universal). Coba side-by-side atau icon tanpa container.",
        "ITALIC SERIF HERO: Italic serif sebagai hero headline utama — sudah jadi klise AI-startup landing page.",
        "HERO EYEBROW/PILL: Label kecil uppercase letter-spaced ('Introducing...', 'New') langsung di atas hero H1. AI SaaS hero default.",
        "REPEATED SECTION KICKERS: Uppercase tracked labels kecil di atas SETIAP section heading. AI editorial scaffold.",
        "OVERSIZED HERO SENTENCE: Kalimat panjang full-sentence di display size yang mendominasi viewport. Perpendek atau perkecil.",
        "CRUSHED LETTER SPACING: Letter-spacing terlalu ketat sehingga huruf kehilangan bentuknya.",
        "ALL-CAPS BODY TEXT: Teks panjang dalam uppercase. Reserve untuk label pendek saja.",
        "HERO METRIC ROW: Big number + small label + 3 supporting stats + gradient accent. Template yang dipakai di mana-mana.",
        "IDENTICAL CARD GRIDS: Card sama persis (icon + heading + text) diulang tanpa variasi visual weight.",
        "MONOTONOUS SPACING: Satu nilai gap digunakan di semua tempatan tanpa ritme. Tight group untuk related items, generous separation antar section.",
        "NUMBERED SECTION MARKERS: 01/02/03 sebagai section label jika bukan sequence nyata.",
        "BADGE ABOVE HERO H1: Badge/pill tepat di atas hero H1 sebagai kombo default.",
        "COLORED CARD BORDERS: Border berwarna di top/left edge card — hampir se-reliable em-dash sebagai AI tell.",
        "STAT BANNER ROWS: Baris statistik angka besar di bawah hero tanpa konteks yang kuat.",
        "SIDEBAR/NAV EMOJI ICONS: Emoji sebagai icon navigasi/sidebar.",
        "ALL-CAPS HEADINGS: Semua heading dalam uppercase tanpa variasi.",
        "BOUNCE/ELASTIC EASING: Dialog atau card yang spring/bounce saat muncul. Gunakan ease-out-quart/quint/expo.",
        "LAYOUT PROPERTY ANIMATION: Animasi width/height/padding/margin yang memicu reflow. Gunakan transform + opacity.",
        "IMAGE HOVER TRANSFORM: Scale atau rotate gambar saat hover tanpa tujuan fungsional.",
        "EM-DASH OVERUSE: Lebih dari 2 em-dash dalam body copy. Gunakan koma, titik dua, atau kurung.",
        "MARKETING BUZZWORD: Supercharge, world-class, enterprise-grade, next-gen, streamline, empower, seamless, robust, cutting-edge, innovative, leverage.",
        "APHORISTIC CADENCE: Frasa pendek kontras berulang yang terasa kaku ('Not a feature. A platform.')",
        "THEATER FRAMING: Menyebut sesuatu sebagai 'theater' atau 'performative' secara generik.",
        "SHADCN/UI DEFAULT FINGERPRINT: Palet dan gaya CSS identik dengan shadcn/ui default tanpa customisasi brand.",
        "PLAIN RED/BLUE/GREEN: Warna plain sebagai primary tanpa brand context.",
        "NEON COLORS PRIMARY: Warna neon sebagai warna utama.",
        "RAINBOW GRADIENT: Gradient pelangi.",
        "GRADIENT FULL-PAGE BACKGROUND: Gradient sebagai background utama full-page tanpa alasan kuat.",
        "100% SYMMETRIC LAYOUT: Layout yang perfectly symmetric tanpa visual hierarchy yang jelas.",
        "CLASSIC AI HERO: Centered text + 2 buttons + abstract shape di background.",
        "TYPOGRAPHY NO CONTRAST: Semua bold atau semua regular tanpa kontras weight.",
        "SHOWY ANIMATION: Animation yang 'showy' tapi tidak fungsional (bounce berlebihan, rotate tanpa makna).",
        "EMOJI AS DECORATION: Emoji di heading atau button sebagai dekorasi visual.",
        "PLACEHOLDER TEXT: Lorem ipsum atau 'Enter your text here' di final output.",
        "OVER-ENGINEERED SKELETON: Progress bar atau skeleton yang berlebihan untuk simple content.",
        "MIXED ICON LIBRARIES: Icon dari library berbeda di satu halaman.",
        "RANDOM SPACING: Angka spacing yang tidak mengikuti grid system (13px, 17px, 23px).",
        "REDUNDANT UX WRITING: Label + sublabel + helper text + hint text semua mengatakan hal sama dengan redaksi berbeda.",
        "MODAL ABUSE: Setingan kompleks yang disesuaikan ke modal padahal butuh scroll + 3 kolom — layaknya page sendiri.",
        "CRAMPED PADDING: Padding terlalu kecil di container/button (di bawah 8px).",
        "BODY TOUCHES VIEWPORT: Teks body menyentuh tepi viewport tanpa container padding.",
        "JUSTIFIED TEXT: Text-align justify tanpa hyphens -> rivers of white.",
        "LOW CONTRAST TEXT: Teks yang gagal WCAG AA (4.5:1 body, 3:1 large text).",
        "HEADING LEVEL SKIP: h1 langsung ke h3 tanpa h2. Breaks document outline untuk screen reader.",
        "TIGHT LINE HEIGHT: Line-height di bawah 1.3x untuk multi-line text.",
        "TINY BODY TEXT: Body text di bawah 12px. Minimum 14px, ideal 16px.",
        "WIDE LETTER SPACING BODY: Letter-spacing di atas 0.05em pada body text. Reserve untuk short uppercase label.",
        "AMATEURISH HAND-DRAWN SVG: Ilustrasi SVG yang di-code manual terlihat seperti doodle, bukan whimsy.",
        "CENTERED LAYOUTS EVERYWHERE: Semua section menggunakan text-align center dan mx-auto tanpa variasi. Mix alignment — left-align body text, center hanya untuk hero singkat atau elemen spesifik yang memang pantas.",
        "MEANINGLESS ABSTRACT BLOBS: Blob atau bentuk abstrak sebagai dekorasi background tanpa tujuan desain yang jelas.",
        "DECORATIVE SEPARATORS: Menggunakan divider/line/separator dekoratif sebagai pengganti whitespace untuk memisahkan section. Gunakan whitespace.",
        "SINGLE COMPONENT PATTERN LOOP: Menggunakan satu pola komponen yang sama diulang-ulang di seluruh halaman (bukan hanya card — termasuk semua section menggunakan layout identik).",
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
        "UNRESTRICTED SCROLL LISTENERS: Dilarang menggunakan window.addEventListener('scroll') di React state. Gunakan Motion useScroll, GSAP ScrollTrigger, atau CSS scroll-driven animations."
      ],
      ALLOWED_WITH_PURPOSE: [
        "Glassmorphism: HANYA untuk elemen yang memang perlu efek transparansi (modal overlay, floating card di atas gambar).",
        "Gradient: HANYA untuk accent kecil (button hover, small badge, icon background) BUKAN background utama atau teks.",
        "Animation: HANYA untuk state transition (hover, focus, page enter) dengan durasi 150-300ms.",
        "Shadow: Gunakan layered subtle shadow untuk depth, bukan single dramatic shadow.",
        "Dark mode: Boleh jika memang design requirement, TANPA neon glow default.",
        "Numbered markers: Boleh jika section memang sequence nyata (step 1->2->3).",
        "Em-dash: Maksimal 2x dalam satu paragraf.",
        "Single font: Boleh jika PRD secara eksplisit menentukan hanya 1 font.",
        "Colored border: Boleh jika tipis (1-2px) dan konsisten, BUKAN thick accent border."
      ]
    },
    colorSystem: {
      FORBIDDEN: [
        "plain red (#FF0000, #EF4444 sebagai primary)",
        "plain blue (#0000FF, #3B82F6 sebagai primary TANPA brand context)",
        "plain green (#00FF00, #22C55E sebagai primary)",
        "neon colors sebagai primary",
        "rainbow gradient",
        "purple-to-blue / violet-to-cyan gradient sebagai default",
        "cream/beige sebagai safe default tanpa palette brand",
        "gradient text pada heading/metric/CTA"
      ],
      REQUIRED: {
        approach: "Gunakan HSL untuk mendefinisikan color palette dengan variasi:",
        structure: {
          primary: "HSL(base_hue, saturation%, lightness%)",
          primary_hover: "HSL(base_hue, saturation%, lightness% - 8%)",
          primary_subtle: "HSL(base_hue, saturation% - 40%, lightness% + 30%)",
          surface: "HSL(0, 0%, 100%) atau HSL(0, 0%, 98%)",
          surface_elevated: "HSL(0, 0%, 100%) dengan shadow",
          text_primary: "HSL(0, 0%, 10%)",
          text_secondary: "HSL(0, 0%, 45%)",
          text_muted: "HSL(0, 0%, 65%)",
          border: "HSL(0, 0%, 90%)",
          border_subtle: "HSL(0, 0%, 94%)",
          destructive: "HSL(0, 72%, 51%)",
          success: "HSL(142, 71%, 45%)",
          warning: "HSL(38, 92%, 50%)"
        },
        contrast_requirement: "WCAG AA minimum: contrast ratio 4.5:1 untuk normal text, 3:1 untuk large text",
        dark_mode_extra: "Jika dark mode: pastikan body text TIDAK medium-gray (gagal kontras). Gunakan near-white (hsl 0 0% 90%+) untuk text primary di dark background."
      },
      cssVariableExample: `\n:root {\n  --color-primary: hsl(220, 90%, 56%);\n  --color-primary-hover: hsl(220, 90%, 48%);\n  --color-primary-subtle: hsl(220, 50%, 96%);\n  --color-surface: hsl(0, 0%, 100%);\n  --color-surface-elevated: hsl(0, 0%, 100%);\n  --color-text-primary: hsl(0, 0%, 9%);\n  --color-text-secondary: hsl(0, 0%, 45%);\n  --color-text-muted: hsl(0, 0%, 64%);\n  --color-border: hsl(0, 0%, 89%);\n  --color-border-subtle: hsl(0, 0%, 94%);\n}\n`
    },
    typographySystem: {
      fontStack: {
        rule: "Pair display font (untuk heading, brand-conscious) dengan body font (highly readable). JANGAN gunakan satu font untuk semua elemen.",
        overusedAvoid: ["Inter (sebagai satu-satunya font)", "Geist (sebagai satu-satunya font)", "Space Grotesk (sebagai satu-satunya font)", "Instrument Serif (sebagai accent default)"],
        sans_example: "'Inter', system-ui, -apple-system, sans-serif",
        display_alternatives: "Pilih dari Google Fonts yang tidak termasuk daftar overused: Plus Jakarta Sans, DM Sans, Satoshi, General Sans, Söhne, Untitled Sans, dsb.",
        mono: "'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace"
      },
      scale: {
        xs: { size: "0.75rem", lineHeight: "1rem", usage: "caption, badge, timestamp" },
        sm: { size: "0.875rem", lineHeight: "1.25rem", usage: "secondary text, label, helper text" },
        base: { size: "1rem", lineHeight: "1.5rem", usage: "body text, paragraph" },
        lg: { size: "1.125rem", lineHeight: "1.75rem", usage: "lead paragraph, emphasized body" },
        xl: { size: "1.25rem", lineHeight: "1.75rem", usage: "section heading level 4" },
        "2xl": { size: "1.5rem", lineHeight: "2rem", usage: "section heading level 3, card title" },
        "3xl": { size: "1.875rem", lineHeight: "2.25rem", usage: "section heading level 2" },
        "4xl": { size: "2.25rem", lineHeight: "2.5rem", usage: "page heading, hero title" },
        "5xl": { size: "3rem", lineHeight: "1.1", usage: "display heading, landing hero" }
      },
      weight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      },
      rules: [
        "Heading SELALU menggunakan weight 600 atau 700, JANGAN 400",
        "Body text SELALU 400, JANGAN bold kecuali inline emphasis",
        "Line-height TIDAK PERNAH di bawah 1.3 untuk heading, 1.5 untuk body",
        "Letter-spacing: -0.02em untuk heading size 3xl ke atas, 0 untuk body",
        "Letter-spacing JANGAN di atas 0.05em untuk body text",
        "Letter-spacing JANGAN terlalu ketat (crushed) sehingga huruf kehilangan bentuk",
        "Body text JANGAN di bawah 12px. Minimum 14px, ideal 16px",
        "Rasio kontras ukuran antar step minimal 1.25x. JANGAN flat hierarchy.",
        "JANGAN gunakan italic serif sebagai hero headline default",
        "JANGAN gunakan all-caps untuk body text panjang",
        "JANGAN skip heading level (h1 -> h3 tanpa h2)"
      ]
    },
    spacingSystem: {
      base: "4px",
      scale: {
        "0": "0px",
        "0.5": "2px",
        "1": "4px",
        "1.5": "6px",
        "2": "8px",
        "2.5": "10px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
        "24": "96px"
      },
      rules: [
        "SELALU gunakan nilai dari scale di atas, JANGAN gunakan angka random seperti 13px, 17px, 23px",
        "Card internal padding: 16px (mobile) / 24px (desktop)",
        "Section padding: 48px (mobile) / 80px (desktop)",
        "Gap antar elemen dalam group: 8px, 12px, atau 16px - pilih satu dan konsisten dalam konteks yang sama",
        "Form field gap: 16px vertikal, 12px horizontal untuk inline fields",
        "BUAT RITME: Tight grouping (8-12px) untuk related items, generous separation (48-80px) antar section. JANGAN monotonous satu angka di semua tempat.",
        "Padding minimum di bordered/colored container: 8px, ideal 12-16px. JANGAN cramped padding.",
        "Body text JANGAN menyentuh tepi viewport. Wrap dalam container dengan minimal 16px horizontal padding."
      ]
    },
    borderRadius: {
      FORBIDDEN: "Mix radius random dalam komponen sejenis. Over-rounding (24px+) di elemen kecil.",
      scale: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
        full: "9999px"
      },
      usage: {
        button: "DEFAULT (6px) atau md (8px)",
        input: "DEFAULT (6px) atau md (8px) — SAMA dengan button",
        card: "lg (12px) atau xl (16px). MAX 16px, JANGAN blob.",
        modal: "xl (16px) atau 2xl (24px)",
        "badge/pill": "full (9999px)",
        dropdown: "md (8px)",
        avatar: "full (9999px)",
        tooltip: "md (8px)"
      },
      rule: "Dalam SATU komponen (misal form), SEMUA input dan button HARUS punya radius yang SAMA"
    },
    shadowSystem: {
      FORBIDDEN: "box-shadow tunggal yang terlalu besar, berwarna, atau neon glow. Hairline border + wide shadow secara bersamaan.",
      scale: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
        sm: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        DEFAULT: "0 2px 4px -1px rgb(0 0 0 / 0.06), 0 4px 6px -1px rgb(0 0 0 / 0.04)",
        md: "0 4px 6px -2px rgb(0 0 0 / 0.05), 0 10px 15px -3px rgb(0 0 0 / 0.05)",
        lg: "0 10px 15px -3px rgb(0 0 0 / 0.05), 0 20px 25px -5px rgb(0 0 0 / 0.05)",
        xl: "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 25px 50px -12px rgb(0 0 0 / 0.15)"
      },
      usage: {
        card_rest: "sm",
        card_hover: "md",
        dropdown: "lg",
        modal: "xl",
        button_subtle: "xs atau none",
        elevated_section: "md"
      },
      rule: "Shadow HARUS subtle dan layered, BUKAN satu shadow besar. Gunakan opacity rendah (3-15%). JANGAN colored glow."
    },
    animationSystem: {
      FORBIDDEN: [
        "Bounce effect atau elastic easing (kecuali eksplisit diminta)",
        "Rotation tanpa konteks",
        "Scale di atas 1.05 untuk hover",
        "Duration di atas 500ms untuk micro-interaction",
        "Infinite loop animation untuk elemen statis",
        "Animasi width/height/padding/margin (layout thrash) — gunakan transform + opacity",
        "Image hover scale/rotate tanpa tujuan fungsional"
      ],
      timing: {
        instant: "75ms",
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
        enter: "400ms"
      },
      easing: {
        DEFAULT: "cubic-bezier(0.4, 0, 0.2, 1)",
        enter: "cubic-bezier(0, 0, 0.2, 1)",
        exit: "cubic-bezier(0.4, 0, 1, 1)",
        FORBIDDEN: "bounce, elastic, spring — kecuali elemen yang benar-benar physical (toggle switch boleh gentle bounce)"
      },
      patterns: {
        button_hover: { property: "background-color, box-shadow", duration: "150ms" },
        card_hover: { property: "box-shadow, transform: translateY(-1px)", duration: "200ms", note: "max translateY -1px, JANGAN -4px atau lebih" },
        modal_enter: { property: "opacity, transform: scale(0.95) -> scale(1)", duration: "200ms", note: "JANGAN scale(0.8) atau bounce" },
        dropdown_open: { property: "opacity, transform: translateY(-4px) -> translateY(0)", duration: "150ms" },
        page_transition: { property: "opacity", duration: "150ms" },
        skeleton: { property: "background-position (shimmer)", duration: "2000ms", infinite: true }
      }
    },
    zIndexSystem: {
      FORBIDDEN: "Angka random seperti z-50, z-999, z-[9999]",
      scale: {
        base: 0,
        dropdown: 10,
        sticky: 20,
        fixed: 30,
        overlay_backdrop: 40,
        modal: 50,
        popover: 60,
        toast: 70,
        tooltip: 80
      },
      rule: "HANYA gunakan nilai dari scale di atas. Jika butuh layer baru, definisikan dengan nama dan nilai yang logis."
    },
    layoutAntiPatterns: {
      FORBIDDEN: [
        "Hero metric row template: big number + small label + 3 stats + gradient accent",
        "Identical card grids: card sama persis (icon + heading + text) diulang tanpa variasi",
        "Numbered section markers 01/02/03 jika bukan sequence nyata",
        "Badge/pill langsung di atas hero H1 sebagai kombo default",
        "Colored left-border atau top-border pada card (side-tab accent)",
        "Stat banner rows tanpa konteks kuat",
        "Sidebar/nav dengan emoji sebagai icon",
        "All-caps headings tanpa variasi",
        "Classic AI hero: centered text + 2 buttons + abstract shape background",
        "Copy-paste layout: hero -> metrics -> 3 feature cards -> testimonials -> pricing -> CFA tanpa variasi struktur",
        "Nested cards: card dalam card dalam card",
        "Setiap section terlihat sama — tidak ada section yang standout"
      ],
      rules: [
        "Setiap section HARUS punya tujuan visual yang berbeda, bukan salinan struktur",
        "Gunakan SATU layout primitive yang kuat dan repeat sampai jadi signature visual, bukan 7 template berbeda",
        "Jika pakai card grid, berikan VARIASI visual weight (1 card besar + 2 kecil, atau highlight card, dsb)",
        "Content yang butuh scroll + 3 kolom di modal -> pindahkan ke page sendiri, bukan modal abuse"
      ]
    },
    copyAntiPatterns: {
      FORBIDDEN: [
        "Marketing buzzword: supercharge, world-class, enterprise-grade, next-gen, streamline, empower, seamless, robust, cutting-edge, innovative, leverage",
        "Em-dash lebih dari 2x dalam satu paragraf",
        "Aphoristic cadence berulang: 'Not a feature. A platform.', 'Built for speed. Designed for scale.'",
        "Theater framing: 'We killed the growth theater', 'Stop the performance'",
        "Redundant UX writing: label + sublabel + helper + hint semua mengatakan hal sama",
        "Vague aspirational headline: 'Build the future', 'Unlock your potential', 'Transform your workflow'",
        "Lorem ipsum atau 'Enter your text here' di final output"
      ],
      rules: [
        "Tulis APA yang produk benar-benar lakukan, bukan buzzword",
        "Satu kalimat, satu makna. Jangan redundansi",
        "Heading harus spesifik, bukan generik"
      ]
    },
    visualHierarchy: {
      rules: [
        "Setiap section HARUS punya satu focal point yang jelas — elemen yang paling pertama menarik perhatian saat user scroll ke section tersebut.",
        "Gunakan whitespace sebagai pemisah antar section, BUKAN decorative divider/line/separator.",
        "Vary ukuran komponen antar section untuk menciptakan ritme visual. Jangan semua section sama besar dan sama padat.",
        "Heading HARUS mengkomunikasikan value secara langsung dan spesifik. User harus tahu apa yang akan didapat dalam 2 detik membaca heading."
      ]
    },
    componentVariety: {
      rule: "Jangan gunakan satu pola komponen yang sama diulang-ulang di seluruh halaman. Pilih pola yang paling cocok untuk jenis konten:",
      availablePatterns: [
        "cards (untuk fitur yang setara)",
        "timelines (untuk proses/chronology)",
        "comparison tables (untuk perbandingan pakah/fitur)",
        "dashboards (untuk data/metrics yang real-time)",
        "expandable/accordion sections (untuk FAQ atau detail yang bisa dilipat)",
        "tabs (untuk konten yang kategorinya setara)",
        "callouts/alerts (untuk peringatan, tips, atau highlight penting)",
        "feature highlights (untuk 1-2 fitur utama dengan detail mendalam)",
        "testimonials (untuk social proof)",
        "screenshots (untuk menunjukkan produk nyata)",
        "interactive previews (untuk demo langsung di halaman)"
      ],
      guideline: "Halaman yang baik memilih 3-5 pola berbeda yang masing-masing cocok dengan kontennya, bukan 1 pola yang diulang 8 kali."
    },
    authenticProductFeel: {
      rules: [
        "Halaman harus terasa seperti produk nyata yang dibangun oleh startup, bukan template demo. Sertakan navigasi yang realistis, konten yang believable.",
        "Jika menggunakan statistik/angka, gunakan angka yang masuk akal dan realistis untuk ukuran produk — bukan '10M+ users' untuk produk yang baru launch.",
        "Setiap interaksi (klik, hover, toggle) HARUS punya tujuan fungsional. Jangan tambahkan interaksi hanya untuk terlihat 'interaktif'."
      ]
    },
    designPhilosophy: {
      principle: "Setiap halaman harus terasa handcrafted oleh senior product designer, bukan generated oleh AI. Desain HARUS wow, eye-catching, modern, tidak kaku, dan tidak boleh terasa kosong/terlalu simple.",
      check: [
        "Apakah desain ini terasa kaya (rich) dan premium?",
        "Apakah spacing ini terlihat intentional?",
        "Apakah typography ini terlihat intentional?",
        "Apakah color ini terlihat intentional?",
        "Apakah animation ini terlihat intentional?",
        "Apakah composition keseluruhan terlihat intentional?"
      ],
      rule: "Jika jawaban 'ini terlihat generated' muncul di salah satu aspek di atas, ulangi desain bagian tersebut."
    },
    stateHandling: {
      required: [
        {
          state: "loading",
          description: "Tampilkan skeleton atau spinner yang match dengan final content shape",
          rule: "Skeleton HARUS punya dimensi yang sama dengan konten yang akan load. JANGAN gunakan spinner untuk content-heavy area. JANGAN over-engineer skeleton untuk simple content."
        },
        {
          state: "empty",
          description: "Tampilkan meaningful empty state dengan ilustrasi/icon + penjelasan + CTA jika applicable",
          rule: "JANGAN biarkan area kosong tanpa penjelasan. Empty state = UX moment."
        },
        {
          state: "error",
          description: "Tampilkan error message yang jelas + recovery action",
          rule: "Error message HARUS menjelaskan WHAT happened dan WHAT user can do. JANGAN hanya 'Something went wrong'."
        },
        {
          state: "success",
          description: "Tampilkan konfirmasi visual yang subtle tapi clear",
          rule: "Success feedback = toast atau inline message, JANGAN modal kecuali memerlukan next action."
        }
      ]
    },
    accessibility: {
      minimum: [
        "Semua interactive element HARUS reachable via keyboard (Tab, Enter, Escape, Arrow keys)",
        "Semua image HARUS punya alt text yang meaningful (bukan 'image' atau 'photo')",
        "Semua form input HARUS punya label yang terasosiasi",
        "Focus indicator HARUS visible (outline atau ring)",
        "Color TIDAK BOLEH menjadi satu-satunya cara menyampaikan informasi",
        "Touch target minimum 44x44px untuk mobile",
        "Heading level JANGAN skip (h1 -> h3 tanpa h2)",
        "Text-align justify JANGAN dipakai tanpa hyphens: auto",
        "Line width maksimal ~75ch untuk text container"
      ],
      focusStyle: {
        FORBIDDEN: "outline: none tanpa replacement",
        RECOMMENDED: "outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: inherit;"
      }
    },
    iconGuidelines: {
      FORBIDDEN: [
        "Mix icon library dalam satu halaman",
        "Icon dengan stroke-width berbeda dalam satu komponen",
        "Icon yang terlalu detail/complex untuk small size",
        "Icon tanpa semantic meaning (decoration only tanpa value)",
        "Emoji sebagai icon navigasi/sidebar",
        "Massive icon containers (lebih besar dari content yang diperkenalkan)",
        "Icon tile kotak rounded di atas heading (AI feature card template)"
      ],
      rules: [
        "Gunakan SATU icon library saja per proyek (Lucide, Phosphor, atau Heroicons — sesuai PRD)",
        "Stroke-width: 1.5px (default) untuk semua icon, 2px untuk yang perlu lebih bold",
        "Size: 16px (inline), 20px (default), 24px (standalone), 32px+ (feature icon)",
        "Icon yang berfungsi sebagai button HARUS punya aria-label",
        "Color icon: inherit dari parent text color, atau gunakan text-muted untuk secondary"
      ]
    },
    responsiveBreakpoints: {
      FORBIDDEN: "Breakpoint random yang tidak mengikuti standar",
      scale: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px"
      },
      mobileFirst: true,
      rules: [
        "Tulis CSS mobile-first: base styles = mobile, media query min-width untuk larger",
        "Navigation: hamburger menu di mobile, horizontal nav di desktop (kecuali PRD specify lain)",
        "Table: horizontal scroll di mobile, full width di desktop",
        "Modal: full-screen atau bottom sheet di mobile, centered dialog di desktop",
        "Grid: single column mobile, multi-column desktop sesuai konteks",
        "Buttons, cards, tables, dan code blocks TIDAK PERNAH boleh overflow horizontal di mobile. Gunakan overflow-x-auto, max-w-full, atau layout yang wrap secara natural.",
        "Typography HARUS scale secara proporsional di setiap breakpoint. Heading 4xl/5xl di desktop harus turun ke 2xl/3xl di mobile. Jangan biarkan heading besar pecah layout di layar kecil."
      ]
    },
    imageryRules: {
      FORBIDDEN: [
        "<img> dengan src kosong, missing, atau placeholder value — akan ship sebagai broken-image box",
        "AI-generated hero illustration yang terlihat generik",
        "Stock photo yang terlihat seperti stock photo"
      ],
      rules: [
        "Gunakan real image, generated asset yang berkualitas, atau hapus tag img jika tidak ada asset",
        "JANGAN scale/rotate image pada hover"
      ]
    }
  },

  outputValidation: {
    selfCheck: {
      runBeforeOutput: true,
      checklist: [
        "☐ Apakah ada purple-blue gradient, gradient text, atau VibeCode Purple?",
        "☐ Apakah ada dark mode + neon glow tanpa alasan brand?",
        "☐ Apakah ada glassmorphism di elemen yang tidak perlu?",
        "☐ Apakah ada side-tab accent border (tebal satu sisi) di card?",
        "☐ Apakah ada nested cards (card dalam card)?",
        "☐ Apakah ada hairline border + wide shadow bersamaan?",
        "☐ Apakah ada icon tile kotak di atas heading?",
        "☐ Apakah ada hero eyebrow/pill chip di atas H1?",
        "☐ Apakah ada repeated section kickers (uppercase label di tiap section)?",
        "☐ Apakah ada hero metric row template?",
        "☐ Apakah ada identical card grids tanpa variasi?",
        "☐ Apakah ada numbered section markers 01/02/03 yang bukan sequence?",
        "☐ Apakah ada badge langsung di atas hero H1?",
        "☐ Apakah spacing monotonous (satu angka di semua tempat)?",
        "☐ Apakah ada bounce/elastic easing?",
        "☐ Apakah ada image hover scale/rotate?",
        "☐ Apakah ada layout property animation (width/height)?",
        "☐ Apakah ada marketing buzzword di copy?",
        "☐ Apakah ada em-dash lebih dari 2x dalam satu paragraf?",
        "☐ Apakah ada aphoristic cadence berulang?",
        "☐ Apakah ada redundant UX writing?",
        "☐ Apakah ada modal abuse?",
        "☐ Apakah ada cramped padding?",
        "☐ Apakah body text menyentuh viewport edge?",
        "☐ Apakah ada justified text tanpa hyphens?",
        "☐ Apakah ada low contrast text?",
        "☐ Apakah ada heading level skip?",
        "☐ Apakah ada tight line height atau tiny body text?",
        "☐ Apakah ada wide letter spacing pada body?",
        "☐ Apakah ada broken/placeholder image?",
        "☐ Apakah ada amateurish hand-drawn SVG?",
        "☐ Apakah hanya 1 font tanpa pairing?",
        "☐ Apakah font termasuk overused stack tanpa alasan?",
        "☐ Apakah ada flat type hierarchy?",
        "☐ Apakah ada italic serif hero?",
        "☐ Apakah ada all-caps body text?",
        "☐ Apakah ada emoji sebagai icon nav/dekorasi?",
        "☐ Apakah ada shadcn/ui default fingerprint tanpa custom?",
        "☐ Apakah warna mengikuti CSS variable system?",
        "☐ Apakah spacing mengikuti 4px grid?",
        "☐ Apakah border-radius konsisten untuk komponen sejenis?",
        "☐ Apakah shadow subtle dan layered (bukan colored glow)?",
        "☐ Apakah ada loading/empty/error state untuk setiap data display?",
        "☐ Apakah semua interactive element keyboard-accessible?",
        "☐ Apakah ada centered layout di semua section tanpa variasi alignment?",
        "☐ Apakah ada abstract blob dekoratif tanpa tujuan?",
        "☐ Apakah ada decorative separator menggantikan whitespace?",
        "☐ Apakah satu pola komponen diulang di seluruh halaman?",
        "☐ Apakah setiap section punya focal point yang jelas?",
        "☐ Apakah ada elemen yang terlihat 'generated' bukan 'intentional'?",
        "☐ Apakah ada elemen yang overflow horizontal di mobile?",
        "☐ Apakah typography tidak scale dengan proporsional di mobile?"
      ],
      ifAnyFail: "Perbaiki sebelum mengirim output. Jangan compromise."
    }
  },

  examples: {
    slopVsGood: {
      card_slop: `\n// ❌ AI SLOP: Side-tab border + glassmorphism + over-rounded\n<div className='bg-white/30 backdrop-blur-xl rounded-3xl shadow-2xl border-l-4 border-purple-500 p-6 hover:scale-105 transition-all duration-500'>\n  <div className='rounded-xl bg-purple-500/10 p-3 mb-3'>\n    <Icon className='w-6 h-6 text-purple-500' />\n  </div>\n  <h3 className='text-lg font-semibold'>Feature</h3>\n</div>\n`,
      card_good: `\n// ✅ GOOD: Subtle shadow, consistent radius, no accent border, icon inline\n<div className='bg-surface rounded-lg shadow-sm border border-border p-4 md:p-6 hover:shadow-md hover:-translate-y-px transition-shadow duration-200'>\n  <div className='flex items-center gap-3 mb-2'>\n    <Icon className='w-5 h-5 text-primary' />\n    <h3 className='text-base font-semibold'>Feature</h3>\n  </div>\n  <p className='text-sm text-secondary'>Description</p>\n</div>\n`,
      hero_slop: `\n// ❌ AI SLOP: Eyebrow pill + gradient text + metric row + abstract shape\n<section className='relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400'>\n  <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]' />\n  <span className='inline-block px-3 py-1 rounded-full bg-white/20 text-xs uppercase tracking-widest mb-4'>Introducing</span>\n  <h1 className='text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent'>Build the Future of Work</h1>\n  <div className='flex gap-8 mt-8'>\n    <div><span className='text-4xl font-bold'>10M+</span><p className='text-white/60 text-sm'>Active Users</p></div>\n    <div><span className='text-4xl font-bold'>99.9%</span><p className='text-white/60 text-sm'>Uptime</p></div>\n    <div><span className='text-4xl font-bold'>200ms</span><p className='text-white/60 text-sm'>p50 Latency</p></div>\n  </div>\n</section>\n`,
      hero_good: `\n// ✅ GOOD: Solid bg, no eyebrow, solid text, no metric row, clear hierarchy\n<section className='bg-surface border-b border-border'>\n  <div className='max-w-3xl mx-auto px-4 py-16 md:py-24'>\n    <h1 className='text-3xl md:text-4xl font-bold text-primary tracking-tight'>Project management for fast-moving teams</h1>\n    <p className='mt-4 text-lg text-secondary max-w-xl'>Ship features faster with less chaos. Real-time sync, built-in CI, and the workflows your team actually uses.</p>\n    <div className='mt-8 flex gap-3'>\n      <button className='bg-primary text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors duration-150'>Get started</button>\n      <button className='border border-border rounded-md px-4 py-2 text-sm font-medium hover:bg-surface-elevated transition-colors duration-150'>View demo</button>\n    </div>\n  </div>\n</section>\n`,
      button_slop: `\n// ❌ AI SLOP: Gradient, bounce, excessive glow, pill shape everywhere\n<button className='bg-gradient-to-r from-purple-500 to-blue-600 rounded-full px-8 py-4 text-white font-bold hover:scale-110 hover:shadow-purple-500/50 shadow-lg transition-all duration-500 animate-pulse'>\n  🚀 Supercharge Your Workflow\n</button>\n`,
      button_good: `\n// ✅ GOOD: Solid color, subtle hover, consistent radius, no emoji, no buzzword\n<button className='bg-primary text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-primary-hover transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>\n  Start free trial\n</button>\n`,
      section_slop: `\n// ❌ AI SLOP: Repeated kicker + numbered markers + identical cards\n<section>\n  <p className='text-xs uppercase tracking-widest text-purple-500 mb-2'>01 — Features</p>\n  <h2>What You Get</h2>\n  <div className='grid grid-cols-3 gap-6'>\n    {[1,2,3].map(i => (\n      <div className='border-l-4 border-purple-500 rounded-xl p-6'>\n        <div className='rounded-lg bg-purple-50 p-3 w-fit mb-4'><Icon /></div>\n        <h3>Feature {i}</h3>\n        <p>Description</p>\n      </div>\n    ))}\n  </div>\n</section>\n`,
      section_good: `\n// ✅ GOOD: No kicker, no numbers, varied card layout, no accent border\n<section>\n  <h2 className='text-2xl font-bold'>Features</h2>\n  <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-4'>\n    <div className='bg-surface rounded-lg border border-border p-6 md:row-span-2'>\n      <Icon className='w-5 h-5 text-primary mb-3' />\n      <h3 className='font-semibold'>Feature one</h3>\n      <p className='text-sm text-secondary mt-1'>Detailed description for the primary feature that gets more space.</p>\n    </div>\n    <div className='bg-surface rounded-lg border border-border p-6'>\n      <Icon className='w-5 h-5 text-primary mb-3' />\n      <h3 className='font-semibold'>Feature two</h3>\n      <p className='text-sm text-secondary mt-1'>Brief description.</p>\n    </div>\n    <div className='bg-surface rounded-lg border border-border p-6'>\n      <Icon className='w-5 h-5 text-primary mb-3' />\n      <h3 className='font-semibold'>Feature three</h3>\n      <p className='text-sm text-secondary mt-1'>Brief description.</p>\n    </div>\n  </div>\n</section>\n`,
      darkmode_slop: `\n/* ❌ AI SLOP: Dark + neon glow + medium gray text (fails contrast) */\nbackground: hsl(240, 10%, 8%);\ncolor: hsl(0, 0%, 55%); /* ~3:1 contrast — fails WCAG AA */\nbox-shadow: 0 0 30px hsl(270, 80%, 60%); /* purple neon glow */\nborder: 1px solid hsl(270, 50%, 30%);\n`,
      darkmode_good: `\n/* ✅ GOOD: Dark + subtle elevation + high contrast text */\nbackground: hsl(240, 10%, 8%);\ncolor: hsl(0, 0%, 92%); /* ~14:1 contrast — passes AAA */\nbox-shadow: 0 1px 3px rgb(0 0 0 / 0.3);\nborder: 1px solid hsl(0, 0%, 18%);\n`,
      copy_slop: `\n<!-- ❌ AI SLOP: Buzzword + em-dash + aphoristic cadence -->\n<h1>Supercharge Your Workflow — World-Class Tools for Enterprise-Grade Teams</h1>\n<p>Not a feature. A platform. Built for speed — designed for scale — engineered for impact.</p>\n`,
      copy_good: `\n<!-- ✅ GOOD: Specific, no buzzword, direct -->\n<h1>Ship deploys in under 30 seconds</h1>\n<p>Push to main and your changes are live. Zero config, no migration scripts, no downtime.</p>\n`,
      variety_slop: `\n// ❌ AI SLOP: Same card pattern repeated 6 times\n{sections.map(s => (\n  <div className='bg-white rounded-xl border p-6'>\n    <Icon className='mb-3' /><h3>{s.title}</h3><p>{s.desc}</p>\n  </div>\n))}\n`,
      variety_good: `\n// ✅ GOOD: Different component patterns for different content types\n{/* Feature highlight with screenshot */}\n<div className='grid md:grid-cols-2 gap-8'>\n  <div><h3>Real-time sync</h3><p>...</p></div>\n  <img src='screenshot.png' className='rounded-lg border' />\n</div>\n{/* Comparison table */}\n<table><thead>...</thead><tbody>...</tbody></table>\n{/* Testimonial */}\n<blockquote className='border-l-2 border-primary pl-4'>"..."</blockquote>\n`,
      centered_slop: `\n// ❌ AI SLOP: Every section centered\n<section className='text-center'>\n  <h2>Features</h2>\n  <p className='mx-auto max-w-2xl'>...</p>\n</section>\n<section className='text-center'>\n  <h2>Pricing</h2>\n  <p className='mx-auto max-w-2xl'>...</p>\n</section>\n`,
      centered_good: `\n// ✅ GOOD: Mixed alignment — hero centered, features left-aligned\n<section className='text-center'>\n  <h1>Short punchy hero</h1>\n</section>\n<section className='max-w-4xl'>\n  <h2 className='text-left'>Features</h2>\n  <p className='text-left'>Detailed explanation that's easier to read left-aligned...</p>\n</section>\n`
    }
  }
};
