import { JWTPayload, jwtVerify } from 'jose';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { isPublicRoute } from './constants/routes.constants';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = await getLocale(request);
  //check if pathname contains locale
  if (!pathname.startsWith(`/${locale}`)) {
    // If not, redirect to the correct locale path
    const newPathname = `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(newPathname, request.url), 301);
  }

  // Mock token for demonstration - replace with actual token retrieval
  // const token = {
  //   id: 'idsadsadasdsa',
  //   name: {
  //     firstName: 'John',
  //     middleName: 'Doe',
  //     lastName: 'Smith',
  //   },
  //   email: 'Sangat202@gmail.com',
  //   role: 'SUPERADMIN',
  //   accountType: 'ADMIN',
  //   phoneNumber: '9806102',
  //   status: true,
  //   permissions: [
  //     {
  //       resource: 'ALL',
  //       action: 'WRITE',
  //     },
  //   ],
  //   healthPostId: 'asdasdsadasdasdasdasdasdasd',
  // };
  const token = await getToken({ req: request });

  console.log('token', token);
  // Handle public routes
  if (isPublicRoute(pathname) || pathname === '/' || !pathname) {
    if (token && isLoginPage(pathname)) {
      return redirectToDashboard(
        locale,
        (token.accountType as string)?.toLocaleLowerCase(),
        request.url,
      );
    }
    return intlMiddleware(request);
  }

  // Handle authentication
  if (!token && !isLoginPage(pathname)) {
    return handleUnauthenticated(locale, pathname, request.url);
  }
  return intlMiddleware(request);
}

// Helper functions
async function getLocale(request: NextRequest): Promise<string> {
  const defaultLocale = 'en';
  const locale = request.nextUrl.pathname.split('/')[1];
  return ['en', 'np'].includes(locale) ? locale : defaultLocale;
}

function redirectToDashboard(locale: string, accountType: string, url: string) {
  return NextResponse.redirect(
    new URL(`/${locale}/${accountType?.toLowerCase()}/`, url),
  );
}

function handleUnauthenticated(locale: string, pathname: string, url: string) {
  const portal = getPortalFromPath(pathname);

  const loginUrl = new URL(`/${locale}/${portal}/login`, url);
  if (!pathname.includes('login')) {
    loginUrl.searchParams.set('callbackUrl', encodeURIComponent(pathname));
  }
  const response = NextResponse.redirect(loginUrl);
  response.cookies.set('accessToken', '', { path: '/', maxAge: 0 });
  return response;
}

function isLoginPage(pathname: string): boolean {
  return pathname.includes('/login');
}

function getPortalFromPath(pathname: string): string | null {
  const parts = pathname.split('/');
  return parts[2] || 'patient';
}

const JWT_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET);

export async function getToken({
  req,
}: {
  req: NextRequest;
}): Promise<JWTPayload | null> {
  const tokenCookie = req.cookies.get('accessToken');
  if (!tokenCookie) return null;

  const tokenStr =
    typeof tokenCookie === 'string' ? tokenCookie : tokenCookie.value;

  try {
    const { payload } = await jwtVerify(tokenStr, JWT_SECRET);
    return payload;
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      'code' in err &&
      err.code === 'ERR_JWT_EXPIRED'
    ) {
      console.warn('Token expired');
    } else {
      console.error('JWT verification failed:', err);
    }
    return null;
  }
}
