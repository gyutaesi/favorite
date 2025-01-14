import { neon } from "@neondatabase/serverless";

export async function getData() {
  const sql = neon(process.env.DATABASE_URL || "");
  const response = await sql`SELECT version()`;
  return response[0].version;
}
