/**
 * src/lib/auth.ts
 * Authentication utilities.
 * Reads/writes the user_id from sessionStorage (tab-isolated).
 * No secrets are hardcoded here.
 */

const SESSION_KEY = 'mc_user_id';

export const Auth = {
  /** Returns the validated user_id from sessionStorage, or null */
  getUserId(): string | null {
    return sessionStorage.getItem(SESSION_KEY);
  },

  /** Persists user_id into sessionStorage */
  setUserId(id: string): void {
    sessionStorage.setItem(SESSION_KEY, id);
  },

  /** Clears the session (logout) */
  clear(): void {
    sessionStorage.removeItem(SESSION_KEY);
  },

  /** True if there is an active session */
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem(SESSION_KEY);
  },
};
