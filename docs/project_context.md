# ArchTier — Project Context & Session Handoff Brief

> **Cara Menggunakan Dokumen Ini:** Paste seluruh isi file ini ke sesi chat baru (atau sebagai context file di Antigravity / Cursor / Claude) agar AI langsung memahami konsep produk, arsitektur teknis, *design system* yang sudah disetujui, serta langkah kerja berikutnya tanpa kehilangan konteks.

---

## 1. Ringkasan Eksekutif & Konsep Produk

- **Nama Project:** **ArchTier** (`v2.4` mockup label)
- **Tagline:** *Architecture guardrails that scale with your stage.*
- **Kategori:** SaaS / Developer Tool (Web Application)
- **Target Pengguna:** Solo developers, startup engineering teams (3–15 orang), lead architects, dan developer yang aktif membangun kode menggunakan AI coding agents (**Antigravity**, **Cursor**, **Claude**, **ChatGPT**).
- **Sudut Pandang Inti (Contrarian / Anti Over-Engineering):**
  - *Masalah 1 (Over-Engineering):* Prompt "Senior Software Architect" standar memperlakukan semua project seperti sistem perbankan enterprise sejak hari pertama—memaksa pembuatan Repository Interfaces, Multi-Layer DTO Mappers, Use-Case wrappers, dan Event Bus saat project masih di tahap MVP. Ini memperlambat pengiriman fitur hingga 2–3x.
  - *Masalah 2 (Architectural Drift):* Tanpa guardrail, AI coding agent cepat menghasilkan *spaghetti code*, mencampur query database di komponen UI, melupakan validasi payload, atau membocorkan *secrets*.
  - *Solusi ArchTier:* Memisahkan **risiko fatal** (*Non-Negotiable Security Floor*) dari **seremoni arsitektur prematur**. Developer memilih fase project (**MVP**, **Growth**, atau **Scale**), lalu ArchTier secara deterministik menentukan aturan mana yang:
    1. **MANDATORY (Locked):** Wajib dipatuhi di semua fase (validasi input Zod, *environment variables* untuk *secrets*, batas autentikasi/RBAC, strict TypeScript tanpa `any`, safe error handling).
    2. **RECOMMENDED (Advisory):** Dianjurkan sesuai skala tim (misalnya Repository Abstraction pada model *high-churn* di fase Growth).
    3. **DEFERRED (Anti Over-Engineering):** Sengaja ditunda agar codebase tetap ramping, terdokumentasi sebagai *intentional trade-off* hingga fase berikutnya.

---

## 2. Matriks Aturan Adaptif (Phase-Calibrated Rule Engine)

| Guardrail / Aturan Arsitektur | Fase 01: `MVP` | Fase 02: `Growth` | Fase 03: `Scale` |
| :--- | :--- | :--- | :--- |
| **Zod Input Validation & Env Secrets** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **TypeScript Strict Mode (No `any`)** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **Explicit Auth & Safe Error Sanitizer** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **Pure Domain Logic (`/src/lib/engine`)** | `MANDATORY` (Colocated) | `MANDATORY` (Shared Schemas) | `MANDATORY` (Domain Isolated) |
| **Integration Test Suite Coverage** | `RECOMMENDED` | `MANDATORY` | `MANDATORY` (+ Contract Gates) |
| **Repository & Adapter Abstraction** | `DEFERRED` | `RECOMMENDED` | `MANDATORY` |
| **Multi-Layer DTOs & Event Bus / OpenAPI** | `DEFERRED` | `DEFERRED` | `MANDATORY` |

**Protokol Stop-on-Conflict:** Jika instruksi fitur bertabrakan dengan batas lapisan arsitektur (contoh: memanggil query Prisma langsung dari `/src/components/`), AI coding agent **wajib berhenti** dan meminta klarifikasi alih-alih membuat asumsi.

---

## 3. Arsitektur Teknis & Tech Stack (Disepakati)

- **Frontend:** Next.js (App Router), React, TypeScript (`strict: true`), Tailwind CSS, shadcn/ui
- **Backend API:** Next.js Route Handlers (`/src/app/api/**`)
- **Domain Engine (Core):** Pure TypeScript, framework-agnostic (`/src/lib/engine`)
- **Shared Contracts:** Zod validation schemas & TypeScript domain types (`/src/lib/schemas`)
- **Database:** PostgreSQL + Prisma ORM (`/src/lib/db`, `/prisma/schema.prisma`) untuk menyimpan preset guardrail, repository profiles, dan riwayat audit
- **Testing:** Vitest untuk unit & integration testing (`/tests/unit`, `/tests/integration`)

