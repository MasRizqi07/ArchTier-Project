import { z } from 'zod';

export const SignInSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid developer or work email.')
    .max(120, 'Email must not exceed 120 characters.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must not exceed 128 characters.'),
  rememberSession: z.boolean().default(true),
});
export type SignInInput = z.infer<typeof SignInSchema>;

export const RegisterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(80, 'Name must not exceed 80 characters.'),
  email: z
    .string()
    .trim()
    .email('Please enter a valid developer or work email.')
    .max(120, 'Email must not exceed 120 characters.'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password must not exceed 128 characters.')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter.')
    .regex(/[0-9]/, 'Password must include at least one number.'),
  rememberSession: z.boolean().default(true),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email to receive reset instructions.')
    .max(120),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong' | 'enterprise';

export interface PasswordStrengthResult {
  score: number; // 0 - 4
  level: PasswordStrengthLevel;
  label: string;
}

export function evaluatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password || password.length === 0) {
    return { score: 0, level: 'weak', label: 'Enter 8+ characters' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, level: 'weak', label: 'Weak: add numbers & symbols' };
    case 2:
      return { score: 2, level: 'medium', label: 'Fair: increase length' };
    case 3:
      return { score: 3, level: 'strong', label: 'Strong: good architecture standard' };
    case 4:
      return { score: 4, level: 'enterprise', label: 'Enterprise Grade: excellent entropy' };
    default:
      return { score: 0, level: 'weak', label: 'Weak: min 8 characters' };
  }
}
