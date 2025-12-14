/**
 * Fibonrose Reputation Service
 * 
 * Calculates and tracks reputation scores across the MBTQ ecosystem.
 * Fibonrose is the shared memory of trustworthiness that all Magicians reference.
 */

import { db } from '../database';

export interface FibonroseScore {
  userId: number;
  totalScore: number;
  level: number;
  badges: string[];
  recentActivity: FibonroseActivity[];
}

export interface FibonroseActivity {
  timestamp: Date;
  action: string;
  pointsChange: number;
  newTotal: number;
  source: string;
  details?: any;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  requiredScore?: number;
  requiredActions?: {
    action: string;
    count: number;
  }[];
}

// Point values for different actions
const POINT_VALUES: Record<string, number> = {
  // SignGigs activities
  'complete_gig': 40,
  'gig_5star_review': 10,
  'first_gig_completed': 40,
  
  // DAO activities
  'dao_vote': 5,
  'dao_proposal_submitted': 15,
  'dao_proposal_approved': 50,
  
  // Community activities
  'help_community_member': 10,
  'create_tutorial': 25,
  'asl_content_created': 30,
  'mentor_session': 30,
  
  // Profile completion
  'complete_profile': 20,
  'verify_email': 10,
  'verify_identity': 15,
  
  // Onboarding
  'complete_onboarding': 25,
  
  // Negative actions (reputation reduction)
  'harassment_violation': -100,
  'scam_attempt': -200,
  'spam': -20,
};

// Badge definitions
const BADGES: Badge[] = [
  {
    id: 'founding_member',
    name: 'Founding Member',
    description: 'Early adopter of the MBTQ ecosystem',
  },
  {
    id: 'top_contributor',
    name: 'Top Contributor',
    description: 'Consistently contributes high-quality work',
    requiredScore: 500,
  },
  {
    id: 'community_guardian',
    name: 'Community Guardian',
    description: 'Helps protect and support the community',
    requiredScore: 300,
  },
  {
    id: 'active_voter',
    name: 'Active Voter',
    description: 'Participates actively in DAO governance',
    requiredActions: [
      { action: 'dao_vote', count: 10 },
    ],
  },
  {
    id: 'mentor',
    name: 'Mentor',
    description: 'Guides and supports other community members',
    requiredActions: [
      { action: 'mentor_session', count: 5 },
    ],
  },
  {
    id: 'asl_creator',
    name: 'ASL Creator',
    description: 'Creates ASL content for the community',
    requiredActions: [
      { action: 'asl_content_created', count: 3 },
    ],
  },
];

/**
 * Get user's Fibonrose score and profile
 */
export async function getFibonroseScore(userId: number): Promise<FibonroseScore | null> {
  try {
    // In production, this would query from database
    // For now, return a mock structure
    
    // TODO: Implement actual database queries
    const mockScore: FibonroseScore = {
      userId,
      totalScore: 150,
      level: calculateLevel(150),
      badges: ['founding_member'],
      recentActivity: [],
    };
    
    return mockScore;
  } catch (error) {
    console.error('Error getting Fibonrose score:', error);
    return null;
  }
}

/**
 * Calculate level based on total score
 * Uses Fibonacci-inspired progression
 */
export function calculateLevel(score: number): number {
  const levels = [0, 50, 100, 200, 350, 550, 850, 1300, 2000, 3000];
  
  for (let i = levels.length - 1; i >= 0; i--) {
    if (score >= levels[i]) {
      return i + 1;
    }
  }
  
  return 1;
}

/**
 * Add points for a specific action
 */
