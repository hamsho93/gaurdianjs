import { DetectionResult } from '../core/GuardianJS';

declare global {
  namespace Express {
    interface Request {
      botDetection?: DetectionResult;
    }
  }
}

export {}; 