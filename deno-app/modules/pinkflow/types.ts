/**
 * PinkFlow Module - Type Definitions
 */

export interface AccessibilityTest {
  url: string;
  standards: string[];
  includeWarnings?: boolean;
}

export interface AccessibilityResult {
  url: string;
  passed: boolean;
  violations: AccessibilityViolation[];
  warnings: AccessibilityViolation[];
  score: number;
  timestamp: string;
}

export interface AccessibilityViolation {
  id: string;
  impact: "critical" | "serious" | "moderate" | "minor";
  description: string;
  help: string;
  helpUrl?: string;
  nodes: {
    html: string;
    target: string[];
  }[];
}

export interface WorkflowTest {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  timeout?: number;
}

export interface WorkflowStep {
  action: "navigate" | "click" | "fill" | "wait" | "assert" | "screenshot";
  target?: string;
  value?: string;
  timeout?: number;
  expected?: string;
}

export interface WorkflowResult {
  name: string;
  passed: boolean;
  duration: number;
  steps: {
    step: WorkflowStep;
    passed: boolean;
    duration: number;
    error?: string;
    screenshot?: string;
  }[];
  error?: string;
  timestamp: string;
}

export interface ASLVideoTest {
  url: string;
  requiredDuration?: number;
  checkCaptions?: boolean;
  checkQuality?: boolean;
}

export interface ASLVideoResult {
  url: string;
  valid: boolean;
  duration: number;
  hasCaptions: boolean;
  quality: {
    resolution: string;
    framerate: number;
    bitrate: number;
  };
  issues: string[];
  timestamp: string;
}

export interface PerformanceTest {
  url: string;
  metrics: string[];
  iterations?: number;
}

export interface PerformanceResult {
  url: string;
  metrics: {
    name: string;
    value: number;
    unit: string;
  }[];
  timestamp: string;
}

export interface TestSuite {
  name: string;
  tests: (AccessibilityTest | WorkflowTest | ASLVideoTest | PerformanceTest)[];
}

export interface TestSuiteResult {
  name: string;
  passed: boolean;
  total: number;
  passed_count: number;
  failed_count: number;
  results: (AccessibilityResult | WorkflowResult | ASLVideoResult | PerformanceResult)[];
  duration: number;
  timestamp: string;
}
