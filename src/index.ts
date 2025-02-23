// Import and re-export the tracker
import { GuardianTracker as Tracker, TrackerConfig as Config, TrackerEvent } from './client/tracker';
export const GuardianTracker = Tracker;
export type TrackerConfig = Config;
export { TrackerEvent };

// Export other utilities
export { GuardianJS } from './core/GuardianJS';
export { startServer, closeServer } from './middleware/express';
export { BotDetectionResult } from './types/detection';
export { GuardianConfig } from './types/config';

// Export default configuration
export { defaultConfig } from './config/default';

// Export utility functions
export { validateConfig } from './utils/validation';

// Export core functionality
export * from './core/UserAgent';
export * from './core/TLSFingerprint';
export * from './core/Behavior';

// Export the class and its types
export { GuardianJS };
export default GuardianJS;

// Export types
export * from './types';

// For CommonJS compatibility
module.exports = GuardianTracker;
module.exports.default = GuardianTracker;
Object.defineProperty(module.exports, "__esModule", { value: true }); 