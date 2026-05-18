/**
 * ASL Video Service
 * Provides ASL video content management, production guidance, and accessibility features
 * Part of the 360 Magicians platform for VR4deaf organizations
 */

import { db } from "../db";
import { aslVideos, aslDictionaryTerms } from "../../shared/schema";
import { eq, or, ilike } from "drizzle-orm";

export interface ASLVideo {
  id: number;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  phaseId?: number;
  taskId?: number;
  duration?: string;
  category?: string;
  signerId?: string;
  transcriptUrl?: string;
}

export interface DictionaryTerm {
  id: number;
  term: string;
  definition: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string;
  signHints?: string;
  importance: string;
  tags?: string[];
  relatedTerms?: string[];
}

export interface VideoProductionGuidelines {
  technical: TechnicalRequirements;
  performance: PerformanceGuidelines;
  accessibility: AccessibilityRequirements;
  branding: BrandingGuidelines;
}

export interface TechnicalRequirements {
  resolution: string;
  frameRate: string;
  codec: string;
  aspectRatio: string;
  duration: string;
  fileFormats: string[];
}

export interface PerformanceGuidelines {
  signerPosition: string;
  lighting: string;
  background: string;
  clothing: string;
  handVisibility: string;
  eyeContact: string;
}

export interface AccessibilityRequirements {
  captions: string;
  transcript: string;
  audioDescription: string;
  languageTag: string;
  playerRequirements: string[];
}

export interface BrandingGuidelines {
  intro: string;
  outro: string;
  logoPlacement: string;
  colorScheme: string;
}

export class ASLVideoService {

  /**
   * Get all ASL videos for a specific phase
   */
  async getVideosByPhase(phaseId: number): Promise<ASLVideo[]> {
    const videos = await db.query.aslVideos.findMany({
      where: eq(aslVideos.phaseId, phaseId)
    });

    return videos.map(v => ({
      id: v.id,
      title: v.title,
      description: v.description,
      videoUrl: v.videoUrl,
      thumbnail: v.thumbnail ?? undefined,
      phaseId: v.phaseId ?? undefined,
      taskId: v.taskId ?? undefined
    }));
  }

  /**
   * Get ASL video for a specific task
   */
  async getVideoByTask(taskId: number): Promise<ASLVideo | null> {
    const video = await db.query.aslVideos.findFirst({
      where: eq(aslVideos.taskId, taskId)
    });

    if (!video) return null;

    return {
      id: video.id,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail ?? undefined,
      taskId: video.taskId ?? undefined
    };
  }

  /**
   * Search dictionary terms
   */
  async searchDictionary(query: string): Promise<DictionaryTerm[]> {
    const terms = await db.query.aslDictionaryTerms.findMany({
      where: or(
        ilike(aslDictionaryTerms.term, `%${query}%`),
        ilike(aslDictionaryTerms.definition, `%${query}%`)
      )
    });

    return terms.map(t => ({
      id: t.id,
      term: t.term,
      definition: t.definition,
      category: t.category,
      videoUrl: t.videoUrl,
      thumbnailUrl: t.thumbnailUrl ?? undefined,
      signHints: t.signHints ?? undefined,
      importance: t.importance ?? "medium",
      tags: t.tags ?? undefined,
      relatedTerms: t.relatedTerms ?? undefined
    }));
  }

  /**
   * Get dictionary terms by category
   */
  async getDictionaryByCategory(category: string): Promise<DictionaryTerm[]> {
    const terms = await db.query.aslDictionaryTerms.findMany({
      where: eq(aslDictionaryTerms.category, category)
    });

    return terms.map(t => ({
      id: t.id,
      term: t.term,
      definition: t.definition,
      category: t.category,
      videoUrl: t.videoUrl,
      thumbnailUrl: t.thumbnailUrl ?? undefined,
      signHints: t.signHints ?? undefined,
      importance: t.importance ?? "medium",
      tags: t.tags ?? undefined,
      relatedTerms: t.relatedTerms ?? undefined
    }));
  }

  /**
   * Get video production guidelines
   */
  getProductionGuidelines(): VideoProductionGuidelines {
    return {
      technical: {
        resolution: "1920x1080 minimum, 3840x2160 (4K) preferred",
        frameRate: "30fps minimum, 60fps for complex signing",
        codec: "H.264 or H.265",
        aspectRatio: "16:9",
        duration: "30 seconds to 10 minutes depending on content",
        fileFormats: ["MP4", "WebM", "MOV"]
      },
      performance: {
        signerPosition: "Centered in frame, visible from waist up",
        lighting: "Even, diffused lighting from front; avoid harsh shadows on hands",
        background: "Solid color (blue, black, or green), contrasting with skin tone",
        clothing: "Solid colors, no patterns; avoid jewelry that may distract",
        handVisibility: "Full signing space visible; hands should never leave frame",
        eyeContact: "Direct eye contact with camera; natural glancing for emphasis"
      },
      accessibility: {
        captions: "Open or closed captions in English, synchronized with signing",
        transcript: "Full text transcript available for download",
        audioDescription: "Optional voice-over for hearing viewers",
        languageTag: "Mark as ASL (American Sign Language) in metadata",
        playerRequirements: [
          "Keyboard accessible controls",
          "Visible play/pause button",
          "Caption toggle",
          "Speed control",
          "Full-screen option"
        ]
      },
      branding: {
        intro: "2-3 second branded intro with logo",
        outro: "5-second outro with contact information and links",
        logoPlacement: "Lower right corner, semi-transparent",
        colorScheme: "Consistent with brand guidelines"
      }
    };
  }

