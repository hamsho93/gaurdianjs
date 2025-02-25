import { GuardianJS } from '../core/GuardianJS';
import type { GuardianConfig } from '../types';

// Singleton instance
let guardianInstance: GuardianJS | null = null;

export function getGuardianInstance(config: Partial<GuardianConfig> = {}) {
  if (!guardianInstance) {
    guardianInstance = new GuardianJS({
      useBehavior: true,
      threshold: 0.5,
      ...config
    });
  }
  return guardianInstance;
}

// HOC for API routes
export function withGuardian(handler: any) {
  return async (req: any, res: any) => {
    const guardian = getGuardianInstance();
    
    try {
      const result = await guardian.isBot({
        userAgent: req.headers['user-agent'] || '',
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
        req
      });
      
      req.botDetection = {
        isBot: result.isBot,
        confidence: result.confidence,
        score: result.score,
        reasons: result.reasons,
        behavior: result.behavior
      };
    } catch (error) {
      console.error('GuardianJS error:', error);
    }
    
    return handler(req, res);
  };
}

// For client-side tracking
export { default as GuardianProvider } from '../components/GuardianProvider';
export { default as useGuardian } from '../hooks/useGuardian';
