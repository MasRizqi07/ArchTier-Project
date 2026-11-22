import { GuardrailRule, ProjectPhase, TaskCategory } from '../schemas/guardrail.schema';

/**
 * Non-Negotiable Security Floor:
 * These rules are ALWAYS locked and mandatory regardless of project phase (MVP, Growth, Scale).
 */
export const SECURITY_FLOOR_RULES: GuardrailRule[] = [
  {
    id: 'zod_input_validation',
    name: 'Zod Input Validation at Boundaries',
    category: 'security_floor',
    status: 'mandatory',
    reason: 'Every API handler and form input must parse untrusted payloads through shared Zod schemas.',
    locked: true,
  },
  {
    id: 'env_secrets_isolation',
    name: 'Zero Hardcoded Secrets & Env Isolation',
    category: 'security_floor',
    status: 'mandatory',
    reason: 'Secrets, database URLs, and API tokens must be strictly isolated to server process.env.',
    locked: true,
  },
  {
    id: 'safe_error_responses',
    name: 'Sanitized Client Error Responses',
    category: 'security_floor',
    status: 'mandatory',
    reason: 'Never leak raw database exceptions, ORM queries, or internal stack traces to clients.',
    locked: true,
  },
  {
    id: 'strict_type_safety',
    name: 'Strict TypeScript (Zero Any / Zero Ts-Ignore)',
    category: 'security_floor',
    status: 'mandatory',
    reason: 'Types must be explicitly declared and verified without unsafe type casts or any escape hatches.',
    locked: true,
  },
];

/**
 * Evaluates structural rules based on the project phase.
 */
export function getStructuralRules(phase: ProjectPhase): GuardrailRule[] {
  switch (phase) {
    case 'mvp':
      return [
        {
          id: 'pure_domain_isolation',
          name: 'Pure Domain Logic Colocation',
          category: 'structural',
          status: 'mandatory',
          reason: 'Business logic must reside in /src/lib/engine as pure synchronous functions without framework coupling.',
          locked: false,
        },
        {
          id: 'integration_test_suite',
          name: 'Integration Test Coverage',
          category: 'testing',
          status: 'recommended',
          reason: 'Unit tests for core logic are prioritized in MVP; integration tests for route boundaries are recommended.',
          locked: false,
        },
        {
          id: 'repository_adapter_abstraction',
          name: 'Repository & Adapter Abstraction',
          category: 'structural',
          status: 'deferred',
          reason: 'DEFERRED: Call ORM/Prisma directly in route handlers. Repository interfaces add redundant ceremony in MVP.',
          locked: false,
        },
        {
          id: 'multilayer_dtos_and_event_bus',
          name: 'Multi-Layer DTOs & Event Bus',
          category: 'structural',
          status: 'deferred',
          reason: 'DEFERRED: Use direct Zod schema inferred types. Avoid separate DTO mapper classes and asynchronous event brokers.',
          locked: false,
        },
      ];

    case 'growth':
      return [
        {
          id: 'pure_domain_isolation',
          name: 'Pure Domain Logic Isolation',
          category: 'structural',
          status: 'mandatory',
          reason: 'Domain engine remains isolated with shared contracts in /src/lib/schemas.',
          locked: true,
        },
        {
          id: 'integration_test_suite',
          name: 'Integration Test Coverage (Mandatory)',
          category: 'testing',
          status: 'mandatory',
          reason: 'All public and protected route handlers must have automated integration tests to prevent team regressions.',
          locked: false,
        },
        {
          id: 'repository_adapter_abstraction',
          name: 'Repository & Adapter Abstraction',
          category: 'structural',
          status: 'recommended',
          reason: 'RECOMMENDED: Introduce repository wrappers for high-churn domain models to facilitate mocking and migrations.',
          locked: false,
        },
        {
          id: 'multilayer_dtos_and_event_bus',
          name: 'Multi-Layer DTOs & Event Bus',
          category: 'structural',
          status: 'deferred',
          reason: 'DEFERRED: Continue colocating input/output models with Zod schemas until distributed services are required.',
          locked: false,
        },
      ];

    case 'scale':
      return [
        {
          id: 'pure_domain_isolation',
          name: 'Pure Domain Logic Isolation (Strict)',
          category: 'structural',
          status: 'mandatory',
          reason: 'Complete decoupling of domain logic with hexagonal boundaries and dependency injection.',
          locked: true,
        },
        {
          id: 'integration_test_suite',
          name: 'Integration & Contract Test Gates',
          category: 'testing',
          status: 'mandatory',
          reason: 'Contract gates and CI breaking-change analyzers must enforce backward compatibility on all routes.',
          locked: true,
        },
        {
          id: 'repository_adapter_abstraction',
          name: 'Repository & Adapter Interfaces',
          category: 'structural',
          status: 'mandatory',
          reason: 'Mandatory repository contracts decouple storage layer completely for multi-database or caching topologies.',
          locked: true,
        },
        {
          id: 'multilayer_dtos_and_event_bus',
          name: 'Multi-Layer DTOs & OpenAPI Event Contracts',
          category: 'structural',
          status: 'mandatory',
          reason: 'All service-to-service communication requires versioned DTO mappings and schema-validated event dispatch.',
          locked: true,
        },
      ];
  }
}

