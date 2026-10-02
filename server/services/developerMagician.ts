/**
 * Developer Magician Service
 * Provides code scaffolding, tech recommendations, and development tools
 * Part of the 360 Magicians platform for VR4deaf organizations
 */

export interface ProjectScaffold {
  name: string;
  type: string;
  framework: string;
  features: string[];
  accessibilityFeatures: string[];
}

export interface TechRecommendation {
  category: string;
  recommended: string;
  alternatives: string[];
  reasoning: string;
  accessibilityScore: number;
}

export interface CodeTemplate {
  name: string;
  language: string;
  description: string;
  code: string;
  accessiblePatterns: string[];
}

export class DeveloperMagicianService {
  
  /**
   * Generate project scaffold for accessibility-first development
   */
  async generateProjectScaffold(
    projectType: "web" | "mobile" | "api" | "desktop",
    preferredStack: string[],
    targetAudience: string
  ): Promise<ProjectScaffold> {
    const accessibilityFeatures = [
      "WCAG 2.1 AA compliant structure",
      "Keyboard navigation patterns",
      "Screen reader announcements",
      "High contrast mode support",
      "Focus management utilities",
      "Skip navigation links"
    ];

    let framework = "React + TypeScript";
    let features: string[] = [];

    switch (projectType) {
      case "web":
        framework = preferredStack.includes("vue") ? "Vue 3" : "React + TypeScript";
        features = [
          "Vite build system",
          "Tailwind CSS with accessible defaults",
          "React Aria components",
          "i18n support",
          "Dark mode with high contrast"
        ];
        break;
      case "mobile":
        framework = "React Native";
        features = [
          "Expo managed workflow",
          "Native accessibility APIs",
          "VoiceOver/TalkBack support",
          "Haptic feedback patterns"
        ];
        break;
      case "api":
        framework = "Express.js + TypeScript";
        features = [
          "OpenAPI documentation",
          "Rate limiting",
          "Request validation",
          "Error handling middleware",
          "CORS configuration"
        ];
        break;
      case "desktop":
        framework = "Electron + React";
        features = [
          "Native notifications",
          "Visual alerts for audio events",
          "System tray integration",
          "Auto-update support"
        ];
        break;
    }

    return {
      name: `${projectType}-project`,
      type: projectType,
      framework,
      features,
      accessibilityFeatures
    };
  }

  /**
   * Get technology recommendations for a project
   */
  async getTechRecommendations(
    requirements: string[],
    teamExperience: string[],
    budget: "low" | "medium" | "high"
  ): Promise<TechRecommendation[]> {
    const recommendations: TechRecommendation[] = [
      {
        category: "Frontend Framework",
        recommended: "React",
        alternatives: ["Vue", "Svelte", "Angular"],
        reasoning: "Large ecosystem of accessible component libraries (React Aria, Radix)",
        accessibilityScore: 95
      },
      {
        category: "Styling",
        recommended: "Tailwind CSS",
        alternatives: ["CSS Modules", "styled-components", "Emotion"],
        reasoning: "Built-in responsive design with easy customization for accessibility",
        accessibilityScore: 90
      },
      {
        category: "UI Components",
        recommended: "Radix UI / shadcn",
        alternatives: ["Chakra UI", "Material UI", "Ant Design"],
        reasoning: "Fully accessible primitives with unstyled options",
        accessibilityScore: 98
      },
      {
        category: "Backend",
        recommended: "Express.js",
        alternatives: ["Fastify", "Hono", "NestJS"],
        reasoning: "Flexible, well-documented, strong TypeScript support",
        accessibilityScore: 85
      },
      {
        category: "Database",
        recommended: "PostgreSQL with Drizzle ORM",
        alternatives: ["Prisma", "TypeORM", "Knex.js"],
        reasoning: "Type-safe queries with excellent schema management",
        accessibilityScore: 90
      },
      {
        category: "Testing",
        recommended: "Vitest + Testing Library",
        alternatives: ["Jest", "Playwright", "Cypress"],
        reasoning: "Built-in accessibility testing with jest-axe integration",
        accessibilityScore: 95
      }
    ];

    // Filter based on team experience
    return recommendations.filter(rec => {
      if (teamExperience.length === 0) return true;
      return teamExperience.some(exp => 
        rec.recommended.toLowerCase().includes(exp.toLowerCase()) ||
        rec.alternatives.some(alt => alt.toLowerCase().includes(exp.toLowerCase()))
      );
    });
  }

