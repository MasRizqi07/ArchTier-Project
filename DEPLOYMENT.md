# ArchTier — Production Deployment & Operations Guide

This guide provides end-to-end instructions for deploying **ArchTier v1.0** to **Vercel** with **Neon Serverless PostgreSQL** and setting up **Better Auth** with GitHub & Google OAuth.

---

## 1. Architecture & Infrastructure Overview

```text
[ Developer / Browser ]
          │
          ▼ HTTPS (Edge SSL)
[ Vercel Serverless Platform (Next.js 15 App Router) ]
    ├── Static & Dynamic Edge Routes (/ , /login, /dashboard)
    ├── Route Handlers (/api/analyze, /api/auth/[...all], /api/rulesets)
    └── In-Memory Rate Limiting & Security Headers
          │
          ▼ Pooled PostgreSQL (TLS 1.3, port 5432 / 6543)
[ Neon Serverless PostgreSQL ]
    ├── Better Auth Tables (User, Session, Account, Verification)
    └── ArchTier Domain Table (RulesetPreset)
```

---

## 2. Prerequisites

- **Node.js**: v20.x or v22.x LTS
- **Package Manager**: npm v10+
- **Neon Account**: [neon.tech](https://neon.tech)
- **Vercel Account**: [vercel.com](https://vercel.com)
- **GitHub Repository**: [github.com/MasRizqi07/ArchTier-Project](https://github.com/MasRizqi07/ArchTier-Project)

---

## 3. Database Setup (Neon PostgreSQL)

1. Log in to [Neon Console](https://console.neon.tech) and create a new project named `archtier-prod`.
2. Under **Connection Details**, copy both connection strings:
   - **Pooled connection string** (for runtime queries via PgBouncer):
     ```text
     DATABASE_URL="postgresql://<user>:<password>@<ep-pooler>.neon.tech/archtier?sslmode=require"
     ```
   - **Direct connection string** (for schema migrations & Prisma CLI):
     ```text
     DIRECT_URL="postgresql://<user>:<password>@<ep-direct>.neon.tech/archtier?sslmode=require"
     ```
3. Initialize the schema in Neon by running Prisma migrate or db push:
   ```bash
   # Set temporary environment variable in your terminal
   export DATABASE_URL="<your-neon-pooled-url>"
   export DIRECT_URL="<your-neon-direct-url>"

   # Push schema to database
   npx prisma db push
   ```

---

## 4. Authentication Secrets & OAuth Configuration

### A. Better Auth Secret
Generate a cryptographically secure 32+ character random string:
```bash
# On Linux / macOS / Git Bash / PowerShell (openssl or node)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Set this as `BETTER_AUTH_SECRET`.

### B. GitHub OAuth App Setup
1. Go to **GitHub Settings** > **Developer Settings** > **OAuth Apps** > **New OAuth App**.
2. **Application name**: `ArchTier Production`
3. **Homepage URL**: `https://your-archtier-domain.vercel.app`
4. **Authorization callback URL**:
   ```text
   https://your-archtier-domain.vercel.app/api/auth/callback/github
   ```
5. Note the generated **Client ID** (`GITHUB_CLIENT_ID`) and generate a **Client Secret** (`GITHUB_CLIENT_SECRET`).

### C. Google OAuth 2.0 Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Web Application).
3. **Authorized JavaScript origins**: `https://your-archtier-domain.vercel.app`
4. **Authorized redirect URIs**:
   ```text
   https://your-archtier-domain.vercel.app/api/auth/callback/google
   ```
5. Note the **Client ID** (`GOOGLE_CLIENT_ID`) and **Client Secret** (`GOOGLE_CLIENT_SECRET`).

---

## 5. Vercel Deployment Steps

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** > **"Project"**.
2. Select repository `MasRizqi07/ArchTier-Project` and click **Import**.
3. **Framework Preset**: `Next.js`
4. **Build and Output Settings**:
   - Build Command: `prisma generate && next build` (automatic via `package.json`)
   - Output Directory: `.next`
5. **Environment Variables**: Add the following:

| Variable Name | Environment | Value Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Production & Preview | Neon pooled connection string |
| `DIRECT_URL` | Production & Preview | Neon direct connection string |
| `BETTER_AUTH_SECRET` | Production & Preview | 32+ character secret |
| `BETTER_AUTH_URL` | Production & Preview | `https://your-archtier-domain.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | Production & Preview | `https://your-archtier-domain.vercel.app` |
| `GITHUB_CLIENT_ID` | Production & Preview | GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | Production & Preview | GitHub OAuth App Client Secret |
| `GOOGLE_CLIENT_ID` | Production & Preview | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Production & Preview | Google OAuth Client Secret |

6. Click **Deploy**. Vercel will run `prisma generate`, TypeScript typecheck, and production bundle optimization.

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Link project
vercel link

# Pull environment variables or set them in project settings
vercel env add DATABASE_URL
vercel env add BETTER_AUTH_SECRET

# Deploy to production
vercel --prod
```

---

## 6. Post-Deployment Verification & Smoke Tests

After deployment succeeds, verify all system components:

1. **Landing Page (`/`)**:
   - Verify Hero section loads in $< 1.5\text{s}$ without layout shifts.
   - Test Phase Simulator switcher (`MVP` $\to$ `Growth` $\to$ `Scale`): verify rule counts update and real HTTP `200` response from `/api/analyze`.
   - Test Command Palette (`⌘K` / `Ctrl+K`).
2. **API Rate Limiter (`POST /api/analyze`)**:
   ```bash
   curl -X POST https://your-domain.vercel.app/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"phase":"mvp","stack":"nextjs","taskCategory":"api_route","taskDescription":"Build public endpoint with Zod validation."}'
   ```
   Should return HTTP `200` with `GuardrailReport` JSON.
3. **Authentication (`/login`)**:
   - Test Sign In and Sign Up with email/password.
   - Test OAuth buttons (GitHub & Google).
   - Test Demo Mode fallback (`/dashboard?demo=true`).
4. **Workspace Dashboard (`/dashboard`)**:
   - Verify preset list loads from `/api/rulesets`.
   - Save a new custom preset (verify HTTP `201`).
   - Download rule files (`.cursor/rules/archtier.mdc`, `CLAUDE.md`, `AGENTS.md`).

---

## 7. Security & Maintenance Checklist

- [x] **Strict Security Headers**: Enabled via `next.config.ts` and `src/middleware.ts` (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`).
- [x] **Sanitized Error Responses**: All database errors and stack traces are suppressed from client responses via `formatErrorResponse`.
- [x] **Rate Limiting**: Public endpoint `/api/analyze` protected by in-memory sliding window rate limiter (60 req/min per IP).
- [x] **Prisma Connection Pooling**: Safe for Vercel serverless functions with Neon PgBouncer connection strings.
- [x] **Continuous Integration**: GitHub Actions runs typecheck, lint, Vitest unit/integration tests, and production build on every push.
