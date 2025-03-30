import { useRouter } from 'next/navigation';

// Types for the authentication data
export interface User {
  email: string;
  role: string;
  id?: string;
  name?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// Login with email and password
export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Authentication failed' };
    }
    
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

// Logout
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

// Get session data
export async function getSession(): Promise<AuthState> {
  try {
    const response = await fetch('/api/auth/session');
    const data = await response.json();
    
    return {
      isAuthenticated: data.isAuthenticated,
      user: data.user,
      loading: false,
    };
  } catch (error) {
    console.error('Get session error:', error);
    return {
      isAuthenticated: false,
      user: null,
      loading: false,
    };
  }
}

// Initiate Google sign-in
export async function signInWithGoogle(): Promise<void> {
  // For a real implementation, redirect to Google OAuth
  window.location.href = '/api/auth/google';
}

// Hook to check if user is authenticated
export function useRequireAuth(redirectTo = '/auth/signin') {
  const router = useRouter();
  
  const checkAuth = async () => {
    const { isAuthenticated } = await getSession();
    
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  };
  
  // Run on mount (client-side only)
  if (typeof window !== 'undefined') {
    checkAuth();
  }
}

// Check if user has specific role
export function hasRole(user: User | null, role: string): boolean {
  return Boolean(user && user.role === role);
}

// Middleware to check if user is admin
export function requireAdmin() {
  return async () => {
    const { isAuthenticated, user } = await getSession();
    
    if (!isAuthenticated || !hasRole(user, 'admin')) {
      return { redirect: { destination: '/auth/signin', permanent: false } };
    }
    
    return { props: {} };
  };
} 