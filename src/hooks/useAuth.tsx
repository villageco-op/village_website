'use client';

import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

import type { User } from '@/lib/api/generated/models/user';
import { logger } from '@/lib/logger';

interface Session {
  user?: User;
  expires: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | undefined;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  logout: () => Promise<void>;
  refetch: () => Promise<Session | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Global auth provider for fetching the auth session and signing out.
 * @param props - Component props
 * @param props.children - Passthrough child components
 * @returns An auth context provider wrapping the children
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const queryClient = useQueryClient();

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        setSession(null);
        setStatus('unauthenticated');
        return null;
      }

      const data = await res.json();
      if (data && Object.keys(data).length > 0) {
        setSession(data);
        setStatus('authenticated');
        return data;
      } else {
        setSession(null);
        setStatus('unauthenticated');
        return null;
      }
    } catch (error) {
      logger.error('Failed to fetch auth session', error);
      setSession(null);
      setStatus('unauthenticated');
      return null;
    }
  }, []);

  useEffect(() => {
    void fetchSession();
  }, [fetchSession]);

  const refetch = useCallback(async () => {
    return await fetchSession();
  }, [fetchSession]);

  const logout = async () => {
    try {
      queryClient.clear();
      const csrfRes = await fetch('/api/auth/csrf');
      if (!csrfRes.ok) throw new Error('Failed to fetch CSRF token');
      const { csrfToken } = await csrfRes.json();

      await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ csrfToken }),
      });

      setSession(null);
      setStatus('unauthenticated');
      window.location.href = '/';
    } catch (error) {
      logger.error('Failed to logout', error);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user, status, logout, refetch }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook for checking user auth status and retrieving the current user.
 * @returns An object containing the session, user, and status.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
