# Proposal Improvement: Piardify CLI & Context Architecture for AI Agents

**Dokumen Analisis Evaluasi & Rekomendasi Fitur Piardify**  
*Tanggal: 12 Agustus 2026*  
*Topik: Mencegah AI Agent Ovisi / Halusinasi Warna & Aturan Desain pada File Konteks Ukuran Besar*

---

## 1. Latar Belakang & Root Cause Analysis (RCA)

Saat bertindak sebagai AI Coding Assistant (seperti Antigravity, Claude, atau GPT-4o), agen membaca file konteks `.piardify/context.md` yang dihasilkan otomatis oleh CLI Piardify. File ini menyatukan **PRD, User Stories, ERD Database, Task Board, dan Design System Tokens** ke dalam 1 file raksasa (seringkali >80-100 KB / >1.000 baris).

### Masalah Utama (*Penyebab AI Melakukan Kesalahan*):
1. **Context Truncation / Bottom Omission**: Token warna resmi (`accent-primary: #F2994A`, `bg-dark: #111111`) dan *Design Locks* diletakkan di **bagian paling bawah file** (`<design_data>` di baris 980+). AI Agent yang membaca file panjang cenderung fokus pada 200 baris awal (PRD/Fitur) dan melewatkan bagian bawah, sehingga melakukan *fallback* ke warna bawaan (seperti `blue-600` / `slate-950`).
2. **Kurangnya Alat Verifikasi Otomatis**: AI Agent tidak memiliki cara cepat untuk menguji apakah class Tailwind yang digunakan sudah 100% patuh pada token Piardify tanpa menjalankan pemeriksaan manual.
3. **Ketidakjelasan Aturan Format Nominal Besar**: Pada UI finansial ber-density tinggi, nominal angka IDR yang panjang (misal: `Rp 13.950.000`) meluap (*overflow/clipping*) pada kartu grid 4 kolom jika tidak ada instruksi eksplisit untuk menggunakan satuan ringkas (`Jt`/`M`/`Rb`).

---

## 2. 8 Pilar Rekomendasi Solusi Komprehensif untuk Piardify

### 📌 Solusi 1: Top-of-File Pinning (`<critical_design_locks>`)
**Konsep**: Meletakkan instruksi warna & aturan terlarang yang paling krusial pada **30 baris pertama** file `.piardify/context.md`.

```markdown
<!-- .piardify/context.md (BARIS 1 - 30) -->
<critical_design_locks>
  PRIMARY_ACCENT: "#F2994A" (Warm Amber/Orange)
  PRIMARY_ACCENT_HOVER: "#E88632"
  BG_DARK: "#111111" (Matte Obsidian Charcoal)
  BG_SURFACE: "#1A1A1A"
  BORDER_SUBTLE: "#2A2A2A"
  SEMANTIC_INCOME: "#2F9E67" (Green)
  SEMANTIC_EXPENSE: "#D95757" (Red)
  SEMANTIC_DEBT: "#D99A2B" (Gold)
  FORBIDDEN_CLASSES: ["bg-slate-900", "bg-slate-950", "bg-blue-600", "text-blue-500", "purple-gradients"]
  CURRENCY_COMPACT_RULE: "For grid cards < 300px, use compact Indonesian units (e.g. Rp 13,95 Jt) with full tooltips."
</critical_design_locks>
```
> **Manfaat**: AI Agent akan langsung membaca token warna utama di awal *prompt context* tanpa risiko terpotong.

---

### 🛠️ Solusi 2: Fitur CLI Linter / Validator (`npx piardify validate-ui`)
**Konsep**: Menambahkan perintah CLI bawaan pada Piardify yang dapat dipanggil oleh AI Agent untuk memverifikasi kepatuhan UI secara otomatis.

```bash
npx piardify validate-ui
```

#### Output Linter yang Diharapkan:
```text
🔍 Piardify Design System Linter v1.2.0

❌ ERROR: Found 2 forbidden color classes in components/app-shell.tsx
   - Line 17: "bg-slate-950" -> Replace with "bg-[var(--background)]" (#111111)

❌ ERROR: Found 1 un-truncated large currency nominal in components/summary-cards.tsx
   - Line 24: "formatMoney(totalBalance)" -> Use "formatCompactMoney(totalBalance)"

FAILED: 3 design lock violations found. Please fix before build.
```

