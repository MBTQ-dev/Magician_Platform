import { HandlerContext } from "fresh/server.ts";
import { getTrustScore } from "../../lib/fibonacci.ts";
import { connectDb } from "../../lib/db.ts";

export async function POST(req: Request, _ctx: HandlerContext) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) return new Response(JSON.stringify({ error: "userId required" }), { status: 400 });

    // Example: read from Postgres and compute something
    const sql = connectDb();
    try {
      // Example query — adjust to your schema
      // Using tagged template literal syntax from postgres package
      const result = await sql`SELECT COUNT(*)::int as count FROM public.messages WHERE user_id = ${userId}`;
      const count = result[0]?.count ?? 0;
      const score = getTrustScore(count);

      return new Response(JSON.stringify({ userId, count, score }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } finally {
      await sql.end();
    }
  } catch (err) {
    console.error("trust API error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
