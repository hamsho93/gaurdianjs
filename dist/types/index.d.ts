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
    threshold?: number;
    detectionThreshold?: number;
    trackingInterval?: number;
    bufferSize?: number;
    useTLS?: boolean;
    maxRetries?: number;
    timeout?: number;
    cacheSize?: number;
    useBehavior?: boolean;
    enableBehaviorAnalysis?: boolean;
    customRules?: Array<any>;
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
    score?: number;
    patterns?: Array<{
        mouseMovements: number | null;
        scrollPatterns: number | null;
        interactionSpeed: number | null;
    }>;
    anomalies?: any[];
    isBot?: boolean;
    confidence?: number;
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
export interface DetectionResult {
    timestamp: Date;
    isBot: boolean;
    confidence: number;
    path: string;
    userAgent: string;
    ip: string;
    reasons?: string[];
    behavior?: BehaviorAnalysis;
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
declare global {
    namespace Express {
        interface Request {
            botDetection?: DetectionResult;
        }
    }
}
