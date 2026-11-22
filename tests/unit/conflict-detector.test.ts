import { describe, it, expect } from 'vitest';
import { detectConflicts } from '@/lib/engine/conflict-detector';
import { AnalysisRequest } from '@/lib/schemas/guardrail.schema';

describe('detectConflicts Boundary & Anti-Pattern Scanner', () => {
  it('detects DB-in-UI layer boundary violation as a blocking conflict', () => {
    const request: AnalysisRequest = {
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'ui_component',
      taskDescription: 'Render user profile card and execute prisma query to load user balance directly in component.',
      targetPath: '/src/components/UserProfile.tsx',
    };

    const conflicts = detectConflicts(request);

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].code).toBe('DB_IN_UI_VIOLATION');
    expect(conflicts[0].severity).toBe('blocking');
    expect(conflicts[0].clarificationPrompt).toContain('Next.js Server Component or API Route');
  });

  it('detects hardcoded secret risks as a blocking conflict', () => {
    const request: AnalysisRequest = {
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Initialize client Stripe SDK with hardcoded secret key in the frontend bundle.',
    };

    const conflicts = detectConflicts(request);

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].code).toBe('HARDCODED_SECRET_RISK');
    expect(conflicts[0].severity).toBe('blocking');
  });

  it('flags MVP premature over-engineering as an advisory conflict', () => {
    const request: AnalysisRequest = {
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Set up Apache Kafka distributed event bus and microservice scaffolding for user onboarding.',
    };

    const conflicts = detectConflicts(request);

    expect(conflicts.length).toBe(1);
    expect(conflicts[0].code).toBe('MVP_OVER_ENGINEERING_ALERT');
    expect(conflicts[0].severity).toBe('advisory');
    expect(conflicts[0].clarificationPrompt).toContain('synchronous Next.js Route Handlers');
  });

  it('returns no conflicts for clean and compliant requests', () => {
    const request: AnalysisRequest = {
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Create POST /api/analyze route handler validating inputs with Zod schemas.',
      targetPath: '/src/app/api/analyze/route.ts',
    };

    const conflicts = detectConflicts(request);

    expect(conflicts.length).toBe(0);
  });
});
