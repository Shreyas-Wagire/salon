import { NextRequest, NextResponse } from 'next/server';

// Handle Google OAuth callback
export async function GET(req: NextRequest) {
  // In a production app, we'd process the OAuth callback here
  // But for our demo with dummy credentials, we'll simulate success
  
  const response = NextResponse.redirect(new URL('/', req.url));
  
  // Set session cookie for the demo client user
  response.cookies.set({
    name: 'salon_session',
    value: JSON.stringify({
      id: 'google-123',
      email: 'client@example.com',
      role: 'client',
      authenticated: true,
    }),
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
  });
  
  return response;
} 