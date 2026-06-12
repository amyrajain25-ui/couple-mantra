/**
 * src/lib/db.ts
 * Neon database client — reads DATABASE_URL from environment variables.
 * Import this wherever you need to make a database query.
 *
 * NOTE: DATABASE_URL must be set in your .env file.
 * It is never hardcoded here.
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = import.meta.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL environment variable is not set. ' +
    'Add it to your .env file: DATABASE_URL=postgresql://...'
  );
}

/**
 * Tagged-template SQL client.
 *
 * Usage:
 *   import { sql } from '@/lib/db';
 *   const rows = await sql`SELECT * FROM couples WHERE id = ${coupleId}`;
 */
export const sql = neon(DATABASE_URL);

export default sql;
