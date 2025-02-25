// src/integrations/express.ts
import { GuardianJS } from '../core/GuardianJS';
import type { GuardianConfig } from '../types';
import type { Request, Response, NextFunction } from 'express';

export function createGuardianMiddleware(config: Partial<GuardianConfig> = {}) {
  const guardian = new GuardianJS({
    useBehavior: true,
    threshold: 0.5,
    ...config
  });
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await guardian.isBot({
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip || '',
        req
      });
      
      (req as any).botDetection = {
        isBot: result.isBot,
        confidence: result.confidence,
        score: result.score,
        reasons: result.reasons,
        behavior: result.behavior
      };
      
      next();
    } catch (error) {
      console.error('GuardianJS error:', error);
      next();
    }
  };
}