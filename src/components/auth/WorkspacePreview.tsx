'use client';

import React, { useState } from 'react';
import { StatusPill } from '@/components/shared/StatusPill';

interface RepoPreset {
  name: string;
  phase: 'MVP' | 'Growth' | 'Scale';
  compliance: string;
  locked: number;
  deferred: number;
  recentAudit: string;
}

const REPO_PRESETS: Record<string, RepoPreset> = {
  'archtier-core': {
    name: 'archtier-core',
    phase: 'MVP',
    compliance: '98.4%',
    locked: 4,
    deferred: 2,
    recentAudit: 'POST /api/analyze validated · Zod schema isolation confirmed.',
  },
  'saas-billing': {
    name: 'saas-billing',
    phase: 'Growth',
    compliance: '96.2%',
    locked: 5,
    deferred: 1,
    recentAudit: 'Stripe webhook HMAC signature verified · Idempotency enforced.',
  },
  'indie-mvp': {
    name: 'indie-mvp',
    phase: 'MVP',
    compliance: '100%',
    locked: 4,
    deferred: 3,
    recentAudit: 'Prisma DB connection singleton active · No DB-in-UI leaks.',
  },
};

export function WorkspacePreview() {
  const [activeRepo, setActiveRepo] = useState<string>('archtier-core');
  const current = REPO_PRESETS[activeRepo];

  return (
    <aside className="hidden lg:flex flex-col justify-between p-8 xl:p-12 bg-bg-elevated/60 border-l border-border-subtle relative overflow-hidden">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-card border border-border-strong text-xs font-mono text-ink-secondary">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Live Guardrail Workspace</span>
          </div>
          <h2 className="font-display font-bold text-2xl xl:text-3xl text-ink-primary">
            Pick up right where your codebase left off.
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Every repository remembers its active phase, locked security rules, and deferred abstractions—so your AI coding agents never drift between sessions.
          </p>
        </div>

        {/* Live Snapshot Card */}
        <div className="bg-surface-card border border-border-strong rounded-xl p-5 shadow-elevated space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-1.5">
              {Object.keys(REPO_PRESETS).map((repoKey) => (
                <button
                  key={repoKey}
                  type="button"
                  onClick={() => setActiveRepo(repoKey)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    activeRepo === repoKey
                      ? 'bg-surface-card-alt text-accent-primary border border-accent-border font-semibold'
                      : 'text-ink-muted hover:text-ink-primary bg-surface-inset'
                  }`}
                >
                  {repoKey}
                </button>
              ))}
            </div>
            <StatusPill variant={current.phase === 'MVP' ? 'mandatory' : 'recommended'}>
              {current.phase} PHASE
            </StatusPill>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono uppercase text-ink-muted">Compliance</div>
              <div className="text-lg font-display font-bold text-accent-primary mt-0.5">
                {current.compliance}
              </div>
            </div>
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono uppercase text-ink-muted">Active Rules</div>
              <div className="text-lg font-display font-bold text-ink-primary mt-0.5">
                {current.locked} Locked
              </div>
            </div>
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono uppercase text-ink-muted">Deferred</div>
              <div className="text-lg font-display font-bold text-status-deferred mt-0.5">
                {current.deferred} Skipped
              </div>
            </div>
          </div>

          <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle text-xs space-y-1">
            <div className="font-mono text-[10px] uppercase text-ink-muted">Latest Audit Log:</div>
            <div className="text-ink-secondary font-mono text-[11px] leading-relaxed">
              {current.recentAudit}
            </div>
          </div>

          <div className="flex items-center justify-between px-3 py-2 rounded bg-accent-soft border border-accent-border text-[11px] font-mono text-accent-primary font-semibold">
            <span>Security Floor: Zod + Env Secrets + Strict Types</span>
            <span>VERIFIED</span>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-surface-card/60 border border-border-subtle space-y-1">
            <div className="font-semibold text-xs text-ink-primary">Zero Code Storage</div>
            <div className="text-[11px] text-ink-muted">Only schema rules &amp; presets are saved.</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-card/60 border border-border-subtle space-y-1">
            <div className="font-semibold text-xs text-ink-primary">Agent-Ready</div>
            <div className="text-[11px] text-ink-muted">Export clean specs to Cursor &amp; Antigravity.</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-card/60 border border-border-subtle space-y-1">
            <div className="font-semibold text-xs text-ink-primary">Deterministic</div>
            <div className="text-[11px] text-ink-muted">Auditable JSON contracts with zero AI hallucination.</div>
          </div>
        </div>
      </div>

      <div className="pt-8 text-xs text-ink-muted font-mono">
        ArchTier v2.4 Architecture Governance Platform
      </div>
    </aside>
  );
}
