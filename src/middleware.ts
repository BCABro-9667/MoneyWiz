
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const authPaths = ['/login', '/register'];
  const isPublicPath = pathname === '/' || authPaths.includes(pathname);

  // If trying to access a protected route without a token, redirect to home
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If authenticated and trying to access login/register, redirect to dashboard
  if (token && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If authenticated and on home page, redirect to dashboard
  if(token && pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/expense/:path*',
    '/profile',
  ],
};
