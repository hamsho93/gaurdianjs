export * from '../index';

/**
 * Configuration options for GuardianJS
 */
export interface GuardianConfig {
  /** Tracking endpoint URL */
  endpoint?: string;
  /** Enable/disable tracking */
  trackingEnabled?: boolean;
  /** Bot detection threshold (0-1) */
  threshold: number;
  detectionThreshold?: number;
  trackingInterval?: number;
  bufferSize?: number;
  useTLS?: boolean;
  maxRetries?: number;
  timeout?: number;
  cacheSize?: number;
  useBehavior: boolean;
  enableBehaviorAnalysis?: boolean;
  customRules: CustomRule[];
}

export interface TLSAnalysis {
  score: number;
  fingerprint?: string;
  version?: string;
  isSuspicious: boolean;
}

export interface BehaviorPattern {
  mouseMovements: number;
  scrollPatterns: number;
  interactionSpeed: number;
}

export interface BehaviorAnalysis {
  mouseMovements: number;
  keystrokes: number;
  timeOnPage: number;
  scrolling: boolean;
}

export interface CustomRule {
  name: string;
  test: (params: BotDetectionParams) => boolean;
  score: number;
}

export interface TrackingEvent {
  event: string;
  path?: string;
  timestamp?: number;
  [key: string]: any;
}

export interface DetectionParams {
  userAgent: string;
  ip: string;
  req?: any;
}

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

export interface DetectionStats {
  total: number;
  bots: number;
  legitimate: number;
  paths: Record<string, number>;
}

export interface BotDetectionResponse {
  isBot: boolean;
  confidence: number;
  reasons?: string[];
  behavior?: BehaviorAnalysis;
}

export interface BotDetectionParams {
  userAgent: string;
  ip: string;
  req?: any;
}

declare global {
  namespace Express {
    interface Request {
      botDetection?: DetectionResult;
    }
  }
} 