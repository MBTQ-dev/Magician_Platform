/**
 * FibonRose Module - Type Definitions
 */

export interface Contribution {
  id: string;
  userId: string;
  type: ContributionType;
  value: number;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export type ContributionType =
  | "complete_gig"
  | "gig_5star_review"
  | "dao_vote"
  | "help_community_member"
  | "mentor_session"
  | "create_asl_content"
  | "complete_training"
  | "refer_user"
  | "contribute_code"
  | "write_documentation"
  | "report_bug"
  | "submit_feedback"
  | "participate_event"
  | "verify_identity"
  | "complete_profile"
  | "harassment_violation"
  | "spam_violation"
  | "fraud_attempt"
  | "policy_violation"
  | "share_resource";

export interface ContributionRequest {
  userId: string;
  type: ContributionType;
  value?: number;
  metadata?: Record<string, unknown>;
}

export interface TrustScore {
  userId: string;
  score: number;
  level: number;
  rank: string;
  contributions: number;
  lastUpdated: string;
  nextLevelAt: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  requirement: string;
  earnedAt?: string;
}

export interface UserBadges {
  userId: string;
  badges: Badge[];
  totalEarned: number;
}

export interface ReputationHistory {
  userId: string;
  entries: {
    timestamp: string;
    score: number;
    change: number;
    reason: string;
  }[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  level: number;
  rank: number;
  badges: number;
}

export interface Leaderboard {
  entries: LeaderboardEntry[];
  timeframe: "daily" | "weekly" | "monthly" | "all-time";
  lastUpdated: string;
}
