// Import and export the main class
import { GuardianJS } from './core/GuardianJS';

// Export types
import type {
  GuardianConfig,
  TrackingEvent,
  TLSAnalysis,
  BehaviorAnalysis,
  CustomRule,
  DetectionResult as TypesDetectionResult,
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
  TypesDetectionResult as DetectionResult,
  BotDetectionResponse
};

// Default export
export default GuardianJS;

// Export types
export * from './types';

// Export middleware
export * from './middleware/express';
export * from './middleware/guardian';

// Export classes and functions
export { createGuardianMiddleware } from './middleware/express';
export { guardianMiddleware } from './middleware/guardian'; 