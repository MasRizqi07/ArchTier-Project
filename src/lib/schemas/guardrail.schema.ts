import { z } from 'zod';

export const ProjectPhaseSchema = z.enum(['mvp', 'growth', 'scale']);
export type ProjectPhase = z.infer<typeof ProjectPhaseSchema>;

export const TechStackSchema = z.enum(['nextjs', 'react_express', 'laravel', 'go_react']);
export type TechStack = z.infer<typeof TechStackSchema>;

export const TaskCategorySchema = z.enum([
  'auth',
  'api_route',
  'payment_webhook',
  'database',
  'ui_component',
  'core_logic',
]);
export type TaskCategory = z.infer<typeof TaskCategorySchema>;

export const RuleStatusSchema = z.enum(['mandatory', 'recommended', 'deferred']);
export type RuleStatus = z.infer<typeof RuleStatusSchema>;

export const AnalysisRequestSchema = z.object({
  phase: ProjectPhaseSchema,
  stack: TechStackSchema,
  taskCategory: TaskCategorySchema.default('api_route'),
  taskDescription: z
    .string()
    .trim()
    .min(12, 'Describe the feature task in at least 12 characters.')
    .max(1500, 'Task description must not exceed 1500 characters.'),
  targetPath: z.string().trim().max(200).optional(),
});
export type AnalysisRequest = z.infer<typeof AnalysisRequestSchema>;

export const GuardrailRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.enum(['security_floor', 'structural', 'contextual', 'testing']),
  status: RuleStatusSchema,
  reason: z.string(),
  locked: z.boolean(),
});
export type GuardrailRule = z.infer<typeof GuardrailRuleSchema>;

export const ConflictWarningSchema = z.object({
  code: z.string(),
  severity: z.enum(['blocking', 'advisory']),
  message: z.string(),
  clarificationPrompt: z.string(),
});
export type ConflictWarning = z.infer<typeof ConflictWarningSchema>;

export const GuardrailReportSchema = z.object({
  phase: ProjectPhaseSchema,
  stack: TechStackSchema,
  taskCategory: TaskCategorySchema,
  declaredFilepath: z.string(),
  summary: z.object({
    mandatoryCount: z.number().int().nonnegative(),
    recommendedCount: z.number().int().nonnegative(),
    deferredCount: z.number().int().nonnegative(),
    estimatedBoilerplateSavedPct: z.number().int().min(0).max(100),
  }),
  conflicts: z.array(ConflictWarningSchema),
  rules: z.array(GuardrailRuleSchema),
  fivePartContract: z.object({
    analysis: z.string(),
    filepath: z.string(),
    codeGuidance: z.string(),
    testing: z.string(),
    impactChecklist: z.string(),
  }),
});
export type GuardrailReport = z.infer<typeof GuardrailReportSchema>;
