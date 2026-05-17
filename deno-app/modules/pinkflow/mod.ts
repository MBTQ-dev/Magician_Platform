/**
 * PinkFlow Module - Main Exports
 */

// Export testing functions
export {
  generateAccessibilityReport,
  validateAccessibility,
  validateASLVideo,
} from "./testing.ts";

// Export validation functions
export {
  testPerformance,
  testRealtimeLatency,
  testWorkflow,
} from "./validation.ts";

// Export types
export type {
  AccessibilityResult,
  AccessibilityTest,
  AccessibilityViolation,
  ASLVideoResult,
  ASLVideoTest,
  PerformanceResult,
  PerformanceTest,
  TestSuite,
  TestSuiteResult,
  WorkflowResult,
  WorkflowStep,
  WorkflowTest,
} from "./types.ts";
