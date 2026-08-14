# 🏷️ Standar Aturan Semantic Versioning (SemVer)

Aturan baku penomoran versi rilis (*Semantic Versioning*) untuk proyek, paket modul, CLI, dan changelog:

---

## 📌 Format Penomoran Versi: `MAJOR.MINOR.PATCH` (contoh: `v2.4.7`)

### 1. 🚀 `MAJOR` (Update Skala Besar)
- **Kriteria**: Terjadi pembaruan arsitektur besar-besaran (*major overhaul*), perombakan sistem menyeluruh (*breaking changes*), atau re-branding platform.
- **Aturan Penambahan**: Tambahkan **`+1`** ke digit `MAJOR` (misal: dari `2.x.x` menjadi `3.0.0`).

### 2. ⚡ `MINOR` (Penambahan Fitur Baru)
- **Kriteria**: Setiap ada fitur baru (*feature additions*) yang diimplementasikan.
- **Aturan Penambahan**: **Bertambah sesuai jumlah fitur yang ditambahkan (+N)** secara kumulatif.
  - *Rumus*: `MINOR_BARU = MINOR_LAMA + JUMLAH_FITUR_BARU`
  - *Contoh*: Jika versi sebelumnya `x.2.x` dan terdapat **2 fitur baru** yang ditambahkan, maka digit minor menjadi `2 + 2 = 4` (`x.4.x`).

### 3. 🐛 `PATCH` (Perbaikan Bug / Bug Fixes)
- **Kriteria**: Setiap ada bug atau error yang terselesaikan (*bug fixes* / *hotfixes*).
- **Aturan Penambahan**: **Bertambah sesuai jumlah bug yang diselesaikan (+M)** secara kumulatif.
  - *Rumus*: `PATCH_BARU = PATCH_LAMA + JUMLAH_BUG_FIXES`
  - *Contoh*: Jika versi sebelumnya `x.x.2` dan terdapat **5 bug terselesaikan**, maka digit patch menjadi `2 + 5 = 7` (`x.x.7`).

---

## 💡 Contoh Kasus Perhitungan

Versi awal: `v2.2.1`

1. Terdapat rilis dengan:
   - **3 Fitur Baru** (AI Recommendation, Presets Baru, Dark Mode Toggle)
   - **4 Bug Fixes** (Fix chat PRD, fix kanban drag error, fix API rate limit, fix token cache)
2. **Perhitungan**:
   - `MAJOR` = `2` (tidak ada breaking change besar)
   - `MINOR` = `2 + 3` = `5`
   - `PATCH` = `1 + 4` = `5`
3. **Versi Baru**: **`v2.5.5`**
