import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

// Matcher config (skip static assets, _next, API, etc.)
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  // Ensure path includes locale
  if (!pathname.startsWith(`/${locale}`)) {
    const newPathname = `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPathname, request.url));
  }
  console.log('cookie', request.cookies.get('portal')?.value);
  const portal = request.cookies.get('portal')?.value || 'admin';
  console.log(`Portal: ${portal}, Locale: ${locale}`);
  if (pathname === `/${locale}`) {
    const newPathname = `/${locale}/${portal}/dashboard`;
    return NextResponse.redirect(new URL(newPathname, request.url));
  }

  // Just forward request to intlMiddleware (does i18n routing, etc.)
  return intlMiddleware(request);
}

// Get locale from path or cookie
function getLocale(request: NextRequest): string {
  const pathnameLocale = request.nextUrl.pathname.split('/')[1];
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  return ['en', 'np'].includes(pathnameLocale)
    ? pathnameLocale
    : cookieLocale || 'np';
}
