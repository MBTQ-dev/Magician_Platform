/**
 * Magician Services Configuration
 * 
 * Central configuration for all 8 Magician services in the platform.
 * This serves as the single source of truth for Magician service metadata.
 */

export const MAGICIAN_SERVICES = [
  {
    id: 'gatekeeper_magician',
    name: 'Gatekeeper Magician',
    capabilities: 6,
    description: 'Identity verification and access control',
    healthCheckPath: '/api/magicians/gatekeeper_magician',
  },
  {
    id: 'reputation_tracker_magician',
    name: 'Reputation Tracker',
    capabilities: 6,
    description: 'Fibonrose reputation scoring and badges',
    healthCheckPath: '/api/magicians/reputation_tracker_magician',
  },
  {
    id: 'workflow_automator_magician',
    name: 'Workflow Automator',
    capabilities: 7,
    description: 'Automated task execution and workflows',
    healthCheckPath: '/api/magicians/workflow_automator_magician',
  },
  {
    id: 'community_concierge_magician',
    name: 'Community Concierge',
    capabilities: 6,
    description: 'Question answering and resource discovery',
    healthCheckPath: '/api/magicians/community_concierge_magician',
  },
  {
    id: 'business_magician',
    name: 'Business Magician',
    capabilities: 8,
    description: 'Business planning and formation guidance',
    healthCheckPath: '/api/magicians/business_magician',
  },
  {
    id: 'developer_magician',
    name: 'Developer Magician',
    capabilities: 8,
    description: 'Project generation and code review',
    healthCheckPath: '/api/magicians/developer_magician',
  },
  {
    id: 'job_magician',
    name: 'Job Magician',
    capabilities: 8,
    description: 'Job matching and career support',
    healthCheckPath: '/api/magicians/job_magician',
  },
  {
    id: 'creative_magician',
    name: 'Creative Magician',
    capabilities: 8,
    description: 'ASL content and creative services',
    healthCheckPath: '/api/magicians/creative_magician',
  },
] as const;

export type MagicianServiceId = typeof MAGICIAN_SERVICES[number]['id'];

/**
 * Get Magician service by ID
 */
export function getMagicianById(id: MagicianServiceId) {
  return MAGICIAN_SERVICES.find(m => m.id === id);
}

/**
 * Get all Magician service IDs
 */
export function getAllMagicianIds(): MagicianServiceId[] {
  return MAGICIAN_SERVICES.map(m => m.id);
}

/**
 * Get total number of Magician services
 */
export function getMagicianCount(): number {
  return MAGICIAN_SERVICES.length;
}
