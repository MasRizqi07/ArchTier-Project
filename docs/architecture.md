# System Architecture Specification — ArchTier (v1.0)

This document is the binding engineering contract for ArchTier v1.0. It adheres to ArchTier's own **MVP-to-Growth pragmatic standard**: strict security boundaries, strict TypeScript contracts, and pure testable domain logic—with zero unnecessary enterprise boilerplate (no DI containers, no repository wrapper interfaces over Prisma, no event buses in v1.0).

---

## 1. High-Level Architecture Overview

```text
[ Browser / Client (Next.js App Router + React + Tailwind + shadcn/ui) ]
       │
       ├── Public Pages: / (Landing), /login (Auth)
       ├── Protected Page: /dashboard (Workbench + Preset Manager + Exporter)
       │
       ▼ HTTPS (JSON / Zod-Validated Contracts)
[ Next.js Route Handlers (/src/app/api/**) — Hosted on Vercel ]
       │
       ├── /api/auth/[...all]   ──► Better Auth Handler (Email/Pwd + GitHub + Google)
       ├── /api/analyze         ──► Pure Domain Engine (/src/lib/engine) [Stateless, Fast]
       └── /api/rulesets        ──► Session Guard + Prisma Client (/src/lib/db)
                                           │
                                           ▼ Connection Pooling (SSL)
                                [ Neon Serverless PostgreSQL ]
```

### Core Tech Stack
- **Framework:** Next.js 15+ (App Router), React 19, TypeScript (`strict: true`)
- **Styling & UI:** Tailwind CSS, shadcn/ui, `lucide-react`
- **Validation & Contracts:** Zod (`/src/lib/schemas`)
- **Domain Logic:** Pure TypeScript, zero framework imports (`/src/lib/engine`)
- **Authentication:** Better Auth (`better-auth`) with Prisma Adapter (Email/Password, GitHub OAuth, Google OAuth)
- **Database & ORM:** Neon Serverless PostgreSQL + Prisma ORM
- **Testing:** Vitest (Unit & Integration)
- **Deployment:** Vercel (Preview & Production)

---

## 2. Folder Structure & Layer Boundaries

```text
/
├── prisma/
│   ├── schema.prisma                   # Better Auth + RulesetPreset models
│   └── migrations/                     # Prisma SQL migrations
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # Root layout, next/font, global atmospheric backdrop
│   │   ├── globals.css                 # ArchTier v2.4 Design System CSS tokens
│   │   ├── page.tsx                    # Landing Page (Server shell + Interactive client islands)
│   │   ├── login/
│   │   │   └── page.tsx                # Auth Page (Sign In / Register / OAuth)
│   │   ├── dashboard/
│   │   │   └── page.tsx                # Protected Workbench (Server auth check + Workbench UI)
│   │   └── api/
│   │       ├── auth/[...all]/route.ts  # Better Auth catch-all handler
│   │       ├── analyze/route.ts        # POST /api/analyze (Public, Zod-validated, rate-limited)
│   │       └── rulesets/
│   │           ├── route.ts            # GET (list) & POST (create) user presets
│   │           └── [id]/route.ts       # PATCH (update) & DELETE (remove) user preset
│   ├── components/
│   │   ├── ui/                         # shadcn/ui primitives styled to ArchTier tokens
│   │   ├── shared/                     # BrandLogo, StatusPill, CommandPalette, ToastProvider
│   │   ├── landing/                    # HeroSimulator, AntiSlopDiff, BentoMatrix, PromptSandbox
│   │   ├── auth/                       # LoginSplitShell, AuthForm, WorkspacePreviewPanel
│   │   └── dashboard/                  # WorkbenchShell, PresetSidebar, RuleReportView, AgentExporter
│   ├── lib/
│   │   ├── schemas/
│   │   │   ├── guardrail.schema.ts     # Shared Zod schemas for analyze engine
│   │   │   └── ruleset.schema.ts       # Shared Zod schemas for preset CRUD
│   │   ├── engine/
│   │   │   ├── rule-registry.ts        # Deterministic security floor & structural rule catalog
│   │   │   ├── conflict-detector.ts    # Layer boundary & anti-pattern conflict scanner
│   │   │   ├── evaluate-guardrails.ts  # Main pure evaluator: (AnalysisRequest) => GuardrailReport
│   │   │   └── export-compiler.ts      # Compiles GuardrailReport into .mdc / CLAUDE.md / AGENTS.md
│   │   ├── auth/
│   │   │   ├── auth.ts                 # Better Auth server instance (Prisma adapter)
│   │   │   └── auth-client.ts          # Better Auth React client helper
│   │   ├── db/
│   │   │   └── prisma.ts               # PrismaClient singleton (Vercel serverless safe)
│   │   └── security/
│   │       ├── error-response.ts       # Safe sanitized JSON error formatter
│   │       └── rate-limit.ts           # Lightweight sliding-window guard for /api/analyze
│   └── middleware.ts                   # Route protection helper for /dashboard
└── tests/
    ├── unit/
    │   ├── evaluate-guardrails.test.ts # Engine phase, security floor, & category assertions
    │   ├── conflict-detector.test.ts   # Stop-on-conflict detection assertions
    │   └── export-compiler.test.ts     # .mdc / CLAUDE.md / AGENTS.md output assertions
    └── integration/
        ├── api-analyze.test.ts         # POST /api/analyze contract & HTTP 400/200 tests
        └── api-rulesets.test.ts        # Auth gate (401) & ownership isolation tests
```

