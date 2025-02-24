// Import and export the main class
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
  CustomRule
};