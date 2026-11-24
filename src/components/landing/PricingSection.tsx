'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatusPill } from '@/components/shared/StatusPill';

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 border-t border-border-subtle bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-3">
          <StatusPill variant="recommended">Transparent Pricing</StatusPill>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-ink-primary">
            Start free on your MVP. Upgrade when your team scales.
          </h2>
          <p className="text-sm sm:text-base text-ink-secondary">
            Zero per-token markup. Bring your own Cursor, Claude, or Antigravity agent.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-lg bg-surface-inset border border-border-subtle mt-4">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                !annual
                  ? 'bg-surface-card text-accent-primary border border-accent-border shadow-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-semibold transition-colors ${
                annual
                  ? 'bg-surface-card text-accent-primary border border-accent-border shadow-sm'
                  : 'text-ink-muted hover:text-ink-primary'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1: Solo MVP */}
          <div className="bg-surface-card border border-border-strong rounded-xl p-6 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-ink-primary">Solo MVP</h3>
                <StatusPill variant="deferred">Indie</StatusPill>
              </div>
              <div className="text-3xl font-display font-bold text-ink-primary">
                $0<span className="text-xs font-mono text-ink-muted">/mo</span>
              </div>
              <p className="text-xs text-ink-secondary">
                For solo builders shipping fast with AI coding agents without architectural drift.
              </p>
              <ul className="space-y-2 text-xs font-mono text-ink-secondary pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Unlimited MVP &amp; Growth compilations</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Core security floor &amp; Zod boundary checks</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Export to Cursor, Claude &amp; Antigravity</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Up to 20 saved ruleset presets</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-lg bg-surface-inset border border-border-strong hover:bg-surface-hover text-xs font-mono font-bold text-ink-primary text-center transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Card 2: Growth Team (Featured) */}
          <div className="bg-surface-card border-2 border-accent-border rounded-xl p-6 shadow-elevated flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-ink-primary">Growth Team</h3>
                <StatusPill variant="mandatory">Most Popular</StatusPill>
              </div>
              <div className="text-3xl font-display font-bold text-accent-primary">
                ${annual ? 23 : 29}
                <span className="text-xs font-mono text-ink-muted">/mo</span>
              </div>
              <p className="text-xs text-ink-secondary">
                For product teams keeping 3–15 engineers and agents aligned on contracts.
              </p>
              <ul className="space-y-2 text-xs font-mono text-ink-secondary pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Everything in Solo MVP</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>PostgreSQL preset sync &amp; history</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Phase promotion gates (MVP → Growth)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Shared workspace repository configs</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-lg bg-accent-primary text-[#04130D] text-xs font-display font-bold text-center hover:bg-accent-primary-hover transition-all shadow-card"
            >
              Open Workspace
            </Link>
          </div>

          {/* Card 3: Scale Org */}
          <div className="bg-surface-card border border-border-strong rounded-xl p-6 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-ink-primary">Scale Org</h3>
                <StatusPill variant="recommended">Enterprise</StatusPill>
              </div>
              <div className="text-3xl font-display font-bold text-ink-primary">
                ${annual ? 79 : 99}
                <span className="text-xs font-mono text-ink-muted">/mo</span>
              </div>
              <p className="text-xs text-ink-secondary">
                For multi-repo organizations enforcing strict decoupled domain contracts.
              </p>
              <ul className="space-y-2 text-xs font-mono text-ink-secondary pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Multi-service contract breaking gates</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Custom SOC2 compliance rule packs</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>CI/CD webhook enforcement &amp; audit</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent-primary font-bold">✓</span>
                  <span>Enterprise SSO &amp; SAML 2.0 (v2.0)</span>
                </li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-2.5 rounded-lg bg-surface-inset border border-border-strong hover:bg-surface-hover text-xs font-mono font-bold text-ink-primary text-center transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