  /**
   * Generate accessible code templates
   */
  async getCodeTemplate(
    templateType: "modal" | "form" | "navigation" | "button" | "toast",
    framework: string
  ): Promise<CodeTemplate> {
    const templates: Record<string, CodeTemplate> = {
      modal: {
        name: "Accessible Modal Dialog",
        language: "TypeScript/React",
        description: "A fully accessible modal with focus trap and keyboard navigation",
        code: `
import * as Dialog from '@radix-ui/react-dialog';

export function AccessibleModal({ 
  title, 
  description, 
  children, 
  open, 
  onOpenChange 
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content 
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          aria-describedby="modal-description"
        >
          <Dialog.Title className="text-lg font-bold">
            {title}
          </Dialog.Title>
          <Dialog.Description id="modal-description">
            {description}
          </Dialog.Description>
          {children}
          <Dialog.Close asChild>
            <button aria-label="Close dialog">×</button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`,
        accessiblePatterns: [
          "Focus trap",
          "Escape key closes",
          "ARIA labels",
          "Proper role attributes"
        ]
      },
      form: {
        name: "Accessible Form",
        language: "TypeScript/React",
        description: "Form with proper labeling, error handling, and validation",
        code: `
import { useForm } from 'react-hook-form';

export function AccessibleForm({ onSubmit }: FormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="field-group">
        <label htmlFor="email" className="block font-medium">
          Email Address
          <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-red-500">
            {errors.email.message}
          </p>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}`,
        accessiblePatterns: [
          "Proper label association",
          "Error announcements",
          "Required field indication",
          "ARIA attributes"
        ]
      },
      navigation: {
        name: "Accessible Navigation",
        language: "TypeScript/React",
        description: "Skip link and landmark navigation",
        code: `
export function AccessibleNav({ items }: NavProps) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only">
        Skip to main content
      </a>
      <nav aria-label="Main navigation">
        <ul>
          {items.map(item => (
            <li key={item.href}>
              <a 
                href={item.href}
                aria-current={item.isCurrent ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}`,
        accessiblePatterns: [
          "Skip links",
          "Landmark roles",
          "Current page indication",
          "Keyboard navigation"
        ]
      },
      button: {
        name: "Accessible Button",
        language: "TypeScript/React",
        description: "Button with loading states and proper announcements",
        code: `
export function AccessibleButton({ 
  children, 
  loading, 
  disabled, 
  onClick 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span className="sr-only">Loading...</span>
          <span aria-hidden="true">⏳</span>
        </>
      ) : children}
    </button>
  );
}`,
        accessiblePatterns: [
          "Loading state announcement",
          "Disabled state handling",
          "Screen reader text"
        ]
      },
      toast: {
        name: "Accessible Toast/Notification",
        language: "TypeScript/React",
        description: "Toast notifications with live region announcements",
        code: `
export function AccessibleToast({ message, type, visible }: ToastProps) {
  return (
    <div
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={visible ? 'visible' : 'sr-only'}
    >
      <span className="sr-only">
        {type === 'error' ? 'Error: ' : 'Notification: '}
      </span>
      {message}
    </div>
  );
}`,
        accessiblePatterns: [
          "Live region",
          "Assertive for errors",
          "Polite for info",
          "Contextual prefix"
        ]
      }
    };

    return templates[templateType] || templates.button;
  }

  /**
   * Review code for accessibility issues
   */
  async reviewAccessibility(code: string, language: string): Promise<{
    score: number;
    issues: Array<{
      severity: "error" | "warning" | "suggestion";
      message: string;
      fix?: string;
    }>;
    recommendations: string[];
  }> {
    // This would integrate with accessibility linting tools
    const issues: Array<{severity: "error" | "warning" | "suggestion"; message: string; fix?: string}> = [];
    const recommendations: string[] = [];

    // Basic pattern checking
    if (!code.includes('aria-') && !code.includes('role=')) {
      issues.push({
        severity: "warning",
        message: "No ARIA attributes detected. Consider adding appropriate roles and labels.",
        fix: "Add aria-label, aria-describedby, or role attributes as needed"
      });
    }

    if (code.includes('<img') && !code.includes('alt=')) {
      issues.push({
        severity: "error",
        message: "Images must have alt text",
        fix: "Add alt attribute to all <img> elements"
      });
    }

    if (code.includes('onClick') && !code.includes('onKeyDown') && !code.includes('<button')) {
      issues.push({
        severity: "warning",
        message: "Click handlers should be on buttons or have keyboard equivalents",
        fix: "Use <button> elements or add onKeyDown handlers"
      });
    }

    recommendations.push(
      "Consider using @testing-library/react with jest-axe for automated accessibility testing",
      "Test with screen readers (VoiceOver, NVDA, JAWS)",
      "Verify keyboard navigation works for all interactive elements"
    );

    const score = Math.max(0, 100 - (issues.filter(i => i.severity === 'error').length * 20) - 
                                     (issues.filter(i => i.severity === 'warning').length * 5));

    return { score, issues, recommendations };
  }
}

// Export singleton instance
export const developerMagician = new DeveloperMagicianService();
