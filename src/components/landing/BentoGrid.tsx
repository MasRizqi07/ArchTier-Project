'use client';

import React, { useState } from 'react';
import { StatusPill } from '@/components/shared/StatusPill';

const CONTRACT_SLICES: Record<string, string> = {
  analysis: `// Section 1: Architecture Analysis
- Layer: Feature belongs to '/src/app/api' route boundary
- Phase: MVP (Pragmatic Speed)
- Security Floor: Strict Zod validation & env secrets isolation
- Abstraction Status: Repository interfaces and DTO wrappers DEFERRED
- Compliance: 100% compliant with ArchTier MVP guidelines`,

  filepath: `// Section 2: Filepath Declaration
- Target File: /src/app/api/analyze/route.ts
- Purpose: Public rate-limited guardrail evaluation controller
- Dependencies: Zod, /src/lib/engine/evaluate-guardrails.ts
- Consumers: Frontend Landing simulator and /dashboard workbench`,

  code: `// Section 3: Code Implementation (Strict TypeScript)
import { NextRequest, NextResponse } from 'next/server';
import { AnalysisRequestSchema } from '@/lib/schemas/guardrail.schema';
import { evaluateGuardrails } from '@/lib/engine/evaluate-guardrails';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validated = AnalysisRequestSchema.parse(body);
  const report = evaluateGuardrails(validated);
  return NextResponse.json(report, { status: 200 });
}`,

  tests: `// Section 4: Testing Requirements (Vitest)
- File: /tests/integration/api-analyze.test.ts
- Specs:
  [x] Returns HTTP 200 with complete GuardrailReport for valid payload
  [x] Returns HTTP 400 with VALIDATION_ERROR when taskDescription < 12 chars
  [x] Returns HTTP 400 when phase is not a valid enum ('mvp'|'growth'|'scale')`,

  impact: `// Section 5: Impact & Security Checklist
- Breaking Changes: None
- Intentional MVP Trade-offs: Direct ORM calls; no repository wrapper
- Security Checklist:
  [x] Zod input validation enforced on all payload fields
  [x] Zero hardcoded secrets in client components
  [x] Sanitized error response (no raw DB stack leak)
  [x] Strict TypeScript (zero any, zero @ts-ignore)`,
};

export function BentoGrid() {
  const [activeContractTab, setActiveContractTab] = useState<string>('analysis');

  return (
    <section id="features" className="py-20 border-t border-border-subtle bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto space-y-3">
          <StatusPill variant="mandatory">Engine Architecture</StatusPill>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary">
            Built like a compiler for your AI coding agents.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary">
            Every rule is deterministic, auditable, and mapped to a binding 5-section output contract before a single line of code is written.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          {/* Bento 1: Wide (7 cols) — Adaptive Matrix */}
          <div className="lg:col-span-7 bg-surface-card border border-border-strong rounded-xl p-6 shadow-card space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-inset border border-border-subtle flex items-center justify-center text-accent-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10M18 20V4M6 20v-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-ink-primary">
                  Phase-Calibrated Rule Matrix
                </h3>
                <p className="text-xs text-ink-muted">
                  Promote architectural rigor deliberately when team size justifies it.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface-inset">
              <table className="w-full text-xs font-mono text-left">
                <thead className="bg-bg-elevated border-b border-border-subtle text-ink-muted uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Guardrail Rule</th>
                    <th className="py-2.5 px-3">MVP</th>
                    <th className="py-2.5 px-3">Growth</th>
                    <th className="py-2.5 px-3">Scale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle text-ink-secondary">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-ink-primary">Zod Input &amp; Env Secrets</td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-ink-primary">TypeScript Strict (No any)</td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-ink-primary">Repository Abstraction</td>
                    <td className="py-2.5 px-3"><StatusPill variant="deferred">Deferred</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="recommended">Advisory</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-ink-primary">Multi-Layer DTOs &amp; Event Bus</td>
                    <td className="py-2.5 px-3"><StatusPill variant="deferred">Deferred</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="deferred">Deferred</StatusPill></td>
                    <td className="py-2.5 px-3"><StatusPill variant="mandatory">Locked</StatusPill></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bento 2: Narrow (5 cols) — Security Floor */}
          <div className="lg:col-span-5 bg-surface-card border border-border-strong rounded-xl p-6 shadow-card space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-inset border border-border-subtle flex items-center justify-center text-accent-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-ink-primary">
                  Non-Negotiable Security Floor
                </h3>
                <p className="text-xs text-ink-muted">
                  Fast MVP mode never compromises baseline boundaries.
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs font-mono">
              {[
                'Schema validation on all API boundaries',
                'Environment variables for all secrets',
                'Safe error responses (no stack leaks)',
                'Explicit auth & ownership checks',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-surface-inset border border-border-subtle"
                >
                  <span className="flex items-center gap-2 text-ink-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span>{item}</span>
                  </span>
                  <span className="text-[10px] text-accent-primary font-bold">LOCKED</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bento 3: Narrow (5 cols) — Stop-on-Conflict */}
          <div className="lg:col-span-5 bg-surface-card border border-border-strong rounded-xl p-6 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-warning-soft border border-status-warning-border flex items-center justify-center text-status-warning">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-ink-primary">
                  Stop-on-Conflict Protocol
                </h3>
                <p className="text-xs text-ink-muted">
                  The agent halts and asks instead of silently guessing.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle font-mono text-xs space-y-2">
              <div className="inline-flex items-center gap-1.5 text-status-warning font-bold text-[11px]">
                <span>⚠️ ARCHITECTURAL CONFLICT DETECTED</span>
              </div>
              <p className="text-ink-secondary text-[11px] leading-relaxed">
                Requested Prisma query inside <code className="text-ink-primary">/src/components/</code>.<br />
                Violates Frontend / Backend separation.<br />
                <span className="text-accent-primary">→ Action halted: Expose via /api/analyze or Server Action?</span>
              </p>
            </div>
          </div>

          {/* Bento 4: Wide (7 cols) — Interactive 5-Section Contract */}
          <div className="lg:col-span-7 bg-surface-card border border-border-strong rounded-xl p-6 shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-inset border border-border-subtle flex items-center justify-center text-accent-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                </svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-ink-primary">
                  Binding 5-Section Code Contract
                </h3>
                <p className="text-xs text-ink-muted">
                  Inspect how ArchTier structures every AI generation output.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 bg-surface-inset p-1 rounded-lg border border-border-subtle text-xs font-mono">
              {[
                { id: 'analysis', label: '01 Analysis' },
                { id: 'filepath', label: '02 Filepath' },
                { id: 'code', label: '03 Typed Code' },
                { id: 'tests', label: '04 Tests' },
                { id: 'impact', label: '05 Impact' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveContractTab(tab.id)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeContractTab === tab.id
                      ? 'bg-surface-card text-accent-primary font-bold border border-accent-border shadow-sm'
                      : 'text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <pre className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle font-mono text-[11px] text-ink-secondary overflow-x-auto max-h-48 leading-relaxed whitespace-pre-wrap">
              {CONTRACT_SLICES[activeContractTab]}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