export async function addPoints(
  userId: number,
  action: string,
  source: string,
  details?: any
): Promise<{
  success: boolean;
  newScore?: number;
  newLevel?: number;
  badgesEarned?: string[];
  error?: string;
}> {
  try {
    const pointsChange = POINT_VALUES[action] || 0;
    
    if (pointsChange === 0) {
      return {
        success: false,
        error: `Unknown action: ${action}`,
      };
    }

    // Get current score
    const currentScore = await getFibonroseScore(userId);
    if (!currentScore) {
      return {
        success: false,
        error: 'User score not found',
      };
    }

    const newScore = currentScore.totalScore + pointsChange;
    const newLevel = calculateLevel(newScore);
    const oldLevel = currentScore.level;

    // Check for new badges
    const badgesEarned = await checkForNewBadges(userId, action, newScore);

    // Log the activity
    const activity: FibonroseActivity = {
      timestamp: new Date(),
      action,
      pointsChange,
      newTotal: newScore,
      source,
      details,
    };

    // In production, this would update the database
    console.log('[Fibonrose] Points added:', {
      userId,
      action,
      pointsChange,
      newScore,
      newLevel,
      levelUp: newLevel > oldLevel,
      badgesEarned,
    });

    return {
      success: true,
      newScore,
      newLevel,
      badgesEarned,
    };
  } catch (error) {
    console.error('Error adding points:', error);
    return {
      success: false,
      error: 'Failed to add points',
    };
  }
}

/**
 * Check if user has earned new badges
 */
async function checkForNewBadges(
  userId: number,
  action: string,
  currentScore: number
): Promise<string[]> {
  const newBadges: string[] = [];
  
  // In production, this would check against user's action history in database
  
  for (const badge of BADGES) {
    // Check score-based badges
    if (badge.requiredScore && currentScore >= badge.requiredScore) {
      newBadges.push(badge.id);
    }
    
    // Check action-based badges
    // TODO: Implement action counting from database
  }
  
  return newBadges;
}

/**
 * Get explanation for score change
 */
export function explainScoreChange(
  action: string,
  pointsChange: number
): string {
  const descriptions: Record<string, string> = {
    'complete_gig': 'You completed a gig on SignGigs',
    'gig_5star_review': 'You received a 5-star review',
    'first_gig_completed': 'You completed your first gig (bonus!)',
    'dao_vote': 'You voted in a DAO proposal',
    'help_community_member': 'You helped a community member',
    'mentor_session': 'You mentored another user',
    'asl_content_created': 'You created ASL content',
  };
  
  const description = descriptions[action] || `Action: ${action}`;
  const points = pointsChange > 0 ? `+${pointsChange}` : pointsChange.toString();
  
  return `${description} (${points} points)`;
}

/**
 * Detect reputation gaming
 */
export function detectReputationGaming(
  userId: number,
  recentActions: FibonroseActivity[]
): {
  isSuspicious: boolean;
  flags: string[];
} {
  const flags: string[] = [];
  
  // Check for suspicious patterns
  // 1. Too many actions in short time
  if (recentActions.length > 50) {
    const timespan = recentActions[recentActions.length - 1].timestamp.getTime() - 
                     recentActions[0].timestamp.getTime();
    if (timespan < 3600000) { // 1 hour
      flags.push('Excessive activity in short timeframe');
    }
  }
  
  // 2. Repeated same action (possible gaming)
  const actionCounts: Record<string, number> = {};
  for (const activity of recentActions) {
    actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1;
  }
  
  for (const [action, count] of Object.entries(actionCounts)) {
    if (count > 20) {
      flags.push(`Repeated action: ${action} (${count} times)`);
    }
  }
  
  return {
    isSuspicious: flags.length > 0,
    flags,
  };
}

/**
 * Freeze account for suspicious activity
 */
export async function freezeAccount(
  userId: number,
  reason: string
): Promise<void> {
  // In production, this would update database
  console.log('[Fibonrose] Account frozen:', {
    userId,
    reason,
    timestamp: new Date().toISOString(),
  });
}

export default {
  getFibonroseScore,
  calculateLevel,
  addPoints,
  explainScoreChange,
  detectReputationGaming,
  freezeAccount,
  POINT_VALUES,
  BADGES,
};