### Strict Dependency Direction Rules
1. `/src/lib/schemas` -> Imports **only** `zod`. Zero imports from `next`, `prisma`, or `react`.
2. `/src/lib/engine` -> Imports **only** from `/src/lib/schemas` and sibling files in `/src/lib/engine`. Must remain 100% pure, synchronous, and framework-agnostic.
3. `/src/components/**` -> **NEVER** imports `/src/lib/db/prisma.ts` or `/src/lib/auth/auth.ts` (server-only). Client components communicate exclusively via `/api/**` or props from Server Components.
4. `/src/app/api/**` -> Thin controllers: validate with Zod -> check auth (if protected) -> invoke `/src/lib/engine` or Prisma -> return sanitized JSON.

---

## 3. Database Schema (`prisma/schema.prisma`)

Designed for **Neon PostgreSQL** with standard **Better Auth** core tables (`User`, `Session`, `Account`, `Verification`) plus ArchTier's `RulesetPreset` table for v1.0.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")        // Neon pooled connection URL
  directUrl = env("DIRECT_URL")          // Neon direct URL for Prisma migrations
}

enum ProjectPhase {
  mvp
  growth
  scale
}

enum TechStackId {
  nextjs
  react_express
  laravel
  go_react
}

enum TaskCategory {
  auth
  api_route
  payment_webhook
  database
  ui_component
  core_logic
}

// --- Better Auth Core Models ---
model User {
  id            String          @id @default(cuid())
  name          String
  email         String          @unique
  emailVerified Boolean         @default(false)
  image         String?
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  sessions      Session[]
  accounts      Account[]
  presets       RulesetPreset[]
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([userId])
}

model Account {
  id                    String    @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
}

model Verification {
  id         String    @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime? @default(now())
  updatedAt  DateTime? @updatedAt
}

// --- ArchTier v1.0 Domain Model ---
model RulesetPreset {
  id              String       @id @default(cuid())
  userId          String
  user            User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  name            String       @db.VarChar(80)
  phase           ProjectPhase @default(mvp)
  stack           TechStackId  @default(nextjs)
  taskCategory    TaskCategory @default(api_route)
  taskDescription String       @db.Text
  targetPath      String?      @db.VarChar(200)
  customNotes     String?      @db.Text
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@index([userId, updatedAt(sort: Desc)])
}
```

---

## 4. Shared Zod Contracts (`/src/lib/schemas/guardrail.schema.ts`)

```typescript
import { z } from 'zod';

