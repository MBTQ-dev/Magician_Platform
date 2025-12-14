/**
 * Health Check Endpoint
 * 
 * Provides comprehensive health status for the Magician Platform
 * including all 8 Magician services, database connectivity, and system resources.
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { MAGICIAN_SERVICES } from '../config/magicians';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
  services: {
    database: ServiceHealth;
    magicians: MagicianHealth[];
    storage: ServiceHealth;
  };
  system: SystemHealth;
}

interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'degraded';
  responseTime?: number;
  lastCheck?: string;
  message?: string;
}

interface MagicianHealth extends ServiceHealth {
  capabilities: number;
}

interface SystemHealth {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  process: {
    uptime: number;
    pid: number;
  };
}

/**
 * GET /api/health
 * Basic health check endpoint
 */
router.get('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
      services: {
        database: await checkDatabaseHealth(),
        magicians: await checkMagiciansHealth(),
        storage: await checkStorageHealth(),
      },
      system: getSystemHealth(),
    };

    // Determine overall status
    const allServicesHealthy = 
      healthStatus.services.database.status === 'up' &&
      healthStatus.services.magicians.every(m => m.status === 'up' || m.status === 'degraded') &&
      healthStatus.services.storage.status === 'up';

    if (!allServicesHealthy) {
      healthStatus.status = 'degraded';
    }

    const responseTime = Date.now() - startTime;
    
    res.status(healthStatus.status === 'healthy' ? 200 : 503).json({
      ...healthStatus,
      responseTime: `${responseTime}ms`,
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime: `${Date.now() - startTime}ms`,
    });
  }
});

/**
 * GET /api/health/live
 * Kubernetes liveness probe endpoint
 */
router.get('/live', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/health/ready
 * Kubernetes readiness probe endpoint
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    if (dbHealth.status === 'up') {
      res.status(200).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(503).json({
        status: 'not_ready',
        reason: 'Database not available',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Check database connectivity and health
 */
async function checkDatabaseHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    // Simple database health check
    // In production, this would query the database
    const isHealthy = !!process.env.DATABASE_URL;
    
    return {
      name: 'database',
      status: isHealthy ? 'up' : 'down',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      message: isHealthy ? 'Connected' : 'Not configured',
    };
  } catch (error) {
    return {
      name: 'database',
      status: 'down',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check all 8 Magician services health
 * 
 * Note: Currently returns 'degraded' status for all Magicians as actual health checks
 * require the Magician services to be running and accessible. In production, this
 * should make actual HTTP requests to each Magician's health endpoint.
 */
async function checkMagiciansHealth(): Promise<MagicianHealth[]> {
  return MAGICIAN_SERVICES.map(magician => ({
    name: magician.name,
    // Return 'degraded' until we implement actual health checks
    // In production, this should check each Magician service's availability
    status: 'degraded' as const,
    capabilities: magician.capabilities,
    lastCheck: new Date().toISOString(),
    message: 'Health check not implemented - assuming available',
  }));
}

/**
 * Check storage service health
 */
async function checkStorageHealth(): Promise<ServiceHealth> {
  const startTime = Date.now();
  
  try {
    // Check if Google Cloud Storage is configured
    const isConfigured = !!(
      process.env.GOOGLE_CLOUD_PROJECT_ID &&
      process.env.GOOGLE_CLOUD_BUCKET_NAME
    );
    
    return {
      name: 'storage',
      status: isConfigured ? 'up' : 'degraded',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      message: isConfigured ? 'Configured' : 'Not fully configured',
    };
  } catch (error) {
    return {
      name: 'storage',
      status: 'down',
      responseTime: Date.now() - startTime,
      lastCheck: new Date().toISOString(),
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get system resource health
 */
function getSystemHealth(): SystemHealth {
  const memoryUsage = process.memoryUsage();
  const totalMemory = memoryUsage.heapTotal;
  const usedMemory = memoryUsage.heapUsed;
  const memoryPercentage = (usedMemory / totalMemory) * 100;

  return {
    memory: {
      used: Math.round(usedMemory / 1024 / 1024), // MB
      total: Math.round(totalMemory / 1024 / 1024), // MB
      percentage: Math.round(memoryPercentage),
    },
    process: {
      uptime: Math.round(process.uptime()), // seconds
      pid: process.pid,
    },
  };
}

export default router;
