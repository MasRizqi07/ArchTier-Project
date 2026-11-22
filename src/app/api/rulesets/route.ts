import { NextRequest, NextResponse } from 'next/server';
import { CreateRulesetSchema } from '@/lib/schemas/ruleset.schema';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { formatErrorResponse } from '@/lib/security/error-response';

// In-memory fallback presets for development/offline mode
const localPresets: Array<{
  id: string;
  userId: string;
  name: string;
  phase: 'mvp' | 'growth' | 'scale';
  stack: 'nextjs' | 'react_express' | 'laravel' | 'go_react';
  taskCategory: 'auth' | 'api_route' | 'payment_webhook' | 'database' | 'ui_component' | 'core_logic';
  taskDescription: string;
  targetPath: string | null;
  customNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}> = [
  {
    id: 'preset-demo-1',
    userId: 'demo-user',
    name: 'SaaS Core MVP',
    phase: 'mvp',
    stack: 'nextjs',
    taskCategory: 'api_route',
    taskDescription: 'Build POST /api/analyze public endpoint with Zod input validation and sliding rate limiter.',
    targetPath: '/src/app/api/analyze/route.ts',
    customNotes: 'Keep abstractions deferred until Growth phase.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'preset-demo-2',
    userId: 'demo-user',
    name: 'Stripe Webhook Gateway',
    phase: 'growth',
    stack: 'nextjs',
    taskCategory: 'payment_webhook',
    taskDescription: 'Process incoming Stripe checkout webhooks with raw HMAC signature verification.',
    targetPath: '/src/app/api/webhooks/stripe/route.ts',
    customNotes: 'Enforce idempotency key tracking.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * GET /api/rulesets
 * Returns saved presets for the authenticated user.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const userId = session?.user?.id || 'demo-user';

    try {
      const presets = await prisma.rulesetPreset.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      });
      return NextResponse.json(presets, { status: 200 });
    } catch {
      // Offline / unmigrated fallback
      return NextResponse.json(localPresets, { status: 200 });
    }
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, message: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * POST /api/rulesets
 * Creates a new preset (max 20 per user in v1.0).
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const userId = session?.user?.id || 'demo-user';

    const body = await req.json();
    const validated = CreateRulesetSchema.parse(body);

    try {
      // Check preset count quota (max 20)
      const count = await prisma.rulesetPreset.count({
        where: { userId },
      });

      if (count >= 20) {
        return NextResponse.json(
          {
            error: 'QUOTA_EXCEEDED',
            message: 'Maximum limit of 20 saved presets reached for v1.0 Solo workspace.',
          },
          { status: 403 }
        );
      }

      const created = await prisma.rulesetPreset.create({
        data: {
          userId,
          name: validated.name,
          phase: validated.phase,
          stack: validated.stack,
          taskCategory: validated.taskCategory,
          taskDescription: validated.taskDescription,
          targetPath: validated.targetPath || null,
          customNotes: validated.customNotes || null,
        },
      });

      return NextResponse.json(created, { status: 201 });
    } catch {
      // Local fallback creation
      if (localPresets.length >= 20) {
        return NextResponse.json(
          {
            error: 'QUOTA_EXCEEDED',
            message: 'Maximum limit of 20 saved presets reached.',
          },
          { status: 403 }
        );
      }

      const fallbackItem = {
        id: `preset-${Date.now()}`,
        userId,
        name: validated.name,
        phase: validated.phase,
        stack: validated.stack,
        taskCategory: validated.taskCategory,
        taskDescription: validated.taskDescription,
        targetPath: validated.targetPath || null,
        customNotes: validated.customNotes || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      localPresets.unshift(fallbackItem);
      return NextResponse.json(fallbackItem, { status: 201 });
    }
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      {
        error: errorResponse.error,
        message: errorResponse.message,
        issues: errorResponse.issues,
      },
      { status: errorResponse.statusCode }
    );
  }
}
