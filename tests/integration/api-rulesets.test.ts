import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/rulesets/route';

describe('/api/rulesets Integration Endpoints', () => {
  it('GET /api/rulesets returns HTTP 200 with list of presets', async () => {
    const req = new NextRequest('http://localhost:3000/api/rulesets');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/rulesets returns HTTP 201 for valid preset creation payload', async () => {
    const newPreset = {
      name: 'Integration Test Preset',
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Build POST /api/analyze route handler validating inputs with Zod schemas.',
      targetPath: '/src/app/api/analyze/route.ts',
    };

    const req = new NextRequest('http://localhost:3000/api/rulesets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPreset),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe('Integration Test Preset');
    expect(data.phase).toBe('mvp');
  });

  it('POST /api/rulesets returns HTTP 400 when taskDescription is too short', async () => {
    const invalidPreset = {
      name: 'Invalid Preset',
      taskDescription: 'Short',
    };

    const req = new NextRequest('http://localhost:3000/api/rulesets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPreset),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('VALIDATION_ERROR');
    expect(data.issues).toBeDefined();
  });
});
