/**
 * Community Concierge Magician
 * 
 * Purpose: Answers questions, surfaces resources, connects users to each other
 * 
 * Responsibilities:
 * - Handle "How do I...?" questions across all MBTQ apps
 * - Point users to docs, tutorials, or relevant community members
 * - Match mentors to mentees based on Fibonrose scores
 * - Surface relevant opportunities
 * - Collect feedback and sentiment
 */

import { BaseMagician, MagicianContext } from './BaseMagician';
import fibonroseService from '../fibonroseService';
import { DatabaseStorage } from '../../database';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  tags: string[];
  aslVideoUrl?: string;
}

export class CommunityConciergeMagician extends BaseMagician {
  private faqDatabase: FAQItem[] = [];
  private db: DatabaseStorage;

  constructor() {
    super(
      'community_concierge',
      'Community Concierge Magician',
      'Q&A, resource discovery, and user connections for MBTQ community',
      [
        'question_answering',
        'resource_discovery',
        'mentor_matching',
        'opportunity_surfacing',
        'feedback_collection',
      ]
    );

    this.db = new DatabaseStorage();
    this.initializeFAQ();
  }

  async execute(action: string, context: MagicianContext, params: any): Promise<any> {
    switch (action) {
      case 'ask_question':
        return await this.askQuestion(context, params);
      
      case 'find_resources':
        return await this.findResources(context, params);
      
      case 'match_mentor':
        return await this.matchMentor(context, params);
      
      case 'surface_opportunities':
        return await this.surfaceOpportunities(context, params);
      
      case 'collect_feedback':
        return await this.collectFeedback(context, params);
      
      case 'search_faq':
        return await this.searchFAQ(context, params);
      
      default:
        return {
          success: false,
          error: `Unknown action: ${action}`,
        };
    }
  }

  /**
   * Initialize FAQ database
   */
  private initializeFAQ(): void {
    this.faqDatabase = [
      {
        question: 'How do I get started on SignGigs?',
        answer: 'To get started on SignGigs: 1) Complete your profile with your skills and experience, 2) Browse available gigs that match your expertise, 3) Submit proposals for gigs you\'re interested in, 4) Wait for clients to review and accept your proposal.',
        category: 'SignGigs',
        tags: ['getting-started', 'signgigs', 'profile'],
        aslVideoUrl: '/asl/faq/signgigs-start.mp4',
      },
      {
        question: 'What is Fibonrose and how does it work?',
        answer: 'Fibonrose is our reputation system. You earn points by contributing to the community: completing gigs, voting in DAO proposals, helping other members, creating content, etc. Your score determines your level and unlocks access to certain features. Higher scores show you\'re a trusted community member.',
        category: 'Reputation',
        tags: ['fibonrose', 'reputation', 'scoring'],
        aslVideoUrl: '/asl/faq/fibonrose-explained.mp4',
      },
      {
        question: 'How do I vote in DAO proposals?',
        answer: 'To vote in DAO proposals, you need Fibonrose Level 2 or higher. Once qualified, go to the DAO section, review active proposals, and cast your vote. Each vote earns you 5 Fibonrose points. Your voting power is based on your Fibonrose score.',
        category: 'DAO',
        tags: ['dao', 'voting', 'governance'],
      },
      {
        question: 'Can I request ASL interpretation for meetings?',
        answer: 'Yes! We provide ASL interpretation for all important meetings. You can request an interpreter through your account settings or by contacting support. We recommend requesting at least 24 hours in advance for best availability.',
        category: 'Accessibility',
        tags: ['asl', 'interpretation', 'accessibility'],
      },
    ];
  }

  /**
   * Answer user questions
   */
  private async askQuestion(
    context: MagicianContext,
    params: { question: string }
  ): Promise<any> {
    try {
      const { question } = params;

      // Search FAQ first
      const faqResult = await this.searchFAQ(context, { query: question });
      
      if (faqResult.success && faqResult.matches.length > 0) {
        const bestMatch = faqResult.matches[0];
        
        this.logAction(
          'question',
          'ask_question',
          { question, matchFound: true },
          true,
          context.userId
        );

        return {
          success: true,
          answer: bestMatch.answer,
          source: 'FAQ',
          category: bestMatch.category,
          aslVideoUrl: bestMatch.aslVideoUrl,
          relatedQuestions: faqResult.matches.slice(1, 3),
          needsHumanHelp: false,
        };
      }

      // If no FAQ match, suggest human help
      const suggestion = {
        answer: "I don't have a specific answer for that question in my knowledge base. Let me connect you with someone who can help.",
        options: [
          {
            type: 'community_expert',
            description: 'Connect with a community expert who can answer your question',
          },
          {
            type: 'support_team',
            description: 'Contact our support team for personalized assistance',
          },
          {
            type: 'community_forum',
            description: 'Post your question in the community forum',
          },
        ],
      };

      this.logAction(
        'question',
        'ask_question',
        { question, matchFound: false },
        true,
        context.userId
      );

      return {
        success: true,
        answer: suggestion.answer,
        needsHumanHelp: true,
        options: suggestion.options,
      };
    } catch (error) {
      this.logAction(
        'question',
        'ask_question',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to process question',
      };
    }
  }

