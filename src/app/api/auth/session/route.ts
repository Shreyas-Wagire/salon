import { NextRequest, NextResponse } from 'next/server';

// Get session data
export async function GET(req: NextRequest) {
  try {
    // Check for salon_session cookie from the request
    const sessionCookie = req.cookies.get('salon_session');
    
    // If no session cookie, user is not authenticated
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false, user: null });
    }
    
    try {
      // Parse the session data from the cookie
      const sessionData = JSON.parse(sessionCookie.value);
      
      if (!sessionData.authenticated) {
        return NextResponse.json({ isAuthenticated: false, user: null });
      }
      
      return NextResponse.json({
        isAuthenticated: true,
        user: {
          id: sessionData.id,
          email: sessionData.email,
          role: sessionData.role,
          name: sessionData.name || sessionData.email
        }
      });
    } catch (error) {
      console.error('Session parsing error:', error);
      return NextResponse.json({ isAuthenticated: false, user: null });
    }
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ isAuthenticated: false, user: null });
  }
} 