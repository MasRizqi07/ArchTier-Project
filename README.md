<div align="center">

# 🏗️ ArchTier

**Architecture guardrails that scale with your stage.**

*A phase-calibrated compiler of software architecture guardrails for AI coding agents.*  
*Prevents premature over-engineering without sacrificing security or type-safety.*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict_0_Errors-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth_v1.7-purple?style=flat-square)](https://www.better-auth.com/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma_v6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-30_Passed_100%25-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![CI](https://img.shields.io/badge/CI-GitHub_Actions-2088FF?style=flat-square&logo=githubactions)](https://github.com/MasRizqi07/ArchTier-Project/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

[Live Features](#-core-features) • [Adaptive Matrix](#-adaptive-guardrail-matrix) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Deployment Guide](DEPLOYMENT.md) • [Architecture Guidelines](#-strict-layer-boundaries)

---

</div>

## 📌 Executive Summary & Philosophy

Modern software engineering with AI coding agents (**Antigravity**, **Cursor**, **Claude Code**, **ChatGPT**, **Codex**) frequently gets trapped between two extremes:

1. **Premature Over-Engineering:** Standard "Senior Architect" prompts treat a 2-week MVP like a 400-engineer banking monolith—forcing Repository Interfaces, Multi-Layer DTO Mappers, Use-Case wrappers, and Event Buses from day one. Shipping slows down by **2–3x**.
2. **Architectural Drift & Spaghetti Code:** Without guardrails, coding agents quickly degrade codebases: executing database queries directly inside React components, omitting payload validation, leaking secret API keys in client bundles, and abusing TypeScript's `any`.

### The ArchTier Solution
**ArchTier** separates the **Non-Negotiable Security Floor** (rules that are *always locked* across all phases) from **premature structural ceremonies** through a 3-tier lifecycle engine:

```text
[ Phase 01: MVP ]        ──► [ Phase 02: Growth ]      ──► [ Phase 03: Scale ]
Speed & Safety               Team Consistency              System Isolation
Security Floor: LOCKED       Security Floor: LOCKED        Security Floor: LOCKED
Abstractions: DEFERRED       Abstractions: RECOMMENDED     Abstractions: MANDATORY
```

- **`MANDATORY` (Locked):** Security, strict typing, and boundary validation must be respected in every phase without compromise.
- **`RECOMMENDED` (Advisory):** Encouraged as team size and codebase churn expand (e.g., repository wrappers for volatile entities).
- **`DEFERRED` (Anti-Slop):** Deliberately postponed and documented as intentional trade-offs to keep the codebase lean and ship fast.

---

## 🎯 Adaptive Guardrail Matrix

| Guardrail / Architecture Rule | Phase 01: `MVP` | Phase 02: `Growth` | Phase 03: `Scale` |
| :--- | :--- | :--- | :--- |
| **Zod Input Validation at Boundaries** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **Zero Hardcoded Secrets & Env Isolation** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **Strict TypeScript (`strict: true`, zero `any`)** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **Sanitized Client Error Responses** | `MANDATORY` (Locked) | `MANDATORY` (Locked) | `MANDATORY` (Locked) |
| **Pure Domain Logic Isolation (`/src/lib/engine`)** | `MANDATORY` (Colocated) | `MANDATORY` (Shared Schemas) | `MANDATORY` (Decoupled Hexagonal) |
| **Automated Integration Test Coverage** | `RECOMMENDED` | `MANDATORY` | `MANDATORY` (+ Contract Gates) |
| **Repository & Adapter Abstraction** | `DEFERRED` (Anti-Slop) | `RECOMMENDED` | `MANDATORY` |
| **Multi-Layer DTOs & Event Bus / OpenAPI** | `DEFERRED` (Anti-Slop) | `DEFERRED` | `MANDATORY` |

---

## ⚡ Core Features

- ⚙️ **Pure Deterministic Rule Engine (`POST /api/analyze`):**  
  Framework-agnostic, zero-LLM-latency (<50ms p95), and zero token cost. Evaluates phase, stack, task category, and feature description into a complete `GuardrailReport`.
- 🛑 **Deterministic Stop-on-Conflict Protocol:**  
  Scans for architectural violations before code is written:
  - **DB-in-UI Violation:** Flags Prisma/SQL operations placed inside client components.
  - **Hardcoded Secret Risk:** Flags credentials or API tokens exposed in client code.
  - **MVP Over-Engineering Alert:** Flags premature microservices, Kafka, or event bus requests during the MVP phase.
- 📤 **Multi-Agent Exporter:**  
  Compiles guardrail reports into production-ready rule configuration files:
  - Cursor Rules: `.cursor/rules/archtier.mdc` (YAML frontmatter + globs)
  - Claude Code: `CLAUDE.md`
  - Universal Agent Contract: `AGENTS.md`
  - Antigravity Rules: `.antigravity/rules.md`
- 🎨 **Architectural Dark Design System (v2.4 - Anti-AI-Slop):**  
  High-precision developer aesthetic inspired by IDE compilers:
  - Deep slate-navy canvas (`#090C12`) with blueprint dot-grid & subtle SVG noise.
  - Signal Emerald (`#10B981`) CTA & locked security tokens.
  - Zero generic purple/pink AI gradients, zero pure `#000000`, and zero emojis as UI icons.
  - Strict WCAG 2.1 AA accessibility (touch target $\ge 44\times 44\text{px}$, visible `<label>`, emerald `:focus-visible` ring).
- 🔐 **Full-Stack Authentication (Better Auth + Prisma):**  
  Email/Password with live Password Strength Meter, GitHub & Google OAuth, HttpOnly secure cookies, and Demo Account quick-fill.
- 💾 **Saved Ruleset Presets (CRUD):**  
  Create, read, update, and delete custom ruleset configurations in Neon PostgreSQL with a 20-preset quota guard and offline development fallback.
- ⌨️ **Command Palette (`⌘K` / `Ctrl+K`):**  
  Fast keyboard navigation, quick phase switching, and instant export shortcuts across all pages.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5.7+ (`strict: true`)
- **Styling:** Tailwind CSS v3.4 + Custom Architectural Design Tokens
- **Icons:** Inline SVGs & Lucide Icons
- **Validation:** Zod v3.24
- **ORM & Database:** Prisma v6 + PostgreSQL (Neon Serverless compatible)
- **Authentication:** Better Auth v1.7
- **Testing:** Vitest v3
- **Deployment:** Vercel + Neon

---

## 🚀 Milestone Progress & Roadmap

| Milestone | Scope & Deliverables | Status |
| :--- | :--- | :--- |
| **Milestone 1** | Foundation, Tokens, Engine, Conflict Detector, `POST /api/analyze`, 15 Tests | ✅ **Completed** |
| **Milestone 2** | Neon Schema, Better Auth, Prisma Client, Auth Validation, `/login` Split UI | ✅ **Completed** |
| **Milestone 3** | Landing Page Migration, Bento Grid, Prompt Sandbox, Pricing, `⌘K` Palette | ✅ **Completed** |
| **Milestone 4** | Workspace Dashboard `/dashboard`, Presets CRUD, Exporters (`.mdc`, `CLAUDE.md`) | ✅ **Completed** |
| **Milestone 5** | Production Hardening, Security Headers, Middleware, CI/CD, Vercel Ready | ✅ **Completed** |

---

## 💻 Getting Started

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/MasRizqi07/ArchTier-Project.git
cd ArchTier-Project
npm install
```

### 2. Configure Environment Variables

Create `.env.local` by copying the example:

```bash
cp .env.example .env.local
```

Fill in your database URL and Better Auth secret (see [DEPLOYMENT.md](DEPLOYMENT.md) for full instructions):

```bash
DATABASE_URL="postgresql://user:password@ep-pooler.neon.tech/archtier?sslmode=require"
DIRECT_URL="postgresql://user:password@ep-direct.neon.tech/archtier?sslmode=require"
BETTER_AUTH_SECRET="archtier-dev-secret-32-chars-long-minimum"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize Prisma Client & Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the full Vitest suite (30 automated tests across 7 test suites):

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# TypeScript strict type checking (zero errors)
npm run typecheck

# ESLint code quality verification
npm run lint

# Production build verification
npm run build
```

---

## 📐 Strict Layer Boundaries

ArchTier enforces its own architecture rules across its folder structure:

```text
/
├── src/
│   ├── app/                    # Next.js App Router (Pages & Route Handlers)
│   │   ├── api/
│   │   │   ├── analyze/        # Public rate-limited guardrail compiler
│   │   │   ├── auth/           # Better Auth endpoints
│   │   │   └── rulesets/       # Protected CRUD presets endpoints
│   │   ├── dashboard/          # Protected Workbench page
│   │   ├── login/              # Split-shell authentication page
│   │   └── page.tsx            # High-conversion Landing page
│   ├── components/             # Pure UI presentation layer
│   │   ├── auth/               # Login form & live preview
│   │   ├── dashboard/          # Workbench form, report viewer, preset sidebar
│   │   ├── landing/            # Bento grid, prompt sandbox, pricing
│   │   └── shared/             # Brand logo, command palette
│   ├── lib/
│   │   ├── auth/               # Better Auth server & client configuration
│   │   ├── db/                 # Prisma client singleton (Vercel serverless safe)
│   │   ├── engine/             # 100% PURE domain logic (Zero Next.js / Zero React)
│   │   ├── schemas/            # Shared Zod contracts (Imports ONLY Zod)
│   │   └── security/           # Error sanitizer & sliding-window rate limiter
│   └── middleware.ts           # Route protection & security headers
├── tests/
│   ├── integration/            # API Route Handler tests
│   └── unit/                   # Pure Engine, Conflict Detector & Compiler tests
└── prisma/
    └── schema.prisma           # Neon PostgreSQL database schema
```

### Dependency Rules:
1. `/src/lib/schemas` imports **only** `zod`.
2. `/src/lib/engine` is **100% pure, synchronous TypeScript**; zero React or Next.js imports.
3. `/src/components/**` **never** imports Prisma or server-only auth directly.

---

## 📄 License

MIT © 2026 [MasRizqi07](https://github.com/MasRizqi07). All rights reserved.
