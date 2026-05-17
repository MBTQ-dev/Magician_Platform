/**
 * FibonRose Module - Reputation Management
 * 
 * Handles contribution recording and reputation tracking
 */

import { createSupabaseServiceClient } from "../../lib/supabase.ts";
import type {
  Contribution,
  ContributionRequest,
  ContributionType,
  ReputationHistory,
} from "./types.ts";
import { calculateTrustScore } from "./trust.ts";

// Contribution point values
const CONTRIBUTION_VALUES: Record<ContributionType, number> = {
  complete_gig: 5,
  gig_5star_review: 3,
  dao_vote: 1,
  help_community_member: 2,
  mentor_session: 8,
  create_asl_content: 10,
  complete_training: 5,
  refer_user: 3,
  contribute_code: 8,
  write_documentation: 5,
  report_bug: 2,
  submit_feedback: 1,
  participate_event: 3,
  verify_identity: 5,
  complete_profile: 2,
  harassment_violation: -20,
  spam_violation: -10,
  fraud_attempt: -50,
  policy_violation: -15,
  share_resource: 2,
};

/**
 * Record a contribution for a user
 */
export async function recordContribution(
  request: ContributionRequest
): Promise<{ success: boolean; contribution?: Contribution; error?: string }> {
  try {
    const supabase = createSupabaseServiceClient();

    const value = request.value ?? CONTRIBUTION_VALUES[request.type] ?? 0;

    const contribution: Omit<Contribution, "id"> = {
      userId: request.userId,
      type: request.type,
      value,
      metadata: request.metadata,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("contributions")
      .insert({
        user_id: contribution.userId,
        type: contribution.type,
        value: contribution.value,
        metadata: contribution.metadata,
        created_at: contribution.timestamp,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      contribution: {
        id: data.id,
        userId: data.user_id,
        type: data.type,
        value: data.value,
        metadata: data.metadata,
        timestamp: data.created_at,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get contribution history for a user
 */
export async function getContributionHistory(
  userId: string,
  limit = 50
): Promise<Contribution[]> {
  try {
    const supabase = createSupabaseServiceClient();

    const { data, error } = await supabase
      .from("contributions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      value: row.value,
      metadata: row.metadata,
      timestamp: row.created_at,
    }));
  } catch (error) {
    console.error("Error getting contribution history:", error);
    return [];
  }
}

/**
 * Get reputation history with score changes
 */
export async function getReputationHistory(
  userId: string
): Promise<ReputationHistory> {
  const contributions = await getContributionHistory(userId, 100);

  let runningScore = 0;
  const entries = contributions.reverse().map((contrib) => {
    runningScore += contrib.value;
    return {
      timestamp: contrib.timestamp,
      score: runningScore,
      change: contrib.value,
      reason: contrib.type,
    };
  });

  return {
    userId,
    entries,
  };
}

/**
 * Get contribution statistics for a user
 */
export async function getContributionStats(userId: string): Promise<{
  total: number;
  positive: number;
  negative: number;
  byType: Record<string, number>;
}> {
  const contributions = await getContributionHistory(userId, 1000);

  const stats = {
    total: contributions.length,
    positive: 0,
    negative: 0,
    byType: {} as Record<string, number>,
  };

  for (const contrib of contributions) {
    if (contrib.value > 0) {
      stats.positive++;
    } else if (contrib.value < 0) {
      stats.negative++;
    }

    stats.byType[contrib.type] = (stats.byType[contrib.type] || 0) + 1;
  }

  return stats;
}

/**
 * Check if user has earned specific achievements
 */
export async function checkAchievements(userId: string): Promise<string[]> {
  const stats = await getContributionStats(userId);
  const score = await calculateTrustScore(userId);
  const achievements: string[] = [];

  // First contribution
  if (stats.total >= 1) {
    achievements.push("first_contribution");
  }

  // Active contributor
  if (stats.total >= 10) {
    achievements.push("active_contributor");
  }

  // Power user
  if (stats.total >= 50) {
    achievements.push("power_user");
  }

  // Mentor
  if (stats.byType.mentor_session >= 5) {
    achievements.push("mentor");
  }

  // ASL creator
  if (stats.byType.create_asl_content >= 3) {
    achievements.push("asl_creator");
  }

  // Code contributor
  if (stats.byType.contribute_code >= 10) {
    achievements.push("code_contributor");
  }

  // Trusted member (level 3+)
  if (score.level >= 3) {
    achievements.push("trusted_member");
  }

  // Community leader (level 6+)
  if (score.level >= 6) {
    achievements.push("community_leader");
  }

  return achievements;
}
