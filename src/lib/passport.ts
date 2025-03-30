import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';

// Mock database of users for demo purposes
const users = [
  { id: '1', email: 'admin@salon.com', password: 'admin123', role: 'admin' },
  { id: '2', email: 'client@example.com', password: 'dummy-password', role: 'client' },
];

// Custom type for user object to store in session
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: string;
      [key: string]: any;
    }
  }
}

// Serialize user to store in session
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser((id: string, done) => {
  const user = users.find(user => user.id === id);
  if (!user) {
    return done(new Error('User not found'));
  }
  done(null, {
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

// Configure local strategy for username/password auth
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  (email, password, done) => {
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password' });
    }
    
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect email or password' });
    }
    
    return done(null, {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }
));

// Configure Google strategy for OAuth
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/api/auth/google/callback',
  },
  (accessToken, refreshToken, profile, done) => {
    // For demo purposes, if we're using a dummy Google client ID, create a demo user
    if (process.env.GOOGLE_CLIENT_ID === 'dummy-google-client-id') {
      return done(null, {
        id: 'google-123',
        email: profile.emails?.[0]?.value || 'client@example.com',
        name: profile.displayName || 'Demo Client',
        role: 'client',
      });
    }
    
    // In a real app, you would find or create a user in your database
    // For now, we'll create a dummy user for demo purposes
    const user = {
      id: `google-${profile.id}`,
      email: profile.emails?.[0]?.value || 'client@example.com',
      name: profile.displayName || 'Google User',
      role: 'client',
    };
    
    return done(null, user);
  }
));

export default passport; 