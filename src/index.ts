// Import and export the main class
import { GuardianJS } from './core/GuardianJS';

// Export types
import type {
  GuardianConfig,
  TrackingEvent,
  TLSAnalysis,
  BehaviorAnalysis,
  CustomRule,
  DetectionResult,
  BotDetectionResponse
} from './types';

// Export utility functions
import { analyzeTLS } from './core/TLSFingerprint';
import { analyzeBehavior } from './core/Behavior';
import { validateConfig } from './utils/validation';

// Export everything
export {
  GuardianJS,
  analyzeTLS,
  analyzeBehavior,
  validateConfig
};

export type {
  GuardianConfig,
  TrackingEvent,
  TLSAnalysis,
  BehaviorAnalysis,
  CustomRule,
  DetectionResult,
  BotDetectionResponse
};

// Default export
export default GuardianJS;

export * from './types';
export * from './core/GuardianJS';
export * from './middleware/express';
export * from './middleware/guardian';

// Export classes and functions
export { createGuardianMiddleware } from './middleware/express';
export { guardianMiddleware } from './middleware/guardian'; 