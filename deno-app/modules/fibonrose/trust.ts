/**
 * FibonRose Module - Trust Score Calculation
 * 
 * Implements Fibonacci-based trust scoring algorithm
 */

import { createSupabaseServiceClient } from "../../lib/supabase.ts";
import type { TrustScore } from "./types.ts";

// Fibonacci sequence for level thresholds
const FIBONACCI_LEVELS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610];

const LEVEL_RANKS = [
  "Newcomer",
  "Participant",
  "Active Member",
  "Contributor",
  "Trusted Member",
  "Veteran",
  "Community Leader",
  "Expert",
  "Ambassador",
  "Legend",
];

/**
 * Calculate trust score for a user
 */
export async function calculateTrustScore(userId: string): Promise<TrustScore> {
  try {
    const supabase = createSupabaseServiceClient();

    // Get all contributions for the user
    const { data: contributions, error } = await supabase
      .from("contributions")
      .select("value, created_at")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    // Calculate total score
    let totalScore = 0;
    let contributionCount = 0;

    if (contributions) {
      for (const contrib of contributions) {
        totalScore += contrib.value || 0;
        contributionCount++;
      }
    }

    // Apply decay if enabled
    if (Deno.env.get("FIBONROSE_DECAY_ENABLED") === "true") {
      const decayDays = parseInt(Deno.env.get("FIBONROSE_DECAY_DAYS") || "90");
      totalScore = applyDecay(totalScore, contributions, decayDays);
    }

    // Calculate level based on Fibonacci thresholds
    const level = calculateLevel(totalScore);
    const rank = LEVEL_RANKS[Math.min(level, LEVEL_RANKS.length - 1)] || "Newcomer";
    const nextLevelAt = FIBONACCI_LEVELS[level + 1] || FIBONACCI_LEVELS[FIBONACCI_LEVELS.length - 1];

    return {
      userId,
      score: Math.max(0, Math.round(totalScore)),
      level,
      rank,
      contributions: contributionCount,
      lastUpdated: new Date().toISOString(),
      nextLevelAt,
    };
  } catch (error) {
    console.error("Error calculating trust score:", error);
    return {
      userId,
      score: 0,
      level: 0,
      rank: "Newcomer",
      contributions: 0,
      lastUpdated: new Date().toISOString(),
      nextLevelAt: FIBONACCI_LEVELS[1],
    };
  }
}

/**
 * Calculate level from score using Fibonacci thresholds
 */
function calculateLevel(score: number): number {
  for (let i = FIBONACCI_LEVELS.length - 1; i >= 0; i--) {
    if (score >= FIBONACCI_LEVELS[i]) {
      return i;
    }
  }
  return 0;
}

/**
 * Apply time-based decay to score
 */
function applyDecay(
  score: number,
  contributions: any[],
  decayDays: number
): number {
  if (!contributions || contributions.length === 0) {
    return score;
  }

  // Get the most recent contribution
  const sortedContributions = contributions.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const mostRecent = new Date(sortedContributions[0].created_at);
  const daysSinceLastContribution = (Date.now() - mostRecent.getTime()) / (1000 * 60 * 60 * 24);

  // Apply decay if inactive for longer than threshold
  if (daysSinceLastContribution > decayDays) {
    const decayFactor = Math.max(0.5, 1 - (daysSinceLastContribution - decayDays) / 365);
    return score * decayFactor;
  }

  return score;
}

/**
 * Get trust score for multiple users
 */
export async function getBatchTrustScores(
  userIds: string[]
): Promise<Map<string, TrustScore>> {
  const scores = new Map<string, TrustScore>();

  await Promise.all(
    userIds.map(async (userId) => {
      const score = await calculateTrustScore(userId);
      scores.set(userId, score);
    })
  );

  return scores;
}

/**
 * Get user's rank among all users
 */
export async function getUserRank(userId: string): Promise<{
  rank: number;
  totalUsers: number;
  percentile: number;
}> {
  try {
    const supabase = createSupabaseServiceClient();

    // Get user's score
    const userScore = await calculateTrustScore(userId);

    // Get count of users with higher scores
    const { count: higherCount } = await supabase
      .from("contributions")
      .select("user_id", { count: "exact", head: true })
      .gt("value", userScore.score);

    // Get total user count
    const { count: totalCount } = await supabase
      .from("contributions")
      .select("user_id", { count: "exact", head: true });

    const rank = (higherCount || 0) + 1;
    const total = totalCount || 1;
    const percentile = ((total - rank) / total) * 100;

    return {
      rank,
      totalUsers: total,
      percentile: Math.round(percentile),
    };
  } catch (error) {
    console.error("Error getting user rank:", error);
    return {
      rank: 0,
      totalUsers: 0,
      percentile: 0,
    };
  }
}
