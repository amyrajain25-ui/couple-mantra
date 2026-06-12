/**
 * src/lib/userInit.ts
 *
 * Called once after a successful auth handshake.
 * If the user_id does not exist in the `users` table, inserts a new record.
 * Uses the Neon HTTP SQL API — DATABASE_URL is read from the environment.
 *
 * This is the "Profile Creation / User Initialization" upsert required by the spec.
 */

const NEON_ENDPOINT =
  'https://ep-soft-resonance-advbdvvm-pooler.c-2.us-east-1.aws.neon.tech/sql';

/** Run a single SQL statement against Neon via the HTTP API. */
async function neonQuery(sql: string, params: (string | number | null)[] = []) {
  const connString = import.meta.env.DATABASE_URL;
  if (!connString) {
    console.warn('[userInit] DATABASE_URL not set — skipping DB upsert.');
    return;
  }

  const resp = await fetch(NEON_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Neon-Connection-String': connString,
    },
    body: JSON.stringify({ query: sql, params }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Neon query failed: ${err}`);
  }

  return resp.json();
}

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
}

/**
 * Upserts the user into the `users` table.
 * If the row already exists (returning tab), nothing changes.
 * If it's a brand-new user, a minimal record is created.
 */
export async function initializeUser(
  userId: string,
  info?: { email?: string; displayName?: string; avatarUrl?: string }
): Promise<void> {
  try {
    await neonQuery(
      `INSERT INTO users (id, email, display_name, avatar_url, updated_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (id) DO UPDATE SET
         email        = COALESCE(EXCLUDED.email, users.email),
         display_name = COALESCE(EXCLUDED.display_name, users.display_name),
         avatar_url   = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
         updated_at   = NOW()`,
      [
        Number(userId),
        info?.email ?? null,
        info?.displayName ?? null,
        info?.avatarUrl ?? null,
      ]
    );
    console.info('[userInit] User record ensured for id:', userId);
  } catch (err) {
    // Non-fatal — the app can still run even if DB write fails
    console.error('[userInit] Could not upsert user record:', err);
  }
}
