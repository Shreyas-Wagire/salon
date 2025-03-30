import { NextRequest, NextResponse } from 'next/server';

// Initiate Google OAuth
export async function GET(req: NextRequest) {
  // In a real app, we'd redirect to Google's OAuth URL
  // For this demo, we'll redirect directly to the callback
  return NextResponse.redirect(new URL('/api/auth/google/callback', req.url));
} 