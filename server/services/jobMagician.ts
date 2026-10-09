/**
 * Job Magician Service
 * Provides resume building, job matching, and career development for deaf job seekers
 * Part of the 360 Magicians platform for VR4deaf organizations
 */

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  certifications: string[];
  accommodations?: string[];
  vrCounselorContact?: VRCounselorContact;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  videoPhone?: string;
  city: string;
  state: string;
  linkedin?: string;
  portfolio?: string;
}

export interface WorkExperience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
  gpa?: string;
  honors?: string[];
}

export interface VRCounselorContact {
  name: string;
  agency: string;
  email: string;
  phone: string;
}

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  accessibilityFeatures: string[];
  accommodationsOffered: string[];
  deafFriendlyRating: number;
}

export interface CareerPath {
  currentRole: string;
  targetRole: string;
  steps: CareerStep[];
  estimatedTimeline: string;
  resources: string[];
}

export interface CareerStep {
  title: string;
  description: string;
  skills: string[];
  certifications?: string[];
  estimatedTime: string;
}

export class JobMagicianService {
  
  /**
   * Build an accessible resume with deaf-friendly features
   */
  async buildResume(data: ResumeData): Promise<{
    html: string;
    plainText: string;
    atsOptimized: string;
    aslVideoScript: string;
    accessibilityFeatures: string[];
  }> {
    const html = this.generateHTMLResume(data);
    const plainText = this.generatePlainTextResume(data);
    const atsOptimized = this.generateATSResume(data);
    const aslVideoScript = this.generateASLVideoScript(data);

    return {
      html,
      plainText,
      atsOptimized,
      aslVideoScript,
      accessibilityFeatures: [
        "Clear heading structure for screen readers",
        "High contrast color scheme",
        "Readable font size (minimum 12pt)",
        "Simple, clean layout for easy parsing",
        "Optional video phone number included",
        "VR counselor contact available if applicable"
      ]
    };
  }

