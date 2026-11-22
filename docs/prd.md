# Product Requirements Document (PRD) — ArchTier

- **Product Name:** ArchTier
- **Version:** v1.0 (MVP Production Release · UI Design Baseline v2.4)
- **Status:** Ready for Implementation
- **Target Deployment:** Vercel (Production) + Neon Serverless PostgreSQL
- **Core Tagline:** *Architecture guardrails that scale with your stage.*

---

## 1. Executive Summary & Problem Statement

### Masalah Utama
Developer dan tim engineering modern yang menggunakan AI coding agent (**Antigravity**, **Cursor**, **Claude**, **ChatGPT**) terjebak di antara dua ekstrem yang merusak kecepatan maupun kualitas software:

1. **Premature Over-Engineering:** System prompt "Senior Architect" standar memperlakukan proyek MVP seperti sistem perbankan enterprise sejak hari pertama—memaksa pembuatan Repository Interfaces, Multi-Layer DTO Mappers, Use-Case wrappers, dan Event Bus. Akibatnya pengiriman fitur melambat hingga 2–3x lipat.
2. **Architectural Drift & Security Gaps:** Tanpa pagar arsitektur yang jelas, AI coding agent cepat menghasilkan *spaghetti code*, mencampur query database di komponen UI, melupakan validasi payload API, memakai tipe `any`, atau membocorkan *secrets*.

### Solusi ArchTier
**ArchTier** adalah aplikasi web *developer tool* yang bertindak sebagai **compiler aturan arsitektur adaptif** untuk AI coding agent. ArchTier memisahkan **risiko fatal** (*Non-Negotiable Security Floor*) dari **seremoni arsitektur prematur** melalui tiga fase proyek (`MVP`, `Growth`, `Scale`) dan mengklasifikasikan setiap aturan secara deterministik ke dalam:

- **`MANDATORY` (Locked):** Wajib dipatuhi di semua fase tanpa kompromi (keamanan & integritas kontrak dasar).
- **`RECOMMENDED` (Advisory):** Dianjurkan sesuai skala kolaborasi tim.
- **`DEFERRED` (Anti Over-Engineering):** Sengaja ditunda dan didokumentasikan sebagai *intentional trade-off* agar codebase tetap ramping.

---

## 2. Target Pengguna (User Personas)

1. **Solo Builder / Indie Hacker (Fase `MVP`)**
   - *Goal:* Ship produk ke production secepat mungkin menggunakan AI agent tanpa takut celah keamanan fatal atau boilerplate berlebihan.
   - *Pain Point:* Prompt generik bikin struktur folder terlalu rumit; coding tanpa prompt bikin kode berantakan di minggu kedua.
2. **Startup Tech Lead / Product Engineer (Tim 3–15 orang, Fase `Growth`)**
   - *Goal:* Menjaga konsistensi kode antar developer dan AI agent yang mereka pakai agar tidak saling merusak kontrak API/schema.
   - *Pain Point:* Sulit menyamakan aturan coding agent di seluruh anggota tim.
3. **Staff / Principal Architect (Fase `Scale`)**
   - *Goal:* Menegakkan isolasi domain, contract testing, dan protokol *stop-on-conflict* pada codebase berskala besar.

---

## 3. Product Scope & Release Roadmap (Dogfooding Anti Over-Engineering)

ArchTier menerapkan prinsipnya sendiri dalam menentukan batasan rilis agar v1.0 cepat rilis, fungsional penuh, dan stabil di Vercel.

### Release v1.0 — Core Production Deploy (Current Scope)
- **Landing Page (`/`):** Hero dengan live interactive Phase Simulator (terhubung ke real `POST /api/analyze`), Anti-Slop Diff, Bento Guardrail Matrix, 5-Section Contract Inspector, Interactive Prompt Builder, Command Palette (`Cmd/Ctrl + K`), dan Pricing section.
- **Authentication (`/login`):**
  - Email + Password (Sign In & Register) menggunakan **Better Auth** + Prisma + Neon PostgreSQL.
  - Social OAuth: **GitHub** dan **Google**.
  - Session persistence & protected route middleware untuk `/dashboard`.