### Struktur Folder Target
```text
/src
├── /app
│   ├── /api
│   │   ├── /analyze/route.ts        # Feature 1: POST /api/analyze
│   │   └── /rulesets/route.ts       # CRUD preset guardrail per workspace
│   ├── /login/page.tsx              # Halaman Login (UI mockup approved)
│   ├── /dashboard/page.tsx          # Halaman Dashboard Workspace (Next UI slice)
│   └── page.tsx                     # Landing Page (UI mockup approved)
├── /components                      # React UI components (PascalCase.tsx)
├── /lib
│   ├── /engine
│   │   └── evaluate-guardrails.ts   # Pure deterministic rule evaluator
│   ├── /schemas
│   │   └── guardrail.schema.ts      # Shared Zod schemas (ProjectPhase, AnalysisRequest, GuardrailReport)
│   └── /db
│       └── prisma.ts                # Prisma client singleton
/tests
├── /unit/evaluate-guardrails.test.ts
└── /integration/api-analyze.test.ts
```

### Konvensi Standar Kode
- **Penamaan:** `camelCase` untuk fungsi & variabel, `PascalCase` untuk komponen React & tipe, `kebab-case` untuk nama file & folder.
- **Kontrak Output 5 Bagian Wajib (untuk AI Agent Coding):**
  1. **Architecture Analysis** (posisi modul di `shared` / `engine` / `api` / `ui`)
  2. **Filepath Declaration** (path eksak, fungsi 1 baris, dependencies, consumers)
  3. **Code Implementation** (strict TypeScript, JSDoc/komentar seperlunya, edge-case error handling)
  4. **Testing Requirements** (spesifikasi unit & integration test beserta lokasi file)
  5. **Architectural Impact & Security Checklist** (breaking changes, intentional MVP trade-offs, checklist keamanan)

---

## 4. UI/UX Design System (Approved — Anti-AI-Slop)

Semua halaman frontend ArchTier wajib mengikuti *design system* yang sudah disetujui berikut:

### Arah Visual & Design Dials
- **Gaya:** *Architectural Dark / Modern Technical* (terinspirasi presisi *developer tools* modern; bebas gradien ungu/pink generik AI, bebas emoji sebagai ikon UI—seluruh ikon menggunakan inline SVG konsisten).
- **Design Dials:** Variance `7/10` (asymmetric split & bento grid), Motion `6/10` (staggered reveal `cubic-bezier(0.22, 1, 0.36, 1)`, `prefers-reduced-motion` aktif), Density `5/10`.
- **Atmosfer:** Latar belakang `#090C12` dengan pola *blueprint dot-grid* halus (`28px`), *radial emerald glow* lembut di bagian atas, dan *SVG noise overlay* (`opacity: 0.025`).

### Token Warna Semantik (CSS Variables)
- `--bg-primary: #090C12` (Canvas utama — bukan `#000000`)
- `--bg-elevated: #0E131D` (Panel & modal)
- `--surface-card: #121825` | `--surface-card-alt: #161E2E` | `--surface-inset: #0A0E16`
- `--text-primary: #F1F5F9` | `--text-secondary: #94A3B8` | `--text-muted: #64748B`
- `--accent-primary: #10B981` (Signal Emerald — CTA utama & status `MANDATORY` / `LOCKED`)
- `--status-warning: #F59E0B` (Amber — status `RECOMMENDED` / `GROWTH`)
- `--status-deferred: #38BDF8` (Sky Blue — status `DEFERRED` / Anti Over-Engineering)
- `--status-danger: #F43F5E` (Coral Red — `BREAKING` / error validasi)
- `--border-subtle: rgba(255, 255, 255, 0.08)` | `--border-strong: rgba(255, 255, 255, 0.16)`

### Tipografi & Aksesibilitas
- **Display Font:** `Bricolage Grotesque` (600, 700, 800; tight tracking `-0.03em`)
- **Body Font:** `Plus Jakarta Sans` (400, 500, 600, 700; base `16px`)
- **Monospace Font:** `JetBrains Mono` (400, 500, 600; `font-variant-numeric: tabular-nums` pada angka metrik & harga)
- **Aksesibilitas:** Kontras teks >= `4.5:1`, target sentuh minimum `44x44px`, `<label>` selalu terlihat pada setiap input, `:focus-visible` ring emerald, tidak ada `alert()`/`confirm()`/`prompt()`.

---

## 5. Status Progres Saat Ini

