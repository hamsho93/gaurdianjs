import { Request } from 'express';
import { GuardianConfig, TrackingEvent, BehaviorAnalysis, BotDetectionParams } from '../types';
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
export interface DetectionParams {
    userAgent: string;
    ip: string;
    req?: any;
}
export declare class GuardianJS {
    private config;
    private events;
    constructor(config?: Partial<GuardianConfig>);
    track(event: TrackingEvent): void;
    private flush;
    isBot(params: BotDetectionParams): Promise<DetectionResult>;
    middleware(): (req: any, res: any, next: any) => Promise<any>;
    detect(req: Request): Promise<DetectionResult>;
}