export const ProjectPhaseSchema = z.enum(['mvp', 'growth', 'scale']);
export const TechStackSchema = z.enum(['nextjs', 'react_express', 'laravel', 'go_react']);
export const TaskCategorySchema = z.enum([
  'auth',
  'api_route',
  'payment_webhook',
  'database',
  'ui_component',
  'core_logic',
]);
export const RuleStatusSchema = z.enum(['mandatory', 'recommended', 'deferred']);

export const AnalysisRequestSchema = z.object({
  phase: ProjectPhaseSchema,
  stack: TechStackSchema,
  taskCategory: TaskCategorySchema.default('api_route'),
  taskDescription: z.string().trim().min(12, 'Describe the feature task in at least 12 characters.').max(1500),
  targetPath: z.string().trim().max(200).optional(),
});

export const GuardrailRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['security_floor', 'structural', 'contextual', 'testing']),
  status: RuleStatusSchema,
  reason: z.string(),
  locked: z.boolean(),
});

export const ConflictWarningSchema = z.object({
  code: z.string(),
  severity: z.enum(['blocking', 'advisory']),
  message: z.string(),
  clarificationPrompt: z.string(),
});

export const GuardrailReportSchema = z.object({
  phase: ProjectPhaseSchema,
  stack: TechStackSchema,
  taskCategory: TaskCategorySchema,
  declaredFilepath: z.string(),
  summary: z.object({
    mandatoryCount: z.number().int().nonnegative(),
    recommendedCount: z.number().int().nonnegative(),
    deferredCount: z.number().int().nonnegative(),
    estimatedBoilerplateSavedPct: z.number().int().min(0).max(100),
  }),
  conflicts: z.array(ConflictWarningSchema),
  rules: z.array(GuardrailRuleSchema),
  fivePartContract: z.object({
    analysis: z.string(),
    filepath: z.string(),
    codeGuidance: z.string(),
    testing: z.string(),
    impactChecklist: z.string(),
  }),
});
```

---

## 5. Pure Domain Engine Design (`/src/lib/engine`)

1. **`evaluateGuardrails(input: AnalysisRequest): GuardrailReport`**
   - Always injects the 4 **Non-Negotiable Security Floor** rules (`zod_input_validation`, `env_secrets_isolation`, `safe_error_responses`, `strict_type_safety`) with `status: 'mandatory'` and `locked: true` regardless of phase.
   - Evaluates **Structural Rules** against `phase` (`mvp` -> defers Repository DI, Multi-layer DTOs, Event Bus; `growth` -> promotes Shared Schemas & Integration Tests to `mandatory`, Repository DI to `recommended`; `scale` -> promotes all to `mandatory`).
   - Injects **Contextual Rules** based on `taskCategory` (e.g. `payment_webhook` locks HMAC signature check & idempotency key; `auth` locks password hashing, HttpOnly cookie/session flags, and rate limiting).
   - Resolves an idiomatic `declaredFilepath` tailored to `stack`, `phase`, and `taskCategory`.
2. **`detectConflicts(input: AnalysisRequest): ConflictWarning[]`**
   - Pure deterministic scanner catching common architectural violations before code is generated:
     - **DB-in-UI Violation:** `targetPath` starts with `/src/components` (or `taskCategory === 'ui_component'`) AND `taskDescription` mentions `prisma`, `sql`, `query`, `database`, or `secret`.
     - **Hardcoded Secret Risk:** `taskDescription` mentions hardcoded API keys, tokens, or credentials in client code.
     - **Over-Engineering Conflict:** `phase === 'mvp'` AND `taskDescription` requests `microservice`, `kafka`, `event bus`, or `clean architecture repository factory`. Triggers an advisory warning explaining why ArchTier recommends deferring it until `scale`.
3. **`compileAgentExport(report, format)`**
   - Supports 4 deterministic output targets:
     - `cursor` -> `.cursor/rules/archtier.mdc` (with valid YAML frontmatter `description`, `globs`, `alwaysApply: false`)
     - `claude` -> `CLAUDE.md`
     - `agents` -> `AGENTS.md`
     - `antigravity` -> `.antigravity/rules.md`

---

## 6. API Endpoints Specification

| Method & Path | Auth Required | Request Validation | Response Codes |
| :--- | :--- | :--- | :--- |
| `POST /api/analyze` | Public (Rate-limited: 60 req/min per IP) | `AnalysisRequestSchema` | `200` (`GuardrailReport`), `400` (Zod issues), `429` |
| `GET /api/rulesets` | Yes (`401` if guest) | None | `200` (`RulesetPreset[]` scoped to `session.user.id`) |
| `POST /api/rulesets` | Yes (`401` if guest) | `CreateRulesetSchema` (max 20/user) | `201` (`RulesetPreset`), `400`, `403` (quota reached) |
| `PATCH /api/rulesets/[id]` | Yes + Owner check | `UpdateRulesetSchema` | `200` (`RulesetPreset`), `400`, `404` |
| `DELETE /api/rulesets/[id]` | Yes + Owner check | Path param `id` | `200` (`{ deleted: true }`), `404` |
| `GET/POST /api/auth/[...all]` | Handled by Better Auth | Better Auth internal | Standard auth session/OAuth responses |

---

## 7. Security Floor & Environment Variables

### Required Environment Variables (`.env.local` & Vercel Project Settings)
```bash
DATABASE_URL="postgresql://...pooler.neon.tech/archtier?sslmode=require"
DIRECT_URL="postgresql://...neon.tech/archtier?sslmode=require"
BETTER_AUTH_SECRET="<min-32-char-cryptographic-random-secret>"
BETTER_AUTH_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
GITHUB_CLIENT_ID="<github-oauth-client-id>"
GITHUB_CLIENT_SECRET="<github-oauth-client-secret>"
GOOGLE_CLIENT_ID="<google-oauth-client-id>"
GOOGLE_CLIENT_SECRET="<google-oauth-client-secret>"
```

### Error Sanitization Policy
Every Route Handler wraps execution in `try/catch` and delegates failures to `/src/lib/security/error-response.ts`:
- `ZodError` -> HTTP `400` with clean `{ error: 'VALIDATION_ERROR', issues: [...] }`
- Unauthenticated -> HTTP `401` `{ error: 'UNAUTHORIZED', message: 'Authentication required.' }`
- Unknown / DB Error -> Logs server-side details via structured console error, returns generic HTTP `500` `{ error: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' }` (never exposes Prisma messages or stack traces).

---

## 8. Testing & Vercel Deployment Pipeline

### Testing Strategy (Vitest)
- **Unit Tests (`/tests/unit/`):** Run in $< 500\text{ ms}$ with zero database dependency. Verify:
  - Security floor rules remain `mandatory` across `mvp`, `growth`, `scale`.
  - Structural rules shift statuses accurately per phase.
  - Conflict detector flags DB-in-UI and MVP over-engineering accurately.
  - Export compiler produces valid `.mdc` frontmatter and 5-section contract.
- **Integration Tests (`/tests/integration/`):** Invoke Route Handler functions directly (`POST(request)`) with mocked auth session/Prisma layer to verify `400`, `401`, `404`, and `200/201` responses.

### Vercel Production Deployment Checklist
1. Connect GitHub repository to Vercel; set Build Command to `npx prisma generate && next build`.
2. Configure all Environment Variables in Vercel for **Production** and **Preview** scopes.
3. Run `npx prisma migrate deploy` against Neon PostgreSQL during release or CI step before promoting traffic.
4. Register production OAuth callback URLs in GitHub & Google Consoles:
   - `https://<your-domain>/api/auth/callback/github`
   - `https://<your-domain>/api/auth/callback/google`
5. Verify `npm run typecheck && npm run lint && npm test` pass in CI before merging to `main`.