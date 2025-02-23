"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuardianTracker = void 0;
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
class GuardianTracker {
    /**
     * Creates a new instance of GuardianTracker
     *
     * @param {TrackerConfig} config - Configuration options
     * @throws {Error} When endpoint is not provided
     */
    constructor(config) {
        if (!config.endpoint) {
            throw new Error('Endpoint is required');
        }
        this.endpoint = config.endpoint;
        this.bufferSize = config.bufferSize || 10;
        this.flushInterval = config.flushInterval || 5000;
    }
    /**
     * Gets the configured endpoint URL
     *
     * @returns {string} The endpoint URL
     */
    getEndpoint() {
        return this.endpoint;
    }
    addEvent(event) {
        // Implementation needed
    }
    destroy() {
        // Implementation needed
    }
}
exports.GuardianTracker = GuardianTracker;
// Most basic possible class
class Tracker {
    constructor(endpoint) {
        this.endpoint = endpoint;
    }
}
// Export the class directly
module.exports = GuardianTracker;