  /**
   * Generate video script template
   */
  generateScriptTemplate(
    contentType: "tutorial" | "explanation" | "announcement" | "story",
    topic: string,
    duration: "short" | "medium" | "long"
  ): {
    structure: string[];
    tips: string[];
    exampleScript: string;
    timingGuide: Record<string, string>;
  } {
    const structures: Record<string, string[]> = {
      tutorial: [
        "Greeting and introduction",
        "Topic overview",
        "Step-by-step demonstration",
        "Key points recap",
        "Closing and call to action"
      ],
      explanation: [
        "Hook/attention grabber",
        "Context setting",
        "Main concept explanation",
        "Examples and applications",
        "Summary and key takeaways"
      ],
      announcement: [
        "Attention-getting opening",
        "Main announcement",
        "Key details (who, what, when, where)",
        "Call to action",
        "Sign-off"
      ],
      story: [
        "Introduction/hook",
        "Background/context",
        "Main narrative",
        "Climax/key moment",
        "Resolution/lesson learned",
        "Closing"
      ]
    };

    const durations: Record<string, Record<string, string>> = {
      short: {
        "Total length": "30-60 seconds",
        "Introduction": "5-10 seconds",
        "Main content": "20-40 seconds",
        "Closing": "5-10 seconds"
      },
      medium: {
        "Total length": "2-3 minutes",
        "Introduction": "15-20 seconds",
        "Main content": "90-120 seconds",
        "Closing": "15-20 seconds"
      },
      long: {
        "Total length": "5-10 minutes",
        "Introduction": "30-45 seconds",
        "Main content": "4-8 minutes",
        "Closing": "30-45 seconds"
      }
    };

    return {
      structure: structures[contentType],
      tips: [
        "Use natural ASL, not signed English",
        "Maintain consistent pace - not too fast for complex content",
        "Use facial expressions appropriately for grammar and emphasis",
        "Include visual aids or on-screen text for key terms",
        "Practice the full script before recording",
        "Consider cultural context and idioms"
      ],
      exampleScript: `
[INTRODUCTION]
Greeting: "Hello, I'm [Name]"
Topic: "Today I'll explain ${topic}"

[MAIN CONTENT]
Point 1: [First key point about ${topic}]
Point 2: [Second key point]
Point 3: [Third key point]
Example: [Practical example or demonstration]

[CLOSING]
Summary: "Remember these key points..."
Call to Action: "For more information, visit..."
Sign-off: "Thank you for watching"
`,
      timingGuide: durations[duration]
    };
  }

  /**
   * Quality check for video accessibility
   */
  assessVideoAccessibility(videoMetadata: {
    hasCaptions: boolean;
    hasTranscript: boolean;
    resolution: string;
    frameRate: number;
    hasAudioDescription: boolean;
    playerAccessible: boolean;
  }): {
    score: number;
    passed: string[];
    failed: string[];
    recommendations: string[];
  } {
    // Parse resolution to numeric value for proper comparison
    const resolutionValue = parseInt(videoMetadata.resolution.replace(/[^0-9]/g, ''), 10) || 0;
    
    const checks: Array<{name: string; passed: boolean; weight: number}> = [
      { name: "Captions available", passed: videoMetadata.hasCaptions, weight: 25 },
      { name: "Transcript available", passed: videoMetadata.hasTranscript, weight: 15 },
      { name: "Minimum resolution (1080p)", passed: resolutionValue >= 1080, weight: 15 },
      { name: "Minimum frame rate (30fps)", passed: videoMetadata.frameRate >= 30, weight: 15 },
      { name: "Audio description available", passed: videoMetadata.hasAudioDescription, weight: 10 },
      { name: "Accessible video player", passed: videoMetadata.playerAccessible, weight: 20 }
    ];

    const passed = checks.filter(c => c.passed).map(c => c.name);
    const failed = checks.filter(c => !c.passed).map(c => c.name);
    const score = checks.reduce((acc, c) => acc + (c.passed ? c.weight : 0), 0);

    const recommendations: string[] = [];
    if (!videoMetadata.hasCaptions) {
      recommendations.push("Add synchronized captions - this is essential for deaf viewers");
    }
    if (!videoMetadata.hasTranscript) {
      recommendations.push("Provide downloadable transcript for deaf-blind users");
    }
    if (videoMetadata.frameRate < 30) {
      recommendations.push("Increase frame rate for clearer signing visibility");
    }
    if (!videoMetadata.playerAccessible) {
      recommendations.push("Ensure video player has keyboard navigation and visible controls");
    }

    return { score, passed, failed, recommendations };
  }

  /**
   * Get signer requirements for video production
   */
  getSignerRequirements(): {
    qualifications: string[];
    preparation: string[];
    performance: string[];
    culturalConsiderations: string[];
  } {
    return {
      qualifications: [
        "Native or near-native ASL fluency",
        "Familiarity with the topic/content area",
        "Clear, expressive signing style",
        "Professional appearance and demeanor",
        "Comfortable with on-camera performance",
        "Understanding of deaf culture and community"
      ],
      preparation: [
        "Review script thoroughly before filming",
        "Research any technical or specialized vocabulary",
        "Practice transitions between concepts",
        "Coordinate with interpreter (if translating from English)",
        "Prepare appropriate clothing and remove distracting accessories"
      ],
      performance: [
        "Maintain consistent energy throughout recording",
        "Use natural pacing appropriate for content complexity",
        "Incorporate appropriate facial grammar",
        "Make direct eye contact with camera",
        "Keep signing within visible frame",
        "Pause appropriately for emphasis"
      ],
      culturalConsiderations: [
        "Use culturally appropriate greetings and closings",
        "Be aware of regional sign variations",
        "Consider audience diversity (educational level, age)",
        "Respect deaf cultural norms in presentation",
        "Avoid patronizing or simplified content"
      ]
    };
  }
}

// Export singleton instance
export const aslVideoService = new ASLVideoService();
