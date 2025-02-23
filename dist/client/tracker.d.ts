/**
 * Configuration options for the GuardianTracker
 * @interface TrackerConfig
 */
export interface TrackerConfig {
    /**
     * The endpoint URL where tracking data will be sent
     * @example 'https://api.example.com/tracking'
     */
    endpoint: string;
    /**
     * Maximum number of events to buffer before sending to endpoint
     * @default 10
     */
    bufferSize?: number;
    /**
     * Interval in milliseconds to flush buffered events
     * @default 5000
     */
    flushInterval?: number;
}
export interface TrackerEvent {
    type: string;
    target?: string;
    timestamp?: number;
    [key: string]: any;
}
/**
 * GuardianTracker class for monitoring and tracking bot-like behavior
 *
 * @example
 * ```typescript
 * const tracker = new GuardianTracker({
 *   endpoint: 'https://api.example.com/tracking',
 *   bufferSize: 5,
 *   flushInterval: 1000
 * });
 * ```
 */
export declare class GuardianTracker {
    private readonly endpoint;
    private readonly bufferSize;
    private readonly flushInterval;
    /**
     * Creates a new instance of GuardianTracker
     *
     * @param {TrackerConfig} config - Configuration options
     * @throws {Error} When endpoint is not provided
     */
    constructor(config: TrackerConfig);
    /**
     * Gets the configured endpoint URL
     *
     * @returns {string} The endpoint URL
     */
    getEndpoint(): string;
    addEvent(event: any): void;
    destroy(): void;
}
