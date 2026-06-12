/**
 * src/app/components/AuthGuard.tsx
 *
 * Sits at the very top of the component tree.
 * Blocks ALL app UI until the identity handshake is complete.
 *
 * Flow:
 *   1. Check sessionStorage for an existing user_id (returning tab).
 *   2. [DEV ONLY] If VITE_MOCK_USER_ID is set, bypass the handshake entirely.
 *   3. Check the URL for ?token=<UUID>.
 *   4. POST the token to the MantraCare identity API.
 *   5. On success → upsert user in DB, store user_id, clean the URL, render children.
 *   6. On failure → hard redirect to /token.
 */

import { useEffect, useState, ReactNode } from 'react';
import { Auth } from '../../lib/auth';
import { initializeUser } from '../../lib/userInit';
import { AuthProvider } from './contexts/AuthContext';

// ─── Loading messages (friendly, no technical jargon) ───────────────────────
const LOADING_MESSAGES = [
  'Getting your space ready…',
  'Setting the mood…',
  'Loading your journey…',
  'Preparing your relationship dashboard…',
  'Bringing your world together…',
];

function SplashScreen() {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0533 0%, #3b0764 50%, #6b21a8 100%)',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 28,
          boxShadow: '0 0 40px rgba(244,63,94,0.5)',
          animation: 'hb-pulse 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: 36 }}>💑</span>
      </div>

      <h1
        style={{
          color: '#fff',
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8,
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        Together
      </h1>

      <p
        key={msgIdx}
        style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: 14,
          fontFamily: 'system-ui, sans-serif',
          animation: 'hb-fadeIn 0.4s ease',
        }}
      >
        {LOADING_MESSAGES[msgIdx]}
      </p>

      <div style={{ display: 'flex', gap: 8, marginTop: 40 }}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.4)',
              animation: `hb-bounce 1.4s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes hb-pulse {
          0%, 100% { transform: scale(1);    box-shadow: 0 0 40px rgba(244,63,94,0.5); }
          50%       { transform: scale(1.08); box-shadow: 0 0 60px rgba(244,63,94,0.7); }
        }
        @keyframes hb-fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hb-bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Constants ───────────────────────────────────────────────────────────────
const HANDSHAKE_URL = 'https://api.mantracare.com/user/user-info';

// ─── AuthGuard ───────────────────────────────────────────────────────────────
interface AuthGuardProps {
  children: ReactNode;
}

type AuthState = 'pending' | 'ready';

export default function AuthGuard({ children }: AuthGuardProps) {
  const [authState, setAuthState] = useState<AuthState>('pending');

  useEffect(() => {
    async function runHandshake() {
      // ── Step 0: Already have a valid session (returning tab / page nav) ──
      if (Auth.isAuthenticated()) {
        setAuthState('ready');
        return;
      }

      // ── Step 1: DEV ONLY — Mock user bypass ─────────────────────────────
      // ⚠️  REMOVE VITE_MOCK_USER_ID from .env BEFORE DEPLOYING TO PRODUCTION ⚠️
      const mockUserId = import.meta.env.VITE_MOCK_USER_ID;
      if (mockUserId) {
        console.info('[AuthGuard] 🧪 DEV MODE — Mock user:', mockUserId);
        Auth.setUserId(String(mockUserId));
        await initializeUser(String(mockUserId), { displayName: 'Dev User' });
        setAuthState('ready');
        return;
      }
      // ── END DEV BLOCK (remove for production) ────────────────────────────

      // ── Step 2: Extract token from URL ──────────────────────────────────
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        window.location.href = '/token';
        return;
      }

      // ── Step 3: POST token → MantraCare identity API ─────────────────────
      try {
        const response = await fetch(HANDSHAKE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        const userId = String(data.user_id ?? data.id ?? data.userId ?? '');

        if (!userId || userId === 'undefined') {
          throw new Error('No user_id returned from handshake');
        }

        // ── Step 4: Upsert user record in Neon DB ────────────────────────
        await initializeUser(userId, {
          email:       data.email,
          displayName: data.name ?? data.display_name,
          avatarUrl:   data.avatar_url ?? data.photo,
        });

        // ── Step 5: Persist session & clean URL ──────────────────────────
        Auth.setUserId(userId);
        params.delete('token');
        const cleanSearch = params.toString();
        window.history.replaceState(
          {},
          '',
          window.location.pathname + (cleanSearch ? `?${cleanSearch}` : '')
        );

        setAuthState('ready');
      } catch (err) {
        console.error('[AuthGuard] Handshake failed:', err);
        Auth.clear();
        window.location.href = '/token';
      }
    }

    runHandshake();
  }, []);

  if (authState === 'pending') return <SplashScreen />;

  return <AuthProvider>{children}</AuthProvider>;
}
