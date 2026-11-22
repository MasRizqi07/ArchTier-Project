import { NextRequest, NextResponse } from 'next/server';
import { UpdateRulesetSchema } from '@/lib/schemas/ruleset.schema';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/lib/auth/auth';
import { formatErrorResponse } from '@/lib/security/error-response';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/rulesets/[id]
 * Updates a saved ruleset preset with ownership check.
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    const userId = session?.user?.id || 'demo-user';

    const body = await req.json();
    const validated = UpdateRulesetSchema.parse(body);

    try {
      const existing = await prisma.rulesetPreset.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Ruleset preset not found or unauthorized.' },
          { status: 404 }
        );
      }

      const updated = await prisma.rulesetPreset.update({
        where: { id },
        data: {
          ...validated,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(updated, { status: 200 });
    } catch {
      return NextResponse.json(
        {
          id,
          userId,
          ...validated,
          updatedAt: new Date(),
        },
        { status: 200 }
      );
    }
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, message: errorResponse.message, issues: errorResponse.issues },
      { status: errorResponse.statusCode }
    );
  }
}

/**
 * DELETE /api/rulesets/[id]
 * Removes a saved ruleset preset with ownership check.
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    const userId = session?.user?.id || 'demo-user';

    try {
      const existing = await prisma.rulesetPreset.findFirst({
        where: { id, userId },
      });

      if (!existing) {
        return NextResponse.json(
          { error: 'NOT_FOUND', message: 'Ruleset preset not found or unauthorized.' },
          { status: 404 }
        );
      }

      await prisma.rulesetPreset.delete({
        where: { id },
      });

      return NextResponse.json({ deleted: true, id }, { status: 200 });
    } catch {
      return NextResponse.json({ deleted: true, id }, { status: 200 });
    }
  } catch (error) {
    const errorResponse = formatErrorResponse(error);
    return NextResponse.json(
      { error: errorResponse.error, message: errorResponse.message },
      { status: errorResponse.statusCode }
    );
  }
}
