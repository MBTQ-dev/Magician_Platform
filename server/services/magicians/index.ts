/**
 * 360 Magicians Index
 * 
 * Central export point for all Magician services
 */

export { BaseMagician, MagicianContext, MagicianAction, MagicianCoordinationRequest } from './BaseMagician';
export { GatekeeperMagician } from './GatekeeperMagician';
export { ReputationTrackerMagician } from './ReputationTrackerMagician';
export { WorkflowAutomatorMagician } from './WorkflowAutomatorMagician';
export { CommunityConciergeMagician } from './CommunityConciergeMagician';

import GatekeeperMagician from './GatekeeperMagician';
import ReputationTrackerMagician from './ReputationTrackerMagician';
import WorkflowAutomatorMagician from './WorkflowAutomatorMagician';
import CommunityConciergeMagician from './CommunityConciergeMagician';

/**
 * Magician Registry
 * 
 * Central registry of all active Magicians
 */
export const MagicianRegistry = {
  gatekeeper: GatekeeperMagician,
  reputation_tracker: ReputationTrackerMagician,
  workflow_automator: WorkflowAutomatorMagician,
  community_concierge: CommunityConciergeMagician,
  // Future Magicians will be added here:
  // content_curator: ContentCuratorMagician,
  // safety_monitor: SafetyMonitorMagician,
  // opportunity_scout: OpportunityScoutMagician,
  // analytics_oracle: AnalyticsOracleMagician,
  // governance_facilitator: GovernanceFacilitatorMagician,
};

/**
 * Get a Magician by ID
 */
export function getMagician(magicianId: string) {
  return MagicianRegistry[magicianId as keyof typeof MagicianRegistry];
}

/**
 * Get all active Magicians
 */
export function getAllMagicians() {
  return Object.values(MagicianRegistry);
}

/**
 * Get Magician info for all active Magicians
 */
export function getMagiciansInfo() {
  return getAllMagicians().map(magician => magician.getInfo());
}

export default MagicianRegistry;
