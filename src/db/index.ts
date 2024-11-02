"use server";
import { neon } from "@neondatabase/serverless";

export async function db({ query }: { query: string }) {
  const sql = neon(process.env.DATABASE_URL!);

  const data = await sql`${query}`;
  return data;
}