- **Workspace Dashboard (`/dashboard`):**
  - **Phase Control:** Switcher interaktif `MVP` / `Growth` / `Scale`.
  - **Stack & Task Analyzer:** Input Tech Stack, Task Category (`Auth`, `API Route`, `Payment/Webhook`, `Database`, `UI Component`, `Core Logic`), serta deskripsi fitur yang terhubung ke real backend `POST /api/analyze`.
  - **Deterministic Conflict Detector:** Mendeteksi pelanggaran batas layer dari deskripsi/target file (misalnya permintaan query database di layer UI) dan menampilkan peringatan *Stop-on-Conflict*.
  - **Guardrail Report Viewer:** Menampilkan hasil aturan terkelompok (`Mandatory`, `Recommended`, `Deferred`), declared filepath, estimasi boilerplate yang dihemat, dan 5-Section Contract preview.
  - **Saved Ruleset Presets (CRUD):** Pengguna yang login dapat menyimpan, memuat, memperbarui, dan menghapus preset konfigurasi guardrail (`GET/POST/PATCH/DELETE /api/rulesets`) ke PostgreSQL.
  - **Multi-Agent Exporter:** Salin System Prompt sekali klik dan **Download file konfigurasi siap pakai**:
    - `.cursor/rules/archtier.mdc` (Cursor)
    - `CLAUDE.md` (Claude Code)
    - `AGENTS.md` (Universal / OpenAI Codex / Antigravity)
    - `.antigravity/rules.md` (Antigravity)

### Release v1.5 — Deferred Post-Launch (Explicitly Out of Scope for v1.0)
- **Multi-Project / Repository Switcher** (pengelompokan preset berdasarkan repo GitHub).
- **Audit History Timeline** (pencatatan riwayat setiap pemanggilan `POST /api/analyze` beserta metrik compliance over time).
- **Passwordless Magic Link & Forgot Password Email Flow** (memerlukan integrasi SMTP/Resend transactional email).

### Release v2.0 — Scale & Enterprise
- GitHub App / PR Diff Architectural Drift Auditing via Webhook.
- Team Workspaces dengan RBAC (Owner, Architect, Member).
- Enterprise SAML 2.0 / Okta SSO & Compliance Rule Packs (SOC2).

---

## 4. Functional Requirements & Acceptance Criteria

### FR-01: Deterministic Phase-Aware Guardrail Engine (`POST /api/analyze`)
- **Deskripsi:** Menerima payload `{ phase, stack, taskCategory, taskDescription, targetPath? }`, memvalidasi dengan Zod, lalu mengembalikan `GuardrailReport` yang deterministik (zero LLM latency, zero token cost).
- **Acceptance Criteria:**
  - `phase` hanya menerima `"mvp" | "growth" | "scale"`. Input tidak valid wajib mengembalikan HTTP `400` dengan error terstruktur dari Zod.
  - Aturan **Non-Negotiable Security Floor** (Zod input validation, env secrets isolation, safe error handling, strict TypeScript tanpa `any`, explicit auth checks) wajib selalu berstatus `mandatory` pada ketiga fase.
  - Aturan struktural (Repository DI, Multi-layer DTOs, OpenAPI/Event Contracts) otomatis beradaptasi sesuai fase (`deferred` di MVP, `recommended`/`mandatory` di Growth/Scale).
  - Menambahkan aturan kontekstual berdasarkan `taskCategory` (misal: HMAC signature verification & idempotency untuk `payment-webhook`).
  - Jika `taskDescription` atau `targetPath` mengindikasikan pelanggaran layer (contoh: "prisma query inside components" atau `/src/components/` dengan operasi DB), engine wajib mengembalikan flag `conflictDetected: true` beserta pesan *Stop-on-Conflict* dan pertanyaan klarifikasi.

### FR-02: Multi-Agent Prompt & Rule File Compiler
- **Deskripsi:** Mengubah `GuardrailReport` menjadi output siap tempel untuk AI coding agent.
- **Acceptance Criteria:**
  - Pengguna dapat menyalin Full System Prompt ke clipboard dengan notifikasi toast konfirmasi.
  - Pengguna dapat memilih format target (`Cursor .mdc`, `CLAUDE.md`, `AGENTS.md`, `Antigravity rules.md`) dan mengunduh file valid dengan nama file eksak.
  - Seluruh hasil export wajib menyertakan **5-Section Output Contract** dan **Stop-on-Conflict Protocol**.

