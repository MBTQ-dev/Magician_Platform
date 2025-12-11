/**
 * Gatekeeper Magician
 * 
 * Purpose: Identity verification, onboarding, access control
 * 
 * Responsibilities:
 * - Welcome new users
 * - Verify DeafAuth credentials
 * - Explain permissions
 * - Flag suspicious activity
 * - Route users to appropriate Magicians
 */

import { BaseMagician, MagicianContext } from './BaseMagician';
import deafAuthService from '../deafAuthService';
import fibonroseService from '../fibonroseService';

export class GatekeeperMagician extends BaseMagician {
  constructor() {
    super(
      'gatekeeper',
      'Gatekeeper Magician',
      'Identity verification, onboarding, and access control for MBTQ ecosystem',
      [
        'authentication',
        'onboarding',
        'access_control',
        'security_monitoring',
        'user_routing',
      ]
    );
  }

  async execute(action: string, context: MagicianContext, params: any): Promise<any> {
    switch (action) {
      case 'welcome_user':
        return await this.welcomeUser(context, params);
      
      case 'verify_credentials':
        return await this.verifyCredentials(context, params);
      
      case 'explain_permissions':
        return await this.explainPermissions(context, params);
      
      case 'check_access':
        return await this.checkAccess(context, params);
      
      case 'flag_suspicious_activity':
        return await this.flagSuspiciousActivity(context, params);
      
      case 'route_user':
        return await this.routeUser(context, params);
      
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`,
        };
    }
  }

  /**
   * Welcome new users to MBTQ
   */
  private async welcomeUser(
    context: MagicianContext,
    params: { userName?: string; appName?: string }
  ): Promise<any> {
    try {
      const { userName = 'there', appName = 'MBTQ' } = params;
      
      const welcomeMessage = context.preferASL
        ? {
            type: 'asl_video',
            message: `Welcome to ${appName}! We're excited to have you here.`,
            aslVideoUrl: '/asl/welcome.mp4', // Placeholder
            textAlternative: `Welcome to ${appName}, ${userName}! I'm your Gatekeeper Magician. I help you get started and ensure secure access to all MBTQ services.`,
          }
        : {
            type: 'text',
            message: `Welcome to ${appName}, ${userName}! I'm your Gatekeeper Magician. I help you get started and ensure secure access to all MBTQ services.`,
          };

      const nextSteps = {
        needsRegistration: !context.userId,
        steps: context.userId
          ? [
              'Your identity is verified ✓',
              'Check your available apps and permissions',
              'Visit your dashboard to get started',
            ]
          : [
              'Create your DeafAuth account',
              'Verify your email address',
              'Complete your profile',
              'Start exploring MBTQ apps',
            ],
      };

      this.logAction(
        'welcome',
        'welcome_user',
        { appName, userName },
        true,
        context.userId
      );

      return {
        success: true,
        welcomeMessage,
        nextSteps,
      };
    } catch (error) {
      this.logAction(
        'welcome',
        'welcome_user',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );
      
      return {
        success: false,
        error: 'Failed to generate welcome message',
      };
    }
  }

  /**
   * Verify DeafAuth credentials
   */
  private async verifyCredentials(
    context: MagicianContext,
    params: { username: string; password: string }
  ): Promise<any> {
    try {
      const { username, password } = params;

      // Use DeafAuth service to authenticate
      const authResult = await deafAuthService.authenticate(username, password);

      if (!authResult.success) {
        this.logAction(
          'authentication',
          'verify_credentials',
          { username },
          false,
          undefined,
          authResult.error
        );

        deafAuthService.logAuthAttempt(username, false);

        return {
          success: false,
          error: 'Invalid credentials',
          message: 'The username or password you entered is incorrect. Please try again.',
        };
      }

      // Get Fibonrose score for the user
      const fibonroseScore = await fibonroseService.getFibonroseScore(authResult.user!.id);

      this.logAction(
        'authentication',
        'verify_credentials',
        { username },
        true,
        authResult.user!.id
      );

      deafAuthService.logAuthAttempt(username, true);

      return {
        success: true,
        token: authResult.token,
        user: authResult.user,
        fibonroseScore: fibonroseScore?.totalScore || 0,
        message: `Welcome back, ${authResult.user!.username}!`,
      };
    } catch (error) {
      this.logAction(
        'authentication',
        'verify_credentials',
        { username: params.username },
        false,
        undefined,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Authentication failed',
      };
    }
  }

  /**
   * Explain user permissions
   */
  private async explainPermissions(
    context: MagicianContext,
    params: { appName?: string }
  ): Promise<any> {
    try {
      if (!context.deafAuthToken) {
        return {
          success: false,
          error: 'Not authenticated',
          message: 'Please sign in to view your permissions.',
        };
      }

      const token = await deafAuthService.verifyToken(context.deafAuthToken);
      if (!token) {
        return {
          success: false,
          error: 'Invalid token',
        };
      }

      const fibonroseScore = context.fibonroseScore || 0;
      const fibonroseLevel = fibonroseService.calculateLevel(fibonroseScore);

      // Build permissions explanation
      const permissions = {
        general: [
          'Access to your profile and settings',
          'Participate in community discussions',
          'Access learning resources',
        ],
        apps: {
          SignGigs: {
            canAccess: true,
            level: 'Full Access',
            requirements: 'All registered users',
          },
          'DAO Voting': {
            canAccess: fibonroseLevel >= 2,
            level: fibonroseLevel >= 2 ? 'Can Vote' : 'Viewing Only',
            requirements: 'Fibonrose Level 2+ required to vote',
          },
          'DeafBiz Directory': {
            canAccess: true,
            level: 'Full Access',
            requirements: 'All registered users',
          },
        },
        currentFibonrose: {
          score: fibonroseScore,
          level: fibonroseLevel,
          nextLevel: fibonroseLevel + 1,
          pointsToNext: this.getPointsToNextLevel(fibonroseScore),
        },
      };

      this.logAction(
        'permissions',
        'explain_permissions',
        { appName: params.appName },
        true,
        context.userId
      );

      return {
        success: true,
        permissions,
        message: context.preferASL
          ? 'ASL video explanation available'
          : 'Here are your current permissions across the MBTQ ecosystem',
      };
    } catch (error) {
      this.logAction(
        'permissions',
        'explain_permissions',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to retrieve permissions',
      };
    }
  }

  /**
   * Check if user can access specific resource
   */
  private async checkAccess(
    context: MagicianContext,
    params: { appName: string; action?: string }
  ): Promise<any> {
    try {
      const { appName, action = 'read' } = params;

      // Verify authentication
      if (!context.deafAuthToken) {
        this.logAction(
          'access_control',
          'check_access',
          { appName, action, reason: 'Not authenticated' },
          false
        );

        return {
          success: true,
          canAccess: false,
          reason: 'Authentication required',
          message: 'Please sign in to access this app.',
        };
      }

      const token = await deafAuthService.verifyToken(context.deafAuthToken);
      if (!token) {
        return {
          success: true,
          canAccess: false,
          reason: 'Invalid authentication token',
        };
      }

      // Check app-specific requirements
      const fibonroseScore = context.fibonroseScore || 0;
      const fibonroseLevel = fibonroseService.calculateLevel(fibonroseScore);

      let canAccess = true;
      let reason = '';

      // App-specific access rules
      if (appName === 'DAO Voting' && action === 'vote') {
        if (fibonroseLevel < 2) {
          canAccess = false;
          reason = 'DAO voting requires Fibonrose Level 2 or higher';
        }
      }

      this.logAction(
        'access_control',
        'check_access',
        { appName, action, canAccess, reason },
        true,
        token.userId
      );

      return {
        success: true,
        canAccess,
        reason: reason || 'Access granted',
        fibonroseLevel,
      };
    } catch (error) {
      this.logAction(
        'access_control',
        'check_access',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to check access',
      };
    }
  }

  /**
   * Flag suspicious activity
   */
  private async flagSuspiciousActivity(
    context: MagicianContext,
    params: { activityType: string; details: any; severity?: string }
  ): Promise<any> {
    try {
      const { activityType, details, severity = 'medium' } = params;

      // Detect suspicious patterns
      const suspicionCheck = deafAuthService.detectSuspiciousActivity(
        context.userId || 0,
        activityType,
        details
      );

      if (suspicionCheck.isSuspicious) {
        // Log the suspicious activity
        this.logAction(
          'security',
          'flag_suspicious_activity',
          {
            activityType,
            details,
            severity,
            flags: suspicionCheck.flags,
          },
          true,
          context.userId
        );

        // Coordinate with Safety Monitor Magician for serious cases
        if (severity === 'high' || severity === 'critical') {
          await this.coordinateWith({
            fromMagician: this.magicianId,
            toMagician: 'safety_monitor',
            requestType: 'review_suspicious_activity',
            payload: {
              userId: context.userId,
              activityType,
              details,
              flags: suspicionCheck.flags,
            },
            priority: severity === 'critical' ? 'critical' : 'high',
          });
        }

        return {
          success: true,
          flagged: true,
          flags: suspicionCheck.flags,
          action: severity === 'critical' ? 'Account temporarily restricted' : 'Flagged for review',
        };
      }

      return {
        success: true,
        flagged: false,
        message: 'No suspicious activity detected',
      };
    } catch (error) {
      this.logAction(
        'security',
        'flag_suspicious_activity',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to flag activity',
      };
    }
  }

  /**
   * Route user to appropriate Magician based on intent
   */
  private async routeUser(
    context: MagicianContext,
    params: { userIntent: string }
  ): Promise<any> {
    try {
      const { userIntent } = params;

      // Simple intent-based routing
      const routing: Record<string, { magician: string; action: string; message: string }> = {
        'join signgigs': {
          magician: 'opportunity_scout',
          action: 'signgigs_onboarding',
          message: "Great! I'll connect you with the Opportunity Scout Magician to get you set up on SignGigs.",
        },
        'need help': {
          magician: 'community_concierge',
          action: 'general_help',
          message: "I'll connect you with the Community Concierge Magician who can answer your questions.",
        },
        'check my reputation': {
          magician: 'reputation_tracker',
          action: 'view_score',
          message: "Let me get the Reputation Tracker Magician to show you your Fibonrose score.",
        },
        'dao vote': {
          magician: 'governance_facilitator',
          action: 'view_proposals',
          message: "I'll connect you with the Governance Facilitator to view active proposals.",
        },
      };

      // Find best match (simple keyword matching for now)
      const intentLower = userIntent.toLowerCase();
      let route = null;

      for (const [keyword, routeInfo] of Object.entries(routing)) {
        if (intentLower.includes(keyword)) {
          route = routeInfo;
          break;
        }
      }

      if (!route) {
        // Default to Community Concierge
        route = {
          magician: 'community_concierge',
          action: 'general_help',
          message: "I'll connect you with the Community Concierge Magician for assistance.",
        };
      }

      this.logAction(
        'routing',
        'route_user',
        { userIntent, targetMagician: route.magician },
        true,
        context.userId
      );

      return {
        success: true,
        targetMagician: route.magician,
        action: route.action,
        message: route.message,
      };
    } catch (error) {
      this.logAction(
        'routing',
        'route_user',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to route user',
      };
    }
  }

  /**
   * Helper: Calculate points needed to reach next level
   */
  private getPointsToNextLevel(currentScore: number): number {
    const levels = [0, 50, 100, 200, 350, 550, 850, 1300, 2000, 3000];
    
    for (let i = 0; i < levels.length; i++) {
      if (currentScore < levels[i]) {
        return levels[i] - currentScore;
      }
    }
    
    return 0; // Already at max level
  }
}

export default new GatekeeperMagician();
