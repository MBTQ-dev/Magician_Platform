/**
 * API Route: /api/realtime/publish
 * 
 * Publish an event to a real-time channel
 */

import { HandlerContext } from "fresh/server.ts";
import { publishEvent } from "../../../modules/pinksync/mod.ts";

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
    const { channel, type, source, data, priority } = body;

    if (!channel || !type || !source) {
      return new Response(
        JSON.stringify({ error: "channel, type, and source are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await publishEvent(channel, {
      type,
      source,
      data: data || {},
      priority: priority || "medium",
    });

    if (!result.success) {
      return new Response(JSON.stringify({ error: result.error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
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
