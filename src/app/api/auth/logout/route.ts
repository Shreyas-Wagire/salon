import { NextRequest, NextResponse } from 'next/server';

// Handle logout
export async function POST(req: NextRequest) {
  const response = NextResponse.json({ success: true });
  
  // Clear the session cookie
  response.cookies.set({
    name: 'salon_session',
    value: '',
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Delete cookie
  });
  
  return response;
} 