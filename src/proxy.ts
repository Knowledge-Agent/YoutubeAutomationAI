import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';
import createIntlMiddleware from 'next-intl/middleware';

import { routing } from '@/core/i18n/config';

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isSingleLocaleMode = routing.locales.length === 1;
  const defaultLocale = routing.defaultLocale;

  // Extract locale from pathname for auth route checks
  const localeFromPath = pathname.split('/')[1];
  const isValidLocale = routing.locales.includes(localeFromPath as any);
  const pathWithoutLocale = isValidLocale
    ? pathname.slice(localeFromPath.length + 1) || '/'
    : pathname;

  // Only check authentication for admin routes
  if (
    pathWithoutLocale.startsWith('/admin') ||
    pathWithoutLocale.startsWith('/settings') ||
    pathWithoutLocale.startsWith('/activity')
  ) {
    // Check if session cookie exists
    const sessionCookie = getSessionCookie(request);

    // If no session token found, redirect to sign-in
    if (!sessionCookie) {
      const signInUrl = request.nextUrl.clone();
      signInUrl.pathname = isValidLocale
        ? `/${localeFromPath}/sign-in`
        : '/sign-in';
      signInUrl.search = '';
      // Add the current path (including search params) as callback - use relative path for multi-language support
      const callbackPath = pathWithoutLocale + request.nextUrl.search;
      signInUrl.searchParams.set('callbackUrl', callbackPath);
      return NextResponse.redirect(signInUrl);
    }

    // For admin routes, we need to check RBAC permissions
    // Note: Full permission check happens in the page/API route level
    // This is a lightweight session check to prevent unauthorized access
    // The detailed permission check (admin.access and specific permissions)
    // will be done in the layout or individual pages using requirePermission()
  }

  // For single-locale setup (current project), we use stable internal rewrite
  // to avoid locale redirect loops on landing/blog routes.
  if (isSingleLocaleMode) {
    if (isValidLocale) {
      return NextResponse.next();
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname =
      pathWithoutLocale === '/'
        ? `/${defaultLocale}`
        : `/${defaultLocale}${pathWithoutLocale}`;

    return NextResponse.rewrite(rewriteUrl);
  }

  // Multi-locale setup falls back to next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};
