import { Request, Response, NextFunction } from 'express';
import { analyzeUA, UAAnalysis } from './UserAgent';
import { analyzeTLS } from './TLSFingerprint';
import { analyzeBehavior } from './Behavior';
import { defaultConfig } from '../config/default';
import { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis, BotDetectionResponse } from '../types';
import fetch from 'cross-fetch';
import { BehaviorAnalyzer } from './Behavior';

export interface DetectionResult {
  verdict: boolean;
  userAgent: UAAnalysis;
  tls: TLSAnalysis | null;
  behavior: BehaviorAnalysis | null;
}

interface DetectionParams {
  userAgent: string;
  ip: string;
  req?: any;
}

export class GuardianJS {
  private config: GuardianConfig;
  private events: TrackingEvent[] = [];
  private behaviorAnalyzer: BehaviorAnalyzer;

  constructor(config: GuardianConfig = {}) {
    this.config = {
      endpoint: config.endpoint || 'http://localhost:3000/api/detect',
      trackingEnabled: config.trackingEnabled ?? true,
      threshold: config.threshold || 0.8,
      detectionThreshold: config.detectionThreshold || 0.5,
      trackingInterval: config.trackingInterval || 1000,
      bufferSize: config.bufferSize || 1000,
      useTLS: config.useTLS ?? true,
      maxRetries: config.maxRetries || 3,
      timeout: config.timeout || 5000,
      cacheSize: config.cacheSize || 100,
      useBehavior: config.useBehavior ?? true,
      enableBehaviorAnalysis: config.enableBehaviorAnalysis ?? true,
      customRules: config.customRules || []
    };
    this.behaviorAnalyzer = new BehaviorAnalyzer();
    
    // Log configuration for debugging
    console.log('GuardianJS initialized with config:', this.config);
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
      const response = await fetch(this.config.endpoint || defaultConfig.endpoint, {
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

  async isBot(params: DetectionParams): Promise<BotDetectionResponse> {
    console.log('Checking bot detection for:', params);
    
    let score = 0;
    const reasons: string[] = [];

    // Apply custom rules
    if (this.config.customRules && this.config.customRules.length > 0) {
      console.log('Applying custom rules...');
      
      for (const rule of this.config.customRules) {
        try {
          console.log(`Testing rule: ${rule.name}`);
          const ruleResult = await Promise.resolve(rule.test(params));
          
          if (ruleResult) {
            score += rule.score;
            reasons.push(rule.name);
            console.log(`Rule ${rule.name} matched! Score: ${score}`);
          }
        } catch (error) {
          console.error(`Error in rule ${rule.name}:`, error);
        }
      }
    }

    const isBot = score >= (this.config.threshold || 0.8);
    console.log('Final detection result:', { isBot, score, reasons });

    return {
      isBot,
      confidence: score,
      reasons,
      behavior: {
        mouseMovements: 0,
        keystrokes: 0,
        timeOnPage: 0,
        scrolling: false
      }
    };
  }

  private async analyzeBehavior(req: any): Promise<BehaviorAnalysis> {
    return this.behaviorAnalyzer.analyze(req);
  }

  middleware() {
    return async (req: any, res: any, next: any) => {
      const userAgent = req.headers['user-agent'] || '';
      const ip = req.ip;

      const isBot = await this.isBot({ userAgent, ip, req });
      if (isBot.isBot) {
        return res.status(403).json({ error: 'Bot detected', reasons: isBot.reasons });
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
