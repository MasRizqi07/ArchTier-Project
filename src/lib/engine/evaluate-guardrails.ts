import {
  AnalysisRequest,
  GuardrailReport,
  GuardrailRule,
} from '../schemas/guardrail.schema';
import {
  SECURITY_FLOOR_RULES,
  getStructuralRules,
  getContextualRules,
} from './rule-registry';
import { detectConflicts } from './conflict-detector';

/**
 * Resolves an idiomatic target filepath based on stack, phase, and category.
 */
function resolveDeclaredFilepath(input: AnalysisRequest): string {
  if (input.targetPath && input.targetPath.trim().length > 0) {
    return input.targetPath.trim();
  }

  const stack = input.stack;
  const category = input.taskCategory;

  switch (stack) {
    case 'nextjs':
      switch (category) {
        case 'api_route':
          return '/src/app/api/feature/route.ts';
        case 'auth':
          return '/src/app/api/auth/[...all]/route.ts';
        case 'payment_webhook':
          return '/src/app/api/webhooks/stripe/route.ts';
        case 'database':
          return '/prisma/schema.prisma';
        case 'ui_component':
          return '/src/components/FeatureView.tsx';
        case 'core_logic':
          return '/src/lib/engine/feature-engine.ts';
      }
      break;

    case 'react_express':
      switch (category) {
        case 'api_route':
        case 'auth':
        case 'payment_webhook':
          return '/server/routes/api.ts';
        case 'database':
          return '/server/db/schema.ts';
        case 'ui_component':
          return '/client/src/components/FeatureView.tsx';
        case 'core_logic':
          return '/server/services/feature.service.ts';
      }
      break;

    case 'laravel':
      switch (category) {
        case 'api_route':
        case 'auth':
        case 'payment_webhook':
          return '/app/Http/Controllers/FeatureController.php';
        case 'database':
          return '/database/migrations/create_features_table.php';
        case 'ui_component':
          return '/resources/js/Components/FeatureView.vue';
        case 'core_logic':
          return '/app/Actions/EvaluateFeature.php';
      }
      break;

    case 'go_react':
      switch (category) {
        case 'api_route':
        case 'auth':
        case 'payment_webhook':
          return '/cmd/api/handlers/feature.go';
        case 'database':
          return '/internal/db/schema.sql';
        case 'ui_component':
          return '/web/src/components/FeatureView.tsx';
        case 'core_logic':
          return '/internal/engine/feature.go';
      }
      break;
  }

  return '/src/app/api/feature/route.ts';
}

/**
 * Calculates estimated boilerplate savings percentage based on deferred rules.
 */
function calculateBoilerplateSaved(phase: AnalysisRequest['phase'], deferredCount: number): number {
  if (phase === 'mvp') {
    return Math.min(85, Math.max(55, deferredCount * 28 + 15));
  }
  if (phase === 'growth') {
    return Math.min(50, Math.max(30, deferredCount * 20 + 10));
  }
  return Math.min(20, deferredCount * 10);
}

/**
 * Generates the standardized 5-Section Contract for AI coding agents.
 */
function generateFivePartContract(
  input: AnalysisRequest,
  declaredPath: string,
  rules: GuardrailRule[]
) {
  const mandatoryRules = rules.filter((r) => r.status === 'mandatory');
  const deferredRules = rules.filter((r) => r.status === 'deferred');

  const analysis = `This task belongs to the '${input.taskCategory}' layer on stack '${input.stack}' in the '${input.phase.toUpperCase()}' phase. Security floor is active and strictly enforced. ${
    deferredRules.length > 0
      ? `Anti-overengineering guards deferred: ${deferredRules.map((r) => r.name).join(', ')}.`
      : 'All enterprise abstractions are enforced.'
  }`;

  const filepath = `Target location: \`${declaredPath}\`. Purpose: Implement ${input.taskCategory} logic for: "${input.taskDescription.slice(0, 90)}...". Consumers: Parent router or UI component.`;

  const codeGuidance = `Implement in strict TypeScript (zero any). Enforce Zod validation on all input boundaries. Security floor mandates: ${mandatoryRules
    .map((r) => r.name)
    .join(', ')}. Avoid premature abstractions.`;

  const testing = `Require Vitest test specifications at matching test location (e.g. /tests/unit/ or /tests/integration/). Must verify successful execution, Zod validation rejection (HTTP 400), and boundary error sanitization.`;

  const impactChecklist = `[x] Zod input validation enforced\n[x] Zero hardcoded secrets in client\n[x] Error responses sanitized (no DB leak)\n[x] Strict TypeScript (zero any)\n[x] Intentional ${input.phase.toUpperCase()} trade-offs documented`;

  return {
    analysis,
    filepath,
    codeGuidance,
    testing,
    impactChecklist,
  };
}

/**
 * Main Pure Deterministic Guardrail Evaluator.
 * Pure synchronous function, framework-agnostic.
 */
export function evaluateGuardrails(input: AnalysisRequest): GuardrailReport {
  // 1. Gather all rules
  const securityRules = SECURITY_FLOOR_RULES;
  const structuralRules = getStructuralRules(input.phase);
  const contextualRules = getContextualRules(input.taskCategory);

  const allRules: GuardrailRule[] = [...securityRules, ...structuralRules, ...contextualRules];

  // 2. Detect conflicts
  const conflicts = detectConflicts(input);

  // 3. Resolve target filepath
  const declaredFilepath = resolveDeclaredFilepath(input);

  // 4. Compute metrics
  const mandatoryCount = allRules.filter((r) => r.status === 'mandatory').length;
  const recommendedCount = allRules.filter((r) => r.status === 'recommended').length;
  const deferredCount = allRules.filter((r) => r.status === 'deferred').length;
  const estimatedBoilerplateSavedPct = calculateBoilerplateSaved(input.phase, deferredCount);

  // 5. Generate 5-part contract
  const fivePartContract = generateFivePartContract(input, declaredFilepath, allRules);

  return {
    phase: input.phase,
    stack: input.stack,
    taskCategory: input.taskCategory,
    declaredFilepath,
    summary: {
      mandatoryCount,
      recommendedCount,
      deferredCount,
      estimatedBoilerplateSavedPct,
    },
    conflicts,
    rules: allRules,
    fivePartContract,
  };
}
