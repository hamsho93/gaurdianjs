export interface BotDetectionResult {
  isBot: boolean;
  confidence: number;
  reasons: string[];
  timestamp: number;
  metadata?: {
    userAgent?: string;
    ip?: string;
    tlsFingerprint?: string;
    behaviorScore?: number;
  };
}

export interface BehaviorData {
  mouseMovements: MouseMovement[];
  scrollEvents: ScrollEvent[];
  keyboardEvents: KeyboardEvent[];
  timeOnPage: number;
}

export interface MouseMovement {
  x: number;
  y: number;
  timestamp: number;
}

export interface ScrollEvent {
  scrollTop: number;
  timestamp: number;
}

export interface KeyboardEvent {
  key: string;
  timestamp: number;
} 