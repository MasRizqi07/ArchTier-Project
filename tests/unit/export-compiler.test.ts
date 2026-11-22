import { describe, it, expect } from 'vitest';
import { compileAgentExport } from '@/lib/engine/export-compiler';
import { evaluateGuardrails } from '@/lib/engine/evaluate-guardrails';

describe('compileAgentExport Multi-Agent Compiler', () => {
  const report = evaluateGuardrails({
    phase: 'mvp',
    stack: 'nextjs',
    taskCategory: 'api_route',
    taskDescription: 'Build public analysis endpoint with Zod input validation.',
    targetPath: '/src/app/api/analyze/route.ts',
  });

  it('compiles valid Cursor MDC rule with YAML frontmatter', () => {
    const cursorOutput = compileAgentExport(report, 'cursor');

    expect(cursorOutput).toContain('---');
    expect(cursorOutput).toContain('description: ArchTier Phase-Calibrated Architecture Rules (MVP)');
    expect(cursorOutput).toContain('globs: ["**/*.ts", "**/*.tsx", "**/*.js"]');
    expect(cursorOutput).toContain('alwaysApply: true');
    expect(cursorOutput).toContain('/src/app/api/analyze/route.ts');
    expect(cursorOutput).toContain('MANDATORY Rules');
    expect(cursorOutput).toContain('DEFERRED Rules');
  });

  it('compiles valid CLAUDE.md operating guidelines', () => {
    const claudeOutput = compileAgentExport(report, 'claude');

    expect(claudeOutput).toContain('# CLAUDE.md — ArchTier Guidelines (MVP)');
    expect(claudeOutput).toContain('## Non-Negotiable Rules');
    expect(claudeOutput).toContain('5-Section Contract');
  });

  it('compiles valid AGENTS.md universal contract', () => {
    const agentsOutput = compileAgentExport(report, 'agents');

    expect(agentsOutput).toContain('# AGENTS.md — Universal Agent Operating Contract');
    expect(agentsOutput).toContain('## Metadata');
    expect(agentsOutput).toContain('Phase: mvp');
  });

  it('compiles valid Antigravity rules.md specification', () => {
    const antigravityOutput = compileAgentExport(report, 'antigravity');

    expect(antigravityOutput).toContain('# .antigravity/rules.md — ArchTier System Guardrails');
    expect(antigravityOutput).toContain('## Stop-on-Conflict Protocol');
  });

  it('embeds architectural conflict banner into export when conflict is present', () => {
    const reportWithConflict = evaluateGuardrails({
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'ui_component',
      taskDescription: 'Prisma database query inside component.',
      targetPath: '/src/components/List.tsx',
    });

    const exportText = compileAgentExport(reportWithConflict, 'cursor');

    expect(exportText).toContain('⚠️ **ARCHITECTURAL CONFLICT DETECTED (BLOCKING):**');
  });
});
