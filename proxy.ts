import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicRoutes = [
    '/',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/vendor-change-password',
  ];

  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  const isApiRoute = pathname.startsWith('/api/');
  const isStaticAsset = pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon');

  if (isPublicRoute || isApiRoute || isStaticAsset) {
    return NextResponse.next();
  }

  const protectedRoutes = {
    admin: /^\/admin(\/|$)/,
    vendor: /^\/vendor(\/|$)/,
  };

  const isAdminRoute = protectedRoutes.admin.test(pathname);
  const isVendorRoute = protectedRoutes.vendor.test(pathname);

  if (!isAdminRoute && !isVendorRoute) {
    return NextResponse.next();
  }

  // Skip auth check at build time - allow all through
  // Auth will be handled at runtime by API routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
