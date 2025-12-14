/**
 * Base Magician Abstract Class
 * 
 * Defines the core interface and shared functionality for all 360 Magicians.
 * Each Magician specializes in one domain but can coordinate with others.
 */

export interface MagicianContext {
  userId?: number;
  userProfile?: any;
  deafAuthToken?: string;
  fibonroseScore?: number;
  permissions?: string[];
  isDeaf?: boolean;
  preferASL?: boolean;
}

export interface MagicianAction {
  type: string;
  timestamp: Date;
  magicianId: string;
  userId?: number;
  action: string;
  details: any;
  success: boolean;
  error?: string;
}

export interface MagicianCoordinationRequest {
  fromMagician: string;
  toMagician: string;
  requestType: string;
  payload: any;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export abstract class BaseMagician {
  protected magicianId: string;
  protected magicianName: string;
  protected description: string;
  protected capabilities: string[];
  protected actionLog: MagicianAction[] = [];

  constructor(id: string, name: string, description: string, capabilities: string[]) {
    this.magicianId = id;
    this.magicianName = name;
    this.description = description;
    this.capabilities = capabilities;
  }

  /**
   * Core validation: Check if user has permission via DeafAuth
   */
  protected async validateDeafAuth(context: MagicianContext): Promise<boolean> {
    // TODO: Integrate with actual DeafAuth service
    if (!context.deafAuthToken) {
      return false;
    }
    return true;
  }

  /**
   * Core validation: Check user's Fibonrose score meets requirement
   */
  protected async validateFibonrose(
    context: MagicianContext,
    minimumScore: number
  ): Promise<boolean> {
    if (context.fibonroseScore === undefined) {
      return false;
    }
    return context.fibonroseScore >= minimumScore;
  }

  /**
   * Log action for transparency and audit trail
   */
  protected logAction(
    type: string,
    action: string,
    details: any,
    success: boolean,
    userId?: number,
    error?: string
  ): void {
    const actionRecord: MagicianAction = {
      type,
      timestamp: new Date(),
      magicianId: this.magicianId,
      userId,
      action,
      details,
      success,
      error,
    };
    
    this.actionLog.push(actionRecord);
    
    // In production, this would also persist to Fibonrose for reputation tracking
    console.log(`[${this.magicianName}] ${action}:`, {
      success,
      userId,
      details: JSON.stringify(details).substring(0, 100),
    });
  }

  /**
   * Coordinate with another Magician
   */
  protected async coordinateWith(request: MagicianCoordinationRequest): Promise<any> {
    // This would be implemented by the MagicianCoordinator service
    console.log(
      `[${this.magicianName}] Coordinating with ${request.toMagician}:`,
      request.requestType
    );
    
    // Placeholder - actual implementation would use event bus or service registry
    return {
      success: true,
      message: 'Coordination request queued',
    };
  }

  /**
   * Check if this Magician has a specific capability
   */
  public hasCapability(capability: string): boolean {
    return this.capabilities.includes(capability);
  }

  /**
   * Get Magician information
   */
  public getInfo() {
    return {
      id: this.magicianId,
      name: this.magicianName,
      description: this.description,
      capabilities: this.capabilities,
    };
  }

  /**
   * Get recent actions for transparency
   */
  public getRecentActions(limit: number = 10): MagicianAction[] {
    return this.actionLog.slice(-limit);
  }

  /**
   * Each Magician implements its core functionality
   */
  abstract execute(action: string, context: MagicianContext, params: any): Promise<any>;
}
