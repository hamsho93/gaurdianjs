export * from '../index';

export interface GuardianConfig {
  endpoint: string;
  trackingEnabled?: boolean;
  detectionThreshold?: number;
  trackingInterval?: number;
  bufferSize?: number;
  useTLS?: boolean;
  useBehavior?: boolean;
  threshold: number;
  enableBehaviorAnalysis?: boolean;
  customRules?: CustomRule[];
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
  score: number;
  patterns: BehaviorPattern[];
  anomalies: string[];
  isBot: boolean;
  confidence: number;
}

export interface CustomRule {
  name: string;
  test: (req: any) => boolean | Promise<boolean>;
  weight?: number;
}

export interface TrackingEvent {
  event: string;
  path?: string;
  timestamp?: number;
  [key: string]: any;
} 