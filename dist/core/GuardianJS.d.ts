import { Request } from 'express';
import { UAAnalysis } from './UserAgent';
import { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis } from '../types';
export interface DetectionResult {
    verdict: boolean;
    userAgent: UAAnalysis;
    tls: TLSAnalysis | null;
    behavior: BehaviorAnalysis | null;
}
export declare class GuardianJS {
    private config;
    private events;
    constructor(userConfig?: Partial<GuardianConfig>);
    track(event: TrackingEvent): void;
    private flush;
    isBot(params: {
        userAgent: string;
        ip: string;
        req?: any;
    }): Promise<boolean>;
    middleware(): (req: any, res: any, next: any) => Promise<any>;
    detect(req: Request): Promise<DetectionResult>;
}
