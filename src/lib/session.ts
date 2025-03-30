import { SessionOptions } from 'express-session';
import cookieParser from 'cookie-parser';

// Session configuration
export const sessionConfig: SessionOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'default-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

// Export cookie parser middleware
export const cookieParserMiddleware = cookieParser();

// Define the session type for TypeScript
declare module 'express-session' {
  interface SessionData {
    passport: {
      user: string;
    };
  }
} 