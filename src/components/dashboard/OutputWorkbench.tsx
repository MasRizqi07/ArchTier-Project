'use client';

import React, { useState } from 'react';
import { GuardrailReport } from '@/lib/schemas/guardrail.schema';
import { StatusPill } from '@/components/shared/StatusPill';
import { compileAgentExport, ExportFormat } from '@/lib/engine/export-compiler';

interface OutputWorkbenchProps {
  report: GuardrailReport | null;
  loading: boolean;
}

export function OutputWorkbench({ report, loading }: OutputWorkbenchProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'contract' | 'export'>('report');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('cursor');
  const [copied, setCopied] = useState(false);

  const exportCode = report ? compileAgentExport(report, exportFormat) : '';

  function handleCopy() {
    if (!exportCode) return;
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!exportCode) return;
    const filenames: Record<ExportFormat, string> = {
      cursor: 'archtier.mdc',
      claude: 'CLAUDE.md',
      agents: 'AGENTS.md',
      antigravity: 'rules.md',
    };
    const blob = new Blob([exportCode], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filenames[exportFormat];
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-ink-muted font-mono text-xs">
        <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin mb-3"></div>
        <span>Evaluating deterministic architecture rules...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-ink-muted space-y-2">
        <p className="text-sm text-ink-secondary">No analysis run yet.</p>
        <p className="text-xs">Configure your feature task and click Run Guardrail Analysis.</p>
      </div>
    );
  }

  const hasBlockingConflict = report.conflicts.some((c) => c.severity === 'blocking');

  return (
    <div className="flex flex-col h-full bg-surface-card text-left">
      {/* Workbench Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bg-elevated border-b border-border-subtle shrink-0">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('report')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-colors ${
              activeTab === 'report'
                ? 'bg-surface-card text-accent-primary border border-accent-border shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Guardrail Report
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contract')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-colors ${
              activeTab === 'contract'
                ? 'bg-surface-card text-accent-primary border border-accent-border shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            5-Section Contract
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold font-mono transition-colors ${
              activeTab === 'export'
                ? 'bg-surface-card text-accent-primary border border-accent-border shadow-sm'
                : 'text-ink-secondary hover:text-ink-primary'
            }`}
          >
            Agent Export
          </button>
        </div>

        <StatusPill
          variant={
            hasBlockingConflict
              ? 'danger'
              : report.phase === 'mvp'
              ? 'mandatory'
              : report.phase === 'growth'
              ? 'recommended'
              : 'deferred'
          }
        >
          {hasBlockingConflict ? 'CONFLICT HALTED' : `${report.phase.toUpperCase()} READY`}
        </StatusPill>
      </div>

      {/* Tab 1: Guardrail Report */}
      {activeTab === 'report' && (
        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)]">
          {/* Conflict Banner */}
          {report.conflicts.length > 0 && (
            <div
              className={`p-4 rounded-lg border text-xs space-y-2 ${
                hasBlockingConflict
                  ? 'bg-status-danger-soft border-status-danger-border text-status-danger'
                  : 'bg-status-warning-soft border-status-warning-border text-status-warning'
              }`}
            >
              <div className="flex items-center gap-2 font-display font-bold text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>
                  STOP-ON-CONFLICT DETECTED ({report.conflicts[0].severity.toUpperCase()}):{' '}
                  {report.conflicts[0].code}
                </span>
              </div>
              <p className="leading-relaxed">{report.conflicts[0].message}</p>
              <div className="p-2.5 rounded bg-surface-inset/80 border border-border-subtle font-mono text-[11px] text-ink-primary">
                <strong>Action Required:</strong> {report.conflicts[0].clarificationPrompt}
              </div>
            </div>
          )}

          {/* KPI Strip */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono text-ink-muted uppercase">Mandatory</div>
              <div className="text-xl font-display font-bold text-accent-primary mt-0.5">
                {report.summary.mandatoryCount} rules
              </div>
            </div>
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono text-ink-muted uppercase">Recommended</div>
              <div className="text-xl font-display font-bold text-status-warning mt-0.5">
                {report.summary.recommendedCount} rules
              </div>
            </div>
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono text-ink-muted uppercase">Deferred</div>
              <div className="text-xl font-display font-bold text-status-deferred mt-0.5">
                {report.summary.deferredCount} skipped
              </div>
            </div>
            <div className="bg-surface-inset p-3 rounded-lg border border-border-subtle">
              <div className="text-[10px] font-mono text-ink-muted uppercase">Boilerplate Saved</div>
              <div className="text-xl font-display font-bold text-ink-primary mt-0.5">
                ~{report.summary.estimatedBoilerplateSavedPct}%
              </div>
            </div>
          </div>

          {/* Declared Target Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-surface-inset rounded-lg border border-border-subtle text-xs font-mono">
            <span className="text-ink-muted">Declared Target Filepath:</span>
            <span className="text-accent-primary font-semibold">{report.declaredFilepath}</span>
          </div>

          {/* Rule Breakdown List */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-ink-muted tracking-wider">
              Evaluated Architecture Rules
            </div>
            {report.rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-surface-inset border border-border-subtle text-xs"
              >
                <div className="space-y-1">
                  <div className="font-semibold text-ink-primary flex items-center gap-2">
                    {rule.name}
                    {rule.locked && (
                      <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-accent-soft text-accent-primary border border-accent-border">
                        Locked
                      </span>
                    )}
                  </div>
                  <div className="text-ink-secondary text-[11px] leading-relaxed">{rule.reason}</div>
                </div>
                <StatusPill variant={rule.status}>{rule.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: 5-Section Contract Preview */}
      {activeTab === 'contract' && (
        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)] text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle space-y-1">
            <div className="text-accent-primary font-bold">1. Architecture Analysis</div>
            <div className="text-ink-secondary leading-relaxed">{report.fivePartContract.analysis}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle space-y-1">
            <div className="text-accent-primary font-bold">2. Filepath Declaration</div>
            <div className="text-ink-secondary leading-relaxed">{report.fivePartContract.filepath}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle space-y-1">
            <div className="text-accent-primary font-bold">3. Code Guidance</div>
            <div className="text-ink-secondary leading-relaxed">{report.fivePartContract.codeGuidance}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle space-y-1">
            <div className="text-accent-primary font-bold">4. Testing Requirements</div>
            <div className="text-ink-secondary leading-relaxed">{report.fivePartContract.testing}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-surface-inset border border-border-subtle space-y-1">
            <div className="text-accent-primary font-bold">5. Impact &amp; Security Checklist</div>
            <pre className="text-ink-secondary leading-relaxed whitespace-pre-wrap">
              {report.fivePartContract.impactChecklist}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Multi-Agent Exporter */}
      {activeTab === 'export' && (
        <div className="p-5 space-y-4 overflow-y-auto max-h-[calc(100vh-170px)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Format Selector */}
            <div className="flex items-center gap-1 bg-surface-inset p-1 rounded-lg border border-border-subtle text-xs font-mono">
              {(['cursor', 'claude', 'agents', 'antigravity'] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setExportFormat(fmt)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    exportFormat === fmt
                      ? 'bg-surface-card text-accent-primary font-bold border border-accent-border shadow-sm'
                      : 'text-ink-muted hover:text-ink-primary'
                  }`}
                >
                  {fmt === 'cursor'
                    ? '.cursor/rules'
                    : fmt === 'claude'
                    ? 'CLAUDE.md'
                    : fmt === 'agents'
                    ? 'AGENTS.md'
                    : 'rules.md'}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-surface-inset border border-border-strong hover:bg-surface-hover text-xs font-mono font-semibold text-ink-primary transition-all active:scale-95 flex items-center gap-1.5"
              >
                <span>{copied ? '✓ Copied' : 'Copy Spec'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-accent-primary text-[#04130D] text-xs font-mono font-bold hover:bg-accent-primary-hover transition-all active:scale-95"
              >
                Download File
              </button>
            </div>
          </div>

          {/* Formatted Code Block */}
          <pre className="p-4 rounded-lg bg-surface-inset border border-border-strong text-xs font-mono text-ink-secondary overflow-x-auto max-h-[460px] whitespace-pre-wrap leading-relaxed">
            {exportCode}
          </pre>
        </div>
      )}
    </div>
  );
}
