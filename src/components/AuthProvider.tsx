"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, getSession, logout } from '@/lib/auth';

// Create auth context
const AuthContext = createContext<{
  authState: AuthState;
  login: (user: User) => void;
  logout: () => Promise<void>;
}>({
  authState: { isAuthenticated: false, user: null, loading: true },
  login: () => {},
  logout: async () => {},
});

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const session = await getSession();
        setAuthState({
          isAuthenticated: session.isAuthenticated,
          user: session.user,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to load session:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      }
    };

    loadSession();
  }, []);

  // Login handler
  const handleLogin = (user: User) => {
    setAuthState({
      isAuthenticated: true,
      user,
      loading: false,
    });
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
} 