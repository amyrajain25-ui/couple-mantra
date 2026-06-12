/**
 * src/app/components/contexts/AuthContext.tsx
 *
 * Provides the authenticated user_id throughout the entire app.
 * Must only be rendered INSIDE <AuthGuard> so user_id is always present.
 */
import { createContext, useContext, ReactNode } from 'react';
import { Auth } from '../../../lib/auth';

interface AuthContextType {
  userId: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const userId = Auth.getUserId()!; // guaranteed non-null — AuthGuard runs first
  return (
    <AuthContext.Provider value={{ userId }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Returns the validated user_id. Throws if called outside AuthGuard. */
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
