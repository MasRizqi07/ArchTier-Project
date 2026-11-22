<div align="center">

# 🏗️ ArchTier

**Architecture guardrails that scale with your stage.**

*A phase-calibrated compiler of software architecture guardrails for AI coding agents.*  
*Prevents premature over-engineering without sacrificing security or type-safety.*

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-purple?style=flat-square)](https://www.better-auth.com/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma_v6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest_21_Passed-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

[Live Engine](#-core-features) • [Adaptive Matrix](#-adaptive-guardrail-matrix) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture Guidelines](#-strict-layer-boundaries)

---

</div>

## 📌 Executive Summary & Philosophy

Modern software engineering with AI coding agents (**Antigravity**, **Cursor**, **Claude Code**, **ChatGPT**, **Codex**) frequently gets trapped between two extremes:

1. **Premature Over-Engineering:** Standard "Senior Architect" prompts treat a 2-week MVP like a 400-engineer banking monolith—forcing Repository Interfaces, Multi-Layer DTO Mappers, Use-Case wrappers, and Event Buses from day one. Shipping slows down by **2–3x**.
2. **Architectural Drift & Spaghetti Code:** Without guardrails, coding agents quickly degrade codebases: executing database queries directly inside React components, omitting payload validation, leaking secret API keys in client bundles, and abusing TypeScript's `any`.

### The ArchTier Solution
**ArchTier** separates the **Non-Negotiable Security Floor** (rules that are *always locked* across all phases) from **premature structural ceremonies** through a 3-tier lifecycle engine:

```
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
  Framework-agnostic, zero-LLM-latency (<100ms p95), and zero token cost. Evaluates phase, stack, task category, and feature description into a complete `GuardrailReport`.
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

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15+ (App Router)
- **UI Library:** React 19
- **Language:** TypeScript 5.7+ (`strict: true`)
- **Styling:** Tailwind CSS v3.4 + Custom Architectural Design Tokens
- **Icons:** Inline SVGs & Lucide Icons
- **Validation:** Zod v3.24
- **ORM & Database:** Prisma v6 + PostgreSQL (Neon Serverless compatible)
- **Authentication:** Better Auth v1.4
- **Testing:** Vitest v3
- **Deployment:** Vercel

---

## 📁 Project Structure

```text
ArchTier-Project/
├── .env.example                     # Environment variables blueprint
├── .gitignore                       # Production gitignore (secrets & build caches ignored)
├── package.json                     # Dependencies and build scripts
├── tsconfig.json                    # Strict TypeScript configuration
├── tailwind.config.ts               # Architectural Dark v2.4 theme tokens
├── vitest.config.ts                 # Vitest test suite configuration
├── prisma/
│   └── schema.prisma                # PostgreSQL models: User, Session, Account, RulesetPreset
├── docs/
│   ├── prd.md                       # Product Requirements & v1.0 / v1.5 scope
│   ├── architecture.md              # System Architecture & Layer Boundaries
│   ├── design_system.md             # CSS variables, typography & A11y rules
│   ├── ux_design.md                 # User flows & Dashboard wireframes
│   ├── project_context.md           # Executive brief & session handoff
│   └── agent_rules.md               # Binding AI coding agent operating rules
├── templates/
│   ├── landing.html                 # Approved Landing Page HTML Mockup
│   └── login.html                   # Approved Login Split-Screen HTML Mockup
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with Google Fonts & noise overlay
│   │   ├── globals.css              # Design system variables & base styling
│   │   ├── page.tsx                 # Interactive Landing Page with Live Engine
│   │   ├── login/
│   │   │   └── page.tsx             # Auth Page (Sign In / Register / OAuth)
│   │   └── api/
│   │       ├── analyze/route.ts     # POST /api/analyze (Zod-validated & rate-limited)
│   │       └── auth/[...all]/route.ts # Better Auth route handler
│   ├── components/
│   │   ├── shared/                  # BrandLogo, StatusPill
│   │   ├── landing/                 # LandingSimulator (Interactive Island)
│   │   └── auth/                    # AuthForm, WorkspacePreview
│   └── lib/
│       ├── schemas/
│       │   ├── guardrail.schema.ts  # Shared Zod contracts for engine
│       │   └── auth.schema.ts       # Auth & password validation schemas
│       ├── engine/
│       │   ├── rule-registry.ts     # Security floor & phase-calibrated rule catalog
│       │   ├── conflict-detector.ts # Boundary & anti-overengineering conflict scanner
│       │   ├── evaluate-guardrails.ts # Main pure evaluator function
│       │   └── export-compiler.ts   # Compiles reports to .mdc / CLAUDE.md / AGENTS.md
│       ├── security/
│       │   ├── error-response.ts    # Sanitized client error formatter
│       │   └── rate-limit.ts        # Sliding-window rate limiter
│       ├── db/
│       │   └── prisma.ts            # PrismaClient singleton for serverless
│       └── auth/
│           ├── auth.ts              # Better Auth server instance
│           └── auth-client.ts       # Better Auth React client
└── tests/
    ├── unit/
    │   ├── evaluate-guardrails.test.ts # Rule evaluation & metric assertions
    │   ├── conflict-detector.test.ts   # Layer violation & conflict assertions
    │   ├── export-compiler.test.ts     # Multi-agent export format assertions
    │   └── auth-schema.test.ts         # Zod auth validation & strength evaluator tests
    └── integration/
        └── api-analyze.test.ts         # Route handler integration tests
```

---

## 📐 Strict Layer Boundaries

ArchTier enforces its architectural constraints through strict dependency directions:

```text
[ /src/lib/schemas ]  ──► Only imports Zod. Zero framework or ORM imports.
         ▲
         │
[ /src/lib/engine ]   ──► Pure TypeScript. Only imports from /src/lib/schemas.
         ▲
         │
[ /src/app/api/** ]   ──► Thin controllers: validates Zod -> calls Engine/Prisma -> returns JSON.
         ▲
         │
[ /src/components ]   ──► Presentation only. NEVER imports PrismaClient or server-only auth.
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** `>= 18.18.0` (Recommended: v20 or v22)
- **Package Manager:** `npm`, `pnpm`, or `yarn`

### 1. Clone & Install
```bash
git clone https://github.com/MasRizqi07/ArchTier-Project.git
cd ArchTier-Project
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update with your PostgreSQL connection string and a secret key:
```ini
DATABASE_URL="postgresql://user:password@localhost:5432/archtier?schema=public"
BETTER_AUTH_SECRET="your-32-character-minimum-random-secret-key"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Generate Database Client
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to explore the Landing Page and live Phase Simulator.

---

## 🧪 Testing & Verification

ArchTier comes with an automated Vitest test suite covering core engine evaluation, conflict detection, multi-agent export compilation, and API route validation:

```bash
# Run all unit and integration tests (21 tests)
npm test

# Run TypeScript strict typecheck (zero any, zero errors)
npm run typecheck

# Run Next.js production build simulation
npm run build
```

---

## 📜 Mandatory 5-Section Output Contract

Every AI coding agent contributing code to ArchTier must deliver its output in these five structured sections:
1. **Architecture Analysis:** Identifies layer placement and verifies zero boundary conflicts.
2. **Filepath Declaration:** Exact paths, dependencies, and consumers.
3. **Code Implementation:** Strict TypeScript (`strict: true`), zero `any`, and comprehensive Zod validation.
4. **Testing Requirements:** Specific unit/integration test specifications in `/tests/`.
5. **Architectural Impact & Security Checklist:** Breaking changes, trade-offs, and security verification.

---

## 🗺️ Product Roadmap

- [x] **Milestone 1 — Foundation & Core Engine:** Next.js App Router, Design Tokens, Zod Schemas, Pure Guardrail Engine, `POST /api/analyze`, and Vitest suite.
- [x] **Milestone 2 — Auth & Database Layer:** PostgreSQL Prisma schema, Better Auth integration, `/login` split-screen auth with password strength meter, and demo fills.
- [ ] **Milestone 3 — Landing Page Polish:** Full bento grid interactions and prompt builder sandbox.
- [ ] **Milestone 4 — Workspace Dashboard & Presets:** `/dashboard` split workbench, Saved Presets CRUD (`/api/rulesets`), and Multi-Agent File Exporter (`.cursor/rules/archtier.mdc`, `CLAUDE.md`, `AGENTS.md`).
- [ ] **Milestone 5 — Production Hardening & Vercel Deploy:** Security audit, WCAG A11y verification, and live Vercel launch.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with precision by <strong>Alex Rivera &amp; MasRizqi07</strong> · Architecture guardrails that scale with your stage.</sub>
</div>
