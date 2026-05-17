/**
 * PinkSync Module - Real-time Sync Logic
 * 
 * Handles real-time bidirectional data synchronization using Supabase Realtime
 */

import { createSupabaseClient } from "../../lib/supabase.ts";
import type { ChannelSubscription, PinkSyncEvent, RealtimeMessage } from "./types.ts";

const LATENCY_THRESHOLD = parseInt(Deno.env.get("PINKSYNC_LATENCY_THRESHOLD") || "100");

/**
 * Subscribe to a real-time channel
 */
export async function subscribeToChannel(
  channelName: string,
  callback: (payload: RealtimeMessage) => void
): Promise<ChannelSubscription> {
  const supabase = createSupabaseClient();
  
  const channel = supabase.channel(channelName);
  
  channel.on("broadcast", { event: "*" }, (payload) => {
    const message: RealtimeMessage = {
      type: payload.event || "unknown",
      channel: channelName,
      payload: payload.payload as Record<string, unknown>,
      timestamp: new Date().toISOString(),
      sender: payload.payload?.sender as string,
    };
    callback(message);
  });

  await channel.subscribe();

  return {
    channel: channelName,
    callback,
    unsubscribe: async () => {
      await supabase.removeChannel(channel);
    },
  };
}

/**
 * Publish event to a channel
 */
export async function publishEvent(
  channelName: string,
  event: Omit<PinkSyncEvent, "id" | "timestamp">
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseClient();
    const channel = supabase.channel(channelName);

    const fullEvent: PinkSyncEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    await channel.subscribe();

    const startTime = performance.now();
    await channel.send({
      type: "broadcast",
      event: event.type,
      payload: fullEvent,
    });
    const latency = performance.now() - startTime;

    if (latency > LATENCY_THRESHOLD) {
      console.warn(`High latency detected: ${latency}ms on channel ${channelName}`);
    }

    await supabase.removeChannel(channel);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Subscribe to database table changes
 */
export async function subscribeToTable(
  table: string,
  callback: (payload: any) => void
): Promise<ChannelSubscription> {
  const supabase = createSupabaseClient();
  const channel = supabase.channel(`table-${table}`);

  channel
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      callback
    )
    .subscribe();

  return {
    channel: `table-${table}`,
    callback,
    unsubscribe: async () => {
      await supabase.removeChannel(channel);
    },
  };
}

/**
 * Broadcast presence (user online status)
 */
export async function broadcastPresence(
  channelName: string,
  userId: string,
  status: "online" | "away" | "offline"
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createSupabaseClient();
    const channel = supabase.channel(channelName);

    await channel.subscribe();

    await channel.track({
      userId,
      status,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all presence users in a channel
 */
export async function getPresence(
  channelName: string
): Promise<{ users: any[]; error?: string }> {
  try {
    const supabase = createSupabaseClient();
    const channel = supabase.channel(channelName);

    await channel.subscribe();

    const presenceState = channel.presenceState();
    const users = Object.values(presenceState).flat();

    await supabase.removeChannel(channel);

    return { users };
  } catch (error) {
    return {
      users: [],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