### FR-03: Authentication & Session Security
- **Deskripsi:** Otentikasi developer via Better Auth + Prisma Adapter.
- **Acceptance Criteria:**
  - Pengguna dapat mendaftar (Register) dengan Nama, Email, dan Password ($\ge 8$ karakter) serta masuk (Sign In).
  - Pengguna dapat masuk via GitHub OAuth dan Google OAuth.
  - Password di-hash secara aman oleh Better Auth; tidak pernah disimpan dalam plaintext.
  - Akses langsung ke `/dashboard` tanpa session aktif di-redirect ke `/login?callbackUrl=/dashboard`.
  - Endpoint mutasi `/api/rulesets` menolak request tanpa session valid dengan HTTP `401`.
  - Endpoint `POST /api/analyze` tetap dapat diakses publik (rate-limited) agar simulator di Landing Page bekerja tanpa login.

### FR-04: Saved Ruleset Presets (`/api/rulesets`)
- **Deskripsi:** CRUD preset konfigurasi proyek milik user di PostgreSQL.
- **Acceptance Criteria:**
  - User yang login dapat menyimpan konfigurasi aktif (`name`, `phase`, `stack`, `taskCategory`, `defaultTask`, `customNotes`) sebagai Preset.
  - User hanya bisa membaca, mengubah, dan menghapus preset miliknya sendiri (`userId === session.user.id`).
  - Batas maksimal preset per akun pada paket Solo MVP (v1.0) adalah 20 preset untuk mencegah penyalahgunaan storage.

---

## 5. Non-Functional Requirements (NFR)

- **Performance:** Response time `POST /api/analyze` $< 100\text{ ms}$ (p95) pada Vercel Serverless Functions. First Contentful Paint (FCP) Landing Page $< 1.5\text{ s}$.
- **Type Safety:** TypeScript `strict: true` di seluruh codebase; zero `any`, zero `@ts-ignore`.
- **Security:** Validasi Zod di seluruh API boundary; semua secrets disimpan di Vercel Environment Variables; pesan error ke client disanitasi agar tidak membocorkan stack trace atau detail skema database.
- **Accessibility:** WCAG 2.1 AA compliance (rasio kontras teks $\ge 4.5:1$, touch target $\ge 44\times 44\text{ px}$, navigasi keyboard penuh, dukungan `prefers-reduced-motion`).
- **Testability:** Core engine (`/src/lib/engine`) memiliki 100% branch coverage via Vitest; route handler utama teruji dengan integration test.

---

## 6. Success Metrics (v1.0 Launch KPIs)

| Metric | Target (30 Hari Pasca Deploy) | Cara Pengukuran |
| :--- | :--- | :--- |
| **Prompt / Rule File Export Rate** | $\ge 40\%$ pengunjung yang mencoba simulator melakukan Copy/Download | Event tracking klien / API analyze counter |
| **Signup Conversion** | $\ge 15\%$ user aktif membuat akun untuk menyimpan preset | Jumlah record `User` di PostgreSQL |
| **Preset Retention** | $\ge 50\%$ user terdaftar menyimpan minimal 1 preset | Query tabel `RulesetPreset` |
| **API Error Rate** | $< 0.5\%$ (5xx errors) | Vercel Observability & Logs |

---

## 7. Implementation Milestones

1. **Milestone 1 — Foundation & Core Engine:** Setup Next.js App Router, Tailwind CSS, Design Tokens, Zod Schemas (`/src/lib/schemas`), Pure Rule Engine + Conflict Detector (`/src/lib/engine`), `POST /api/analyze`, dan Vitest suite.
2. **Milestone 2 — Auth & Database:** Setup Neon PostgreSQL, Prisma schema, Better Auth (Email/Password + GitHub/Google OAuth), dan migrasi halaman `/login`.
3. **Milestone 3 — Landing Page Migration:** Konversi mockup Landing Page (`/`) ke komponen React modular yang terhubung ke real `POST /api/analyze`.
4. **Milestone 4 — Workspace Dashboard & Presets:** Implementasi `/dashboard`, CRUD `/api/rulesets`, dan Multi-Agent File Exporter (`.mdc`, `CLAUDE.md`, `AGENTS.md`).
5. **Milestone 5 — Hardening & Vercel Deploy:** Security audit, Lighthouse/A11y check, environment configuration, dan production deployment ke Vercel.