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