- [x] **Ideasi & Seleksi Konsep:** Dipilih **ArchTier** (Contrarian Anti-Overengineering Guardrail App).
- [x] **System Prompt Coding Agent:** Sudah diadaptasi lengkap untuk **Antigravity / Cursor / Claude** dengan target Milestone 1 (`POST /api/analyze` + `evaluate-guardrails.ts`).
- [x] **UI/UX Mockup 01 — Landing Page (`templates/landing.html`):** **APPROVED.** Mencakup asymmetric split hero + live interactive Phase Simulator, Anti-Overengineering folder diff, asymmetric Bento Grid (7/5 & 5/7) dengan 5-Section Contract Inspector, Interactive Prompt Builder, Command Palette (`⌘K`), dan Pricing Matrix.
- [x] **UI/UX Mockup 02 — User Login Page (`templates/login.html`):** **APPROVED.** Mencakup editorial split-screen auth (`Sign In`, `Magic Link`, `Register`), GitHub & Google OAuth, password visibility toggle & strength meter, modal *Forgot Password*, Demo Fill, dan Live Workspace Preview di panel kanan.

---

## 6. Rencana Langkah Berikutnya (Next Steps di Sesi Baru)

1. **UI/UX Slicing Lanjutan (opsional sebelum coding):**
   - Membuat mockup HTML **Dashboard Workspace Utama (`templates/dashboard.html`)**: Collapsible sidebar, Project/Repo switcher, Phase Control (`MVP` / `Growth` / `Scale`), Interactive Guardrail Analyzer form (`POST /api/analyze`), hasil laporan rule (`Mandatory` / `Recommended` / `Deferred`), dan Export System Prompt.
2. **Implementasi Kode di Antigravity (Milestone 1 — Feature 1):**
   - Membuat `/src/lib/schemas/guardrail.schema.ts` (Zod contracts).
   - Membuat `/src/lib/engine/evaluate-guardrails.ts` (pure rule evaluator).
   - Membuat `/src/app/api/analyze/route.ts` (validated API endpoint).
   - Menulis unit & integration tests di `/tests/unit/` dan `/tests/integration/`.

---

## 7. Ready-to-Use System Prompt (Untuk Antigravity / Coding Agent)

```markdown
🏗️ ArchTier — Adaptive Full-Stack Software Architect Developer

## Role
You are a senior software architect responsible for building and maintaining **ArchTier**, a web application that enforces phase-appropriate software architecture guardrails (**MVP**, **Growth**, **Scale**) to prevent both architectural drift and premature over-engineering. Every line of code must align with the established system design. Architecture documents are binding contracts.

## Task
Generate production-grade code for ArchTier that strictly adheres to the provided architecture. Before writing any code:
1. **Analyze the architecture** - Read the relevant layers below and explain where the new code fits within ArchTier's system structure without introducing unnecessary abstractions.
2. **Declare the filepath** - State the exact location, purpose, dependencies, and consumers.
3. **Write the code** - Fully typed (TypeScript strict mode), documented, with comprehensive error handling and Zod input validation.
4. **Specify tests** - Describe required unit and integration tests with exact filepaths.
5. **Document impact** - Flag any architectural changes, breaking changes, technical debt, or intentional MVP trade-offs.

## Context
- **Product**: ArchTier — Adaptive Architecture Guardrail Web App (`mvp`, `growth`, `scale`).
- **Frontend**: Next.js (App Router), React, TypeScript (strict), Tailwind CSS, shadcn/ui (`/src/app`, `/src/components`).
- **Backend**: Next.js Route Handlers (`/src/app/api/**`), pure domain logic in `/src/lib/engine`.
- **Shared Layer**: Zod validation schemas and domain types in `/src/lib/schemas`.
- **Database**: PostgreSQL with Prisma ORM (`/src/lib/db`, `/prisma/schema.prisma`).
- **Testing**: Vitest (`/tests/unit`, `/tests/integration`).

Current work:
Build **Feature 1: Core Phase-Aware Guardrail Engine & Analysis API (`POST /api/analyze`)** with shared Zod schemas (`ProjectPhase`, `AnalysisRequest`, `GuardrailReport`), pure evaluator in `/src/lib/engine/evaluate-guardrails.ts`, and validated route handler in `/src/app/api/analyze/route.ts`.

## Standards
- **Naming**: `camelCase` functions/vars, `PascalCase` components/types, `kebab-case` files/folders
- **Types**: TypeScript `strict: true`, zero `any`
- **Security**: Strict Zod validation on all API boundaries, env vars for secrets, auth gates, safe error messages
- **Conflict Rule**: Stop immediately and request clarification rather than making assumptions.

## Output
Provide five sections: **Architecture Analysis**, **Filepath Declaration**, **Code Implementation**, **Testing Requirements**, and **Architectural Impact** (including security checklist).
```
