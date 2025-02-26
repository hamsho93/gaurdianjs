// Import the main class
import { GuardianJS } from './core/GuardianJS';

// Export types
import type {
  GuardianConfig,
  TrackingEvent,
  TLSAnalysis,
  BehaviorAnalysis,
  CustomRule
} from './types';

// Export utility functions
import { analyzeTLS } from './core/TLSFingerprint';
import { analyzeBehavior } from './core/Behavior';
import { validateConfig } from './utils/validation';

// Export framework integrations
import * as nextjs from './integrations/nextjs';
import * as express from './integrations/express';
import * as react from './integrations/react';

// Export everything
export {
  GuardianJS,
  analyzeTLS,
  analyzeBehavior,
  validateConfig,
  nextjs,
  express,
  react
};

// Export types
export type {
  GuardianConfig,
  TrackingEvent,
  TLSAnalysis,
  BehaviorAnalysis,
  CustomRule
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

// Export Node.js client
export { GuardianClient } from './client/node';

// Export API server
export { createApiServer } from './api/server'; 