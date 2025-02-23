import { GuardianJS } from './core/GuardianJS';
import type { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis, CustomRule } from './types';
import { analyzeTLS } from './core/TLSFingerprint';
import { analyzeBehavior } from './core/Behavior';
import { validateConfig } from './utils/validation';
export { GuardianJS, analyzeTLS, analyzeBehavior, validateConfig };
export type { GuardianConfig, TrackingEvent, TLSAnalysis, BehaviorAnalysis, CustomRule };
export default GuardianJS;
