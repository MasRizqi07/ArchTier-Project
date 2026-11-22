import { describe, it, expect } from 'vitest';
import { evaluateGuardrails } from '@/lib/engine/evaluate-guardrails';
import { AnalysisRequest } from '@/lib/schemas/guardrail.schema';

describe('evaluateGuardrails Domain Engine', () => {
  const baseRequest: AnalysisRequest = {
    phase: 'mvp',
    stack: 'nextjs',
    taskCategory: 'api_route',
    taskDescription: 'Build POST /api/analyze endpoint with input validation and rate limiting.',
  };

  it('enforces non-negotiable security floor across all project phases', () => {
    const phases: Array<'mvp' | 'growth' | 'scale'> = ['mvp', 'growth', 'scale'];

    for (const phase of phases) {
      const report = evaluateGuardrails({ ...baseRequest, phase });
      const securityFloorRules = report.rules.filter((r) => r.category === 'security_floor');

      expect(securityFloorRules.length).toBe(4);
      for (const rule of securityFloorRules) {
        expect(rule.status).toBe('mandatory');
        expect(rule.locked).toBe(true);
      }
    }
  });

  it('calibrates structural rules for MVP phase (defers premature enterprise abstractions)', () => {
    const report = evaluateGuardrails({ ...baseRequest, phase: 'mvp' });

    const repoRule = report.rules.find((r) => r.id === 'repository_adapter_abstraction');
    const dtoRule = report.rules.find((r) => r.id === 'multilayer_dtos_and_event_bus');
    const testRule = report.rules.find((r) => r.id === 'integration_test_suite');

    expect(repoRule?.status).toBe('deferred');
    expect(dtoRule?.status).toBe('deferred');
    expect(testRule?.status).toBe('recommended');
    expect(report.summary.deferredCount).toBeGreaterThanOrEqual(2);
    expect(report.summary.estimatedBoilerplateSavedPct).toBeGreaterThanOrEqual(55);
  });

  it('promotes structural rules appropriately in Growth and Scale phases', () => {
    const growthReport = evaluateGuardrails({ ...baseRequest, phase: 'growth' });
    const growthTestRule = growthReport.rules.find((r) => r.id === 'integration_test_suite');
    const growthRepoRule = growthReport.rules.find((r) => r.id === 'repository_adapter_abstraction');

    expect(growthTestRule?.status).toBe('mandatory');
    expect(growthRepoRule?.status).toBe('recommended');

    const scaleReport = evaluateGuardrails({ ...baseRequest, phase: 'scale' });
    const scaleRepoRule = scaleReport.rules.find((r) => r.id === 'repository_adapter_abstraction');
    const scaleDtoRule = scaleReport.rules.find((r) => r.id === 'multilayer_dtos_and_event_bus');

    expect(scaleRepoRule?.status).toBe('mandatory');
    expect(scaleDtoRule?.status).toBe('mandatory');
    expect(scaleReport.summary.deferredCount).toBe(0);
  });

  it('injects contextual rules for specific task categories (payment webhook & auth)', () => {
    const webhookReport = evaluateGuardrails({
      ...baseRequest,
      taskCategory: 'payment_webhook',
      taskDescription: 'Handle incoming Stripe checkout session completed events.',
    });

    const hmacRule = webhookReport.rules.find((r) => r.id === 'webhook_signature_verification');
    const idempotencyRule = webhookReport.rules.find((r) => r.id === 'idempotent_event_handling');

    expect(hmacRule?.status).toBe('mandatory');
    expect(idempotencyRule?.status).toBe('mandatory');

    const authReport = evaluateGuardrails({
      ...baseRequest,
      taskCategory: 'auth',
      taskDescription: 'Implement sign-in and session cookies for users.',
    });

    const cookieRule = authReport.rules.find((r) => r.id === 'session_cookie_flags');
    const hashRule = authReport.rules.find((r) => r.id === 'secure_password_hashing');

    expect(cookieRule?.status).toBe('mandatory');
    expect(hashRule?.status).toBe('mandatory');
  });

  it('generates a complete 5-part contract in the report', () => {
    const report = evaluateGuardrails(baseRequest);

    expect(report.fivePartContract).toBeDefined();
    expect(report.fivePartContract.analysis).toContain("layer on stack 'nextjs'");
    expect(report.fivePartContract.filepath).toContain('/src/app/api/');
    expect(report.fivePartContract.codeGuidance).toContain('strict TypeScript');
    expect(report.fivePartContract.testing).toContain('Vitest');
    expect(report.fivePartContract.impactChecklist).toContain('[x]');
  });
});
