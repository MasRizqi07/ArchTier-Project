# Product & UX Design Blueprint — ArchTier

Dokumen ini menjabarkan arsitektur informasi, alur pengguna (*user flows*), struktur wireframe untuk halaman baru `/dashboard`, serta perilaku interaksi dan state di seluruh aplikasi ArchTier v1.0.

---

## 1. Information Architecture & Sitemap (v1.0)

```text
ArchTier Web App
├── /                     (Public) Landing Page & Live Phase Simulator
│   ├── #simulator        Interactive Phase Guardrail Simulator (calls POST /api/analyze)
│   ├── #comparison       Anti-Slop Architectural Diff (Generic Prompt vs ArchTier)
│   ├── #features         Asymmetric Bento Grid + 5-Section Contract Inspector
│   ├── #sandbox          Interactive Prompt Builder & Quick Export
│   └── #pricing          Pricing Matrix (Monthly/Annual toggle) + CTA to /login
│
├── /login                (Public, redirects to /dashboard if authenticated)
│   ├── Tab: Sign In      Email + Password & GitHub/Google OAuth
│   ├── Tab: Register     Name + Email + Password (with Strength Meter) & OAuth
│   └── Right Panel       Interactive Live Workspace Preview (Static showcase)
│
└── /dashboard            (Protected — requires valid Better Auth session)
    ├── Top Bar           Brand, Active Preset Name, Quick Search/Cmd+K, User Menu
    ├── Left Sidebar      Saved Ruleset Presets list + "+ New Preset" + v1.5 Badges
    └── Main Workspace    Split Workbench:
        ├── Left Pane     Guardrail Configuration Form (Phase, Stack, Category, Task, Path)
        └── Right Pane    Live Output Tabs:
                          1) Guardrail Report (Mandatory / Recommended / Deferred + Conflict Banner)
                          2) 5-Section Contract Preview
                          3) Agent Export (.cursorrules .mdc / CLAUDE.md / AGENTS.md / Antigravity)
```

> **Catatan Konsistensi Mockup v1.0 vs v1.5:**
> Pada mockup `/login` sebelumnya terdapat tab *Magic Link* dan tombol *Forgot Password*. Untuk menjaga disiplin MVP v1.0 (tanpa integrasi email server dulu), tab *Magic Link* dan tautan *Enterprise SSO* ditampilkan dengan badge halus `v1.5` (atau disembunyikan rapi hingga email provider siap) agar tidak ada tombol mati (*dead UI*) di production.

---

## 2. Core User Flows

### Flow A: First-Time Developer (Anonymous -> Value in < 30 Seconds)
1. User mendarat di `/` dan langsung melihat Hero + **Live Phase Simulator**.
2. User klik toggle fase (`01 · MVP` -> `02 · Growth` -> `03 · Scale`) dan memilih skenario task.
3. Frontend memanggil `POST /api/analyze` (dengan *optimistic instant feedback* atau debounce ringan) dan merender perubahan aturan secara real-time.
4. User scroll ke `#sandbox`, memilih tech stack, mengetik task fitur mereka, klik **Compile Guardrail Prompt**, lalu klik **Copy Prompt** -> Toast konfirmasi muncul.
5. Ingin menyimpan preset & download file `.mdc` / `CLAUDE.md`? User klik **Open Workspace / Sign In** menuju `/login`.

### Flow B: Authentication Flow (`/login` -> `/dashboard`)
1. User membuka `/login` (atau terkena redirect dari `/dashboard`).
2. User memilih **GitHub OAuth**, **Google OAuth**, atau mengisi form **Sign In / Register**.
3. Validasi Zod berjalan di client (saat blur/submit) dan server. Error ditampilkan inline di bawah field terkait dengan `aria-invalid="true"`.
4. Setelah sukses, session cookie `HttpOnly` aktif -> redirect otomatis ke `/dashboard`.

### Flow C: Core Workbench Flow di `/dashboard`
1. User masuk ke `/dashboard`. Jika belum punya preset, sistem memuat *Default Starter Config* (`MVP` + `Next.js App Router` + contoh task `POST /api/analyze`) dan menampilkan *empty state* yang membantu di sidebar preset.
2. User memilih **Phase** (`MVP` / `Growth` / `Scale`), **Tech Stack**, **Task Category**, dan mengetik **Feature Task** (opsional: **Target Filepath**).
3. User menekan **Run Guardrail Analysis** (atau shortcut `Cmd/Ctrl + Enter`).
4. Sistem memanggil `POST /api/analyze`:
   - **Normal Path:** Panel kanan menampilkan KPI strip (`Mandatory`, `Recommended`, `Deferred`, `Boilerplate Saved`), daftar aturan berwarna semantik, serta declared filepath.
   - **Conflict Path:** Jika terdeteksi pelanggaran layer (contoh: menulis query database di `/src/components/`), muncul **Stop-on-Conflict Alert Banner** berwarna Amber/Danger di bagian atas report dengan alasan konflik dan pertanyaan klarifikasi yang harus diselesaikan sebelum kode digenerate.
5. User berpindah ke tab **Agent Export**, memilih target agent (`Cursor`, `Claude Code`, `Antigravity`, `Universal AGENTS.md`), lalu klik **Copy** atau **Download File**.
6. User klik **Save as Preset**, memberi nama (misal: *"SaaS Core MVP"*), dan preset langsung tersimpan ke Neon PostgreSQL via `POST /api/rulesets` dan muncul di sidebar kiri.

---

## 3. Wireframe & Layout Specification: `/dashboard`

