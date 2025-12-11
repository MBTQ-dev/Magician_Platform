/**
 * 360 Magicians API Routes
 * 
 * Provides HTTP endpoints for interacting with all Magicians
 */

import { Router } from 'express';
import MagicianRegistry from '../services/magicians';
import deafAuthService from '../services/deafAuthService';
import type { MagicianContext } from '../services/magicians/BaseMagician';

const router = Router();

/**
 * Helper: Extract MagicianContext from request
 */
async function getMagicianContext(req: any): Promise<MagicianContext> {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  let context: MagicianContext = {
    preferASL: false,
  };

  if (token) {
    const deafAuthToken = await deafAuthService.verifyToken(token);
    if (deafAuthToken) {
      context = {
        userId: deafAuthToken.userId,
        deafAuthToken: token,
        permissions: deafAuthToken.permissions,
        // These would be fetched from database in production
        isDeaf: false,
        preferASL: false,
        fibonroseScore: 150,
      };
    }
  }

  return context;
}

/**
 * GET /api/magicians
 * List all available Magicians
 */
router.get('/', async (req, res) => {
  try {
    const magicians = Object.values(MagicianRegistry).map(m => m.getInfo());
    
    res.json({
      success: true,
      magicians,
      total: magicians.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list Magicians',
    });
  }
});

/**
 * GET /api/magicians/:magicianId
 * Get info about a specific Magician
 */
router.get('/:magicianId', async (req, res) => {
  try {
    const { magicianId } = req.params;
    const magician = MagicianRegistry[magicianId as keyof typeof MagicianRegistry];
    
    if (!magician) {
      return res.status(404).json({
        success: false,
        error: 'Magician not found',
      });
    }

    const context = await getMagicianContext(req);
    
    res.json({
      success: true,
      magician: magician.getInfo(),
      recentActions: magician.getRecentActions(5),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get Magician info',
    });
  }
});

/**
 * POST /api/magicians/:magicianId/execute
 * Execute an action on a specific Magician
 */
router.post('/:magicianId/execute', async (req, res) => {
  try {
    const { magicianId } = req.params;
    const { action, params } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: 'Action is required',
      });
    }

    const magician = MagicianRegistry[magicianId as keyof typeof MagicianRegistry];
    
    if (!magician) {
      return res.status(404).json({
        success: false,
        error: 'Magician not found',
      });
    }

    const context = await getMagicianContext(req);
    const result = await magician.execute(action, context, params || {});

    res.json(result);
  } catch (error) {
    console.error('Magician execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute action',
    });
  }
});

/**
 * Gatekeeper-specific routes
 */

/**
 * POST /api/magicians/gatekeeper/welcome
 * Welcome a user to MBTQ
 */
router.post('/gatekeeper/welcome', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const result = await MagicianRegistry.gatekeeper.execute(
      'welcome_user',
      context,
      req.body
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to welcome user',
    });
  }
});

/**
 * POST /api/magicians/gatekeeper/login
 * Authenticate user credentials
 */
router.post('/gatekeeper/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required',
      });
    }

    const context = await getMagicianContext(req);
    const result = await MagicianRegistry.gatekeeper.execute(
      'verify_credentials',
      context,
      { username, password }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
    });
  }
});

/**
 * GET /api/magicians/gatekeeper/permissions
 * Get user's permissions
 */
router.get('/gatekeeper/permissions', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    
    if (!context.deafAuthToken) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const result = await MagicianRegistry.gatekeeper.execute(
      'explain_permissions',
      context,
      { appName: req.query.app as string }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve permissions',
    });
  }
});

/**
 * Reputation Tracker-specific routes
 */

/**
 * GET /api/magicians/reputation/score
 * Get user's Fibonrose score
 */
router.get('/reputation/score', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    
    if (!context.userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const result = await MagicianRegistry.reputation_tracker.execute(
      'view_score',
      context,
      { userId: context.userId }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve score',
    });
  }
});

/**
 * POST /api/magicians/reputation/contribution
 * Record a user contribution
 */
router.post('/reputation/contribution', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const { userId, contributionType, source, details } = req.body;

    if (!userId || !contributionType || !source) {
      return res.status(400).json({
        success: false,
        error: 'userId, contributionType, and source are required',
      });
    }

    const result = await MagicianRegistry.reputation_tracker.execute(
      'record_contribution',
      context,
      { userId, contributionType, source, details }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record contribution',
    });
  }
});

/**
 * GET /api/magicians/reputation/badges
 * Get user's badges
 */
router.get('/reputation/badges', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    
    if (!context.userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const result = await MagicianRegistry.reputation_tracker.execute(
      'check_badges',
      context,
      { userId: context.userId }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve badges',
    });
  }
});

/**
 * GET /api/magicians/reputation/leaderboard
 * Get reputation leaderboard
 */
router.get('/reputation/leaderboard', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string || 'overall';

    const result = await MagicianRegistry.reputation_tracker.execute(
      'leaderboard',
      context,
      { limit, category }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve leaderboard',
    });
  }
});

/**
 * Workflow Automator-specific routes
 */

/**
 * GET /api/magicians/workflow/recipes
 * List all workflow recipes
 */
router.get('/workflow/recipes', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const includeDisabled = req.query.includeDisabled === 'true';

    const result = await MagicianRegistry.workflow_automator.execute(
      'list_recipes',
      context,
      { includeDisabled }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to list recipes',
    });
  }
});

/**
 * POST /api/magicians/workflow/recipes
 * Create a new workflow recipe
 */
router.post('/workflow/recipes', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const { name, trigger, actions } = req.body;

    if (!name || !trigger || !actions) {
      return res.status(400).json({
        success: false,
        error: 'name, trigger, and actions are required',
      });
    }

    const result = await MagicianRegistry.workflow_automator.execute(
      'create_recipe',
      context,
      { name, trigger, actions }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create recipe',
    });
  }
});

/**
 * POST /api/magicians/workflow/execute
 * Execute a workflow recipe
 */
router.post('/workflow/execute', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const { recipeId, payload } = req.body;

    if (!recipeId) {
      return res.status(400).json({
        success: false,
        error: 'recipeId is required',
      });
    }

    const result = await MagicianRegistry.workflow_automator.execute(
      'execute_recipe',
      context,
      { recipeId, payload }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to execute recipe',
    });
  }
});

/**
 * GET /api/magicians/workflow/health
 * Check system health
 */
router.get('/workflow/health', async (req, res) => {
  try {
    const context = await getMagicianContext(req);
    const component = req.query.component as string;

    const result = await MagicianRegistry.workflow_automator.execute(
      'monitor_health',
      context,
      { component }
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check health',
    });
  }
});

export default router;
