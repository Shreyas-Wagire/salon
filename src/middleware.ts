import { NextRequest, NextResponse } from 'next/server';

// Paths that require authentication
const protectedPaths = [
  '/admin',
  '/client',
];

// Paths that require admin role
const adminPaths = [
  '/admin',
];

// Check if the path matches any of the patterns
const matchesPath = (path: string, patterns: string[]): boolean => {
  return patterns.some(pattern => 
    path.startsWith(pattern) || 
    path === pattern
  );
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip API routes - they handle their own auth
  if (path.startsWith('/api')) {
    return NextResponse.next();
  }
  
  // Check if this is a protected path
  if (matchesPath(path, protectedPaths)) {
    // Get session cookie
    const sessionCookie = request.cookies.get('salon_session');
    
    // If no session, redirect to login
    if (!sessionCookie) {
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
    
    try {
      // Parse session data
      const sessionData = JSON.parse(sessionCookie.value);
      
      // Check authentication
      if (!sessionData.authenticated) {
        const url = new URL('/auth/signin', request.url);
        url.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(url);
      }
      
      // Check admin paths
      if (matchesPath(path, adminPaths) && sessionData.role !== 'admin') {
        // User is not admin, redirect to unauthorized page
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
      
      // User is authenticated and authorized
      return NextResponse.next();
    } catch (error) {
      // Error parsing session cookie, redirect to login
      const url = new URL('/auth/signin', request.url);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    }
  }
  
  // Not a protected path, continue
  return NextResponse.next();
}

// Configure the paths that trigger this middleware
export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}; 