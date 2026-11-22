import React from 'react';
import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { AuthForm } from '@/components/auth/AuthForm';
import { WorkspacePreview } from '@/components/auth/WorkspacePreview';

export default function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 text-ink-primary bg-bg-primary">
      {/* Left Column: Auth Shell */}
      <div className="flex flex-col justify-between p-6 sm:p-10 lg:p-14 min-h-screen border-r border-border-subtle">
        {/* Topbar */}
        <header className="flex items-center justify-between">
          <BrandLogo />
          <div className="flex items-center gap-2 text-xs font-mono text-ink-secondary px-2.5 py-1 rounded-full bg-surface-inset border border-border-subtle">
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
            <span>Engine Online</span>
          </div>
        </header>

        {/* Center Auth Form */}
        <main className="my-auto py-8">
          <div className="max-w-md mx-auto space-y-2 mb-6 text-left">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink-primary">
              Welcome back, architect.
            </h1>
            <p className="text-xs sm:text-sm text-ink-secondary">
              Sign in to access your saved phase guardrails, repo presets, and AI agent prompts.
            </p>
          </div>

          <AuthForm />
        </main>

        {/* Footer */}
        <footer className="pt-6 border-t border-border-subtle flex items-center justify-between text-xs text-ink-muted font-mono">
          <span>© 2026 ArchTier · Zero-Drift Guardrails</span>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-ink-primary transition-colors">
              Home
            </Link>
            <span>·</span>
            <span className="text-ink-muted cursor-default">Enterprise SSO (v1.5)</span>
          </div>
        </footer>
      </div>

      {/* Right Column: Interactive Workspace Snapshot */}
      <WorkspacePreview />
    </div>
  );
}
