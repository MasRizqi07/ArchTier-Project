'use client';

import React from 'react';
import { ProjectPhase, TechStack, TaskCategory } from '@/lib/schemas/guardrail.schema';

interface ConfigFormProps {
  phase: ProjectPhase;
  setPhase: (p: ProjectPhase) => void;
  stack: TechStack;
  setStack: (s: TechStack) => void;
  taskCategory: TaskCategory;
  setTaskCategory: (c: TaskCategory) => void;
  taskDescription: string;
  setTaskDescription: (d: string) => void;
  targetPath: string;
  setTargetPath: (p: string) => void;
  onRunAnalysis: () => void;
  onSavePreset: () => void;
  loading: boolean;
}

export function ConfigForm({
  phase,
  setPhase,
  stack,
  setStack,
  taskCategory,
  setTaskCategory,
  taskDescription,
  setTaskDescription,
  targetPath,
  setTargetPath,
  onRunAnalysis,
  onSavePreset,
  loading,
}: ConfigFormProps) {
  function applyStarter(desc: string, cat: TaskCategory, path: string) {
    setTaskDescription(desc);
    setTaskCategory(cat);
    setTargetPath(path);
  }

  return (
    <div className="space-y-5 p-5 md:p-6 text-left">
      {/* 1. Phase Control Bar */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-2">
          Project Phase Tier
        </label>
        <div className="grid grid-cols-3 gap-2 bg-surface-inset p-1.5 rounded-lg border border-border-subtle">
          {(['mvp', 'growth', 'scale'] as ProjectPhase[]).map((p, idx) => {
            const active = phase === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPhase(p)}
                className={`py-2 px-3 rounded-md text-center transition-all ${
                  active
                    ? 'bg-surface-card-alt text-accent-primary border border-accent-border font-bold shadow-sm'
                    : 'text-ink-secondary hover:text-ink-primary hover:bg-surface-hover'
                }`}
              >
                <div className="text-xs font-display">
                  0{idx + 1} · {p.toUpperCase()}
                </div>
                <div className="text-[10px] text-ink-muted hidden sm:block">
                  {p === 'mvp' ? 'Speed & Safety' : p === 'growth' ? 'Team Gates' : 'Decoupled'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Tech Stack & Task Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
            Tech Stack
          </label>
          <select
            value={stack}
            onChange={(e) => setStack(e.target.value as TechStack)}
            className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs text-ink-primary focus:border-accent-primary outline-none"
          >
            <option value="nextjs">Next.js 15+ (App Router)</option>
            <option value="react_express">React + Node.js Express</option>
            <option value="laravel">Laravel + Vue / Inertia</option>
            <option value="go_react">Go + React (Vite)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
            Task Category
          </label>
          <select
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
            className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs text-ink-primary focus:border-accent-primary outline-none"
          >
            <option value="api_route">API Route / Route Handler</option>
            <option value="auth">Authentication &amp; Session</option>
            <option value="payment_webhook">Payment / Webhook Handler</option>
            <option value="database">Database Schema / Migration</option>
            <option value="ui_component">UI Presentation Component</option>
            <option value="core_logic">Core Pure Domain Engine</option>
          </select>
        </div>
      </div>

      {/* 3. Target Filepath (Optional) */}
      <div>
        <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted mb-1.5">
          Target Filepath (Optional)
        </label>
        <input
          type="text"
          value={targetPath}
          onChange={(e) => setTargetPath(e.target.value)}
          placeholder="e.g. /src/app/api/analyze/route.ts"
          className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs font-mono text-ink-primary placeholder:text-ink-muted focus:border-accent-primary outline-none"
        />
      </div>

      {/* 4. Feature Description */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-mono uppercase tracking-wider text-ink-muted">
            Feature Task Description
          </label>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-ink-muted">
            <span>Quick Fill:</span>
            <button
              type="button"
              onClick={() =>
                applyStarter(
                  'Build POST /api/analyze endpoint with input validation and rate limiting.',
                  'api_route',
                  '/src/app/api/analyze/route.ts'
                )
              }
              className="text-accent-primary hover:underline"
            >
              API Route
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() =>
                applyStarter(
                  'Query prisma database directly inside UserCard UI component to fetch account balance.',
                  'ui_component',
                  '/src/components/UserCard.tsx'
                )
              }
              className="text-status-warning hover:underline"
              title="Test Stop-on-Conflict violation"
            >
              Test Conflict
            </button>
          </div>
        </div>
        <textarea
          rows={4}
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Describe what feature, endpoint, or component the AI coding agent should generate..."
          className="w-full px-3 py-2 rounded-lg bg-surface-inset border border-border-strong text-xs text-ink-primary placeholder:text-ink-muted focus:border-accent-primary outline-none resize-none"
        />
      </div>

      {/* 5. Action Buttons & Security Floor Checkmarks */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onRunAnalysis}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-lg bg-accent-primary text-[#04130D] font-display font-bold text-xs uppercase tracking-wider hover:bg-accent-primary-hover active:scale-95 transition-all shadow-card flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Evaluating...' : 'Run Guardrail Analysis'}</span>
            <span className="font-mono text-[10px] opacity-75">(Cmd+↵)</span>
          </button>

          <button
            type="button"
            onClick={onSavePreset}
            className="py-2.5 px-4 rounded-lg bg-surface-card border border-border-strong hover:bg-surface-hover text-xs font-semibold text-ink-primary transition-all active:scale-95"
          >
            Save as Preset
          </button>
        </div>

        {/* Security Floor Indicators */}
        <div className="flex flex-wrap items-center gap-3 px-3 py-2 rounded-lg bg-surface-inset border border-border-subtle text-[11px] font-mono text-ink-muted">
          <span className="text-accent-primary font-semibold">Security Floor:</span>
          <span>[✓] Zod Input Validation</span>
          <span>[✓] Zero Client Secrets</span>
          <span>[✓] Strict TS (No any)</span>
          <span>[✓] Safe Errors</span>
        </div>
      </div>
    </div>
  );
}
