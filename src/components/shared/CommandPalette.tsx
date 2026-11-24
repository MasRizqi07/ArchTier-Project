'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (!open) return null;

  function runAction(action: () => void) {
    action();
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-surface-card border border-border-strong rounded-xl shadow-elevated overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-elevated">
          <div className="flex items-center gap-2 text-xs font-mono text-ink-muted">
            <span>⌘K</span>
            <span>Quick Actions &amp; Navigation</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-ink-muted hover:text-ink-primary text-xs"
          >
            ESC
          </button>
        </div>

        <div className="p-2 space-y-1">
          <button
            type="button"
            onClick={() => runAction(() => router.push('/dashboard'))}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-surface-hover text-ink-primary transition-colors text-left font-mono"
          >
            <span>Open Workspace Dashboard</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-inset text-ink-muted border border-border-subtle">
              ↵
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => runAction(() => router.push('/login'))}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-surface-hover text-ink-primary transition-colors text-left font-mono"
          >
            <span>Sign In to Workspace</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-inset text-ink-muted border border-border-subtle">
              L
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('simulator');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-surface-hover text-ink-primary transition-colors text-left font-mono"
          >
            <span>Jump to Live Phase Simulator</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-inset text-ink-muted border border-border-subtle">
              S
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('sandbox');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-surface-hover text-ink-primary transition-colors text-left font-mono"
          >
            <span>Jump to Interactive Prompt Builder</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-inset text-ink-muted border border-border-subtle">
              P
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setOpen(false);
            }}
            className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs hover:bg-surface-hover text-ink-primary transition-colors text-left font-mono"
          >
            <span>View Transparent Pricing</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-inset text-ink-muted border border-border-subtle">
              $
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
