import { Request } from 'express';
import { UAAnalysis } from './UserAgent';
import { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis, BotDetectionResponse } from '../types';
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
export declare class GuardianJS {
    private config;
    private events;
    private behaviorAnalyzer;
    constructor(config?: GuardianConfig);
    track(event: TrackingEvent): void;
    private flush;
    isBot(params: DetectionParams): Promise<BotDetectionResponse>;
    private analyzeBehavior;
    middleware(): (req: any, res: any, next: any) => Promise<any>;
    detect(req: Request): Promise<DetectionResult>;
}
export {};
