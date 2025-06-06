import { jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { isPublicRoute } from './constants/routes.constants';

const intlMiddleware = createMiddleware({
  locales: ['en', 'np'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = await getLocale(request);
  console.log(`Locale: ${locale}, Pathname: ${pathname}`);

  const token = await getToken({ req: request });

  console.log('isPublicRoute', isPublicRoute(pathname));
  // Skip auth for public routes
  if (isPublicRoute(pathname) || pathname === '/' || !pathname) {
    if (token) {
      if (pathname.includes('/login')) {
        console.log('User already authenticated, redirecting to home');
        return NextResponse.redirect(
          new URL(`/${locale}/${token.accountType}/`, request.url),
        );
      }
    }
    return intlMiddleware(request);
  }

  if (!token) {
    // Handle unauthenticated users
    return NextResponse.redirect(
      new URL(
        `/${locale}/patient/login${pathname.includes('login') ? '' : '?callbackUrl=' + encodeURIComponent(pathname)}`,
        request.url,
      ),
    );
  } else {
    //check if user path is for login routes
    if (
      pathname.includes('/login') ||
      // pathname === locale ||
      pathname === `/${locale}`
    ) {
      console.log('User already authenticated, redirecting to home');
      return NextResponse.redirect(
        new URL(`/${locale}/${token.accountType}/`, request.url),
      );
    }
  }

  const portal = pathname.split('/')[2];
  if (portal !== token.accountType && portal !== 'unauthorized') {
    return NextResponse.rewrite(
      new URL(`/${locale}/unauthorized`, request.url),
    );
  }
  // Apply internationalization
  return intlMiddleware(request);
}

// Utility to extract locale (compatible with next-intl)
async function getLocale(request: NextRequest): Promise<string> {
  const defaultLocale = 'en';
  try {
    const locale = request.nextUrl.pathname.split('/')[1];
    return ['en', 'np'].includes(locale) ? locale : defaultLocale;
  } catch {
    return defaultLocale;
  }
}

// Replace this with your actual secret (must be a Uint8Array)
const JWT_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET);

async function getToken({ req }: { req: NextRequest }) {
  const tokenCookie = req.cookies.get('accessToken');
  console.log(`Token Cookie: ${tokenCookie ? tokenCookie : 'not found'}`);
  if (!tokenCookie) return null;

  const tokenStr =
    typeof tokenCookie === 'string' ? tokenCookie : tokenCookie.value;

  try {
    // Verify and decode the JWT
    const { payload } = await jwtVerify(tokenStr, JWT_SECRET);

    return payload;
  } catch (err) {
    console.log('JWT verification failed:', err);
    return null;
  }
}