  /**
   * Find relevant resources
   */
  private async findResources(
    context: MagicianContext,
    params: { topic: string; resourceType?: string }
  ): Promise<any> {
    try {
      const { topic, resourceType } = params;

      // In production, this would query a resource database
      const mockResources = [
        {
          title: 'Getting Started with MBTQ',
          type: 'tutorial',
          url: '/resources/getting-started',
          description: 'A comprehensive guide to using MBTQ apps',
          aslAvailable: true,
        },
        {
          title: 'SignGigs Best Practices',
          type: 'guide',
          url: '/resources/signgigs-guide',
          description: 'Tips for success on SignGigs platform',
          aslAvailable: true,
        },
        {
          title: 'DAO Governance Explained',
          type: 'video',
          url: '/resources/dao-explained',
          description: 'Learn how DAO governance works',
          aslAvailable: true,
        },
      ];

      const filteredResources = resourceType
        ? mockResources.filter(r => r.type === resourceType)
        : mockResources;

      this.logAction(
        'resources',
        'find_resources',
        { topic, resourceType, found: filteredResources.length },
        true,
        context.userId
      );

      return {
        success: true,
        topic,
        resources: filteredResources,
        total: filteredResources.length,
        preferASL: context.preferASL,
      };
    } catch (error) {
      this.logAction(
        'resources',
        'find_resources',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to find resources',
      };
    }
  }

  /**
   * Match mentors to mentees
   */
  private async matchMentor(
    context: MagicianContext,
    params: { interests?: string[]; experienceLevel?: string }
  ): Promise<any> {
    try {
      if (!context.userId) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      const userScore = await fibonroseService.getFibonroseScore(context.userId);
      const { interests = [] } = params;

      // In production, this would query mentor database
      const mockMentors = [
        {
          userId: 201,
          name: 'Maria Rodriguez',
          fibonroseScore: 850,
          fibonroseLevel: 7,
          specialties: ['SignGigs', 'business development', 'ASL content'],
          completedMentorships: 12,
          isDeaf: true,
          preferASL: true,
        },
        {
          userId: 202,
          name: 'James Chen',
          fibonroseScore: 720,
          fibonroseLevel: 6,
          specialties: ['DAO governance', 'community management'],
          completedMentorships: 8,
          isDeaf: false,
          preferASL: true,
        },
      ];

      // Simple matching logic - in production would be more sophisticated
      const matches = mockMentors.filter(mentor => {
        // Only match mentors with higher Fibonrose
        if (userScore && mentor.fibonroseLevel <= userScore.level) {
          return false;
        }
        
        // Match based on interests
        if (interests.length > 0) {
          return interests.some(interest =>
            mentor.specialties.some(specialty =>
              specialty.toLowerCase().includes(interest.toLowerCase())
            )
          );
        }
        
        return true;
      });

      this.logAction(
        'mentorship',
        'match_mentor',
        { interests, matches: matches.length },
        true,
        context.userId
      );

      return {
        success: true,
        matches,
        message: matches.length > 0
          ? `Found ${matches.length} potential mentors for you`
          : 'No mentors match your criteria right now. Try expanding your interests or check back later.',
      };
    } catch (error) {
      this.logAction(
        'mentorship',
        'match_mentor',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to match mentor',
      };
    }
  }

