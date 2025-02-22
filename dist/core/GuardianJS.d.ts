import { Request, Response, NextFunction } from 'express';
import { UAAnalysis } from './UserAgent';
import { TLSAnalysis } from './TLSFingerprint';
import { BehaviorAnalysis } from './Behavior';
export interface GuardianConfig {
    useTLS?: boolean;
    useBehavior?: boolean;
}
export interface DetectionResult {
    verdict: boolean;
    userAgent: UAAnalysis;
    tls: TLSAnalysis | null;
    behavior: BehaviorAnalysis | null;
}
export declare class GuardianJS {
    private config;
    constructor(config?: GuardianConfig);
    middleware(): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    detect(req: Request): Promise<DetectionResult>;
}
