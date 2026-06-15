/**
 * src/lib/userInit.ts
 *
 * Called once after a successful auth handshake.
 * If the user_id does not exist in the `users` table, inserts a new record.
 * Uses the Neon HTTP SQL API client from ./db.
 *
 * This is the "Profile Creation / User Initialization" upsert.
 */

import { sql } from './db';

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  avatar_url?: string;
  created_at?: string;
}

/**
 * Upserts the user into the `users` table.
 * If the row already exists, nothing changes.
 * If it's a brand-new user, a minimal record is created.
 */
export async function initializeUser(
  userId: string,
  info?: { email?: string; displayName?: string; avatarUrl?: string }
): Promise<void> {
  try {
    await sql`
      INSERT INTO users (id, email, display_name, avatar_url, updated_at)
      VALUES (${Number(userId)}, ${info?.email ?? null}, ${info?.displayName ?? null}, ${info?.avatarUrl ?? null}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        email        = COALESCE(EXCLUDED.email, users.email),
        display_name = COALESCE(EXCLUDED.display_name, users.display_name),
        avatar_url   = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        updated_at   = NOW()
    `;
    console.info('[userInit] User record ensured for id:', userId);
  } catch (err) {
    // Non-fatal — the app can still run even if DB write fails
    console.error('[userInit] Could not upsert user record:', err);
  }
}