/**
 * Returns contextual rules tailored to the selected task category.
 */
export function getContextualRules(category: TaskCategory): GuardrailRule[] {
  switch (category) {
    case 'payment_webhook':
      return [
        {
          id: 'webhook_signature_verification',
          name: 'HMAC Cryptographic Signature Check',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Verify webhook signature using raw body and secret before JSON parsing to prevent spoofing.',
          locked: true,
        },
        {
          id: 'idempotent_event_handling',
          name: 'Idempotency Key & Deduplication',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Record and verify event IDs in database to prevent double-charging or duplicate order fulfillment.',
          locked: true,
        },
      ];

    case 'auth':
      return [
        {
          id: 'secure_password_hashing',
          name: 'Salted Password Hashing',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Passwords must be securely hashed (Argon2id or bcrypt) via Better Auth; never store plain text.',
          locked: true,
        },
        {
          id: 'session_cookie_flags',
          name: 'Secure Session Cookie Flags',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Session cookies must enforce HttpOnly, SameSite=Lax, and Secure flags to prevent XSS session theft.',
          locked: true,
        },
        {
          id: 'auth_rate_limiting',
          name: 'Brute-Force Rate Limiting',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Limit failed sign-in attempts per IP/account to mitigate dictionary and brute-force attacks.',
          locked: true,
        },
      ];

    case 'database':
      return [
        {
          id: 'prisma_singleton_connection',
          name: 'Singleton Connection Pooling',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Prisma Client must be instantiated as a global singleton to prevent exhausting pooled connections in serverless.',
          locked: true,
        },
        {
          id: 'migration_version_control',
          name: 'Versioned Database Migrations',
          category: 'contextual',
          status: 'mandatory',
          reason: 'All schema alterations must be committed via versioned Prisma migration scripts; never use db push in production.',
          locked: true,
        },
      ];

    case 'ui_component':
      return [
        {
          id: 'server_client_boundary',
          name: 'Explicit Server / Client Boundary',
          category: 'contextual',
          status: 'mandatory',
          reason: "Mark interactive components with 'use client' only when hooks, state, or browser APIs are required.",
          locked: true,
        },
        {
          id: 'accessible_form_controls',
          name: 'WCAG 2.1 AA Accessible Controls',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Every input must have a visible label, min 44x44px touch target, and visible emerald focus-ring.',
          locked: true,
        },
      ];

    case 'api_route':
      return [
        {
          id: 'safe_http_methods',
          name: 'Strict HTTP Verb & Status Codes',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Use standard REST verbs (GET, POST, PATCH, DELETE) with accurate HTTP statuses (200, 201, 400, 401, 404).',
          locked: true,
        },
      ];

    case 'core_logic':
      return [
        {
          id: 'framework_agnostic_purity',
          name: 'Framework-Agnostic Purity',
          category: 'contextual',
          status: 'mandatory',
          reason: 'Domain calculations and rules must be pure functions with zero Next.js, React, or database imports.',
          locked: true,
        },
      ];
  }
}
