/**
 * API Route: /api/reputation/contribute
 * 
 * Record a contribution for a user
 */

import { HandlerContext } from "fresh/server.ts";
import { recordContribution } from "../../../modules/fibonrose/mod.ts";
import type { ContributionType } from "../../../modules/fibonrose/types.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext
): Promise<Response> => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { userId, type, value, metadata } = body;

    if (!userId || !type) {
      return new Response(
        JSON.stringify({ error: "userId and type are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await recordContribution({
      userId,
      type: type as ContributionType,
      value,
      metadata,
    });

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        contribution: result.contribution,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
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
