// src/services/guardianStorage.ts
import { DetectionResult, BotDetectionParams } from '../types';
import { GuardianJS } from '../core/GuardianJS';

const guardian = new GuardianJS();
const detections: DetectionResult[] = [];

export class GuardianStorage {
  private static instance: GuardianStorage;
  
  private constructor() {}
  
  static getInstance(): GuardianStorage {
    if (!GuardianStorage.instance) {
      GuardianStorage.instance = new GuardianStorage();
    }
    return GuardianStorage.instance;
  }
  
  async detectBot(params: BotDetectionParams): Promise<DetectionResult> {
    const result = await guardian.isBot(params);
    detections.push(result);
    return result;
  }
  
  getDetections(): DetectionResult[] {
    return [...detections].sort((a, b) => {
      const bTime = b.timestamp.getTime();
      const aTime = a.timestamp.getTime();
      return bTime - aTime;
    });
  }
  
  getStats() {
    const total = detections.length;
    const bots = detections.filter((d: DetectionResult) => d.isBot).length;
    
    const pathStats = detections.reduce((acc: Record<string, number>, curr: DetectionResult) => {
      const path = curr.path || 'unknown';
      acc[path] = (acc[path] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalRequests: total,
      detectedBots: bots,
      pathStats
    };
  }
}

// Create and export a singleton instance
export const guardianStorage = GuardianStorage.getInstance();