  /**
   * Surface relevant opportunities based on user profile, interests, and Fibonrose score
   */
  private async surfaceOpportunities(
    context: MagicianContext,
    params: { category?: string; type?: string; limit?: number }
  ): Promise<any> {
    try {
      if (!context.userId) {
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      // Get user's Fibonrose score
      const userScore = context.fibonroseScore || 0;

      // Get user's interests for personalized matching
      const userInterests = await this.db.getUserInterests(context.userId);
      
      // Get user profile to determine target audience
      const user = await this.db.getUser(context.userId);
      const targetAudience: string[] = [];
      if (user?.isDeaf) {
        targetAudience.push('deaf');
      }
      if (user?.preferASL) {
        targetAudience.push('asl_user');
      }
      
      // Build query parameters based on user profile and interests
      const queryParams: any = {
        isActive: true,
        userFibonroseScore: userScore, // Only show opportunities user qualifies for
      };

      if (params.category) {
        queryParams.category = params.category;
      }

      if (params.type) {
        queryParams.type = params.type;
      }

      if (targetAudience.length > 0) {
        queryParams.targetAudience = targetAudience;
      }

      // Extract tags from user interests
      const userTags: string[] = [];
      if (userInterests.length > 0) {
        userInterests.forEach(interest => {
          if (interest.category) {
            userTags.push(interest.category);
          }
          if (interest.subcategories) {
            userTags.push(...interest.subcategories);
          }
        });
      }

      // Query opportunities from database
      let allOpportunities = await this.db.getOpportunities(queryParams);

      // Apply personalized ranking based on user interests
      if (userTags.length > 0 || userInterests.length > 0) {
        allOpportunities = this.rankOpportunitiesByRelevance(
          allOpportunities,
          userInterests,
          userTags,
          params.type
        );
      }

      // Limit results if specified
      const limit = params.limit || 10;
      const qualifiedOpportunities = allOpportunities.slice(0, limit);

      this.logAction(
        'opportunities',
        'surface_opportunities',
        { 
          category: params.category, 
          type: params.type,
          found: qualifiedOpportunities.length,
          userScore,
          hasInterests: userInterests.length > 0
        },
        true,
        context.userId
      );

      return {
        success: true,
        opportunities: qualifiedOpportunities,
        total: qualifiedOpportunities.length,
        message: qualifiedOpportunities.length > 0
          ? `Found ${qualifiedOpportunities.length} personalized opportunities for you`
          : 'No opportunities match your profile right now. Keep building your Fibonrose score or update your interests!',
      };
    } catch (error) {
      this.logAction(
        'opportunities',
        'surface_opportunities',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to surface opportunities',
      };
    }
  }

  /**
   * Rank opportunities by relevance to user interests and preferences
   */
  private rankOpportunitiesByRelevance(
    opportunities: any[],
    userInterests: any[],
    userTags: string[],
    preferredType?: string
  ): any[] {
    return opportunities
      .map(opp => {
        let relevanceScore = opp.priority || 0;

        // Boost if opportunity type matches user's looking-for preferences
        if (preferredType && opp.type === preferredType) {
          relevanceScore += 50;
        }

        userInterests.forEach(interest => {
          // Match on category
          if (opp.category === interest.category) {
            relevanceScore += 30;
          }

          // Match on type preferences (what user is looking for)
          if (interest.lookingFor && interest.lookingFor.includes(opp.type)) {
            relevanceScore += 40;
          }

          // Match on subcategories
          if (interest.subcategories && opp.tags) {
            const matchingTags = interest.subcategories.filter((sub: string) =>
              opp.tags?.includes(sub)
            );
            relevanceScore += matchingTags.length * 10;
          }
        });

        // Match on user tags
        if (opp.tags && userTags.length > 0) {
          const matchingTags = opp.tags.filter((tag: string) => userTags.includes(tag));
          relevanceScore += matchingTags.length * 5;
        }

        // Boost newer opportunities slightly
        const daysOld = Math.floor(
          (Date.now() - new Date(opp.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysOld < 7) {
          relevanceScore += 10;
        }

        return { ...opp, relevanceScore };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Collect user feedback
   */
  private async collectFeedback(
    context: MagicianContext,
    params: {
      feedbackType: string;
      rating?: number;
      comment?: string;
      category?: string;
    }
  ): Promise<any> {
    try {
      const { feedbackType, rating, comment, category } = params;

      // In production, this would store feedback in database
      const feedback = {
        id: `feedback_${Date.now()}`,
        userId: context.userId,
        type: feedbackType,
        rating,
        comment,
        category,
        timestamp: new Date(),
      };

      console.log('[Community Concierge] Feedback collected:', feedback);

      this.logAction(
        'feedback',
        'collect_feedback',
        { feedbackType, category },
        true,
        context.userId
      );

      // Coordinate with Analytics Oracle to aggregate feedback
      await this.coordinateWith({
        fromMagician: this.magicianId,
        toMagician: 'analytics_oracle',
        requestType: 'record_feedback',
        payload: feedback,
        priority: 'low',
      });

      return {
        success: true,
        message: 'Thank you for your feedback! It helps us improve the platform.',
        feedbackId: feedback.id,
      };
    } catch (error) {
      this.logAction(
        'feedback',
        'collect_feedback',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to collect feedback',
      };
    }
  }

  /**
   * Search FAQ database
   */
  private async searchFAQ(
    context: MagicianContext,
    params: { query: string; category?: string }
  ): Promise<any> {
    try {
      const { query, category } = params;
      const queryLower = query.toLowerCase();

      let results = this.faqDatabase;

      // Filter by category if provided
      if (category) {
        results = results.filter(faq => faq.category === category);
      }

      // Simple keyword matching
      const matches = results
        .map(faq => {
          const questionMatch = faq.question.toLowerCase().includes(queryLower);
          const tagMatch = faq.tags.some(tag => tag.toLowerCase().includes(queryLower));
          const score = questionMatch ? 2 : tagMatch ? 1 : 0;
          
          return { ...faq, score };
        })
        .filter(faq => faq.score > 0)
        .sort((a, b) => b.score - a.score);

      this.logAction(
        'search',
        'search_faq',
        { query, category, matches: matches.length },
        true,
        context.userId
      );

      return {
        success: true,
        query,
        matches,
        total: matches.length,
      };
    } catch (error) {
      this.logAction(
        'search',
        'search_faq',
        params,
        false,
        context.userId,
        error instanceof Error ? error.message : 'Unknown error'
      );

      return {
        success: false,
        error: 'Failed to search FAQ',
      };
    }
  }
}

export default new CommunityConciergeMagician();