---

### 📂 Solusi 3: Arsitektur File Konteks Terpisah (*Modular Context Architecture*)
**Konsep**: Memecah file `.piardify/context.md` tunggal menjadi beberapa file modular yang mudah di-parse oleh LLM.

```text
.piardify/
├── tokens.json            # Token HEX/HSL machine-readable murni
├── anti_slop_rules.md     # Aturan visual & larangan desain
├── prd_summary.md         # Ringkasan fitur & alur user
└── task_board.json        # Status pengerjaan task
```

---

### 💡 Solusi 4: Panduan Format Nominal Finansial Ringkas (*Compact Currency Directives*)
**Konsep**: Menambahkan instruksi eksplisit pada `design_data` mengenai penanganan nominal mata uang bernilai besar pada komponen UI ber-density tinggi.

- `IDR >= 1.000.000.000` $\rightarrow$ `Rp X,XX M` (Miliar)
- `IDR >= 1.000.000` $\rightarrow$ `Rp X,XX Jt` (Juta) *(misal: Rp 13,95 Jt)*
- `IDR >= 100.000` $\rightarrow$ `Rp XXX Rb` (Ribu)

---

### ⚙️ Solusi 5: Auto-Generated Tailwind Preset / CSS Theme Boilerplate (`npx piardify init-theme`)
**Konsep**: Saat pengguna menjalankan `npx piardify project context`, CLI Piardify secara otomatis menginjeksikan preset Tailwind atau variabel CSS (`piardify.preset.js` / `globals.css`) langsung ke proyek pengguna.

#### Contoh Class Semantic Tailwind:
- `bg-piardify-dark` (`#111111`)
- `bg-piardify-surface` (`#1A1A1A`)
- `text-piardify-primary` (`#F2994A`)
- `border-piardify-subtle` (`#2A2A2A`)

> **Manfaat**: AI Agent tidak perlu lagi menulis angka HEX manual (`bg-[#111111]`), melainkan cukup memanggil class Tailwind resmi yang sudah pasti terkonfigurasi.

---

### 🪝 Solusi 6: Automated Pre-Commit / Build Hook Integration (`npx piardify hook`)
**Konsep**: Memasang *git pre-commit hook* atau Next.js build plugin yang otomatis memeriksa kepatuhan UI saat `npm run build` atau `git commit`.

```json
// package.json
"scripts": {
  "prebuild": "npx piardify validate-ui"
}
```
> **Manfaat**: Jika AI Agent tidak sengaja memasukkan class warna terlarang, perintah build akan langsung *fail* di terminal dengan pesan lokasi baris yang presisi.

---

### 🔌 Solusi 7: Integrasi Piardify MCP Server (`mcp_piardify`)
**Konsep**: Menyediakan MCP (*Model Context Protocol*) server bawaan Piardify yang mengekspos fungsi seperti `get_theme_tokens()` atau `validate_component_syntax()`.

#### Alur Kerja MCP:
1. AI Agent memanggil tool `mcp_piardify_get_theme()`.
2. MCP server mengembalikan JSON token yang langsung masuk ke memori agen tanpa risiko terpotong oleh pembacaan file.

---

### 🧩 Solusi 8: Automated Component Scaffold Generator (`npx piardify generate <component>`)
**Konsep**: Menyediakan generator kode komponen siap pakai berbasis token Piardify.

```bash
npx piardify generate card --type=financial-summary
```
> **Manfaat**: AI Agent dapat mengambil *boilerplate* komponen yang sudah 100% memenuhi aturan desain Piardify daripada menulis ulang struktur JSX dari nol.

---

## 3. Kesimpulan

Dengan menggabungkan **8 Solusi Rekomendasi Piardify** di atas:
1. AI Agent terbebas dari masalah *context truncation* / pembacaan sebagian.
2. Penulisan class Tailwind menjadi lebih aman melalui variabel CSS/preset otomatis.
3. Verifikasi UI terjadi secara otomatis saat proses build/commit.
4. Kualitas estetika antarmuka finansial tetap konsisten, rapi, dan bebas dari *anti-slop violations*.
