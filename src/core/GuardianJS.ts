import { Request, Response, NextFunction } from 'express';
import { analyzeUA, UAAnalysis } from './UserAgent';
import { analyzeTLS } from './TLSFingerprint';
import { analyzeBehavior } from './Behavior';
import { defaultConfig } from '../config/default';
import { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis } from '../types';

export interface DetectionResult {
  verdict: boolean;
  userAgent: UAAnalysis;
  tls: TLSAnalysis | null;
  behavior: BehaviorAnalysis | null;
}

export class GuardianJS {
  private config: GuardianConfig;
  private events: TrackingEvent[] = [];

  constructor(userConfig: Partial<GuardianConfig> = {}) {
    this.config = {
      ...defaultConfig,
      ...userConfig
    };
  }

  track(event: TrackingEvent): void {
    this.events.push({
      timestamp: Date.now(),
      ...event
    });

    if (this.events.length >= (this.config.bufferSize || 10)) {
      this.flush();
    }
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.events),
      });

      if (response.ok) {
        this.events = [];
      }
    } catch (error) {
      console.error('Error flushing events:', error);
    }
  }

  async isBot(params: { userAgent: string; ip: string; req?: any }): Promise<boolean> {
    const { userAgent, ip, req } = params;
    
    if (/bot|crawler|spider|googlebot/i.test(userAgent)) {
      return true;
    }

    if (req && (this.config.useTLS || this.config.useBehavior)) {
      const results = {
        tls: this.config.useTLS ? await analyzeTLS(req) : null,
        behavior: this.config.useBehavior ? await analyzeBehavior(req) : null
      };

      return Boolean(
        results.tls?.isSuspicious ||
        results.behavior?.isBot
      );
    }

    return false;
  }

  middleware() {
    return async (req: any, res: any, next: any) => {
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip;

      const isBot = await this.isBot({ userAgent, ip, req });
      if (isBot) {
        return res.status(403).json({ error: 'Bot detected' });
      }

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
