import { Request, Response, NextFunction } from 'express';
import { analyzeUA, UAAnalysis } from './UserAgent';
import { analyzeTLS, TLSAnalysis } from './TLSFingerprint';
import { analyzeBehavior, BehaviorAnalysis } from './Behavior';

export interface GuardianConfig {
  useTLS?: boolean;
  useBehavior?: boolean;
}

export interface DetectionResult {
  verdict: boolean;
  userAgent: UAAnalysis;
  tls: TLSAnalysis | null;
  behavior: BehaviorAnalysis | null;
}

export class GuardianJS {
  constructor(private config: GuardianConfig = {}) {}

  middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const result = await this.detect(req);
      req.botDetection = result;
      next();
    };
  }

  async detect(req: Request): Promise<DetectionResult> {
    const results = {
      userAgent: analyzeUA(req.headers['user-agent'] || ''),
      tls: this.config.useTLS ? await analyzeTLS(req) : null,
      behavior: this.config.useBehavior ? await analyzeBehavior(req) : null
    };

    return {
      verdict: Boolean(
        results.userAgent.isBot || 
        results.tls?.isSuspicious || 
        results.behavior?.isBot
      ),
      userAgent: results.userAgent,
      tls: results.tls,
      behavior: results.behavior
    };
  }
}
