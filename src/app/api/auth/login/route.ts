import { NextRequest, NextResponse } from 'next/server';

const ADMIN_CREDENTIALS = {
  email: 'admin@salon.com',
  password: 'admin123'
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }
  
  // Check admin credentials
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    const response = NextResponse.json({
      success: true,
      user: {
        id: 'admin-1',
        email: ADMIN_CREDENTIALS.email,
        role: 'admin'
      }
    });
    
    // Set session cookie
    response.cookies.set({
      name: 'salon_session',
      value: JSON.stringify({
        id: 'admin-1',
        email: ADMIN_CREDENTIALS.email,
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
  
  return NextResponse.json(
    { error: 'Invalid email or password' },
    { status: 401 }
  );
}