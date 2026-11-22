'use client';

import React, { useState, useEffect } from 'react';
import { GuardrailReport, ProjectPhase, TaskCategory } from '@/lib/schemas/guardrail.schema';
import { StatusPill } from '@/components/shared/StatusPill';

const SCENARIOS: Record<string, { label: string; category: TaskCategory; desc: string }> = {
  auth: {
    label: 'User Auth API',
    category: 'auth',
    desc: 'Build secure authentication route with password hashing and session cookie flags.',
  },
  billing: {
    label: 'Stripe Webhook',
    category: 'payment_webhook',
    desc: 'Process Stripe checkout session webhook with HMAC signature verification and idempotency.',
  },
  engine: {
    label: 'Guardrail Engine',
    category: 'core_logic',
    desc: 'Pure synchronous evaluator calculating phase-calibrated software architecture guardrails.',
  },
};

export function LandingSimulator() {
  const [phase, setPhase] = useState<ProjectPhase>('mvp');
  const [scenarioKey, setScenarioKey] = useState<string>('auth');
  const [report, setReport] = useState<GuardrailReport | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function runAnalysis() {
      setLoading(true);
      try {
        const scenario = SCENARIOS[scenarioKey];
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase,
            stack: 'nextjs',
            taskCategory: scenario.category,
            taskDescription: scenario.desc,
          }),
        });
        if (res.ok) {
          const data: GuardrailReport = await res.json();
          setReport(data);
        }
      } catch (err) {
        console.error('Failed to analyze guardrails:', err);
      } finally {
        setLoading(false);
      }
    }

    runAnalysis();
  }, [phase, scenarioKey]);

  return (
    <div
      id="simulator"
      className="w-full bg-surface-card border border-border-strong rounded-xl shadow-elevated overflow-hidden text-left"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-bg-elevated border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-border-strong"></span>
          </div>
          <span className="font-mono text-xs text-ink-muted">POST /api/analyze · live-evaluator</span>
        </div>
        <StatusPill variant={phase === 'mvp' ? 'mandatory' : phase === 'growth' ? 'recommended' : 'deferred'}>
          {phase.toUpperCase()} MODE
        </StatusPill>
      </div>

      <div className="p-5 md:p-6 space-y-5">
        {/* Phase Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2">
            1. Select Project Phase:
          </label>
          <div className="grid grid-cols-3 gap-2 bg-surface-inset p-1.5 rounded-lg border border-border-subtle">
            {(['mvp', 'growth', 'scale'] as ProjectPhase[]).map((p, idx) => {
              const active = phase === p;
              const subtext =
                p === 'mvp'
                  ? 'Ship fast, zero drift'
                  : p === 'growth'
                  ? 'Team boundaries'
                  : 'Strict contracts';

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPhase(p)}
                  className={`flex flex-col items-center justify-center py-2 px-3 rounded-md transition-all ${
                    active
                      ? 'bg-surface-card-alt text-accent-primary border border-accent-border shadow-sm font-semibold'
                      : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-hover'
                  }`}
                >
                  <span className="font-display text-sm font-bold">
                    0{idx + 1} · {p.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-ink-muted hidden sm:inline">{subtext}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Task Scenario Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2">
            2. Feature Task Scenario:
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SCENARIOS).map(([key, s]) => {
              const active = scenarioKey === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setScenarioKey(key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-accent-soft text-accent-primary border-accent-border'
                      : 'bg-surface-inset text-ink-secondary border-border-subtle hover:border-border-strong hover:text-ink-primary'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="bg-surface-inset p-3 rounded-md border border-border-subtle">
            <div className="text-[10px] font-mono text-ink-muted uppercase">Mandatory (Locked)</div>
            <div className="text-xl font-display font-bold text-accent-primary mt-0.5">
              {report ? `${report.summary.mandatoryCount} rules` : '...'}
            </div>
          </div>
          <div className="bg-surface-inset p-3 rounded-md border border-border-subtle">
            <div className="text-[10px] font-mono text-ink-muted uppercase">Deferred (Anti-Slop)</div>
            <div className="text-xl font-display font-bold text-status-deferred mt-0.5">
              {report ? `${report.summary.deferredCount} skipped` : '...'}
            </div>
          </div>
          <div className="bg-surface-inset p-3 rounded-md border border-border-subtle">
            <div className="text-[10px] font-mono text-ink-muted uppercase">Boilerplate Saved</div>
            <div className="text-xl font-display font-bold text-ink-primary mt-0.5">
              {report ? `~${report.summary.estimatedBoilerplateSavedPct}%` : '...'}
            </div>
          </div>
        </div>

        {/* Rule List Preview */}
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {loading ? (
            <div className="text-xs text-ink-muted py-4 text-center font-mono">Evaluating guardrails...</div>
          ) : (
            report?.rules.slice(0, 5).map((rule) => (
              <div
                key={rule.id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-md bg-surface-inset border border-border-subtle text-xs"
              >
                <div>
                  <div className="font-semibold text-ink-primary flex items-center gap-2">
                    {rule.name}
                    {rule.locked && (
                      <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-accent-soft text-accent-primary border border-accent-border">
                        Locked
                      </span>
                    )}
                  </div>
                  <div className="text-ink-secondary text-[11px] mt-0.5">{rule.reason}</div>
                </div>
                <StatusPill variant={rule.status}>{rule.status}</StatusPill>
              </div>
            ))
          )}
        </div>

        {/* Declared Target Bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-surface-inset rounded-md border border-border-subtle text-xs font-mono">
          <span className="text-ink-muted">Declared Target:</span>
          <span className="text-accent-primary font-semibold">{report?.declaredFilepath || '...'}</span>
        </div>
      </div>
    </div>
  );
}
