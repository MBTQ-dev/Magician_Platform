/**
 * PinkSync Module - Main Exports
 */

// Export real-time functions
export {
  broadcastPresence,
  getPresence,
  publishEvent,
  subscribeToChannel,
  subscribeToTable,
} from "./realtime.ts";

// Export accessibility functions
export {
  getUserAccessibilityPreferences,
  optimizeAccessibility,
  updateUserAccessibilityPreferences,
  validateAccessibility,
} from "./accessibility.ts";

// Export types
export type {
  AccessibilityOptimization,
  AccessibilityPreferences,
  ChannelSubscription,
  LatencyMetrics,
  OptimizedContent,
  PinkSyncEvent,
  RealtimeMessage,
} from "./types.ts";
