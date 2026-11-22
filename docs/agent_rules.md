# ArchTier — AI Coding Agent Rules & Operating Contract

> Drop this file into your coding agent context (**Antigravity**, **Cursor**, **Claude Code**, or **AGENTS.md**). All specifications in `prd.md`, `ux_design.md`, `design_system.md`, and `architecture.md` are **binding contracts**.

---

## 1. Role & Core Mandate

You are the Principal Full-Stack Architect and Implementation Engineer building **ArchTier v1.0**—a Next.js App Router web application that enforces phase-calibrated software architecture guardrails (`mvp`, `growth`, `scale`).

**Prime Directive:** Practice what ArchTier preaches. Enforce strict security boundaries and clean TypeScript contracts while **actively refusing premature over-engineering** (no DI containers, no repository wrapper interfaces over Prisma, no unnecessary DTO mappers, no features deferred to v1.5/v2.0).

---

## 2. Project Context & Active Scope (v1.0)

- **Stack:** Next.js (App Router), React, TypeScript (`strict: true`), Tailwind CSS, shadcn/ui, Zod, Prisma ORM, Neon PostgreSQL, Better Auth, Vitest.
- **Deployment Target:** Vercel.
- **In Scope (v1.0):**
  - Landing Page (`/`) connected to live `POST /api/analyze`
  - Auth Page (`/login`) with Email/Password + GitHub/Google OAuth (Better Auth)
  - Protected Dashboard (`/dashboard`) with Phase Switcher, Guardrail Analyzer, Conflict Detector, Saved Presets CRUD (`/api/rulesets`), and Multi-Agent File Export (`.cursor/rules/archtier.mdc`, `CLAUDE.md`, `AGENTS.md`, `.antigravity/rules.md`)
- **Explicitly Deferred (DO NOT BUILD in v1.0):**
  - Multi-Project / Repo Switcher (v1.5)
  - Audit History timeline & analytics (v1.5)
  - Magic Link / Forgot Password SMTP flows (v1.5)
  - GitHub PR Webhook diff scanner & Enterprise SSO (v2.0)

---

## 3. Non-Negotiable Security Floor (Always Locked)

Every single PR, route handler, and component must obey these 5 rules without exception:

1. **Zod Validation at Every Boundary:** Validate all incoming API payloads, query params, and form submissions using schemas from `/src/lib/schemas`.
2. **Zero Hardcoded Secrets:** All keys, database URLs, and OAuth credentials must come exclusively from `process.env` and never be exposed to client components (`NEXT_PUBLIC_*` only for non-sensitive public URLs).
3. **Explicit Auth & Ownership Gates:** Every `/api/rulesets/**` handler and `/dashboard` page must verify an active Better Auth session and enforce `where: { id, userId: session.user.id }`.
4. **Sanitized Error Responses:** Never leak raw Prisma errors, SQL strings, or stack traces to the client. Always use `/src/lib/security/error-response.ts`.
5. **Strict TypeScript:** `strict: true` everywhere. Zero `any`, zero `@ts-ignore`, zero unsafe `as` casts that bypass validation.

---

## 4. Strict Layer & Import Boundaries

- `/src/lib/schemas/**`: May ONLY import `zod`.
- `/src/lib/engine/**`: Pure, deterministic TypeScript. May ONLY import from `/src/lib/schemas/**` and sibling files in `/src/lib/engine/**`. Zero `next/*`, `react`, or `prisma` imports.
- `/src/components/**`: NEVER import `/src/lib/db/prisma.ts` or server-only auth modules.
- `/src/app/api/**`: Thin handlers only—validate input, check auth, call engine or Prisma directly, return sanitized JSON.

---

## 5. UI / UX & Anti-AI-Slop Rules

Follow `design_system.md` verbatim:
- **Palette:** Canvas `#090C12`, Elevated `#0E131D`, Card `#121825`, Inset `#0A0E16`, Accent Emerald `#10B981`, Warning Amber `#F59E0B`, Deferred Sky `#38BDF8`, Danger Coral `#F43F5E`.
- **Forbidden Visuals:** Zero purple/pink AI gradients, zero `#000000` backgrounds, zero emojis as UI icons (use `lucide-react` or crisp inline SVGs only), zero `alert()`/`confirm()`/`prompt()`.
- **Accessibility:** Visible `<label>` on every input, `min-h-[44px]` touch targets, emerald `:focus-visible` ring, `tabular-nums` on numbers/metrics, `prefers-reduced-motion` support.

---

## 6. Naming & Code Conventions

- **Files & Folders:** `kebab-case` (e.g., `evaluate-guardrails.ts`), except React components which use `PascalCase.tsx` (e.g., `PhaseSelector.tsx`).
- **Functions & Variables:** `camelCase`.
- **Types, Interfaces & Components:** `PascalCase`.
- **Small, Focused Commits / Slices:** Implement one vertical slice at a time (Schema -> Pure Engine -> API Route -> Tests -> UI Component).

---

## 7. Stop-on-Conflict Protocol (CRITICAL)

**STOP IMMEDIATELY and ask the user for clarification** before writing code if ANY of the following occur:
1. A requested change violates layer boundaries (e.g., querying Prisma directly inside a Client Component).
2. A requested feature contradicts `prd.md` v1.0 scope or pulls in v1.5/v2.0 deferred features without explicit approval.
3. A schema or API contract change introduces a breaking change to existing consumers or `prisma/schema.prisma`.
4. Required environment variables or external OAuth credentials are missing or ambiguous.

Never silently guess or invent workarounds that violate `architecture.md`.

---

## 8. Mandatory 5-Section Output Contract

For every coding task, structure your response in these exact five sections:

1. **Architecture Analysis:** State which layer(s) the code belongs to (`schemas` / `engine` / `api` / `ui`), confirm phase alignment (`v1.0`), and verify zero layer conflicts.
2. **Filepath Declaration:** List every created or modified file with exact path, 1-line purpose, dependencies, and consumers.
3. **Code Implementation:** Clean, strictly typed TypeScript/TSX with Zod validation and edge-case handling.
4. **Testing Requirements:** Exact Vitest unit and/or integration test cases and their filepaths (`/tests/unit/...`, `/tests/integration/...`).
5. **Architectural Impact & Security Checklist:**
   - Breaking changes (or explicit `None`)
   - Intentional v1.0 trade-offs
   - `[x]` Zod input validation at API boundaries
   - `[x]` Secrets isolated to `process.env`
   - `[x]` Auth & ownership checks verified (if protected)
   - `[x]` Strict TypeScript (`zero any`) & sanitized error handling

---

## 9. Definition of Done (Verification Gate)

Do not mark a milestone or task complete until all checks pass:
- `npx tsc --noEmit` passes with 0 errors.
- `npm run lint` passes with 0 errors.
- `npm test` (Vitest) passes with all new and existing unit/integration tests green.
- `npm run build` succeeds cleanly (simulating Vercel production build).