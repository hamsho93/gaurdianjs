export interface TrackerConfig {
    endpoint: string;
    bufferSize?: number;
    flushInterval?: number;
}
export interface TrackerEvent {
    type: string;
    target?: string;
    timestamp?: number;
    [key: string]: any;
}
export declare class GuardianTracker {
    private readonly endpoint;
    private readonly bufferSize;
    private readonly flushInterval;
    constructor(config: TrackerConfig);
    getEndpoint(): string;
    addEvent(event: any): void;
    destroy(): void;
}
