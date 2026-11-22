import { AnalysisRequest, ConflictWarning } from '../schemas/guardrail.schema';

/**
 * Pure deterministic conflict detector.
 * Scans task description and target path for boundary violations or premature over-engineering.
 */
export function detectConflicts(input: AnalysisRequest): ConflictWarning[] {
  const conflicts: ConflictWarning[] = [];
  const descLower = input.taskDescription.toLowerCase();
  const pathLower = (input.targetPath || '').toLowerCase();

  // 1. DB in UI Violation: Database operations inside UI component layer
  const mentionsDb =
    descLower.includes('prisma') ||
    descLower.includes('database') ||
    descLower.includes('query') ||
    descLower.includes('sql') ||
    descLower.includes('db.') ||
    descLower.includes('db connection');

  const isUiLayer =
    input.taskCategory === 'ui_component' ||
    pathLower.includes('/src/components') ||
    pathLower.includes('\\src\\components') ||
    pathLower.endsWith('.tsx');

  if (isUiLayer && mentionsDb) {
    conflicts.push({
      code: 'DB_IN_UI_VIOLATION',
      severity: 'blocking',
      message:
        'Architectural Boundary Violation: Database operations (Prisma/SQL) cannot reside inside UI components or client files.',
      clarificationPrompt:
        'Move database access to a Next.js Server Component or API Route (/src/app/api/...), and pass data as typed props or JSON responses. Would you like to declare an API endpoint instead?',
    });
  }

  // 2. Hardcoded Secret Risk: Secrets or API keys mentioned for client code
  const mentionsSecret =
    descLower.includes('hardcoded secret') ||
    descLower.includes('hardcoded key') ||
    descLower.includes('hardcode secret') ||
    descLower.includes('client api key') ||
    descLower.includes('in browser token') ||
    descLower.includes('store secret in client') ||
    (descLower.includes('hardcode') &&
      (descLower.includes('secret') ||
        descLower.includes('key') ||
        descLower.includes('token') ||
        descLower.includes('credential')));

  if (mentionsSecret) {
    conflicts.push({
      code: 'HARDCODED_SECRET_RISK',
      severity: 'blocking',
      message:
        'Security Floor Violation: Secret keys or credentials must never be stored or exposed in client components.',
      clarificationPrompt:
        'All credentials must be read exclusively from process.env on the server. Confirm that this credential will be kept in .env.local and server route handlers.',
    });
  }

  // 3. MVP Over-Engineering Conflict: Requesting enterprise messaging or microservice patterns during MVP phase
  if (input.phase === 'mvp') {
    const mentionsOverEngineering =
      descLower.includes('microservice') ||
      descLower.includes('kafka') ||
      descLower.includes('event bus') ||
      descLower.includes('clean architecture repository factory') ||
      descLower.includes('rabbitmq') ||
      descLower.includes('grpc');

    if (mentionsOverEngineering) {
      conflicts.push({
        code: 'MVP_OVER_ENGINEERING_ALERT',
        severity: 'advisory',
        message:
          'Anti-Overengineering Advisory: Complex asynchronous messaging or microservice scaffolding is deferred during MVP phase.',
        clarificationPrompt:
          'ArchTier recommends using synchronous Next.js Route Handlers and deferring message brokers until the Scale phase. Would you like to proceed with a lean monolithic service instead?',
      });
    }
  }

  return conflicts;
}
