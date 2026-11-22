import { describe, it, expect } from 'vitest';
import { CreateRulesetSchema, UpdateRulesetSchema } from '@/lib/schemas/ruleset.schema';

describe('Ruleset Schema Contracts', () => {
  it('validates CreateRulesetSchema with valid parameters', () => {
    const valid = {
      name: 'Core Auth Spec',
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'auth',
      taskDescription: 'Implement sign-in and session cookies using Better Auth.',
      targetPath: '/src/app/api/auth/[...all]/route.ts',
      customNotes: 'Keep it lean.',
    };

    const result = CreateRulesetSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects CreateRulesetSchema with name too short (< 2 chars)', () => {
    const invalid = {
      name: 'X',
      taskDescription: 'Valid task description with plenty of characters.',
    };

    const result = CreateRulesetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects CreateRulesetSchema with taskDescription too short (< 12 chars)', () => {
    const invalid = {
      name: 'Valid Name',
      taskDescription: 'Too short',
    };

    const result = CreateRulesetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('allows partial updates with UpdateRulesetSchema', () => {
    const partialUpdate = {
      phase: 'growth',
      customNotes: 'Updated to growth stage for integration test requirements.',
    };

    const result = UpdateRulesetSchema.safeParse(partialUpdate);
    expect(result.success).toBe(true);
  });
});
