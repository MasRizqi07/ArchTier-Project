import React from 'react';
import Link from 'next/link';

export function BrandLogo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 text-ink-primary font-display font-bold tracking-tight text-lg group"
    >
      <div className="w-8 h-8 rounded-md bg-surface-card border border-accent-border flex items-center justify-center text-accent-primary shadow-sm group-hover:border-accent-primary transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      <span>
        Arch<span className="text-accent-primary">Tier</span>
      </span>
      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-surface-inset border border-border-subtle text-ink-secondary">
        v2.4
      </span>
    </Link>
  );
}
