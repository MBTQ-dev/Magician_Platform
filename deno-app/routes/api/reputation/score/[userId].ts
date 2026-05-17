/**
 * API Route: /api/reputation/score/[userId]
 * 
 * Get trust score for a user
 */

import { HandlerContext } from "fresh/server.ts";
import { calculateTrustScore } from "../../../../modules/fibonrose/mod.ts";

export const handler = async (
  _req: Request,
  ctx: HandlerContext
): Promise<Response> => {
  try {
    const userId = ctx.params.userId;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const score = await calculateTrustScore(userId);

    return new Response(JSON.stringify(score), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
