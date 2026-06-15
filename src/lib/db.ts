/**
 * src/lib/db.ts
 * Neon database client — supports loading DATABASE_URL from .env during dev
 * and fetching /couple/config.json at runtime in production.
 */

import { neon } from '@neondatabase/serverless';

let sqlClient: any = null;
let initPromise: Promise<void> | null = null;

async function getSqlClient() {
  if (sqlClient) return sqlClient;

  if (!initPromise) {
    initPromise = (async () => {
      // In Vite dev mode, we can use VITE_DATABASE_URL or DATABASE_URL
      let databaseUrl = import.meta.env.VITE_DATABASE_URL || import.meta.env.DATABASE_URL;

      if (!databaseUrl) {
        try {
          // In production, fetch config.json served under the same subpath /couple/
          const res = await fetch('/couple/config.json');
          if (res.ok) {
            const data = await res.json();
            databaseUrl = data.DATABASE_URL;
          }
        } catch (err) {
          console.warn('[db] Could not fetch runtime config.json:', err);
        }
      }

      if (!databaseUrl) {
        throw new Error(
          'DATABASE_URL is not set. Please define VITE_DATABASE_URL in .env ' +
          'or provide /couple/config.json at runtime.'
        );
      }

      sqlClient = neon(databaseUrl);
    })();
  }

  await initPromise;
  return sqlClient;
}

/**
 * Tagged-template SQL client wrapper that initializes lazily.
 */
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const client = await getSqlClient();
  return client(strings, ...values);
};

export default sql;
