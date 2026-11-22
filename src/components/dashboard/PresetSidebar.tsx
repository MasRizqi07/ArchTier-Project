'use client';

import React from 'react';
import { RulesetItem } from '@/lib/schemas/ruleset.schema';

interface PresetSidebarProps {
  presets: RulesetItem[];
  activePresetId: string | null;
  onSelectPreset: (preset: RulesetItem) => void;
  onNewPreset: () => void;
  onDeletePreset: (id: string, e: React.MouseEvent) => void;
  loading: boolean;
}

export function PresetSidebar({
  presets,
  activePresetId,
  onSelectPreset,
  onNewPreset,
  onDeletePreset,
  loading,
}: PresetSidebarProps) {
  return (
    <aside className="w-full md:w-64 lg:w-72 bg-bg-elevated/70 border-r border-border-subtle flex flex-col justify-between shrink-0">
      <div className="p-4 space-y-4">
        {/* Preset Header & New Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase text-ink-muted">
              Presets
            </span>
            <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-surface-inset border border-border-subtle text-accent-primary">
              {presets.length}/20
            </span>
          </div>
          <button
            type="button"
            onClick={onNewPreset}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold bg-accent-soft text-accent-primary border border-accent-border hover:bg-accent-primary hover:text-[#04130D] transition-all"
          >
            <span>+</span>
            <span>New</span>
          </button>
        </div>

        {/* Preset List */}
        <div className="space-y-1.5 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
          {loading ? (
            <div className="text-xs text-ink-muted font-mono py-4 text-center">Loading presets...</div>
          ) : presets.length === 0 ? (
            <div className="p-4 rounded-lg bg-surface-inset border border-dashed border-border-subtle text-center text-xs space-y-2">
              <p className="text-ink-muted">No presets saved yet.</p>
              <button
                type="button"
                onClick={onNewPreset}
                className="text-accent-primary font-mono text-[11px] hover:underline"
              >
                Create your first preset →
              </button>
            </div>
          ) : (
            presets.map((p) => {
              const active = activePresetId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPreset(p)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                    active
                      ? 'bg-surface-card-alt border-accent-border text-ink-primary shadow-sm'
                      : 'bg-surface-card border-border-subtle text-ink-secondary hover:border-border-strong hover:text-ink-primary'
                  }`}
                >
                  <div className="space-y-0.5 truncate pr-6">
                    <div className="text-xs font-semibold truncate text-ink-primary">{p.name}</div>
                    <div className="text-[10px] font-mono text-ink-muted">
                      {p.stack} · <span className="uppercase text-accent-primary font-bold">{p.phase}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    title="Delete preset"
                    onClick={(e) => onDeletePreset(p.id, e)}
                    className="opacity-0 group-hover:opacity-100 hover:text-status-danger p-1 text-ink-muted transition-all"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Coming Soon Badges */}
      <div className="p-4 border-t border-border-subtle bg-bg-primary/40 space-y-2 text-xs font-mono">
        <div className="text-[10px] uppercase text-ink-muted font-bold tracking-wider">
          Roadmap Preview
        </div>
        <div className="flex items-center justify-between text-ink-muted text-[11px]">
          <span>Repo Switcher</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-surface-inset text-status-deferred border border-status-deferred-border">
            v1.5
          </span>
        </div>
        <div className="flex items-center justify-between text-ink-muted text-[11px]">
          <span>Audit History Timeline</span>
          <span className="text-[9px] px-1 py-0.2 rounded bg-surface-inset text-status-deferred border border-status-deferred-border">
            v1.5
          </span>
        </div>
      </div>
    </aside>
  );
}
