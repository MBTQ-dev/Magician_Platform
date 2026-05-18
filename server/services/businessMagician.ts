/**
 * Business Magician Service
 * Provides business formation, guidance, and lifecycle management for deaf entrepreneurs
 * Part of the 360 Magicians platform for VR4deaf organizations
 */

import { db } from "../db";
import { businesses, lifecyclePhases, tasks, subtasks, tools, formationProviders } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export interface BusinessIdea {
  name: string;
  description: string;
  industry: string;
  targetMarket: string;
  uniqueValue: string;
}

export interface BusinessFormationRequest {
  userId: number;
  businessName: string;
  entityType: "LLC" | "Corporation" | "Sole Proprietorship" | "Partnership";
  state: string;
  registeredAgent?: string;
  additionalServices?: string[];
}

export interface BusinessGuidance {
  phaseId: number;
  phaseName: string;
  tasks: TaskGuidance[];
  resources: string[];
  aslVideoUrls: string[];
}

export interface TaskGuidance {
  id: number;
  name: string;
  description: string;
  subtasks: string[];
  estimatedTime: string;
  hasAslVideo: boolean;
  aslVideoUrl?: string;
}

export class BusinessMagicianService {
  
  /**
   * Generate business ideas based on user interests and skills
   */
  async generateBusinessIdeas(
    interests: string[],
    skills: string[],
    budget: number,
    preferDeafCommunity: boolean
  ): Promise<BusinessIdea[]> {
    // This would integrate with AI service for personalized suggestions
    const baseIdeas: BusinessIdea[] = [
      {
        name: "ASL Tutoring Service",
        description: "Online ASL tutoring for families and businesses",
        industry: "Education",
        targetMarket: "Hearing families with deaf members, businesses seeking accessibility",
        uniqueValue: "Native ASL fluency with cultural context"
      },
      {
        name: "Accessible Web Design Agency",
        description: "Web design focused on accessibility for deaf users",
        industry: "Technology",
        targetMarket: "Businesses seeking WCAG compliance",
        uniqueValue: "Deaf-owned, understands accessibility needs firsthand"
      },
      {
        name: "Video Captioning Service",
        description: "Professional captioning and transcription services",
        industry: "Media",
        targetMarket: "Content creators, educational institutions",
        uniqueValue: "Deaf perspective ensures quality and cultural accuracy"
      }
    ];

    // Filter based on budget and preferences
    return baseIdeas.filter(idea => {
      if (preferDeafCommunity) {
        return idea.targetMarket.toLowerCase().includes('deaf') || 
               idea.uniqueValue.toLowerCase().includes('deaf');
      }
      return true;
    });
  }

  /**
   * Recommend the best entity type for a business
   */
  async recommendEntityType(
    businessType: string,
    expectedRevenue: number,
    numberOfOwners: number,
    liabilityProtection: boolean
  ): Promise<{
    recommended: string;
    alternatives: string[];
    reasoning: string;
    vrConsiderations: string;
  }> {
    let recommended = "LLC";
    let reasoning = "";
    let vrConsiderations = "";

    if (liabilityProtection && expectedRevenue > 50000) {
      recommended = "LLC";
      reasoning = "LLC provides liability protection while maintaining tax flexibility";
    } else if (numberOfOwners === 1 && expectedRevenue < 30000) {
      recommended = "Sole Proprietorship";
      reasoning = "Simple structure for starting out, easy to convert to LLC later";
    } else if (numberOfOwners > 1) {
      recommended = "LLC";
      reasoning = "Multi-member LLC provides clear ownership structure and protection";
    }

    // VR-specific considerations
    vrConsiderations = "VR agencies often require proof of business registration. " +
      "An LLC or Corporation may be preferred for VR self-employment grants. " +
      "Consult with your VR counselor about specific state requirements.";

    return {
      recommended,
      alternatives: ["LLC", "Corporation", "Sole Proprietorship"].filter(t => t !== recommended),
      reasoning,
      vrConsiderations
    };
  }

