import { GuardrailReport } from '../schemas/guardrail.schema';

export type ExportFormat = 'cursor' | 'claude' | 'agents' | 'antigravity';

/**
 * Compiles a GuardrailReport into a ready-to-use rule configuration file
 * for various AI coding agents.
 */
export function compileAgentExport(report: GuardrailReport, format: ExportFormat): string {
  const mandatoryRules = report.rules.filter((r) => r.status === 'mandatory');
  const recommendedRules = report.rules.filter((r) => r.status === 'recommended');
  const deferredRules = report.rules.filter((r) => r.status === 'deferred');

  const ruleBullets = (rules: typeof report.rules) =>
    rules.map((r) => `- **${r.name}**: ${r.reason}`).join('\n');

  const conflictBanner =
    report.conflicts.length > 0
      ? `\n> ⚠️ **ARCHITECTURAL CONFLICT DETECTED (${report.conflicts[0].severity.toUpperCase()}):**\n> ${report.conflicts[0].message}\n> *Action Required:* ${report.conflicts[0].clarificationPrompt}\n`
      : '';

  switch (format) {
    case 'cursor':
      return `---
description: ArchTier Phase-Calibrated Architecture Rules (${report.phase.toUpperCase()})
globs: ["**/*.ts", "**/*.tsx", "**/*.js"]
alwaysApply: true
---

# ArchTier Guardrail Specification (${report.phase.toUpperCase()} Phase)
${conflictBanner}
## Target Filepath
\`${report.declaredFilepath}\`

## 1. MANDATORY Rules (Security Floor & Locked)
${ruleBullets(mandatoryRules)}

## 2. RECOMMENDED Rules (Advisory)
${recommendedRules.length > 0 ? ruleBullets(recommendedRules) : '- None at this phase.'}

## 3. DEFERRED Rules (Anti Over-Engineering)
${deferredRules.length > 0 ? ruleBullets(deferredRules) : '- None.'}

## Mandatory 5-Section Response Format
Before outputting code, the coding agent MUST provide:
1. Architecture Analysis
2. Filepath Declaration
3. Code Implementation
4. Testing Requirements
5. Architectural Impact & Security Checklist
`;

    case 'claude':
      return `# CLAUDE.md — ArchTier Guidelines (${report.phase.toUpperCase()})
${conflictBanner}
## Project Context
- **Phase:** ${report.phase.toUpperCase()}
- **Stack:** ${report.stack}
- **Category:** ${report.taskCategory}
- **Target File:** \`${report.declaredFilepath}\`

## Non-Negotiable Rules
${ruleBullets(mandatoryRules)}

## Phase Recommendations
${recommendedRules.length > 0 ? ruleBullets(recommendedRules) : '- Standard practices apply.'}

## Deferred Abstractions (Do Not Build)
${deferredRules.length > 0 ? ruleBullets(deferredRules) : '- None.'}

## Protocol
Always reply with the 5-Section Contract: Architecture Analysis, Filepath Declaration, Code Implementation, Testing Requirements, and Architectural Impact.
`;

    case 'agents':
      return `# AGENTS.md — Universal Agent Operating Contract
${conflictBanner}
## Metadata
- Phase: ${report.phase}
- Stack: ${report.stack}
- Target: ${report.declaredFilepath}

## Mandatory Rules (Locked)
${ruleBullets(mandatoryRules)}

## Advisory Rules
${recommendedRules.length > 0 ? ruleBullets(recommendedRules) : '- None.'}

## Deferred Features & Anti-Patterns
${deferredRules.length > 0 ? ruleBullets(deferredRules) : '- None.'}

## Output Format
You must structure every implementation in 5 sections:
1. Architecture Analysis
2. Filepath Declaration
3. Code Implementation
4. Testing Requirements
5. Architectural Impact & Security Checklist
`;

    case 'antigravity':
      return `# .antigravity/rules.md — ArchTier System Guardrails
${conflictBanner}
## Active Scope
- Phase: \`${report.phase}\`
- Stack: \`${report.stack}\`
- Target Location: \`${report.declaredFilepath}\`

## Security Floor & Mandatory Rules
${ruleBullets(mandatoryRules)}

## Recommended Guidelines
${recommendedRules.length > 0 ? ruleBullets(recommendedRules) : '- None.'}

## Deferred Architectural Ceremonies
${deferredRules.length > 0 ? ruleBullets(deferredRules) : '- None.'}

## Stop-on-Conflict Protocol
If any task conflicts with layer boundaries or requests deferred abstractions, stop immediately and ask for clarification.
`;
  }
}
