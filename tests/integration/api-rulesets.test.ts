import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/rulesets/route';
import { PATCH, DELETE } from '@/app/api/rulesets/[id]/route';

// Mock Prisma client singleton for deterministic, fast unit/integration testing
vi.mock('@/lib/db/prisma', () => {
  const mockPresets = [
    {
      id: 'mock-preset-1',
      userId: 'demo-user',
      name: 'Mock Sku Preset',
      phase: 'mvp',
      stack: 'nextjs',
      taskCategory: 'api_route',
      taskDescription: 'Build POST /api/analyze route with Zod schemas.',
      targetPath: '/src/app/api/analyze/route.ts',
      customNotes: 'Keep abstractions deferred.',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return {
    prisma: {
      rulesetPreset: {
        findMany: vi.fn().mockResolvedValue(mockPresets),
        findFirst: vi.fn().mockImplementation(({ where }) => {
          if (where.id === 'mock-preset-1') {
            return Promise.resolve(mockPresets[0]);
          }
          return Promise.resolve(null);
        }),
        count: vi.fn().mockResolvedValue(1),
        create: vi.fn().mockImplementation(({ data }) => {
          return Promise.resolve({
            id: 'mock-created-id',
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }),
        update: vi.fn().mockImplementation(({ data }) => {
          return Promise.resolve({
            ...mockPresets[0],
            ...data,
            updatedAt: new Date(),
          });
        }),
        delete: vi.fn().mockResolvedValue({ id: 'mock-preset-1' }),
      },
    },
  };
});

describe('/api/rulesets Integration Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET /api/rulesets returns HTTP 200 with list of presets', async () => {
    const req = new NextRequest('http://localhost:3000/api/rulesets');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].name).toBe('Mock Sku Preset');
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

  it('PATCH /api/rulesets/[id] updates an existing preset', async () => {
    const updatePayload = {
      name: 'Updated Preset Name',
      phase: 'growth',
    };

    const req = new NextRequest('http://localhost:3000/api/rulesets/mock-preset-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload),
    });

    const context = {
      params: Promise.resolve({ id: 'mock-preset-1' }),
    };

    const res = await PATCH(req, context);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.name).toBe('Updated Preset Name');
    expect(data.phase).toBe('growth');
  });

  it('DELETE /api/rulesets/[id] removes an existing preset', async () => {
    const req = new NextRequest('http://localhost:3000/api/rulesets/mock-preset-1', {
      method: 'DELETE',
    });

    const context = {
      params: Promise.resolve({ id: 'mock-preset-1' }),
    };

    const res = await DELETE(req, context);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.deleted).toBe(true);
  });
});
