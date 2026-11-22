import { NextRequest, NextResponse } from 'next/server';
import { AnalysisRequestSchema } from '@/lib/schemas/guardrail.schema';
import { evaluateGuardrails } from '@/lib/engine/evaluate-guardrails';
import { formatErrorResponse } from '@/lib/security/error-response';
import { checkRateLimit } from '@/lib/security/rate-limit';

/**
 * POST /api/analyze
 * Public, rate-limited, Zod-validated guardrail evaluation endpoint.
 * Evaluates architecture rules and returns a deterministically computed GuardrailReport.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateLimit = checkRateLimit(ip, 60, 60000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait a minute before analyzing again.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rateLimit.resetMs / 1000)),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Parse & Validate JSON payload via Zod
    const body = await req.json();
    const validatedInput = AnalysisRequestSchema.parse(body);

    // 3. Pure deterministic engine execution
    const report = evaluateGuardrails(validatedInput);

    // 4. Return successful response with rate-limit headers
    return NextResponse.json(report, {
      status: 200,
      headers: {
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });
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