Karena `/` (Landing) dan `/login` sudah memiliki mockup HTML yang disetujui, berikut adalah cetak biru tata letak untuk halaman baru `/dashboard` agar konsisten 100% dengan estetika *Architectural Dark v2.4*.

```text
+-----------------------------------------------------------------------------------+
| [Logo] ArchTier v2.4  /  [Preset: SaaS Core MVP *]     [Cmd+K]  [Save]  [Avatar v]|
+----------------------+------------------------------------------------------------+
| PRESETS (3/20)  [+]  |  PHASE CONTROL BAR                                         |
| -------------------- |  [ 01 MVP (Active) ]  [ 02 Growth ]  [ 03 Scale ]          |
| > SaaS Core MVP      |------------------------------------------------------------+
|   Next.js · MVP      |  CONFIGURATION (45%)        |  LIVE OUTPUT WORKBENCH (55%) |
|                      |                             |                              |
|   Billing API        |  Tech Stack                 |  [Report] [5-Part] [Export]  |
|   Next.js · Growth   |  [ Next.js App Router  v ]  |                              |
|                      |                             |  (If Conflict Detected:)     |
|   Auth Service       |  Task Category              |  +------------------------+  |
|   Go + React · Scale |  [ API Route / Backend v ]  |  | ! ARCHITECTURAL CONFLICT| |
|                      |                             |  | Violation details...   |  |
| -------------------- |  Target Filepath (Optional) |  +------------------------+  |
| COMING IN v1.5       |  [ /src/app/api/...      ]  |                              |
| - Repo Switcher      |                             |  [3 Locked][1 Adv][2 Skip]   |
| - Audit History      |  Feature Description        |                              |
|                      |  +-----------------------+  |  Declared Target:            |
|                      |  | Build POST /api/...   |  |  /src/app/api/analyze/...    |
|                      |  +-----------------------+  |                              |
|                      |                             |  [MANDATORY] Security Floor  |
|                      |  [ Run Analysis (Cmd+↵) ]   |  - Zod Input Validation      |
|                      |                             |  - Env Secrets Isolation     |
|                      |  SECURITY FLOOR INDICATOR   |  - Strict TS (No any)        |
|                      |  [✓] Zod  [✓] Env  [✓] Auth |                              |
|                      |                             |  [DEFERRED - ANTI-SLOP]      |
|                      |                             |  - Repository Interfaces     |
|                      |                             |  - Multi-Layer DTO Mappers   |
+----------------------+-----------------------------+------------------------------+
```

### Responsive Behavior (`/dashboard`)
- **Desktop ($\ge 1200\text{ px}$):** Sidebar kiri tetap (`260px`, bisa di-collapse ke `0px` lewat tombol toggle), Workbench 2 kolom (`45%` config / `55%` output).
- **Tablet ($768\text{ px} - 1199\text{ px}$):** Sidebar berubah menjadi slide-over drawer; Workbench tetap 2 kolom atau stack vertikal tergantung lebar viewport.
- **Mobile ($< 768\text{ px}$):** Sidebar berupa drawer dari tombol topbar; Phase Control berupa segmented stack; Config pane di atas, Output pane di bawah dengan sticky bottom action bar untuk **Run Analysis** / **Copy Prompt**.

---

## 4. Interactive States & Edge Cases Matrix

Semua komponen interaktif wajib menangani 5 state berikut tanpa menggunakan native `alert()`, `confirm()`, atau `prompt()`:

| State | Visual & Behavioral Treatment |
| :--- | :--- |
| **Loading / Pending** | Tombol submit menampilkan spinner kecil (`16px`) + teks status (misal `"Analyzing rules..."`) dan `disabled`. Daftar preset di sidebar menampilkan skeleton shimmer halus dengan warna `--surface-card-alt`. |
| **Empty State** | Jika user belum memiliki Saved Presets, tampilkan kartu dashed border di sidebar: *"No saved presets yet. Configure a phase and save your first guardrail profile."* dengan tombol quick-fill starter template. |
| **Conflict Halted State** | Banner dengan border `--status-warning-border` dan ikon peringatan SVG muncul di puncak output panel. Tombol export tetap tersedia namun menyertakan blok `[HALT & CLARIFY REQUIRED]` agar agent AI tidak menebak-nebak. |
| **Validation / API Error** | Validasi field tampil inline di bawah input (`--status-danger`). Error jaringan atau HTTP 500 tampil dalam banner dismissible dengan tombol **Retry** dan pesan aman (tanpa stack trace). |
| **Destructive Action (Delete Preset)** | Menghapus preset wajib memakai inline confirmation popover atau modal konfirmasi kustom (`Cancel` / `Delete Preset`)—tidak pernah langsung menghapus dalam 1 klik tak sengaja. |

---

## 5. Keyboard Shortcuts & Accessibility Map

- **`Cmd/Ctrl + K`:** Membuka Command Palette global (Landing Page & Dashboard) untuk quick switch Phase (`01`/`02`/`03`), pindah tab output, membuat preset baru, atau menyalin prompt.
- **`Cmd/Ctrl + Enter`:** Menjalankan analisis guardrail (`POST /api/analyze`) saat fokus berada di form `/dashboard`.
- **`Escape`:** Menutup modal, drawer, atau popover yang sedang terbuka dan mengembalikan fokus ke tombol pemicu.
- **ARIA Live Regions:** Container hasil analisis, toast notifikasi, dan banner konflik memakai `aria-live="polite"` agar pembaca layar mengumumkan pembaruan tanpa mengganggu fokus.