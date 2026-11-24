import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * ArchTier Security & Protected Route Middleware
 * 
 * Enforces session authentication for /dashboard while providing
 * seamless fallback for demo/guest mode and appending defense-in-depth
 * security headers to all downstream responses.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Clone headers for response modification
  const response = NextResponse.next();

  // Inject security headers on every response
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Route protection for /dashboard
  if (pathname.startsWith('/dashboard')) {
    // Check Better Auth session cookies
    const sessionToken =
      request.cookies.get('better-auth.session_token')?.value ||
      request.cookies.get('__Secure-better-auth.session_token')?.value ||
      request.cookies.get('archtier-demo-session')?.value;

    const isDemoParam = searchParams.get('demo') === 'true';

    // Allow access if session cookie or demo flag is present
    if (sessionToken || isDemoParam) {
      if (isDemoParam && !request.cookies.get('archtier-demo-session')) {
        // Set temporary demo session cookie
        response.cookies.set('archtier-demo-session', 'active', {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24, // 24 hours
        });
      }
      return response;
    }

    // Redirect guest to login with callback URL
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
