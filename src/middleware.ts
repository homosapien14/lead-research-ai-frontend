import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth_token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

    const { pathname } = request.nextUrl;
    const isAuthPage = pathname.startsWith('/auth');
    const isApiRequest = pathname.startsWith('/api');
    const isPublicPath = isAuthPage || isApiRequest;

    // If trying to access auth pages while logged in
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If trying to access protected pages without being logged in
    if (!token && !isPublicPath) {
        const from = encodeURIComponent(pathname);
        return NextResponse.redirect(
            new URL(`/auth/login?from=${from}`, request.url)
        );
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all paths except:
         * 1. /api (API routes)
         * 2. /_next (Next.js internals)
         * 3. /_static (static files)
         * 4. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!api|_next|_static|favicon.ico|sitemap.xml).*)',
    ],
} 