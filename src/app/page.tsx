import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { LandingSimulator } from '@/components/landing/LandingSimulator';
import { BentoGrid } from '@/components/landing/BentoGrid';
import { PromptSandbox } from '@/components/landing/PromptSandbox';
import { PricingSection } from '@/components/landing/PricingSection';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { StatusPill } from '@/components/shared/StatusPill';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col text-ink-primary bg-bg-primary">
      {/* Command Palette Modal */}
      <CommandPalette />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-bg-primary/80 border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo />
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-medium text-ink-secondary">
            <a href="#simulator" className="hover:text-ink-primary transition-colors">
              Live Engine
            </a>
            <a href="#comparison" className="hover:text-ink-primary transition-colors">
              Anti-Slop Diff
            </a>
            <a href="#features" className="hover:text-ink-primary transition-colors">
              Guardrail Matrix
            </a>
            <a href="#sandbox" className="hover:text-ink-primary transition-colors">
              Prompt Builder
            </a>
            <a href="#pricing" className="hover:text-ink-primary transition-colors">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-surface-inset border border-border-subtle text-[11px] font-mono text-ink-muted">
              <span>Press</span>
              <kbd className="px-1 py-0.2 rounded bg-surface-card border border-border-strong text-ink-primary">
                ⌘K
              </kbd>
            </div>
            <Link
              href="/login"
              className="px-4 py-2 rounded-md text-xs font-semibold font-mono uppercase tracking-wider bg-accent-primary text-[#04130D] hover:bg-accent-primary-hover active:scale-95 transition-all shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-border-strong text-xs font-mono text-ink-secondary">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                <span>Anti Over-Engineering Guardrails</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-ink-primary">
                Architecture guardrails that scale with your stage.
              </h1>

              <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-xl">
                Generic coding prompts over-engineer MVPs with redundant enterprise ceremonies. ArchTier deterministically enforces what matters (<span className="text-accent-primary font-medium">Zod, Env Secrets, Strict Types</span>) and deliberately defers what slows you down.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#simulator"
                  className="px-5 py-3 rounded-md text-sm font-semibold bg-accent-primary text-[#04130D] hover:bg-accent-primary-hover active:scale-95 transition-all shadow-card font-mono uppercase tracking-wide"
                >
                  Test Live Engine
                </a>
                <Link
                  href="/login"
                  className="px-5 py-3 rounded-md text-sm font-semibold bg-surface-card border border-border-strong text-ink-primary hover:bg-surface-hover active:scale-95 transition-all font-mono uppercase tracking-wide"
                >
                  Open Workspace
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border-subtle max-w-lg">
                <div>
                  <div className="text-2xl font-display font-bold text-ink-primary">100%</div>
                  <div className="text-xs text-ink-muted">Security floor locked</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-accent-primary">-64%</div>
                  <div className="text-xs text-ink-muted">Less boilerplate in MVP</div>
                </div>
                <div>
                  <div className="text-2xl font-display font-bold text-status-deferred">5-Part</div>
                  <div className="text-xs text-ink-muted">Binding agent contract</div>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Simulator */}
            <div className="lg:col-span-6">
              <LandingSimulator />
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Diff Section */}
      <section id="comparison" className="py-20 border-t border-border-subtle bg-bg-elevated/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <StatusPill variant="recommended">Why Contrarian Guardrails Win</StatusPill>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              Rigid enterprise prompts stall early teams.
            </h2>
            <p className="text-ink-secondary text-sm sm:text-base">
              Standard architecture prompts demand repositories, DTO mappers, and event buses on day one. ArchTier separates <strong className="text-ink-primary">fatal risks</strong> from <strong className="text-ink-primary">premature ceremonies</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Card 1: Over-engineered */}
            <div className="bg-surface-card border border-border-strong rounded-xl p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-ink-primary">Generic "Senior Architect" Prompt</h3>
                  <p className="text-xs text-ink-muted">Treats a 2-week MVP like a 400-engineer bank</p>
                </div>
                <StatusPill variant="danger">Over-Engineered</StatusPill>
              </div>

              <pre className="p-4 rounded-lg bg-surface-inset border border-border-subtle font-mono text-xs text-ink-secondary overflow-x-auto">
{`/src/modules/auth/
├── domain/entities/user.entity.ts         // premature
├── domain/ports/user-repo.interface.ts    // 1 implementation
├── application/use-cases/login.usecase.ts // wrapper
├── application/dtos/login-request.dto.ts  // duplicated
├── infrastructure/mappers/user.mapper.ts  // boilerplate
├── infrastructure/adapters/prisma.repo.ts
└── presentation/controllers/auth.ctrl.ts`}
              </pre>

              <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-2 border-t border-border-subtle">
                <span>14 files generated</span>
                <span>~680 LOC boilerplate</span>
                <span className="text-status-danger">High AI drift risk</span>
              </div>
            </div>

            {/* Card 2: ArchTier Pragmatic Standard */}
            <div className="bg-surface-card border border-accent-border rounded-xl p-6 space-y-4 shadow-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-ink-primary">ArchTier · MVP Guardrail Contract</h3>
                  <p className="text-xs text-ink-muted">Strict security &amp; types, zero ceremony until Growth</p>
                </div>
                <StatusPill variant="mandatory">Production-Safe</StatusPill>
              </div>

              <pre className="p-4 rounded-lg bg-surface-inset border border-border-subtle font-mono text-xs text-ink-secondary overflow-x-auto">
{`/src/
├── lib/schemas/auth.schema.ts             // Zod contract (locked)
├── lib/engine/authenticate.ts             // pure typed logic
├── app/api/auth/route.ts                  // validated boundary
└── tests/integration/auth.test.ts         // required test spec
// Deferred to Growth: Repository DI, Multi-layer DTOs`}
              </pre>

              <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-2 border-t border-border-subtle">
                <span className="text-accent-primary">4 focused files</span>
                <span>~190 LOC clean TS</span>
                <span className="text-accent-primary">100% security floor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Bento Grid Section */}
      <BentoGrid />

      {/* Interactive Prompt Sandbox Section */}
      <PromptSandbox />

      {/* Transparent Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-border-subtle bg-bg-elevated text-xs text-ink-muted font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <BrandLogo />
              </div>
              <p className="text-ink-muted text-[11px]">
                Architecture guardrails that scale with your stage. Press <kbd className="px-1 py-0.5 rounded bg-surface-inset border border-border-subtle">⌘K</kbd> anywhere.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#simulator" className="hover:text-ink-primary transition-colors">
                Live Engine
              </a>
              <a href="#comparison" className="hover:text-ink-primary transition-colors">
                Anti-Slop Diff
              </a>
              <a href="#features" className="hover:text-ink-primary transition-colors">
                Guardrail Matrix
              </a>
              <a href="#sandbox" className="hover:text-ink-primary transition-colors">
                Prompt Builder
              </a>
              <a href="#pricing" className="hover:text-ink-primary transition-colors">
                Pricing
              </a>
              <Link href="/login" className="hover:text-ink-primary transition-colors text-accent-primary font-bold">
                Sign In →
              </Link>
            </div>
          </div>

          <div className="border-t border-border-subtle pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>© 2026 ArchTier Project. Open Source &amp; Anti-Overengineering Standard.</span>
            <span>Zero AI Slop · WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
