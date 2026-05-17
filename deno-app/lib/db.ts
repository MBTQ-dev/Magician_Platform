// lib/db.ts — helper to connect to Postgres using npm:postgres
import postgres from "postgres";

export function connectDb() {
  const SUPABASE_DB_URL = Deno.env.get("SUPABASE_DB_URL");
  if (!SUPABASE_DB_URL) throw new Error("SUPABASE_DB_URL not set");

  // Postgres client using npm:postgres (postgres@3.1.0)
  // This package uses tagged template literals for queries
  const sql = postgres(SUPABASE_DB_URL);

  return sql;
}