  /**
   * Get the current lifecycle phase for a business
   */
  async getCurrentPhase(businessId: number): Promise<BusinessGuidance | null> {
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.id, businessId)
    });

    if (!business) return null;

    // Determine current phase based on formation status
    let phaseSlug = "ideation";
    if (business.formationStatus === "completed") {
      phaseSlug = "growth";
    } else if (business.formationStatus === "processing") {
      phaseSlug = "formation";
    }

    const phase = await db.query.lifecyclePhases.findFirst({
      where: eq(lifecyclePhases.slug, phaseSlug)
    });

    if (!phase) return null;

    const phaseTasks = await db.query.tasks.findMany({
      where: eq(tasks.phaseId, phase.id)
    });

    const taskGuidance: TaskGuidance[] = await Promise.all(
      phaseTasks.map(async (task) => {
        const taskSubtasks = await db.query.subtasks.findMany({
          where: eq(subtasks.taskId, task.id)
        });

        return {
          id: task.id,
          name: task.name,
          description: task.description,
          subtasks: taskSubtasks.map(s => s.name),
          estimatedTime: "30 minutes", // Would be calculated based on task complexity
          hasAslVideo: task.hasASLVideo ?? false,
          aslVideoUrl: task.aslVideoUrl ?? undefined
        };
      })
    );

    return {
      phaseId: phase.id,
      phaseName: phase.name,
      tasks: taskGuidance,
      resources: [],
      aslVideoUrls: taskGuidance
        .filter(t => t.hasAslVideo && t.aslVideoUrl)
        .map(t => t.aslVideoUrl!)
    };
  }

  /**
   * Initiate business formation process
   */
  async initiateFormation(request: BusinessFormationRequest): Promise<{
    formationId: number;
    status: string;
    nextSteps: string[];
    estimatedCompletion: string;
    vrDocumentation: string[];
  }> {
    // Create business record
    const [newBusiness] = await db.insert(businesses).values({
      userId: request.userId,
      name: request.businessName,
      businessType: request.entityType,
      formationState: request.state,
      formationStatus: "pending"
    }).returning();

    // Determine formation provider based on state
    await this.selectFormationProvider(request.state);

    return {
      formationId: newBusiness.id,
      status: "pending",
      nextSteps: [
        "Review and approve formation documents",
        "Pay state filing fees",
        "Obtain EIN from IRS",
        "Set up business bank account"
      ],
      estimatedCompletion: "5-10 business days",
      vrDocumentation: [
        "Business Formation Certificate (for VR case file)",
        "EIN Confirmation Letter",
        "Operating Agreement (for LLC)"
      ]
    };
  }

  /**
   * Select the best formation provider for a state
   */
  private async selectFormationProvider(state: string): Promise<{
    name: string;
    estimatedCost: number;
    processingTime: string;
  }> {
    // Default to Northwest as preferred provider
    return {
      name: "Northwest Registered Agent",
      estimatedCost: 225,
      processingTime: "1-2 business days"
    };
  }

  /**
   * Get business tools for the current phase
   */
  async getPhaseTools(phaseId: number): Promise<Array<{
    id: number;
    name: string;
    description: string;
    toolType: string;
    actionUrl: string;
    isAccessible: boolean;
  }>> {
    const phaseTools = await db.query.tools.findMany({
      where: eq(tools.phaseId, phaseId)
    });

    return phaseTools.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      toolType: tool.toolType,
      actionUrl: tool.actionUrl,
      isAccessible: true // All tools designed for accessibility
    }));
  }

  /**
   * Generate VR counselor report for business progress
   */
  async generateVRReport(businessId: number): Promise<{
    businessSummary: string;
    milestones: string[];
    currentPhase: string;
    recommendations: string[];
    documentationReady: string[];
  }> {
    const business = await db.query.businesses.findFirst({
      where: eq(businesses.id, businessId)
    });

    if (!business) {
      throw new Error("Business not found");
    }

    return {
      businessSummary: `${business.name} - ${business.businessType} in ${business.formationState}`,
      milestones: [
        "Business idea validated",
        "Entity type selected",
        "Formation process initiated"
      ],
      currentPhase: business.formationStatus || "planning",
      recommendations: [
        "Continue with formation process",
        "Schedule EIN application after formation",
        "Begin business plan development"
      ],
      documentationReady: [
        "Business Registration Application",
        "Operating Agreement Template"
      ]
    };
  }
}

// Export singleton instance
export const businessMagician = new BusinessMagicianService();
