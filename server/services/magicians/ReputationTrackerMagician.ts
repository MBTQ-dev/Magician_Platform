/**
 * Reputation Tracker Magician
 * 
 * Purpose: Fibonrose score calculation, badge issuance, trust validation
 * 
 * Responsibilities:
 * - Monitor contributions across all MBTQ apps
 * - Update Fibonrose scores in real-time
 * - Issue badges when milestones are hit
 * - Answer questions about reputation system
 * - Detect reputation gaming
 */

import { BaseMagician, MagicianContext } from './BaseMagician';
import fibonroseService from '../fibonroseService';

export class ReputationTrackerMagician extends BaseMagician {
  constructor() {
    super(
      'reputation_tracker',
      'Reputation Tracker Magician',
      'Fibonrose score calculation and badge management for MBTQ ecosystem',
      [
        'score_calculation',
        'badge_issuance',
        'reputation_monitoring',
        'fraud_detection',
        'score_explanation',
      ]
    );
  }

  async execute(action: string, context: MagicianContext, params: any): Promise<any> {
    switch (action) {
      case 'view_score':
        return await this.viewScore(context, params);
      
      case 'record_contribution':
        return await this.recordContribution(context, params);
      
      case 'explain_score_change':
        return await this.explainScoreChange(context, params);
      
      case 'check_badges':
        return await this.checkBadges(context, params);
      
      case 'detect_gaming':
        return await this.detectGaming(context, params);
      
      case 'leaderboard':
        return await this.getLeaderboard(context, params);
      
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`,
        };
    }
  }

  /**
   * View user's current Fibonrose score
   */
  private async viewScore(
    context: MagicianContext,
    params: { userId?: number }
  ): Promise<any> {
    try {
      const targetUserId = params.userId || context.userId;
      
      if (!targetUserId) {
        return {
          success: false,
          error: 'User ID required',
        };
      }

      const score = await fibonroseService.getFibonroseScore(targetUserId);
      
      if (!score) {
        return {
          success: false,
          error: 'Score not found',
        };
      }

      const nextLevel = score.level + 1;
      const currentLevelThreshold = this.getLevelThreshold(score.level);
      const nextLevelThreshold = this.getLevelThreshold(nextLevel);
      const pointsToNext = nextLevelThreshold - score.totalScore;

      this.logAction(
        'view',
        'view_score',
        { userId: targetUserId },
        true,
        context.userId
      );

      return {
        success: true,
        score: {
          total: score.totalScore,
          level: score.level,
          badges: score.badges,
          progress: {
            current: score.totalScore - currentLevelThreshold,
            needed: nextLevelThreshold - currentLevelThreshold,
            percentage: Math.round(
              ((score.totalScore - currentLevelThreshold) /
                (nextLevelThreshold - currentLevelThreshold)) *
                100
            ),
          },
          nextMilestone: {
            level: nextLevel,
            pointsNeeded: pointsToNext,
          },
        },
        recentActivity: score.recentActivity.slice(-10),
        message: context.preferASL
          ? 'Your Fibonrose score is available in ASL video format'
          : `Your current Fibonrose score is ${score.totalScore}. You're at Level ${score.level}.`,
      };
    } catch (error) {
      this.logAction(
        'view',
        'view_score',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to retrieve score',
      };
    }
  }

  /**
   * Record a contribution and update score
   */
  private async recordContribution(
    context: MagicianContext,
    params: {
      userId: number;
      contributionType: string;
      source: string;
      details?: any;
    }
  ): Promise<any> {
    try {
      const { userId, contributionType, source, details } = params;

      // Add points for the contribution
      const result = await fibonroseService.addPoints(
        userId,
        contributionType,
        source,
        details
      );

      if (!result.success) {
        return result;
      }

      // Check if user leveled up
      const leveledUp = result.newLevel! > (context.fibonroseScore ? 
        fibonroseService.calculateLevel(context.fibonroseScore) : 1);

      // Build response message
      const pointsChange = fibonroseService.POINT_VALUES[contributionType] || 0;
      const explanation = fibonroseService.explainScoreChange(
        contributionType,
        pointsChange
      );

      this.logAction(
        'contribution',
        'record_contribution',
        {
          userId,
          contributionType,
          pointsChange,
          newScore: result.newScore,
          leveledUp,
        },
        true,
        context.userId
      );

      // Coordinate with Workflow Automator for notifications
      if (leveledUp || (result.badgesEarned && result.badgesEarned.length > 0)) {
        await this.coordinateWith({
          fromMagician: this.magicianId,
          toMagician: 'workflow_automator',
          requestType: 'send_notification',
          payload: {
            userId,
            type: leveledUp ? 'level_up' : 'badge_earned',
            newLevel: result.newLevel,
            badges: result.badgesEarned,
          },
          priority: 'medium',
        });
      }

      return {
        success: true,
        contribution: {
          type: contributionType,
          pointsEarned: pointsChange,
          explanation,
        },
        newScore: result.newScore,
        newLevel: result.newLevel,
        leveledUp,
        badgesEarned: result.badgesEarned || [],
        message: leveledUp
          ? `Congratulations! You've reached Level ${result.newLevel}!`
          : `${explanation}. Your new score: ${result.newScore}.`,
      };
    } catch (error) {
      this.logAction(
        'contribution',
        'record_contribution',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to record contribution',
      };
    }
  }

  /**
   * Explain recent score changes
   */
  private async explainScoreChange(
    context: MagicianContext,
    params: { userId?: number; days?: number }
  ): Promise<any> {
    try {
      const userId = params.userId || context.userId;
      if (!userId) {
        return {
          success: false,
          error: 'User ID required',
        };
      }

      const score = await fibonroseService.getFibonroseScore(userId);
      if (!score) {
        return {
          success: false,
          error: 'Score not found',
        };
      }

      const days = params.days || 7;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const recentChanges = score.recentActivity.filter(
        activity => activity.timestamp >= cutoffDate
      );

      const changes = recentChanges.map(activity => ({
        date: activity.timestamp,
        action: activity.action,
        points: activity.pointsChange,
        explanation: fibonroseService.explainScoreChange(
          activity.action,
          activity.pointsChange
        ),
        newTotal: activity.newTotal,
      }));

      const totalChange = recentChanges.reduce(
        (sum, activity) => sum + activity.pointsChange,
        0
      );

      this.logAction(
        'explanation',
        'explain_score_change',
        { userId, days },
        true,
        context.userId
      );

      return {
        success: true,
        period: `Last ${days} days`,
        changes,
        summary: {
          totalChange,
          numberOfActions: changes.length,
          currentScore: score.totalScore,
        },
        message: totalChange > 0
          ? `You gained ${totalChange} points in the last ${days} days!`
          : totalChange < 0
          ? `Your score decreased by ${Math.abs(totalChange)} points in the last ${days} days.`
          : `No changes to your score in the last ${days} days.`,
      };
    } catch (error) {
      this.logAction(
        'explanation',
        'explain_score_change',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to explain score changes',
      };
    }
  }

  /**
   * Check user's badges
   */
  private async checkBadges(
    context: MagicianContext,
    params: { userId?: number }
  ): Promise<any> {
    try {
      const userId = params.userId || context.userId;
      if (!userId) {
        return {
          success: false,
          error: 'User ID required',
        };
      }

      const score = await fibonroseService.getFibonroseScore(userId);
      if (!score) {
        return {
          success: false,
          error: 'Score not found',
        };
      }

      // Get badge details
      const earnedBadges = fibonroseService.BADGES.filter(badge =>
        score.badges.includes(badge.id)
      );

      // Find available badges (not yet earned)
      const availableBadges = fibonroseService.BADGES.filter(
        badge => !score.badges.includes(badge.id)
      ).map(badge => ({
        ...badge,
        canEarn: badge.requiredScore
          ? score.totalScore >= badge.requiredScore
          : false,
      }));

      this.logAction(
        'badges',
        'check_badges',
        { userId },
        true,
        context.userId
      );

      return {
        success: true,
        earned: earnedBadges,
        available: availableBadges,
        stats: {
          totalEarned: earnedBadges.length,
          totalAvailable: fibonroseService.BADGES.length,
          percentComplete: Math.round(
            (earnedBadges.length / fibonroseService.BADGES.length) * 100
          ),
        },
        message: `You have earned ${earnedBadges.length} of ${fibonroseService.BADGES.length} badges.`,
      };
    } catch (error) {
      this.logAction(
        'badges',
        'check_badges',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to retrieve badges',
      };
    }
  }

  /**
   * Detect reputation gaming
   */
  private async detectGaming(
    context: MagicianContext,
    params: { userId: number }
  ): Promise<any> {
    try {
      const { userId } = params;

      const score = await fibonroseService.getFibonroseScore(userId);
      if (!score) {
        return {
          success: false,
          error: 'Score not found',
        };
      }

      const gamingCheck = fibonroseService.detectReputationGaming(
        userId,
        score.recentActivity
      );

      if (gamingCheck.isSuspicious) {
        // Log suspicious activity
        this.logAction(
          'fraud_detection',
          'detect_gaming',
          {
            userId,
            flags: gamingCheck.flags,
          },
          true,
          context.userId
        );

        // Freeze account for review
        await fibonroseService.freezeAccount(
          userId,
          `Suspicious reputation gaming detected: ${gamingCheck.flags.join(', ')}`
        );

        // Coordinate with Safety Monitor
        await this.coordinateWith({
          fromMagician: this.magicianId,
          toMagician: 'safety_monitor',
          requestType: 'review_reputation_gaming',
          payload: {
            userId,
            flags: gamingCheck.flags,
            recentActivity: score.recentActivity.slice(-20),
          },
          priority: 'high',
        });

        return {
          success: true,
          suspicious: true,
          flags: gamingCheck.flags,
          action: 'Account frozen for review',
          message: 'This account has been temporarily restricted while we review recent activity.',
        };
      }

      return {
        success: true,
        suspicious: false,
        message: 'No suspicious activity detected',
      };
    } catch (error) {
      this.logAction(
        'fraud_detection',
        'detect_gaming',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to detect gaming',
      };
    }
  }

  /**
   * Get leaderboard of top contributors
   */
  private async getLeaderboard(
    context: MagicianContext,
    params: { limit?: number; category?: string }
  ): Promise<any> {
    try {
      const { limit = 10, category = 'overall' } = params;

      // In production, this would query database
      // For now, return mock leaderboard
      const mockLeaderboard = [
        {
          rank: 1,
          userId: 101,
          username: 'JohnDoe',
          score: 850,
          level: 7,
          badges: ['top_contributor', 'mentor', 'active_voter'],
        },
        {
          rank: 2,
          userId: 102,
          username: 'JaneSmith',
          score: 720,
          level: 6,
          badges: ['community_guardian', 'asl_creator'],
        },
        // ... more entries
      ].slice(0, limit);

      this.logAction(
        'leaderboard',
        'get_leaderboard',
        { limit, category },
        true,
        context.userId
      );

      return {
        success: true,
        leaderboard: mockLeaderboard,
        category,
        message: `Top ${limit} contributors in ${category}`,
      };
    } catch (error) {
      this.logAction(
        'leaderboard',
        'get_leaderboard',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to retrieve leaderboard',
      };
    }
  }

  /**
   * Helper: Get score threshold for a level
   */
  private getLevelThreshold(level: number): number {
    const levels = [0, 50, 100, 200, 350, 550, 850, 1300, 2000, 3000];
    return levels[level - 1] || 0;
  }
}

export default new ReputationTrackerMagician();
