import { NextRequest, NextResponse } from 'next/server';
import passport from '@/lib/passport';
import { cookies } from 'next/headers';

// Handle login requests
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }
  
  // In a real app, you would authenticate with your backend/database
  // For demo purposes, use a hardcoded admin user
  if (email === 'admin@salon.com' && password === 'admin123') {
    // Create a response with session data
    const response = NextResponse.json({
      success: true,
      user: {
        email: 'admin@salon.com',
        role: 'admin'
      }
    });
    
    // Set the session cookie
    response.cookies.set({
      name: 'salon_session',
      value: JSON.stringify({
        id: '1',
        email: 'admin@salon.com',
        role: 'admin',
        authenticated: true
      }),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    return response;
  }
  
  // For demo client
  if (email === 'client@example.com' && password === 'dummy-password') {
    // Create a response with session data
    const response = NextResponse.json({
      success: true,
      user: {
        email: 'client@example.com',
        role: 'client'
      }
    });
    
    // Set the session cookie
    response.cookies.set({
      name: 'salon_session',
      value: JSON.stringify({
        id: '2',
        email: 'client@example.com',
        role: 'client',
        authenticated: true
      }),
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    return response;
  }
  
  return NextResponse.json(
    { error: 'Invalid email or password' },
    { status: 401 }
  );
} 