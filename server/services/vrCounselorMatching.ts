/**
 * VR Counselor Matching Service
 * Matches deaf clients with Vocational Rehabilitation counselors and manages relationships
 * Part of the 360 Magicians platform for VR4deaf organizations
 */

import { db } from "../db";
import { vrCounselors, userCounselors, users } from "../../shared/schema";
import { eq, and } from "drizzle-orm";

export interface CounselorProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  organization: string;
  specializations?: string[];
  languages?: string[];
  aslProficiency?: string;
  availability?: string;
  caseloadCapacity?: number;
}

export interface CounselorMatch {
  counselor: CounselorProfile;
  matchScore: number;
  matchReasons: string[];
  communicationPreference: string;
}

export interface ClientCounselorRelationship {
  id: number;
  userId: number;
  counselorId: number;
  startDate: Date;
  endDate?: Date;
  status: string;
  goals?: string[];
  progress?: ProgressUpdate[];
}

export interface ProgressUpdate {
  date: Date;
  milestone: string;
  notes: string;
  nextSteps: string[];
}

export interface VRDocumentation {
  type: string;
  title: string;
  content: string;
  dateGenerated: Date;
  forCounselor: boolean;
}

export class VRCounselorMatchingService {

  /**
   * Find matching counselors for a client
   */
  async findCounselorMatches(
    userId: number,
    preferences: {
      preferASL: boolean;
      location: string;
      specializations?: string[];
      availability?: string;
    }
  ): Promise<CounselorMatch[]> {
    const allCounselors = await db.query.vrCounselors.findMany();
    
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId)
    });

    if (!user) {
      throw new Error("User not found");
    }

    const matches: CounselorMatch[] = allCounselors.map(counselor => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Location matching - check for state abbreviation or full state name
      // Uses word boundary matching to avoid false positives (e.g., "CA" matching "CALIFORNIA" but not "CARDIAC")
      const locationLower = preferences.location.toLowerCase().trim();
      const orgLower = counselor.organization.toLowerCase();
      const locationRegex = new RegExp(`\\b${locationLower}\\b`, 'i');
      
      if (locationRegex.test(orgLower) || orgLower.includes(locationLower)) {
        score += 20;
        reasons.push("Located in your area");
      }

      // ASL proficiency (if user prefers ASL)
      if (preferences.preferASL) {
        score += 15;
        reasons.push("ASL communication available");
      }

      // Contact availability
      if (counselor.phone) {
        score += 5;
        reasons.push("Direct phone contact available");
      }

      return {
        counselor: {
          id: counselor.id,
          name: counselor.name,
          email: counselor.email,
          phone: counselor.phone ?? undefined,
          organization: counselor.organization
        },
        matchScore: Math.min(score, 100),
        matchReasons: reasons,
        communicationPreference: preferences.preferASL ? "ASL/Video" : "Written/Email"
      };
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Create a client-counselor relationship
   */
  async createRelationship(
    userId: number,
    counselorId: number,
    initialGoals?: string[]
  ): Promise<ClientCounselorRelationship> {
    const [relationship] = await db.insert(userCounselors).values({
      userId,
      counselorId,
      status: "active"
    }).returning();

    return {
      id: relationship.id,
      userId: relationship.userId,
      counselorId: relationship.counselorId,
      startDate: relationship.startDate ?? new Date(),
      status: relationship.status ?? "active",
      goals: initialGoals
    };
  }

  /**
   * Get current counselor for a user
   */
  async getCurrentCounselor(userId: number): Promise<CounselorProfile | null> {
    const relationship = await db.query.userCounselors.findFirst({
      where: and(
        eq(userCounselors.userId, userId),
        eq(userCounselors.status, "active")
      )
    });

    if (!relationship) return null;

    const counselor = await db.query.vrCounselors.findFirst({
      where: eq(vrCounselors.id, relationship.counselorId)
    });

    if (!counselor) return null;

    return {
      id: counselor.id,
      name: counselor.name,
      email: counselor.email,
      phone: counselor.phone ?? undefined,
      organization: counselor.organization
    };
  }

  /**
   * Generate documentation for VR counselor
   */
  generateVRDocumentation(
    clientName: string,
    businessInfo: {
      name: string;
      type: string;
      status: string;
      goals: string[];
    },
    documentType: "progress_report" | "iep_summary" | "goal_update" | "closure_report"
  ): VRDocumentation {
    const templates: Record<string, { title: string; content: string }> = {
      progress_report: {
        title: "Self-Employment Progress Report",
        content: `
VOCATIONAL REHABILITATION SELF-EMPLOYMENT PROGRESS REPORT

Client: ${clientName}
Date: ${new Date().toLocaleDateString()}
Business Name: ${businessInfo.name}
Business Type: ${businessInfo.type}
Current Status: ${businessInfo.status}

PROGRESS SUMMARY:
The client has made significant progress toward self-employment goals.
Current achievements include:
${businessInfo.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

NEXT STEPS:
- Continue business development activities
- Complete required training/certifications
- Establish business operations

ACCOMMODATIONS UTILIZED:
- ASL interpreter for training sessions
- Written communication for documentation
- Accessible technology tools

RECOMMENDATIONS:
Continue support for business formation and initial operations phase.

Submitted by: 360 Magicians Platform
        `
      },
      iep_summary: {
        title: "Individualized Employment Plan Summary",
        content: `
INDIVIDUALIZED EMPLOYMENT PLAN (IEP) SUMMARY

Client: ${clientName}
Date: ${new Date().toLocaleDateString()}

EMPLOYMENT GOAL:
Self-employment as owner/operator of ${businessInfo.name}

BUSINESS DETAILS:
- Business Type: ${businessInfo.type}
- Industry: To be determined based on market analysis
- Target Launch: Within 6-12 months

SERVICES TO BE PROVIDED:
1. Business planning assistance
2. Entity formation support
3. Financial literacy training
4. Marketing and branding guidance
5. Technology accessibility support

ACCOMMODATIONS:
- All services available in ASL
- Written documentation provided
- Visual learning materials
- Captioned video content

MILESTONES:
${businessInfo.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

Generated by: 360 Magicians Platform
        `
      },
      goal_update: {
        title: "Goal Update Summary",
        content: `
VR SELF-EMPLOYMENT GOAL UPDATE

Client: ${clientName}
Date: ${new Date().toLocaleDateString()}
Business: ${businessInfo.name}

CURRENT GOALS STATUS:
${businessInfo.goals.map((g, i) => `${i + 1}. ${g} - ${businessInfo.status}`).join('\n')}

BARRIERS ADDRESSED:
- Communication accessibility: Resolved through ASL resources
- Technical knowledge: Addressed through accessible training
- Business formation: Support provided through platform

CONTINUING SUPPORT NEEDED:
- Ongoing business mentorship
- Technology accommodations
- Marketing assistance

Generated by: 360 Magicians Platform
        `
      },
      closure_report: {
        title: "Successful Closure Report",
        content: `
VR CASE SUCCESSFUL CLOSURE REPORT

Client: ${clientName}
Date: ${new Date().toLocaleDateString()}

BUSINESS ESTABLISHED:
Name: ${businessInfo.name}
Type: ${businessInfo.type}
Status: Operational

GOALS ACHIEVED:
${businessInfo.goals.map((g, i) => `${i + 1}. ${g} - COMPLETED`).join('\n')}

OUTCOMES:
- Business successfully formed and registered
- Client operating independently
- Income generation documented

ACCOMMODATIONS PROVIDED:
- ASL interpretation services
- Accessible technology tools
- Written documentation support
- Visual learning materials

FOLLOW-UP RECOMMENDATIONS:
- Post-employment support as needed
- Ongoing accessibility resources
- Business mentorship connections

This case demonstrates successful achievement of self-employment goals.

Generated by: 360 Magicians Platform
        `
      }
    };

    const template = templates[documentType];
    return {
      type: documentType,
      title: template.title,
      content: template.content,
      dateGenerated: new Date(),
      forCounselor: true
    };
  }

  /**
   * Get communication guidelines for working with VR
   */
  getVRCommunicationGuidelines(): {
    bestPractices: string[];
    documentationTips: string[];
    meetingPreparation: string[];
    accommodationRequests: string[];
  } {
    return {
      bestPractices: [
        "Request ASL interpreter for all meetings if preferred",
        "Ask for written summaries of all decisions",
        "Keep copies of all signed documents",
        "Request video phone appointments when available",
        "Use email for non-urgent communications",
        "Document all verbal agreements in writing"
      ],
      documentationTips: [
        "Keep a folder for all VR-related documents",
        "Save copies of emails and correspondence",
        "Document progress toward goals monthly",
        "Take photos of completed milestones",
        "Keep receipts for all business expenses",
        "Maintain a log of VR services received"
      ],
      meetingPreparation: [
        "Request interpreter at least 48 hours in advance",
        "Prepare questions in advance",
        "Bring documentation of progress",
        "Review your IEP before meeting",
        "List any new accommodations needed",
        "Note any barriers you've encountered"
      ],
      accommodationRequests: [
        "ASL interpreter for meetings and training",
        "CART (real-time captioning) services",
        "Written materials in accessible formats",
        "Video phone capability for counselor",
        "Extended time for written assessments",
        "Visual aids for training materials",
        "Captioned videos for educational content",
        "Text-based communication options"
      ]
    };
  }

  /**
   * Get VR self-employment checklist
   */
  getSelfEmploymentChecklist(): {
    preApplication: string[];
    application: string[];
    planning: string[];
    implementation: string[];
    launch: string[];
  } {
    return {
      preApplication: [
        "Research VR self-employment services in your state",
        "Gather documentation of disability",
        "Prepare basic business idea description",
        "Identify potential barriers and accommodations",
        "Connect with deaf business mentors"
      ],
      application: [
        "Complete VR application",
        "Attend eligibility assessment",
        "Discuss self-employment goal with counselor",
        "Request accommodations for process",
        "Provide necessary documentation"
      ],
      planning: [
        "Work with counselor on IEP",
        "Develop business plan",
        "Identify training needs",
        "Research funding options",
        "Plan for accessibility in business"
      ],
      implementation: [
        "Complete required training",
        "Form business entity",
        "Set up business bank account",
        "Obtain necessary licenses",
        "Establish accessible systems"
      ],
      launch: [
        "Begin operations",
        "Document initial income",
        "Maintain VR progress reports",
        "Use approved accommodations",
        "Work toward successful closure"
      ]
    };
  }

  /**
   * Calculate eligibility indicators for VR self-employment
   */
  assessSelfEmploymentReadiness(
    skills: string[],
    experience: number,
    hasBusinessIdea: boolean,
    financialReadiness: "low" | "medium" | "high",
    supportSystem: "weak" | "moderate" | "strong"
  ): {
    readinessScore: number;
    strengths: string[];
    areasToAddress: string[];
    recommendations: string[];
    estimatedTimeline: string;
  } {
    let score = 0;
    const strengths: string[] = [];
    const areasToAddress: string[] = [];
    const recommendations: string[] = [];

    // Evaluate skills
    if (skills.length >= 5) {
      score += 20;
      strengths.push("Strong skill set");
    } else {
      areasToAddress.push("Develop additional business skills");
      recommendations.push("Consider VR-funded training programs");
    }

    // Evaluate experience
    if (experience >= 5) {
      score += 25;
      strengths.push("Significant industry experience");
    } else if (experience >= 2) {
      score += 15;
      strengths.push("Some relevant experience");
    } else {
      areasToAddress.push("Build industry experience");
      recommendations.push("Seek internship or mentorship opportunities");
    }

    // Evaluate business idea
    if (hasBusinessIdea) {
      score += 20;
      strengths.push("Clear business concept");
    } else {
      areasToAddress.push("Develop business idea");
      recommendations.push("Work with Business Magician to generate ideas");
    }

    // Evaluate financial readiness
    if (financialReadiness === "high") {
      score += 20;
      strengths.push("Financial stability");
    } else if (financialReadiness === "medium") {
      score += 10;
    } else {
      areasToAddress.push("Address financial preparation");
      recommendations.push("Explore VR funding for startup costs");
    }

    // Evaluate support system
    if (supportSystem === "strong") {
      score += 15;
      strengths.push("Strong support network");
    } else if (supportSystem === "moderate") {
      score += 8;
    } else {
      areasToAddress.push("Build support network");
      recommendations.push("Connect with deaf entrepreneur community");
    }

    // Determine timeline
    let timeline: string;
    if (score >= 80) {
      timeline = "6-9 months to business launch";
    } else if (score >= 60) {
      timeline = "9-12 months to business launch";
    } else if (score >= 40) {
      timeline = "12-18 months to business launch";
    } else {
      timeline = "18+ months - focus on preparation first";
    }

    return {
      readinessScore: score,
      strengths,
      areasToAddress,
      recommendations,
      estimatedTimeline: timeline
    };
  }
}

// Export singleton instance
export const vrCounselorMatching = new VRCounselorMatchingService();
