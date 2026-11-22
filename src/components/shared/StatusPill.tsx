import React from 'react';

export type StatusVariant = 'mandatory' | 'recommended' | 'deferred' | 'danger';

interface StatusPillProps {
  variant: StatusVariant;
  children: React.ReactNode;
  className?: string;
}

export function StatusPill({ variant, children, className = '' }: StatusPillProps) {
  const variantStyles: Record<StatusVariant, string> = {
    mandatory:
      'bg-accent-soft text-accent-primary border-accent-border',
    recommended:
      'bg-status-warning-soft text-status-warning border-status-warning-border',
    deferred:
      'bg-status-deferred-soft text-status-deferred border-status-deferred-border',
    danger:
      'bg-status-danger-soft text-status-danger border-status-danger-border',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
