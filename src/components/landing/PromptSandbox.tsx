'use client';

import React, { useState } from 'react';
import { ProjectPhase, TechStack } from '@/lib/schemas/guardrail.schema';
import { StatusPill } from '@/components/shared/StatusPill';

export function PromptSandbox() {
  const [phase, setPhase] = useState<ProjectPhase>('mvp');
  const [stack, setStack] = useState<TechStack>('nextjs');
  const [task, setTask] = useState(
    'Build POST /api/analyze endpoint that validates project phase with Zod and returns mandatory, recommended, and deferred architecture guardrails.'
  );
  const [compiledPrompt, setCompiledPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);

  function handleCompile(e: React.FormEvent) {
    e.preventDefault();
    const promptText = `🏗️ ArchTier Architectural Guardrail Spec (${phase.toUpperCase()})
Tech Stack: ${stack}
Target Feature: ${task}

## Mandatory 5-Section Response Format:
1. Architecture Analysis: Place in appropriate layer without unnecessary abstractions.
2. Filepath Declaration: State exact filepath, purpose, dependencies, and consumers.
3. Code Implementation: Strict TypeScript (zero any), Zod input validation, safe error handling.
4. Testing Requirements: Specify Vitest test file and coverage assertions.
5. Impact & Security Checklist: Document trade-offs, verify secrets isolated to env vars.

## Active Phase Rules (${phase.toUpperCase()}):
- Security Floor: LOCKED (Zod, Env Secrets, Strict Types, Explicit Auth)
${
  phase === 'mvp'
    ? '- Deferred Abstractions: Repository interfaces & Multi-layer DTOs (Ship fast, zero drift)'
    : phase === 'growth'
    ? '- Recommended Abstractions: Repository abstraction for high-churn models + Mandatory Integration Tests'
    : '- Mandatory Abstractions: Hexagonal isolation, versioned DTOs, and contract test gates'
}
- Stop-on-Conflict: If instructions violate layer boundaries (e.g. DB in UI), halt and request clarification.`;

    setCompiledPrompt(promptText);
  }

  function handleCopy() {
    if (!compiledPrompt) return;
    navigator.clipboard.writeText(compiledPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section id="sandbox" className="py-20 border-t border-border-subtle bg-bg-elevated/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <StatusPill variant="deferred">Interactive Prompt Builder</StatusPill>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary">
            Configure your stack. Export a tailored agent prompt.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary">
            Test ArchTier right here: pick your project phase and stack, describe your next feature, and generate a ready-to-paste system prompt for Antigravity, Cursor, or Claude.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left bg-surface-card border border-border-strong rounded-xl p-6 sm:p-8 shadow-card">
          {/* Builder Form */}
          <form onSubmit={handleCompile} className="lg:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5" htmlFor="sandboxPhase">
                Project Phase
              </label>
              <select
                id="sandboxPhase"
                value={phase}
                onChange={(e) => setPhase(e.target.value as ProjectPhase)}
                className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs text-ink-primary focus:border-accent-primary outline-none"
              >
                <option value="mvp">MVP — Speed + Non-Negotiable Security</option>
                <option value="growth">Growth — Modular Boundaries + Integration Tests</option>
                <option value="scale">Scale — Strict Contracts + Multi-Layer Isolation</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5" htmlFor="sandboxStack">
                Architecture &amp; Tech Stack
              </label>
              <select
                id="sandboxStack"
                value={stack}
                onChange={(e) => setStack(e.target.value as TechStack)}
                className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs text-ink-primary focus:border-accent-primary outline-none"
              >
                <option value="nextjs">Next.js 15+ (App Router) + TypeScript + Zod + Prisma</option>
                <option value="react_express">React + Vite + Express + PostgreSQL</option>
                <option value="laravel">Laravel 11 + Vue 3 + Inertia + MySQL</option>
                <option value="go_react">Go (Chi/Fiber) + React + TypeScript + Postgres</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5" htmlFor="sandboxTask">
                Current Feature Task
              </label>
              <textarea
                id="sandboxTask"
                rows={4}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs text-ink-primary focus:border-accent-primary outline-none resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2.5 rounded-lg bg-accent-primary text-[#04130D] font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-primary-hover active:scale-95 transition-all shadow-card flex items-center gap-1.5"
              >
                <span>Compile Guardrail Prompt</span>
              </button>
              {compiledPrompt && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-lg bg-surface-inset border border-border-strong hover:bg-surface-hover text-xs font-mono font-semibold text-ink-primary transition-all active:scale-95"
                >
                  {copied ? '✓ Copied' : 'Copy Prompt'}
                </button>
              )}
            </div>
          </form>

          {/* Compiled Output Preview */}
          <div className="lg:col-span-6 flex flex-col justify-between bg-surface-inset rounded-lg border border-border-subtle p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <span className="text-xs font-mono text-ink-muted">archtier-system-prompt.md</span>
              <StatusPill variant={phase === 'mvp' ? 'mandatory' : phase === 'growth' ? 'recommended' : 'deferred'}>
                {phase.toUpperCase()} READY
              </StatusPill>
            </div>

            <pre className="flex-1 font-mono text-xs text-ink-secondary overflow-y-auto max-h-72 whitespace-pre-wrap leading-relaxed">
              {compiledPrompt ||
                '// Click "Compile Guardrail Prompt" above to preview your tailored system prompt.'}
            </pre>

            <div className="text-[11px] font-mono text-ink-muted pt-2 border-t border-border-subtle">
              Drop this output into Antigravity, Cursor, or Claude Code before coding.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