  /**
   * Generate HTML resume
   */
  private generateHTMLResume(data: ResumeData): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.personalInfo.fullName} - Resume</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #2563EB; padding-bottom: 10px; }
    h2 { color: #2563EB; margin-top: 20px; }
    .contact { margin-bottom: 20px; }
    .contact a { color: #2563EB; }
    .experience, .education { margin-bottom: 15px; }
    .skills { display: flex; flex-wrap: wrap; gap: 10px; }
    .skill { background: #E5E7EB; padding: 5px 10px; border-radius: 5px; }
  </style>
</head>
<body>
  <header>
    <h1>${data.personalInfo.fullName}</h1>
    <div class="contact">
      <p>${data.personalInfo.city}, ${data.personalInfo.state}</p>
      <p>Email: <a href="mailto:${data.personalInfo.email}">${data.personalInfo.email}</a></p>
      ${data.personalInfo.phone ? `<p>Phone: ${data.personalInfo.phone}</p>` : ''}
      ${data.personalInfo.videoPhone ? `<p>Video Phone: ${data.personalInfo.videoPhone}</p>` : ''}
      ${data.personalInfo.linkedin ? `<p>LinkedIn: <a href="${data.personalInfo.linkedin}">${data.personalInfo.linkedin}</a></p>` : ''}
    </div>
  </header>

  <section>
    <h2>Professional Summary</h2>
    <p>${data.summary}</p>
  </section>

  <section>
    <h2>Experience</h2>
    ${data.experience.map(exp => `
      <div class="experience">
        <h3>${exp.title}</h3>
        <p><strong>${exp.company}</strong> | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</p>
        <ul>
          ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
        </ul>
      </div>
    `).join('')}
  </section>

  <section>
    <h2>Education</h2>
    ${data.education.map(edu => `
      <div class="education">
        <h3>${edu.degree} in ${edu.field}</h3>
        <p>${edu.institution} | ${edu.graduationDate}</p>
      </div>
    `).join('')}
  </section>

  <section>
    <h2>Skills</h2>
    <div class="skills">
      ${data.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
    </div>
  </section>
</body>
</html>`;
  }

  /**
   * Generate plain text resume for ATS systems
   */
  private generatePlainTextResume(data: ResumeData): string {
    let resume = `${data.personalInfo.fullName.toUpperCase()}
${data.personalInfo.city}, ${data.personalInfo.state}
Email: ${data.personalInfo.email}
Phone: ${data.personalInfo.phone}
${data.personalInfo.videoPhone ? `Video Phone: ${data.personalInfo.videoPhone}` : ''}

PROFESSIONAL SUMMARY
${data.summary}

EXPERIENCE
${data.experience.map(exp => `
${exp.title}
${exp.company} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
${exp.achievements.map(a => `• ${a}`).join('\n')}
`).join('\n')}

EDUCATION
${data.education.map(edu => `
${edu.degree} in ${edu.field}
${edu.institution} | ${edu.graduationDate}
`).join('\n')}

SKILLS
${data.skills.join(', ')}
`;

    if (data.certifications.length > 0) {
      resume += `\nCERTIFICATIONS\n${data.certifications.join('\n')}`;
    }

    return resume;
  }

  /**
   * Generate ATS-optimized resume
   */
  private generateATSResume(data: ResumeData): string {
    // ATS systems prefer simple formatting
    return this.generatePlainTextResume(data);
  }

  /**
   * Generate script for ASL video resume
   */
  private generateASLVideoScript(data: ResumeData): string {
    return `
ASL VIDEO RESUME SCRIPT
=======================

INTRODUCTION (15-20 seconds)
- Sign: Hello, my name is ${data.personalInfo.fullName}
- Sign: I'm looking for opportunities in [target field]
- Sign: I'm from ${data.personalInfo.city}, ${data.personalInfo.state}

PROFESSIONAL SUMMARY (30-45 seconds)
${data.summary}
(Keep signing natural, not word-for-word English)

TOP SKILLS (20-30 seconds)
Highlight 3-5 key skills:
${data.skills.slice(0, 5).map(s => `- ${s}`).join('\n')}

EXPERIENCE HIGHLIGHTS (45-60 seconds)
Focus on most relevant position:
- Company: ${data.experience[0]?.company || '[Company]'}
- Role: ${data.experience[0]?.title || '[Title]'}
- Key achievement: ${data.experience[0]?.achievements[0] || '[Achievement]'}

EDUCATION (15-20 seconds)
- ${data.education[0]?.degree || 'Degree'} from ${data.education[0]?.institution || 'Institution'}

CLOSING (10-15 seconds)
- Thank you for watching
- I'm excited about this opportunity
- Contact information on screen

PRODUCTION NOTES:
- Total length: 2-3 minutes
- Dress professionally
- Use solid, contrasting background
- Ensure good lighting on face and hands
- Keep signing space visible
- Add captions for accessibility
`;
  }

  /**
   * Find job matches based on resume and preferences
   */
  async findJobMatches(
    resume: ResumeData,
    preferences: {
      desiredRoles: string[];
      locations: string[];
      remote: boolean;
      salaryMin?: number;
      accommodationsNeeded: string[];
    }
  ): Promise<JobMatch[]> {
    // This would integrate with job APIs
    const mockMatches: JobMatch[] = [
      {
        id: "job-1",
        title: "Senior Software Developer",
        company: "Accessible Tech Inc",
        location: "Remote",
        salary: "$120,000 - $150,000",
        matchScore: 95,
        accessibilityFeatures: [
          "Visual communication tools",
          "Slack/Teams for messaging",
          "Captioned video calls"
        ],
        accommodationsOffered: [
          "Video phone reimbursement",
          "ASL interpreter for meetings",
          "Flexible work hours"
        ],
        deafFriendlyRating: 5
      },
      {
        id: "job-2",
        title: "UX Designer",
        company: "Inclusive Design Co",
        location: preferences.locations[0] || "Remote",
        salary: "$90,000 - $110,000",
        matchScore: 88,
        accessibilityFeatures: [
          "Visual-first communication",
          "Written documentation culture"
        ],
        accommodationsOffered: [
          "CART services",
          "Flexible deadlines for captioned content"
        ],
        deafFriendlyRating: 4
      }
    ];

    return mockMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Generate career development path
   */
  async generateCareerPath(
    currentRole: string,
    targetRole: string,
    currentSkills: string[],
    yearsExperience: number
  ): Promise<CareerPath> {
    const steps: CareerStep[] = [
      {
        title: "Skill Assessment & Gap Analysis",
        description: "Identify skills needed for target role",
        skills: ["Self-assessment", "Research", "Goal setting"],
        estimatedTime: "2 weeks"
      },
      {
        title: "Skill Development",
        description: "Build required competencies through courses and practice",
        skills: this.identifySkillGaps(currentSkills, targetRole),
        certifications: this.suggestCertifications(targetRole),
        estimatedTime: "3-6 months"
      },
      {
        title: "Portfolio & Experience Building",
        description: "Create projects that demonstrate new skills",
        skills: ["Project management", "Documentation"],
        estimatedTime: "2-3 months"
      },
      {
        title: "Network & Job Search",
        description: "Connect with deaf professionals in target field",
        skills: ["Networking", "Interview preparation"],
        estimatedTime: "1-3 months"
      }
    ];

    return {
      currentRole,
      targetRole,
      steps,
      estimatedTimeline: "6-12 months",
      resources: [
        "National Deaf Business Institute (NDBI)",
        "Deaf Professional Network",
        "State VR Agency training programs",
        "LinkedIn Learning (with captions)",
        "Coursera accessible courses"
      ]
    };
  }

  /**
   * Identify skill gaps for target role
   */
  private identifySkillGaps(currentSkills: string[], targetRole: string): string[] {
    const roleSkills: Record<string, string[]> = {
      "software developer": ["JavaScript", "Python", "Git", "APIs", "Databases"],
      "ux designer": ["Figma", "User Research", "Prototyping", "Accessibility"],
      "project manager": ["Agile", "Scrum", "Communication", "Risk Management"],
      "data analyst": ["SQL", "Python", "Visualization", "Statistics"]
    };

    const targetSkills = roleSkills[targetRole.toLowerCase()] || [];
    return targetSkills.filter(s => 
      !currentSkills.some(cs => cs.toLowerCase().includes(s.toLowerCase()))
    );
  }

  /**
   * Suggest certifications for target role
   */
  private suggestCertifications(targetRole: string): string[] {
    const certifications: Record<string, string[]> = {
      "software developer": ["AWS Certified", "Google Cloud Professional", "Meta Front-End Developer"],
      "ux designer": ["Google UX Design Certificate", "Nielsen Norman Certification"],
      "project manager": ["PMP", "Scrum Master", "Google Project Management"],
      "data analyst": ["Google Data Analytics", "IBM Data Science Professional"]
    };

    return certifications[targetRole.toLowerCase()] || [];
  }

  /**
   * Prepare for interview with deaf-specific considerations
   */
  async prepareForInterview(
    jobTitle: string,
    company: string,
    interviewType: "video" | "in-person" | "phone"
  ): Promise<{
    commonQuestions: Array<{question: string; suggestedAnswer: string}>;
    accommodationRequests: string[];
    tips: string[];
    aslPracticeNotes: string[];
  }> {
    const commonQuestions = [
      {
        question: "Tell me about yourself",
        suggestedAnswer: `I'm a ${jobTitle} with [X] years of experience. I'm passionate about [area] and have accomplished [achievement]. I'm excited about this role because [reason].`
      },
      {
        question: "Why do you want to work here?",
        suggestedAnswer: `I'm drawn to ${company} because of your commitment to [value/mission]. I've researched your recent [project/initiative] and it aligns with my experience in [area].`
      },
      {
        question: "How do you handle communication in a team?",
        suggestedAnswer: "I'm highly effective at written communication and visual collaboration tools. I use email, Slack, and shared documents extensively. For real-time discussions, I typically use video calls with captions or ASL interpreters."
      }
    ];

    const accommodationRequests = [
      interviewType === "video" ? "Request CART or ASL interpreter for video interview" : "",
      interviewType === "in-person" ? "Request ASL interpreter or CART for in-person interview" : "",
      "Ask about their experience working with deaf employees",
      "Inquire about captioning on internal video calls",
      "Request interview questions in advance if helpful"
    ].filter(Boolean);

    const tips = [
      "Test video/audio setup before interview",
      "Ensure good lighting on face and hands if using ASL",
      "Have backup communication method ready",
      "Research company's accessibility initiatives",
      "Prepare questions about team communication practices",
      "Practice with interpreter beforehand if using one"
    ];

    const aslPracticeNotes = [
      "Practice introducing yourself smoothly",
      "Prepare signs for technical terms in your field",
      "Consider cultural differences in interview formality",
      "Practice maintaining eye contact appropriately"
    ];

    return {
      commonQuestions,
      accommodationRequests,
      tips,
      aslPracticeNotes
    };
  }
}

// Export singleton instance
export const jobMagician = new JobMagicianService();
