import { describe, it, expect } from 'vitest';
import {
  SignInSchema,
  RegisterSchema,
  evaluatePasswordStrength,
} from '@/lib/schemas/auth.schema';

describe('Auth Schema Contracts & Strength Evaluator', () => {
  it('validates SignInSchema with valid email and password', () => {
    const valid = {
      email: 'alex.rivera@archtier.dev',
      password: 'ArchTier2026!Secure',
      rememberSession: true,
    };
    const result = SignInSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects SignInSchema with invalid email or too short password (< 8 chars)', () => {
    const invalidEmail = {
      email: 'not-an-email',
      password: 'validPassword123',
    };
    expect(SignInSchema.safeParse(invalidEmail).success).toBe(false);

    const shortPassword = {
      email: 'test@archtier.dev',
      password: 'short',
    };
    expect(SignInSchema.safeParse(shortPassword).success).toBe(false);
  });

  it('validates RegisterSchema requiring name, uppercase, and number in password', () => {
    const valid = {
      name: 'Alex Rivera',
      email: 'alex@archtier.dev',
      password: 'SecurePassword123',
    };
    expect(RegisterSchema.safeParse(valid).success).toBe(true);

    const missingNumber = {
      name: 'Alex Rivera',
      email: 'alex@archtier.dev',
      password: 'SecurePasswordOnly',
    };
    expect(RegisterSchema.safeParse(missingNumber).success).toBe(false);

    const missingUppercase = {
      name: 'Alex Rivera',
      email: 'alex@archtier.dev',
      password: 'securepassword123',
    };
    expect(RegisterSchema.safeParse(missingUppercase).success).toBe(false);
  });

  it('evaluates password strength tiers accurately', () => {
    expect(evaluatePasswordStrength('').level).toBe('weak');
    expect(evaluatePasswordStrength('short').level).toBe('weak');
    expect(evaluatePasswordStrength('weakpassword').score).toBeGreaterThanOrEqual(1);
    expect(evaluatePasswordStrength('FairPass12').level).toBe('medium');
    expect(evaluatePasswordStrength('StrongPass123!@').score).toBeGreaterThanOrEqual(3);
  });
});
