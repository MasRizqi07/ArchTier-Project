import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/analyze/route';

describe('POST /api/analyze Integration Endpoint', () => {
  it('returns HTTP 200 with complete GuardrailReport for valid payload', async () => {
    const validPayload = {
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Implement POST /api/analyze endpoint with Zod validation.',
      targetPath: '/src/app/api/analyze/route.ts',
    };

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.phase).toBe('mvp');
    expect(body.stack).toBe('nextjs');
    expect(body.declaredFilepath).toBe('/src/app/api/analyze/route.ts');
    expect(body.summary.mandatoryCount).toBeGreaterThan(0);
    expect(body.summary.deferredCount).toBeGreaterThan(0);
    expect(body.fivePartContract).toBeDefined();
    expect(res.headers.get('X-RateLimit-Limit')).toBe('60');
  });

  it('returns HTTP 400 with VALIDATION_ERROR when taskDescription is too short (< 12 chars)', async () => {
    const invalidPayload = {
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Too short',
    };

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.issues).toBeDefined();
    expect(body.issues[0].path).toBe('taskDescription');
  });

  it('returns HTTP 400 when phase is not a valid enum value', async () => {
    const invalidPayload = {
      phase: 'enterprise_ultra',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Valid task description with plenty of characters.',
    };

    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPayload),
    });

    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe('VALIDATION_ERROR');
    expect(body.issues[0].path).toBe('phase');
  });
});
