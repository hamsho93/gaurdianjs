export { GuardianJS } from './core/GuardianJS';
export { startServer, closeServer } from './middleware/express';
export { BotDetectionResult } from './types/detection';
export { GuardianConfig } from './types/config';
export { defaultConfig } from './config/default';
export { validateConfig } from './utils/validation';
export * from './core/UserAgent';
export * from './core/TLSFingerprint';
export * from './core/Behavior';
export interface TrackerConfig {
    endpoint: string;
    bufferSize?: number;
    flushInterval?: number;
    startServer?: boolean;
}
export declare class GuardianTracker {
    private readonly endpoint;
    private readonly bufferSize;
    private readonly flushInterval;
    constructor(config: TrackerConfig);
    getEndpoint(): string;
}
