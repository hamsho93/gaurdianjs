import { Request, Response, NextFunction } from 'express';
import { analyzeUA, UAAnalysis } from './UserAgent';
import { analyzeTLS } from './TLSFingerprint';
import { analyzeBehavior } from './Behavior';
import { defaultConfig as configDefaults } from '../config/default';
import { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis, BotDetectionResponse, 
         DetectionParams as DetectionParamsType, 
         DetectionResult as DetectionResultType, 
         CustomRule, BotDetectionParams } from '../types';
import fetch from 'cross-fetch';

// Export the DetectionResult interface so it can be imported by other files
export interface DetectionResult {
  isBot: boolean;
  score: number;
  confidence: number;
  reasons: string[];
  behavior: BehaviorAnalysis;
  timestamp: Date;
  path: string;
  userAgent: string;
  ip: string;
}

// Export this interface as well if needed by other files
export interface DetectionParams {
  userAgent: string;
  ip: string;
  req?: any;
}

const defaultConfig: GuardianConfig = {
  threshold: 0.5,
  useBehavior: true,
  customRules: []
};

export class GuardianJS {
  private config: GuardianConfig;
  private events: TrackingEvent[] = [];

  constructor(config: Partial<GuardianConfig> = {}) {
    this.config = {
      ...defaultConfig,
      ...config,
      customRules: [
        {
          name: 'Known Bot Detection',
          test: (params: BotDetectionParams) => {
            const knownBots = [
              'googlebot',
              'bingbot',
              'yandexbot',
              'duckduckbot',
              'baiduspider',
              'facebookexternalhit'
            ];
            const ua = params.userAgent.toLowerCase();
            return knownBots.some(bot => ua.includes(bot));
          },
          score: 1.0
        },
        // Add LLM bot detection with more patterns
        {
          name: 'LLM Bot Detection',
          test: (params: BotDetectionParams) => {
            const llmBots = [
              'gptbot',
              'claude-web',
              'anthropic',
              'cohere',
              'llama',
              'bard',
              'openai'
            ];
            const ua = params.userAgent.toLowerCase();
            // More thorough check for GPTBot which might be in different formats
            if (ua.includes('gpt') || ua.includes('openai')) {
              return true;
            }
            return llmBots.some(bot => ua.includes(bot));
          },
          score: 1.0
        },
        ...(config.customRules || [])
      ]
    };
    
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
      const response = await fetch(this.config.endpoint || configDefaults.endpoint, {
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

  async isBot(params: BotDetectionParams): Promise<DetectionResult> {
    let score = 0;
    const reasons: string[] = [];

    // Check for LLM bots first
    const llmBotPatterns = ['gptbot', 'claude', 'anthropic', 'cohere', 'llama', 'bard', 'openai'];
    const ua = params.userAgent.toLowerCase();
    const isLLMBot = llmBotPatterns.some(pattern => ua.includes(pattern)) || ua.includes('gpt');
    
    if (isLLMBot) {
      return {
        isBot: true,
        score: 1.0,
        confidence: 1.0,
        reasons: ['LLM Bot Pattern'],
        behavior: analyzeBehavior(),
        timestamp: new Date(),
        path: params.req?.path || '',
        userAgent: params.userAgent,
        ip: params.ip
      };
    }

    // Then check custom rules
    for (const rule of this.config.customRules) {
      if (rule.test(params)) {
        score += rule.score;
        reasons.push(rule.name);
      }
    }

    // Use analyzeBehavior from Behavior.ts
    const behavior = analyzeBehavior();

    return {
      isBot: score >= this.config.threshold,
      score,
      confidence: score,
      reasons,
      behavior,
      timestamp: new Date(),
      path: params.req?.path || '',
      userAgent: params.userAgent,
      ip: params.ip
    };
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
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip || '';
    
    // Check for LLM bots first - this is the most direct approach
    const llmBotPatterns = ['gptbot', 'claude', 'anthropic', 'cohere', 'llama', 'bard', 'openai'];
    const ua = userAgent.toLowerCase();
    const isLLMBot = llmBotPatterns.some(pattern => ua.includes(pattern)) || ua.includes('gpt');

    if (isLLMBot) {
      return {
        isBot: true,
        score: 1.0,
        confidence: 1.0,
        reasons: ['LLM Bot Pattern'],
        behavior: this.config.useBehavior ? analyzeBehavior() : {
          mouseMovements: 0,
          keystrokes: 0,
          timeOnPage: 0,
          scrolling: false
        },
        timestamp: new Date(),
        path: req.path || '',
        userAgent,
        ip
      };
    }
    
    // Then check against our custom rules
    const botCheck = await this.isBot({ userAgent, ip, req });
    if (botCheck.isBot) {
      return botCheck;
    }
    
    // If not caught by custom rules, do deeper analysis
    const results = {
      userAgent: analyzeUA(userAgent),
      tls: this.config.useTLS ? await analyzeTLS(req) : null,
      behavior: this.config.useBehavior ? analyzeBehavior() : null
    };

    return {
      isBot: Boolean(
        results.userAgent.isBot || 
        results.tls?.isSuspicious
      ),
      score: results.userAgent.isBot ? 1.0 : 0,
      confidence: results.userAgent.isBot ? 1.0 : 0,
      reasons: results.userAgent.isBot ? ['User Agent Analysis'] : [],
      behavior: results.behavior || {
        mouseMovements: 0,
        keystrokes: 0,
        timeOnPage: 0,
        scrolling: false
      },
      timestamp: new Date(),
      path: req.path || '',
      userAgent,
      ip
    };
  }
}
