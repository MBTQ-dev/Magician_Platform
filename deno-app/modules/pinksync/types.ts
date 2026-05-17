/**
 * PinkSync Module - Type Definitions
 */

export interface RealtimeMessage {
  type: string;
  channel: string;
  payload: Record<string, unknown>;
  timestamp: string;
  sender?: string;
}

export interface ChannelSubscription {
  channel: string;
  callback: (payload: RealtimeMessage) => void;
  unsubscribe: () => Promise<void>;
}

export interface AccessibilityPreferences {
  preferASL: boolean;
  captionsEnabled: boolean;
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderEnabled: boolean;
}

export interface AccessibilityOptimization {
  content: string;
  contentType: "text" | "video" | "image" | "audio";
  userPreferences: AccessibilityPreferences;
}

export interface OptimizedContent {
  original: string;
  optimized: string;
  aslVideoUrl?: string;
  captions?: string[];
  alternativeFormats: {
    format: string;
    url: string;
  }[];
  accessibilityScore: number;
}

export interface PinkSyncEvent {
  id: string;
  type: string;
  source: string;
  data: Record<string, unknown>;
  timestamp: string;
  priority: "low" | "medium" | "high" | "critical";
}

export interface LatencyMetrics {
  channel: string;
  averageLatency: number;
  maxLatency: number;
  minLatency: number;
  samples: number;
  lastUpdated: string;
}
