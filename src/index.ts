export { GuardianJS } from './core/GuardianJS';
export { startServer, closeServer } from './middleware/express';
export { BotDetectionResult } from './types/detection';
export { GuardianConfig } from './types/config';

// Export default configuration
export { defaultConfig } from './config/default';

// Export utility functions
export { validateConfig } from './utils/validation';

export * from './core/UserAgent';
export * from './core/TLSFingerprint';
export * from './core/Behavior';

import { Server } from 'http';

export interface TrackerConfig {
  endpoint: string;
  bufferSize?: number;
  flushInterval?: number;
  startServer?: boolean;
}

export class GuardianTracker {
  private readonly endpoint: string;
  private readonly bufferSize: number;
  private readonly flushInterval: number;

  constructor(config: TrackerConfig) {
    if (!config.endpoint) {
      throw new Error('Endpoint is required');
    }

    this.endpoint = config.endpoint;
    this.bufferSize = config.bufferSize || 10;
    this.flushInterval = config.flushInterval || 5000;

    // Prevent server from starting automatically
    if (config.startServer) {
      console.warn('Server auto-start is disabled. Use startServer() explicitly if needed.');
    }
  }

  public getEndpoint(): string {
    return this.endpoint;
  }
}

// Only export the tracker class
module.exports = GuardianTracker; 